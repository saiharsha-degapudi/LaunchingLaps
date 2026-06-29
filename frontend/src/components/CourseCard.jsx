import { Link } from 'react-router-dom'
import { Card3D } from '../utils/design'

const LEVEL_COLORS = {
  Beginner: 'bg-green-50 text-green-700 border border-green-200',
  Intermediate: 'bg-amber-50 text-amber-700 border border-amber-200',
  Advanced: 'bg-red-50 text-red-700 border border-red-200',
}

export default function CourseCard({ course }) {
  const levelColor = LEVEL_COLORS[course.level] || 'bg-zinc-100 text-zinc-700 border border-zinc-200'

  return (
    <Card3D>
      <div className="reveal bg-white border border-zinc-200 rounded-xl flex flex-col gap-3 overflow-hidden h-full">
        {course.thumbnail_url && (
          <div className="overflow-hidden">
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-40 object-cover transition-transform duration-500 hover:scale-105"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
        )}

        <div className="flex flex-col gap-3 p-5 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-zinc-900 leading-tight text-sm">{course.title}</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-md whitespace-nowrap flex-shrink-0 ${levelColor}`}>
              {course.level}
            </span>
          </div>

          <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed">{course.description}</p>

          {/* Progress bar placeholder for completion */}
          {course.completion_percent != null && (
            <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${course.completion_percent}%` }}
              />
            </div>
          )}

          <div className="flex items-center gap-3 text-xs text-zinc-400 mt-auto pt-3 border-t border-zinc-100">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {course.instructor_name}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.duration_hours}h
            </span>
            <Link to={`/education/${course.id}`} className="ml-auto btn-primary text-xs px-4 py-1.5">
              Start Course
            </Link>
          </div>
        </div>
      </div>
    </Card3D>
  )
}
