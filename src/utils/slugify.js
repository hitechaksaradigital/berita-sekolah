export function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function uniqueSlug(slug, existing = [], currentId = null) {
  const taken = new Set(existing.filter((item) => item.id !== currentId).map((item) => item.slug))
  if (!taken.has(slug)) return slug
  let index = 2
  while (taken.has(`${slug}-${index}`)) index += 1
  return `${slug}-${index}`
}
