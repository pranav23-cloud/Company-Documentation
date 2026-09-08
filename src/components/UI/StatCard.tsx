interface StatCardProps {
  icon: string
  label: string
  value: string | number
  subtext?: string
}

export default function StatCard({ icon, label, value, subtext }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 card-hover">
      <div className="text-3xl mb-3">{icon}</div>
      <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
        {value}
      </div>
      <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</div>
      {subtext && (
        <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtext}</div>
      )}
    </div>
  )
}
