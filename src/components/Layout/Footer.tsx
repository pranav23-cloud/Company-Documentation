export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span>⚙️</span>
            <span>My PLC Learning Journey</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
            Documenting my journey through PLC Programming, Industrial Automation and Engineering.
          </p>
        </div>
      </div>
    </footer>
  )
}
