import { useState } from 'react'
import SearchFilter from '../components/Journey/SearchFilter'
import Timeline from '../components/Journey/Timeline'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { useFilteredDays, useLearningData } from '../hooks/useLearningData'
import { isSupabaseConfigured } from '../lib/supabase'
import { SetupNotice, ErrorMessage } from './HomePage'

export default function JourneyPage() {
  const { days, categories, loading, error } = useLearningData()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')

  const filteredDays = useFilteredDays(days, search, categoryFilter)

  if (!isSupabaseConfigured) return <SetupNotice />

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
          Learning Journey
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          A chronological record of everything I've learned in PLC and Industrial Automation.
        </p>
      </div>

      <div className="mb-8">
        <SearchFilter
          search={search}
          onSearchChange={setSearch}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          categories={categories}
          resultCount={filteredDays.length}
        />
      </div>

      {loading ? (
        <LoadingSpinner message="Loading learning journey..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <Timeline days={filteredDays} categories={categories} />
      )}
    </div>
  )
}
