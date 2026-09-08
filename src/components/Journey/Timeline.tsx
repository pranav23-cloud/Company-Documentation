import type { Category, LearningDay } from '../../types'
import TimelineCard from './TimelineCard'

interface TimelineProps {
  days: LearningDay[]
  categories: Category[]
}

export default function Timeline({ days, categories }: TimelineProps) {
  if (days.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
          No learning entries yet
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
          Learning entries will appear here once added through the Admin Dashboard.
        </p>
      </div>
    )
  }

  const sortedDays = [...days].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const totalDays = sortedDays.length

  return (
    <div className="relative">
      <div className="timeline-line" />
      {sortedDays.map((day, index) => (
        <TimelineCard
          key={day.id}
          day={day}
          dayNumber={totalDays - index}
          categories={categories}
        />
      ))}
    </div>
  )
}
