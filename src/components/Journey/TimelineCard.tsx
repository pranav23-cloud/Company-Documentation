import type { Category, LearningDay } from '../../types'
import { formatDate, getCategoryEmoji } from '../../types'

interface TimelineCardProps {
  day: LearningDay
  dayNumber: number
  categories: Category[]
}

export default function TimelineCard({ day, dayNumber, categories }: TimelineCardProps) {
  const topics = day.topics ?? []

  return (
    <div className="relative pl-16 pb-12 animate-fade-in-up">
      {/* Timeline dot */}
      <div className="absolute left-4 top-1 w-5 h-5 rounded-full bg-primary-600 dark:bg-primary-400 border-4 border-white dark:border-slate-950 z-10" />

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden card-hover">
        {/* Date header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-800 dark:to-primary-900 px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="text-primary-100 text-xs font-medium tracking-widest mb-0.5">
                📅 {formatDate(day.date)}
              </div>
              <div className="text-white/70 text-xs">Day {dayNumber}</div>
            </div>
            <div className="text-white/80 text-xs bg-white/10 px-3 py-1 rounded-full">
              {topics.length} topic{topics.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Topics */}
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {topics.map((topic) => (
            <div key={topic.id} className="px-6 py-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">
                  {getCategoryEmoji(topic.category, categories)} {topic.topic_name}
                </h3>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 whitespace-nowrap">
                  {topic.category}
                </span>
              </div>
              {topic.description && (
                <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {topic.description}
                </p>
              )}
              {topic.notes && (
                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 italic border-l-2 border-slate-200 dark:border-slate-600 pl-3">
                  📝 {topic.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
