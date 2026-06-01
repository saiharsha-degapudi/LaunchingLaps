import { useEffect, useState } from 'react'
import api from '../api/axios'
import CourseCard from '../components/CourseCard'

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function Education() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('All')

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get('/education/courses')
        setCourses(data)
      } catch {
        setError('Failed to load courses. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const filtered = courses.filter((c) => {
    const matchesSearch =
      search === '' ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor_name.toLowerCase().includes(search.toLowerCase())
    const matchesLevel = level === 'All' || c.level === level
    return matchesSearch && matchesLevel
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="bg-brand-800 rounded-2xl p-8 mb-8 text-white">
        <p className="text-gold-400 text-xs font-semibold uppercase tracking-widest mb-2">LaunchingLaps Academy</p>
        <h1 className="text-3xl font-black mb-2">Learn, Grow, Launch</h1>
        <p className="text-brand-200 text-sm max-w-xl">
          Expert-led courses on fundraising, US market entry, financial modeling, pitch crafting, and scaling your startup globally.
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-8 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses…"
          className="input flex-1"
        />
        <div className="flex gap-2 flex-wrap">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                level === l
                  ? 'bg-brand-800 text-white border-brand-800'
                  : 'border-gray-300 text-gray-600 hover:border-brand-800'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <svg className="animate-spin w-10 h-10 text-brand-800" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </div>
      ) : error ? (
        <div className="card text-center py-12">
          <p className="text-red-600 font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary mt-4">
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-gray-500 font-medium">No courses found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or level filter.</p>
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-sm mb-4">{filtered.length} course{filtered.length !== 1 ? 's' : ''} available</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
