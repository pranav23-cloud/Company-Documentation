import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
          About This Journey
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          An honest record of continuous learning in engineering and automation.
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
          <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-3">
            ⚙️ What This Is
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            This website documents my continuous learning journey in PLC Programming,
            Industrial Automation, CNC systems, sensors, Ladder Logic, and related
            engineering technologies. Every entry reflects actual topics studied —
            nothing is fabricated or exaggerated.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
          <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-3">
            📚 What I Document
          </h2>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400">
            {[
              'Daily topics learned in PLC and automation',
              'Short descriptions of concepts understood',
              'Categories covering electrical, sensors, ladder logic, and more',
              'Personal notes and observations from each learning session',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-primary-500 mt-0.5">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
          <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-3">
            🎯 Purpose
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            This serves as my personal PLC Learning Journal, Industrial Automation
            Learning Tracker, and Engineering Learning Portfolio. It demonstrates
            consistent effort, curiosity, and growth in a field I'm actively building
            expertise in.
          </p>
        </div>

        <div className="bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-xl p-6 text-center">
          <p className="text-primary-700 dark:text-primary-300 mb-4">
            Want to follow along or connect?
          </p>
          <Link to="/journey" className="btn-primary inline-block">
            View My Learning Journey →
          </Link>
        </div>
      </div>
    </div>
  )
}
