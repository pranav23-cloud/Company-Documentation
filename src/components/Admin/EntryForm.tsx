import { useState } from 'react'
import type { Category, DayFormData, LearningDay, TopicFormData } from '../../types'
import { emptyTopic } from '../../types'

interface EntryFormProps {
  categories: Category[]
  initialData?: LearningDay
  onSave: (data: DayFormData, status: 'published' | 'draft') => Promise<void>
  onCancel: () => void
  saving: boolean
}

export default function EntryForm({
  categories,
  initialData,
  onSave,
  onCancel,
  saving,
}: EntryFormProps) {
  const today = new Date().toISOString().split('T')[0]

  const [date, setDate] = useState(initialData?.date ?? today)
  const [topics, setTopics] = useState<TopicFormData[]>(
    initialData?.topics?.map((t) => ({
      topic_name: t.topic_name,
      description: t.description,
      category: t.category,
      notes: t.notes ?? '',
    })) ?? [emptyTopic()]
  )
  const [error, setError] = useState<string | null>(null)

  const updateTopic = (index: number, field: keyof TopicFormData, value: string) => {
    setTopics((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)))
  }

  const addTopic = () => setTopics((prev) => [...prev, emptyTopic()])

  const removeTopic = (index: number) => {
    if (topics.length > 1) setTopics((prev) => prev.filter((_, i) => i !== index))
  }

  const validate = (): boolean => {
    if (!date) {
      setError('Please select a date.')
      return false
    }
    const validTopics = topics.filter((t) => t.topic_name.trim())
    if (validTopics.length === 0) {
      setError('Please add at least one topic with a name.')
      return false
    }
    for (const t of validTopics) {
      if (!t.category) {
        setError('Please select a category for all topics.')
        return false
      }
    }
    setError(null)
    return true
  }

  const handleSave = async (status: 'published' | 'draft') => {
    if (!validate()) return
    await onSave({ date, status, topics }, status)
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
        <h2 className="text-white font-semibold text-lg">
          {initialData ? '✏️ Edit Learning Entry' : '➕ Add Today\'s Learning'}
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Date */}
        <div>
          <label className="form-label">📅 Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700" />

        {/* Topics */}
        {topics.map((topic, index) => (
          <div key={index} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                Topic {index + 1}
              </h3>
              {topics.length > 1 && (
                <button
                  onClick={() => removeTopic(index)}
                  className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400"
                >
                  Remove
                </button>
              )}
            </div>

            <div>
              <label className="form-label">Topic Name</label>
              <input
                type="text"
                value={topic.topic_name}
                onChange={(e) => updateTopic(index, 'topic_name', e.target.value)}
                placeholder="e.g. Industrial Automation Basics"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Short Description</label>
              <textarea
                value={topic.description}
                onChange={(e) => updateTopic(index, 'description', e.target.value)}
                placeholder="Brief description of what you learned..."
                rows={3}
                className="form-input resize-none"
              />
            </div>

            <div>
              <label className="form-label">Category</label>
              <select
                value={topic.category}
                onChange={(e) => updateTopic(index, 'category', e.target.value)}
                className="form-input"
              >
                <option value="">Select Category ▼</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Optional Notes</label>
              <input
                type="text"
                value={topic.notes}
                onChange={(e) => updateTopic(index, 'notes', e.target.value)}
                placeholder="Any additional notes..."
                className="form-input"
              />
            </div>

            {index < topics.length - 1 && (
              <div className="border-t border-slate-100 dark:border-slate-700" />
            )}
          </div>
        ))}

        <button
          onClick={addTopic}
          className="w-full py-3 border-2 border-dashed border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors text-sm font-medium"
        >
          ➕ ADD ANOTHER TOPIC
        </button>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="btn-primary flex-1 sm:flex-none"
          >
            {saving ? 'Saving...' : '💾 SAVE LEARNING'}
          </button>
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="btn-secondary flex-1 sm:flex-none"
          >
            SAVE AS DRAFT
          </button>
          <button onClick={onCancel} disabled={saving} className="btn-secondary flex-1 sm:flex-none">
            CANCEL
          </button>
        </div>
      </div>
    </div>
  )
}
