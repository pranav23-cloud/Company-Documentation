import { Link } from 'react-router-dom'
import StatCard from '../components/UI/StatCard'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { useLearningData } from '../hooks/useLearningData'
import { isSupabaseConfigured } from '../lib/supabase'
import { formatDate, formatDateShort, getCategoryEmoji } from '../types'
import { SetupNotice, ErrorMessage } from './HomePage'

export default function ProgressPage() {
  const { days, categories, stats, loading, error } = useLearningData()

  if (!isSupabaseConfigured) return <SetupNotice />

  const categoryBreakdown: Record<string, number> = {}
  for (const day of days) {
    for (const topic of day.topics ?? []) {
      categoryBreakdown[topic.category] = (categoryBreakdown[topic.category] ?? 0) + 1
    }
  }
  const sortedCategories = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1])
  const maxCount = sortedCategories[0]?.[1] ?? 1

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
          Learning Progress
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Automatically calculated from your learning entries.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <StatCard icon="📚" label="Total Topics Learned" value={stats.totalTopics} />
            <StatCard icon="📅" label="Total Learning Days" value={stats.totalDays} />
            <StatCard
              icon="⚙️"
              label="Current Focus"
              value={stats.currentFocus ?? '—'}
            />
            <StatCard
              icon="🕒"
              label="Latest Learning Date"
              value={stats.latestDate ? formatDateShort(stats.latestDate) : '—'}
              subtext={stats.latestDate ? formatDate(stats.latestDate) : undefined}
            />
          </div>

          {stats.earliestDate && stats.latestDate && (
            <div className="bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-xl p-6 mb-12">
              <h2 className="font-semibold text-primary-800 dark:text-primary-300 mb-2">
                📅 Learning Journey Period
              </h2>
              <p className="text-primary-700 dark:text-primary-400">
                {formatDate(stats.earliestDate)} — {formatDate(stats.latestDate)}
              </p>
            </div>
          )}

          {sortedCategories.length > 0 && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
              <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-6">
                Topics by Category
              </h2>
              <div className="space-y-4">
                {sortedCategories.map(([category, count]) => (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {getCategoryEmoji(category, categories)} {category}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{count} topics</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 dark:bg-primary-400 rounded-full transition-all duration-500"
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stats.totalDays === 0 && (
            <div className="text-center py-12 mt-8">
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                No learning data yet. Start documenting your journey!
              </p>
              <Link to="/admin/login" className="btn-primary inline-block">
                Go to Admin Dashboard
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}
