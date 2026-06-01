import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const LEVEL_COLORS = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-red-100 text-red-700',
}

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeLesson, setActiveLesson] = useState(null)

  useEffect(() => {
    async function fetchCourse() {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get(`/education/courses/${id}`)
        setCourse(data)
        if (data.lessons?.length > 0) {
          const sorted = [...data.lessons].sort((a, b) => a.order_index - b.order_index)
          setActiveLesson(sorted[0])
        }
      } catch (err) {
        if (err?.response?.status === 404) {
          setError('Course not found.')
        } else {
          setError('Failed to load course.')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <svg className="animate-spin w-10 h-10 text-brand-800" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="card">
          <p className="text-red-600 font-medium text-lg mb-4">{error}</p>
          <button onClick={() => navigate('/education')} className="btn-primary">
            Back to Courses
          </button>
        </div>
      </div>
    )
  }

  const sortedLessons = [...(course.lessons || [])].sort((a, b) => a.order_index - b.order_index)
  const levelColor = LEVEL_COLORS[course.level] || 'bg-gray-100 text-gray-700'
  const activeLessonIndex = sortedLessons.findIndex((l) => l.id === activeLesson?.id)

  function goToLesson(direction) {
    const newIndex = activeLessonIndex + direction
    if (newIndex >= 0 && newIndex < sortedLessons.length) {
      setActiveLesson(sortedLessons[newIndex])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/education" className="hover:text-brand-800 transition-colors">Education</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium truncate max-w-xs">{course.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: lesson list */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h2 className="font-bold text-brand-800 text-sm mb-1">{course.title}</h2>
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className={`badge ${levelColor} text-xs`}>{course.level}</span>
              <span className="text-xs text-gray-400">{course.duration_hours}h total</span>
            </div>

            {sortedLessons.length === 0 ? (
              <p className="text-gray-400 text-sm">No lessons yet.</p>
            ) : (
              <ul className="flex flex-col gap-1">
                {sortedLessons.map((lesson, idx) => {
                  const isActive = lesson.id === activeLesson?.id
                  return (
                    <li key={lesson.id}>
                      <button
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition flex items-start gap-3 ${
                          isActive
                            ? 'bg-brand-800 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                          isActive ? 'bg-gold-500 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{lesson.title}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Course header */}
          <div className="card">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Course Overview</p>
                <h1 className="text-2xl font-black text-brand-800">{course.title}</h1>
              </div>
              <span className={`badge ${levelColor}`}>{course.level}</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{course.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {course.instructor_name}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {course.duration_hours} hours
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {sortedLessons.length} lesson{sortedLessons.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Active lesson */}
          {activeLesson ? (
            <div className="card flex flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Lesson {activeLessonIndex + 1} of {sortedLessons.length}
                  </p>
                  <h2 className="text-xl font-bold text-brand-800">{activeLesson.title}</h2>
                </div>
                <span className="badge bg-brand-100 text-brand-700 text-xs whitespace-nowrap">
                  {activeLesson.duration_minutes} min
                </span>
              </div>

              {/* Video embed if available */}
              {activeLesson.video_url && (
                <div className="rounded-xl overflow-hidden bg-black aspect-video">
                  <iframe
                    src={activeLesson.video_url}
                    title={activeLesson.title}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              )}

              {/* Lesson content */}
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-lg p-5 border border-gray-200">
                {activeLesson.content}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <button
                  onClick={() => goToLesson(-1)}
                  disabled={activeLessonIndex === 0}
                  className="btn-secondary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <span className="text-xs text-gray-400">
                  {activeLessonIndex + 1} / {sortedLessons.length}
                </span>
                <button
                  onClick={() => goToLesson(1)}
                  disabled={activeLessonIndex === sortedLessons.length - 1}
                  className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-gray-400">Select a lesson from the sidebar to begin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
