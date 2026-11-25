import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { readDemo, updateDemo } from '../data/demo'

const AuthContext = createContext(null)

async function fetchProfile(user) {
  if (!user) return null
  const { data, error } = await supabase
    .from('profiles').select('id,full_name,email,role,avatar_url').eq('id', user.id).maybeSingle()
  if (error) throw error
  return data || {
    id: user.id,
    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Penulis',
    email: user.email,
    role: 'writer',
    avatar_url: null,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    if (!isSupabaseConfigured) {
      const session = readDemo().session
      const demoProfile = session
        ? readDemo().profiles.find((item) => item.email === session.email) || null
        : null
      if (active) {
        setUser(session ? { email: session.email, id: demoProfile?.id } : null)
        setProfile(demoProfile)
        setLoading(false)
      }
      return () => { active = false }
    }

    supabase.auth.getSession().then(async ({ data }) => {
      const current = data?.session?.user || null
      const currentProfile = current ? await fetchProfile(current) : null
      if (active) {
        setUser(current)
        setProfile(currentProfile)
        setLoading(false)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const current = session?.user || null
      const currentProfile = current ? await fetchProfile(current) : null
      if (active) {
        setUser(current)
        setProfile(currentProfile)
        setLoading(false)
      }
    })

    return () => {
      active = false
      listener?.subscription?.unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({
    user,
    profile,
    role: profile?.role || 'writer',
    isAdmin: profile?.role === 'admin',
    isDemo: !isSupabaseConfigured,
    loading,
    async signIn(email, password) {
      if (!isSupabaseConfigured) {
        const account = readDemo().profiles.find((item) => item.email === email.trim().toLowerCase())
        if (!account || password.length < 6) {
          throw new Error('Email tidak ditemukan atau kata sandi kurang dari 6 karakter.')
        }
        updateDemo((state) => { state.session = { email: account.email } })
        setUser({ email: account.email, id: account.id })
        setProfile(account)
        return account
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      const nextProfile = await fetchProfile(data.user)
      setUser(data.user)
      setProfile(nextProfile)
      return nextProfile
    },
    async signOut() {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
      } else {
        updateDemo((state) => { state.session = null })
      }
      setUser(null)
      setProfile(null)
    },
  }), [user, profile, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook ini sengaja diekspor bersama provider agar semua halaman memakai satu sumber sesi.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth harus dipakai di dalam AuthProvider')
  return context
}
