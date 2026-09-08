export interface Category {
  id: string
  name: string
  emoji: string
  created_at: string
}

export interface LearningDay {
  id: string
  date: string
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
  topics?: LearningTopic[]
}

export interface LearningTopic {
  id: string
  learning_day_id: string
  topic_name: string
  description: string
  category: string
  notes: string | null
  created_at: string
}

export interface LearningStats {
  totalDays: number
  totalTopics: number
  latestDate: string | null
  earliestDate: string | null
  currentFocus: string | null
}

export interface TopicFormData {
  topic_name: string
  description: string
  category: string
  notes: string
}

export interface DayFormData {
  date: string
  status: 'draft' | 'published'
  topics: TopicFormData[]
}

export const DEFAULT_CATEGORIES = [
  { name: 'PLC Programming', emoji: '⚙️' },
  { name: 'Electrical', emoji: '🔌' },
  { name: 'Industrial Automation', emoji: '🏭' },
  { name: 'Sensors', emoji: '📡' },
  { name: 'CNC Automation', emoji: '🤖' },
  { name: 'Ladder Logic', emoji: '🧠' },
  { name: 'Timers & Counters', emoji: '⏱️' },
  { name: 'Hardware', emoji: '🔧' },
] as const

export function getCategoryEmoji(category: string, categories: Category[]): string {
  const found = categories.find(
    (c) => c.name.toLowerCase() === category.toLowerCase()
  )
  return found?.emoji ?? '⚙️'
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).toUpperCase()
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function emptyTopic(): TopicFormData {
  return { topic_name: '', description: '', category: '', notes: '' }
}
