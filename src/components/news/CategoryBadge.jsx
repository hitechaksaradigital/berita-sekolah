export default function CategoryBadge({ category }) {
  if (!category) return null
  return <span className="category-tag">{category.name}</span>
}
