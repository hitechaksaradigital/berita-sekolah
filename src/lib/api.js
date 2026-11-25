import { supabase, isSupabaseConfigured } from './supabase'
import { readDemo, updateDemo } from '../data/demo'
import { STORAGE_BUCKET } from '../config/site'

const POST_SELECT = [
  'id', 'title', 'slug', 'excerpt', 'content', 'thumbnail_url',
  'category_id', 'author_id', 'status', 'is_featured', 'views_count',
  'published_at', 'created_at', 'updated_at',
  'categories(id,name,slug)',
  'author:profiles!posts_author_id_fkey(id,full_name,avatar_url,role)',
].join(',')

function attachRelations(post, state) {
  return {
    ...post,
    categories: state.categories.find((category) => category.id === post.category_id) || null,
    author: state.profiles.find((profile) => profile.id === post.author_id) || null,
  }
}

function sortPosts(posts) {
  return [...posts].sort((a, b) => new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at))
}

function demoPublished(params = {}) {
  const state = readDemo()
  let posts = state.posts.filter((post) => post.status === 'published').map((post) => attachRelations(post, state))
  if (params.categorySlug) posts = posts.filter((post) => post.categories?.slug === params.categorySlug)
  if (params.featured) posts = posts.filter((post) => post.is_featured)
  if (params.excludeId) posts = posts.filter((post) => post.id !== params.excludeId)
  if (params.search) {
    const needle = params.search.toLowerCase()
    posts = posts.filter((post) =>
      `${post.title} ${post.excerpt} ${post.content}`.toLowerCase().includes(needle),
    )
  }
  posts = sortPosts(posts)
  return params.limit ? posts.slice(0, params.limit) : posts
}

export async function getPublishedPosts(params = {}) {
  if (!isSupabaseConfigured) return demoPublished(params)

  let query = supabase.from('posts').select(POST_SELECT).eq('status', 'published')
  if (params.categorySlug) {
    const { data: category } = await supabase
      .from('categories').select('id').eq('slug', params.categorySlug).maybeSingle()
    if (!category) return []
    query = query.eq('category_id', category.id)
  }
  if (params.featured) query = query.eq('is_featured', true)
  if (params.excludeId) query = query.neq('id', params.excludeId)
  if (params.search) query = query.or(`title.ilike.%${params.search}%,excerpt.ilike.%${params.search}%,content.ilike.%${params.search}%`)
  query = query.order('published_at', { ascending: false })
  if (params.limit) query = query.limit(params.limit)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getPostBySlug(slug) {
  if (!isSupabaseConfigured) {
    return demoPublished().find((post) => post.slug === slug) || null
  }
  const { data, error } = await supabase
    .from('posts').select(POST_SELECT).eq('slug', slug).eq('status', 'published').maybeSingle()
  if (error) throw error
  return data
}

export async function getAllPosts() {
  if (!isSupabaseConfigured) {
    const state = readDemo()
    return sortPosts(state.posts.map((post) => attachRelations(post, state)))
  }
  const { data, error } = await supabase
    .from('posts').select(POST_SELECT).order('updated_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getPostById(id) {
  if (!isSupabaseConfigured) {
    const state = readDemo()
    const post = state.posts.find((item) => item.id === id)
    return post ? attachRelations(post, state) : null
  }
  const { data, error } = await supabase.from('posts').select(POST_SELECT).eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

export async function getCategories() {
  if (!isSupabaseConfigured) return [...readDemo().categories]
  const { data, error } = await supabase.from('categories').select('*').order('name')
  if (error) throw error
  return data || []
}

export async function getProfiles() {
  if (!isSupabaseConfigured) return [...readDemo().profiles]
  const { data, error } = await supabase.from('profiles').select('id,full_name,email,role,avatar_url,created_at').order('full_name')
  if (error) throw error
  return data || []
}

export async function incrementViews(id) {
  if (!isSupabaseConfigured) {
    updateDemo((state) => {
      const post = state.posts.find((item) => item.id === id)
      if (post) post.views_count += 1
    })
    return
  }
  // RPC dengan SECURITY DEFINER: publik tidak perlu izin UPDATE pada tabel posts.
  const { error } = await supabase.rpc('increment_post_views', { post_id: id })
  if (error) throw error
}

export async function savePost(payload) {
  const now = new Date().toISOString()
  if (!isSupabaseConfigured) {
    const result = updateDemo((state) => {
      if (payload.id) {
        const index = state.posts.findIndex((item) => item.id === payload.id)
        if (index === -1) throw new Error('Berita tidak ditemukan')
        state.posts[index] = { ...state.posts[index], ...payload, updated_at: now }
        return state
      }
      const id = crypto.randomUUID()
      state.posts.unshift({
        id,
        views_count: 0,
        created_at: now,
        updated_at: now,
        ...payload,
      })
      return state
    })
    const saved = result.posts.find((item) => item.id === (payload.id || result.posts[0].id))
    return attachRelations(saved, result)
  }

  const row = { ...payload, updated_at: now }
  if (row.status === 'published' && !row.published_at) row.published_at = now
  if (row.status !== 'published') row.published_at = null

  if (row.id) {
    const { id, ...updates } = row
    const { data, error } = await supabase.from('posts').update(updates).eq('id', id).select(POST_SELECT).single()
    if (error) throw error
    return data
  }
  const { id: _id, ...insert } = row
  const { data, error } = await supabase.from('posts').insert(insert).select(POST_SELECT).single()
  if (error) throw error
  return data
}

export async function deletePost(id) {
  if (!isSupabaseConfigured) {
    return updateDemo((state) => {
      state.posts = state.posts.filter((post) => post.id !== id)
    })
  }
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw error
}

export async function saveCategory(payload) {
  if (!isSupabaseConfigured) {
    return updateDemo((state) => {
      if (payload.id) {
        const index = state.categories.findIndex((item) => item.id === payload.id)
        if (index !== -1) state.categories[index] = { ...state.categories[index], ...payload }
        return state
      }
      state.categories.push({ ...payload, id: Math.max(0, ...state.categories.map((c) => c.id)) + 1 })
    }).categories
  }
  if (payload.id) {
    const { id, ...updates } = payload
    const { error } = await supabase.from('categories').update(updates).eq('id', id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('categories').insert(payload)
    if (error) throw error
  }
  return getCategories()
}

export async function deleteCategory(id) {
  if (!isSupabaseConfigured) {
    return updateDemo((state) => {
      state.categories = state.categories.filter((category) => category.id !== id)
    })
  }
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}

export async function updateUserRole(id, role) {
  if (!isSupabaseConfigured) {
    return updateDemo((state) => {
      const profile = state.profiles.find((item) => item.id === id)
      if (profile) profile.role = role
    })
  }
  const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
  if (error) throw error
}

export async function uploadImage(file) {
  if (!isSupabaseConfigured) {
    // Pratinjau lokal: URL objek hanya bertahan selama sesi browser ini.
    return URL.createObjectURL(file)
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '-').toLowerCase()
  const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeName}`
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  })
  if (error) throw error
  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl
}
