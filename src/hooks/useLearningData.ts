import { useCallback, useEffect, useState } from 'react'
import type { Category, LearningDay, LearningStats } from '../types'
import {
  computeStats,
  fetchAllDays,
  fetchCategories,
  fetchPublishedDays,
} from '../lib/api'

interface UseLearningDataOptions {
  includeDrafts?: boolean
}

export function useLearningData(options: UseLearningDataOptions = {}) {
  const { includeDrafts = false } = options
  const [days, setDays] = useState<LearningDay[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [stats, setStats] = useState<LearningStats>({
    totalDays: 0,
    totalTopics: 0,
    latestDate: null,
    earliestDate: null,
    currentFocus: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [daysData, categoriesData] = await Promise.all([
        includeDrafts ? fetchAllDays() : fetchPublishedDays(),
        fetchCategories(),
      ])
      setDays(daysData)
      setCategories(categoriesData)
      setStats(computeStats(daysData))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [includeDrafts])

  useEffect(() => {
    load()
  }, [load])

  return { days, categories, stats, loading, error, reload: load }
}

export function useFilteredDays(
  days: LearningDay[],
  search: string,
  categoryFilter: string
) {
  return days.filter((day) => {
    const topics = day.topics ?? []
    const matchesSearch =
      !search ||
      topics.some(
        (t) =>
          t.topic_name.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase()) ||
          t.category.toLowerCase().includes(search.toLowerCase())
      )
    const matchesCategory =
      categoryFilter === 'ALL' ||
      topics.some((t) => t.category === categoryFilter)
    return matchesSearch && matchesCategory
  })
}
