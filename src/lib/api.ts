import type { Category, DayFormData, LearningDay, LearningStats } from '../types'
import { supabase } from './supabase'

export async function fetchPublishedDays(): Promise<LearningDay[]> {
  const { data: days, error: daysError } = await supabase
    .from('learning_days')
    .select('*')
    .eq('status', 'published')
    .order('date', { ascending: false })

  if (daysError) throw daysError
  if (!days?.length) return []

  const { data: topics, error: topicsError } = await supabase
    .from('learning_topics')
    .select('*')
    .in('learning_day_id', days.map((d) => d.id))
    .order('created_at', { ascending: true })

  if (topicsError) throw topicsError

  return days.map((day) => ({
    ...day,
    topics: (topics ?? []).filter((t) => t.learning_day_id === day.id),
  }))
}

export async function fetchAllDays(): Promise<LearningDay[]> {
  const { data: days, error: daysError } = await supabase
    .from('learning_days')
    .select('*')
    .order('date', { ascending: false })

  if (daysError) throw daysError
  if (!days?.length) return []

  const { data: topics, error: topicsError } = await supabase
    .from('learning_topics')
    .select('*')
    .in('learning_day_id', days.map((d) => d.id))
    .order('created_at', { ascending: true })

  if (topicsError) throw topicsError

  return days.map((day) => ({
    ...day,
    topics: (topics ?? []).filter((t) => t.learning_day_id === day.id),
  }))
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data ?? []
}

export function computeStats(days: LearningDay[]): LearningStats {
  const publishedDays = days.filter((d) => d.status === 'published')
  const allTopics = publishedDays.flatMap((d) => d.topics ?? [])
  const sortedDates = publishedDays.map((d) => d.date).sort()

  const categoryCounts: Record<string, number> = {}
  for (const topic of allTopics) {
    categoryCounts[topic.category] = (categoryCounts[topic.category] ?? 0) + 1
  }
  const currentFocus = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

  return {
    totalDays: publishedDays.length,
    totalTopics: allTopics.length,
    latestDate: sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : null,
    earliestDate: sortedDates.length > 0 ? sortedDates[0] : null,
    currentFocus,
  }
}

export async function saveLearningDay(form: DayFormData, existingId?: string): Promise<void> {
  let dayId = existingId

  if (existingId) {
    const { error } = await supabase
      .from('learning_days')
      .update({ date: form.date, status: form.status })
      .eq('id', existingId)
    if (error) throw error

    const { error: deleteError } = await supabase
      .from('learning_topics')
      .delete()
      .eq('learning_day_id', existingId)
    if (deleteError) throw deleteError
  } else {
    const { data, error } = await supabase
      .from('learning_days')
      .insert({ date: form.date, status: form.status })
      .select('id')
      .single()
    if (error) throw error
    dayId = data.id
  }

  const topicsToInsert = form.topics
    .filter((t) => t.topic_name.trim())
    .map((t) => ({
      learning_day_id: dayId!,
      topic_name: t.topic_name.trim(),
      description: t.description.trim(),
      category: t.category,
      notes: t.notes.trim() || null,
    }))

  if (topicsToInsert.length > 0) {
    const { error } = await supabase.from('learning_topics').insert(topicsToInsert)
    if (error) throw error
  }
}

export async function deleteLearningDay(id: string): Promise<void> {
  const { error } = await supabase.from('learning_days').delete().eq('id', id)
  if (error) throw error
}

export async function addCategory(name: string, emoji: string): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert({ name, emoji })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}
