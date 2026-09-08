import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from '../UI/ThemeToggle'

const publicLinks = [
  { to: '/', label: 'HOME' },
  { to: '/journey', label: 'LEARNING JOURNEY' },
  { to: '/progress', label: 'PROGRESS' },
  { to: '/about', label: 'ABOUT' },
]

export default function Navbar() {
  const location = useLocation()
  const { session } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary-700 dark:text-primary-400">
            <span>⚙️</span>
            <span className="hidden sm:inline">PLC Learning</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {publicLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 text-xs font-semibold tracking-wide rounded-lg transition-colors ${
                  isActive(link.to)
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950'
                    : 'text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />

            {session ? (
              <Link
                to="/admin/dashboard"
                className="px-3 py-2 text-xs font-semibold tracking-wide text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-lg transition-colors"
              >
                DASHBOARD
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="px-3 py-2 text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
              >
                ADMIN LOGIN
              </Link>
            )}

            <ThemeToggle />
          </div>

          {/* Mobile toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800"
              aria-label="Toggle menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200 dark:border-slate-800 pt-2">
            {publicLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-semibold rounded-lg ${
                  isActive(link.to)
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-950'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-slate-200 dark:border-slate-700 my-2" />
            {session ? (
              <Link
                to="/admin/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-sm font-semibold text-emerald-600"
              >
                DASHBOARD
              </Link>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-sm font-semibold text-slate-500"
              >
                ADMIN LOGIN
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
