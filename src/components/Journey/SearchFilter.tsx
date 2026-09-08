import type { Category } from '../../types'

interface SearchFilterProps {
  search: string
  onSearchChange: (value: string) => void
  categoryFilter: string
  onCategoryChange: (value: string) => void
  categories: Category[]
  resultCount: number
}

export default function SearchFilter({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  categories,
  resultCount,
}: SearchFilterProps) {
  const allCategories = ['ALL', ...categories.map((c) => c.name)]

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input
          type="text"
          placeholder="Search topics..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="form-input pl-11"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
              categoryFilter === cat
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-primary-950 hover:text-primary-600 dark:hover:text-primary-400'
            }`}
          >
            {cat === 'ALL' ? 'ALL' : `${categories.find((c) => c.name === cat)?.emoji ?? '⚙️'} ${cat}`}
          </button>
        ))}
      </div>

      {(search || categoryFilter !== 'ALL') && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing {resultCount} entr{resultCount === 1 ? 'y' : 'ies'}
          {search && ` matching "${search}"`}
          {categoryFilter !== 'ALL' && ` in ${categoryFilter}`}
        </p>
      )}
    </div>
  )
}
