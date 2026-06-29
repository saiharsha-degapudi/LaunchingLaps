import { useEffect, useState } from 'react'
import api from '../api/axios'
import CourseCard from '../components/CourseCard'
import { WordReveal, PageHeader, SectionHeader, StatCounter, VoiceSearchButton, useScrollReveal, useDragScroll } from '../utils/design'

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function Education() {
  useScrollReveal()
  const dragScroll = useDragScroll()

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

  const categories = [...new Set(courses.map(c => c.level).filter(Boolean))]

  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Hero header */}
      <div className="border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">LaunchingLaps Academy</p>
          <WordReveal text="Learn & Grow" tag="h1" className="text-4xl font-bold text-zinc-900 tracking-tight mb-3" />
          <p className="text-sm text-zinc-500 max-w-xl leading-relaxed">
            Expert-led courses on fundraising, US market entry, financial modeling, pitch crafting, and scaling your startup globally.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Stats row */}
        {!loading && courses.length > 0 && (
          <div className="grid grid-cols-3 gap-6 mb-10 reveal">
            <div className="bg-white border border-zinc-200 rounded-xl p-6 text-center reveal reveal-delay-1">
              <StatCounter target={courses.length} label="Total Courses" />
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-6 text-center reveal reveal-delay-2">
              <StatCounter target={categories.length} label="Skill Levels" />
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-6 text-center reveal reveal-delay-3">
              <StatCounter target={courses.reduce((sum, c) => sum + (c.duration_hours || 0), 0)} suffix="h" label="Total Learning Hours" />
            </div>
          </div>
        )}

        {/* Search + level filter */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 mb-6 reveal">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative flex items-center gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="input flex-1"
              />
              <VoiceSearchButton onResult={(text) => setSearch(text)} />
            </div>
          </div>

          {/* Horizontal scrollable level tabs */}
          <div
            className="relative"
            style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)' }}
          >
            <div
              ref={dragScroll.ref}
              onMouseDown={dragScroll.onMouseDown}
              onMouseMove={dragScroll.onMouseMove}
              onMouseUp={dragScroll.onMouseUp}
              className="flex gap-2 overflow-x-auto select-none cursor-grab active:cursor-grabbing pb-1"
              style={{ overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 flex-shrink-0 ${
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
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-700 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-white border border-zinc-200 rounded-xl text-center py-12 reveal">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 btn-primary text-sm"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl text-center py-16 reveal">
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
            <SectionHeader
              title={`${filtered.length} course${filtered.length !== 1 ? 's' : ''} available`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {filtered.map((course, idx) => (
                <div
                  key={course.id}
                  className={`reveal reveal-delay-${Math.min(idx % 5 + 1, 5)}`}
                >
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
