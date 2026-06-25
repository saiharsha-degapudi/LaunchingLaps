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
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-2">LaunchingLaps Academy</p>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Learn, Grow, Launch</h1>
          <p className="text-sm text-zinc-500 mt-1 max-w-xl">
            Expert-led courses on fundraising, US market entry, financial modeling, pitch crafting, and scaling your startup globally.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses…"
            className="w-full border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white flex-1"
          />
          <div className="flex gap-2 flex-wrap">
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  level === l
                    ? 'bg-zinc-900 text-white'
                    : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
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
            <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-700 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-white border border-zinc-200 rounded-xl text-center py-12">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl text-center py-16">
            <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-sm font-medium text-zinc-700">No courses found</p>
            <p className="text-xs text-zinc-400 mt-1">Try adjusting your search or level filter.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-zinc-400 mb-4">
              <span className="font-medium text-zinc-700">{filtered.length}</span> course{filtered.length !== 1 ? 's' : ''} available
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
