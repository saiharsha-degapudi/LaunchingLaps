import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { WordReveal, Card3D, MeshGradient, useScrollReveal } from '../utils/design'

const LEVEL_COLORS = {
  Beginner: 'bg-green-50 text-green-700 border border-green-200',
  Intermediate: 'bg-amber-50 text-amber-700 border border-amber-200',
  Advanced: 'bg-red-50 text-red-700 border border-red-200',
}

export default function CourseDetail() {
  useScrollReveal()
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
      <div className="flex justify-center items-center py-24 bg-zinc-50 min-h-screen">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-700 rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-zinc-50 min-h-screen flex items-center justify-center">
        <div className="bg-white border border-zinc-200 rounded-xl p-8 max-w-sm w-full text-center">
          <p className="text-red-600 font-medium text-sm mb-4">{error}</p>
          <button onClick={() => navigate('/education')} className="btn-primary">
            Back to Courses
          </button>
        </div>
      </div>
    )
  }

  const sortedLessons = [...(course.lessons || [])].sort((a, b) => a.order_index - b.order_index)
  const levelColor = LEVEL_COLORS[course.level] || 'bg-zinc-100 text-zinc-700 border border-zinc-200'
  const activeLessonIndex = sortedLessons.findIndex((l) => l.id === activeLesson?.id)

  function goToLesson(direction) {
    const newIndex = activeLessonIndex + direction
    if (newIndex >= 0 && newIndex < sortedLessons.length) {
      setActiveLesson(sortedLessons[newIndex])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Hero with MeshGradient */}
      <div className="relative overflow-hidden border-b border-zinc-100">
        <MeshGradient />
        <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-5">
            <Link to="/education" className="hover:text-zinc-700 transition-colors duration-200">Education</Link>
            <span>/</span>
            <span className="text-zinc-600 font-medium truncate max-w-xs">{course.title}</span>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1">
              <span className={`inline-flex text-xs font-medium px-2.5 py-0.5 rounded-md mb-3 ${levelColor}`}>
                {course.level}
              </span>
              <WordReveal text={course.title} tag="h1" className="text-3xl font-bold text-zinc-900 tracking-tight mb-3" />
              <p className="text-sm text-zinc-500 max-w-2xl leading-relaxed">{course.description}</p>
            </div>
            <div className="flex-shrink-0">
              <button className="btn-accent text-sm px-6 py-2.5">
                Enroll Now
              </button>
            </div>
          </div>

          {/* Course meta */}
          <div className="flex flex-wrap gap-6 text-sm text-zinc-500 mt-6 pt-6 border-t border-zinc-200/60">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {course.instructor_name}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.duration_hours} hours
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {sortedLessons.length} lesson{sortedLessons.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar: lesson list */}
          <div className="lg:col-span-1">
            <Card3D>
              <div className="bg-white border border-zinc-200 rounded-xl p-5 sticky top-20 reveal">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Curriculum</p>
                <h2 className="font-semibold text-zinc-900 text-sm mb-4 leading-snug">{course.title}</h2>

                {sortedLessons.length === 0 ? (
                  <p className="text-zinc-400 text-sm">No lessons yet.</p>
                ) : (
                  <ul className="flex flex-col gap-1">
                    {sortedLessons.map((lesson, idx) => {
                      const isActive = lesson.id === activeLesson?.id
                      return (
                        <li key={lesson.id} className={`reveal reveal-delay-${Math.min(idx + 1, 5)}`}>
                          <button
                            onClick={() => setActiveLesson(lesson)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 flex items-start gap-3 ${
                              isActive
                                ? 'bg-zinc-900 text-white'
                                : 'text-zinc-600 hover:bg-zinc-50'
                            }`}
                          >
                            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                              isActive ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-500'
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

                {/* Instructor card */}
                <div className="mt-6 pt-5 border-t border-zinc-100">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Instructor</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-800">{course.instructor_name}</p>
                      <p className="text-xs text-zinc-400">Course Instructor</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card3D>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            {/* Active lesson */}
            {activeLesson ? (
              <div className="bg-white border border-zinc-200 rounded-xl p-6 flex flex-col gap-5 reveal">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-zinc-400 uppercase tracking-wide mb-1.5">
                      Lesson {activeLessonIndex + 1} of {sortedLessons.length}
                    </p>
                    <h2 className="text-xl font-semibold text-zinc-900">{activeLesson.title}</h2>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100 whitespace-nowrap flex-shrink-0">
                    {activeLesson.duration_minutes} min
                  </span>
                </div>

                {/* Video embed if available */}
                {activeLesson.video_url && (
                  <div className="rounded-xl overflow-hidden bg-zinc-950 aspect-video">
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
                <div className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap bg-zinc-50 rounded-xl p-5 border border-zinc-100">
                  {activeLesson.content}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-4 border-t border-zinc-100">
                  <button
                    onClick={() => goToLesson(-1)}
                    disabled={activeLessonIndex === 0}
                    className="btn-secondary text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                  <span className="text-xs text-zinc-400 tabular-nums">
                    {activeLessonIndex + 1} / {sortedLessons.length}
                  </span>
                  {activeLessonIndex === sortedLessons.length - 1 ? (
                    <button className="btn-accent text-sm flex items-center gap-1.5">
                      Complete Course
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => goToLesson(1)}
                      disabled={activeLessonIndex === sortedLessons.length - 1}
                      className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                      Next
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-zinc-200 rounded-xl text-center py-16 reveal">
                <p className="text-zinc-400 text-sm">Select a lesson from the sidebar to begin.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
