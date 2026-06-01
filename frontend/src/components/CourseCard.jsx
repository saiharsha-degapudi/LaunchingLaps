import { Link } from 'react-router-dom'

const LEVEL_COLORS = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-red-100 text-red-700',
}

export default function CourseCard({ course }) {
  const levelColor = LEVEL_COLORS[course.level] || 'bg-gray-100 text-gray-700'

  return (
    <div className="card hover:shadow-md transition-shadow flex flex-col gap-3">
      {course.thumbnail_url && (
        <img
          src={course.thumbnail_url}
          alt={course.title}
          className="w-full h-40 object-cover rounded-lg"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      )}

      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-brand-800 leading-tight">{course.title}</h3>
        <span className={`badge ${levelColor} whitespace-nowrap`}>{course.level}</span>
      </div>

      <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>

      <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto pt-2 border-t border-gray-100">
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
  )
}
