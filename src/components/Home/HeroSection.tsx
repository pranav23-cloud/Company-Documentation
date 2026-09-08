import { Link } from 'react-router-dom'
import type { LearningStats } from '../../types'
import { formatDateShort } from '../../types'
import StatCard from '../UI/StatCard'

interface HeroSectionProps {
  stats: LearningStats
}

export default function HeroSection({ stats }: HeroSectionProps) {
  const dateRange =
    stats.earliestDate && stats.latestDate
      ? `${formatDateShort(stats.earliestDate)} — ${formatDateShort(stats.latestDate)}`
      : 'Start your journey today'

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 dark:from-slate-950 dark:via-primary-950 dark:to-slate-950 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 75% 75%, #1d4ed8 0%, transparent 50%)',
        }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="max-w-3xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm text-primary-200 mb-6">
            <span>⚙️</span>
            <span>Industrial Automation Learning Portfolio</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            MY PLC LEARNING JOURNEY{' '}
            <span className="inline-block">⚙️</span>
          </h1>

          <p className="text-lg sm:text-xl text-primary-100 mb-2 leading-relaxed">
            Documenting my journey through PLC Programming, Industrial Automation and Engineering.
          </p>

          <p className="text-sm text-primary-300 mb-10">
            📅 Learning Period: {dateRange}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/journey" className="btn-primary bg-white text-primary-700 hover:bg-primary-50">
              View Learning Journey →
            </Link>
            <Link to="/progress" className="btn-outline border-white/40 text-white hover:bg-white/10">
              View Progress
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-3xl font-bold">{stats.totalDays}</div>
            <div className="text-sm text-primary-200 mt-1">Learning Days</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">⚙️</div>
            <div className="text-3xl font-bold">{stats.totalTopics}</div>
            <div className="text-sm text-primary-200 mt-1">Topics Covered</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-3xl font-bold truncate">
              {stats.currentFocus ?? '—'}
            </div>
            <div className="text-sm text-primary-200 mt-1">Current Focus</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function StatsSection({ stats }: HeroSectionProps) {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📅" label="Total Learning Days" value={stats.totalDays} />
        <StatCard icon="⚙️" label="Topics Learned" value={stats.totalTopics} />
        <StatCard
          icon="📚"
          label="Current Focus"
          value={stats.currentFocus ?? '—'}
        />
        <StatCard
          icon="🕒"
          label="Latest Learning"
          value={stats.latestDate ? formatDateShort(stats.latestDate) : '—'}
        />
      </div>
    </section>
  )
}
