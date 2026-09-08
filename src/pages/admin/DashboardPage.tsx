import { useState } from 'react'
import EntryForm from '../../components/Admin/EntryForm'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import { useLearningData } from '../../hooks/useLearningData'
import { deleteLearningDay, saveLearningDay } from '../../lib/api'
import type { DayFormData, LearningDay } from '../../types'
import { formatDateShort, getCategoryEmoji } from '../../types'

type View = 'list' | 'add' | 'edit'

export default function DashboardPage() {
  const { signOut, session } = useAuth()
  const { days, categories, loading, error, reload } = useLearningData({ includeDrafts: true })

  const [view, setView] = useState<View>('list')
  const [editingDay, setEditingDay] = useState<LearningDay | null>(null)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 4000)
  }

  const handleSave = async (data: DayFormData, status: 'published' | 'draft') => {
    setSaving(true)
    try {
      await saveLearningDay({ ...data, status }, editingDay?.id)
      await reload()
      setView('list')
      setEditingDay(null)
      showSuccess(
        status === 'draft'
          ? '✅ Learning entry saved as draft!'
          : '✅ Learning entry saved and published!'
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save entry')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(true)
    try {
      await deleteLearningDay(id)
      await reload()
      setDeleteConfirm(null)
      showSuccess('🗑️ Entry deleted successfully.')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete entry')
    } finally {
      setDeleting(false)
    }
  }

  const startEdit = (day: LearningDay) => {
    setEditingDay(day)
    setView('edit')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Signed in as {session?.user.email}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {view === 'list' && (
            <button
              onClick={() => { setEditingDay(null); setView('add') }}
              className="btn-primary"
            >
              ➕ ADD TODAY'S LEARNING
            </button>
          )}
          <button onClick={signOut} className="btn-secondary text-sm">
            Sign Out
          </button>
        </div>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="mb-6 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-emerald-700 dark:text-emerald-300 text-sm font-medium animate-fade-in-up">
          {successMsg}
        </div>
      )}

      {/* Form views */}
      {(view === 'add' || view === 'edit') && (
        <EntryForm
          categories={categories}
          initialData={editingDay ?? undefined}
          onSave={handleSave}
          onCancel={() => { setView('list'); setEditingDay(null) }}
          saving={saving}
        />
      )}

      {/* List view */}
      {view === 'list' && (
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
            My Learning Entries
          </h2>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          ) : days.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
              <div className="text-4xl mb-3">📚</div>
              <p className="text-slate-500 dark:text-slate-400 mb-4">No entries yet. Add your first learning day!</p>
              <button
                onClick={() => setView('add')}
                className="btn-primary"
              >
                ➕ ADD TODAY'S LEARNING
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {days.map((day) => (
                <div
                  key={day.id}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden"
                >
                  <div className="flex items-center justify-between px-5 py-4 bg-slate-50 dark:bg-slate-900/50 flex-wrap gap-2">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        📅 {formatDateShort(day.date)}
                      </span>
                      <span className={`ml-3 text-xs px-2 py-0.5 rounded-full font-medium ${
                        day.status === 'published'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}>
                        {day.status === 'published' ? '✅ Published' : '📝 Draft'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(day)}
                        className="px-3 py-1.5 text-xs font-semibold bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
                      >
                        ✏️ EDIT
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(day.id)}
                        className="px-3 py-1.5 text-xs font-semibold bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                      >
                        🗑️ DELETE
                      </button>
                    </div>
                  </div>

                  <div className="px-5 py-4 divide-y divide-slate-100 dark:divide-slate-700">
                    {(day.topics ?? []).map((topic) => (
                      <div key={topic.id} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm text-slate-800 dark:text-slate-200">
                            {getCategoryEmoji(topic.category, categories)} {topic.topic_name}
                          </span>
                          <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                            {topic.category}
                          </span>
                        </div>
                        {topic.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{topic.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Confirm Delete
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Are you sure you want to delete this learning entry? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="btn-danger flex-1"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
