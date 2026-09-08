import { Link } from 'react-router-dom'
import HeroSection, { StatsSection } from '../components/Home/HeroSection'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { useLearningData } from '../hooks/useLearningData'
import { isSupabaseConfigured } from '../lib/supabase'
import { formatDateShort } from '../types'

export default function HomePage() {
  const { days, stats, loading, error } = useLearningData()
  const recentDays = [...days].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)

  if (!isSupabaseConfigured) {
    return <SetupNotice />
  }

  return (
    <>
      <HeroSection stats={stats} />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            What This Journey Covers
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A daily record of my learning in PLC programming, industrial automation,
            electrical systems, sensors, ladder logic, and CNC technologies.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '⚙️', label: 'PLC Programming' },
            { icon: '🔌', label: 'Electrical Systems' },
            { icon: '🏭', label: 'Industrial Automation' },
            { icon: '📡', label: 'Sensors & I/O' },
            { icon: '🧠', label: 'Ladder Logic' },
            { icon: '⏱️', label: 'Timers & Counters' },
            { icon: '🤖', label: 'CNC Automation' },
            { icon: '🔧', label: 'Hardware' },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center card-hover"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <StatsSection stats={stats} />

      {/* Recent entries preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Recent Learning
          </h2>
          <Link to="/journey" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : recentDays.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
            <p className="text-slate-500 dark:text-slate-400">No entries yet. Add your first learning day via the Admin Dashboard.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {recentDays.map((day) => (
              <div
                key={day.id}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 card-hover"
              >
                <div className="text-xs font-semibold text-primary-600 dark:text-primary-400 mb-3">
                  📅 {formatDateShort(day.date)}
                </div>
                <div className="space-y-2">
                  {(day.topics ?? []).slice(0, 2).map((topic) => (
                    <div key={topic.id}>
                      <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                        {topic.topic_name}
                      </span>
                      {topic.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {topic.description}
                        </p>
                      )}
                    </div>
                  ))}
                  {(day.topics ?? []).length > 2 && (
                    <p className="text-xs text-slate-400">+{(day.topics ?? []).length - 2} more topics</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

function SetupNotice() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-6">⚙️</div>
      <h1 className="text-3xl font-bold mb-4">MY PLC LEARNING JOURNEY</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Supabase is not configured yet. Copy <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">.env.example</code> to <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">.env</code> and add your credentials.
      </p>
      <p className="text-sm text-slate-500">See README.md for full setup instructions.</p>
    </div>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-300 text-sm">
      Failed to load data: {message}
    </div>
  )
}

export { ErrorMessage, SetupNotice }
