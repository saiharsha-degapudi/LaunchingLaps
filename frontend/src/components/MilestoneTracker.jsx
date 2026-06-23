import { useState, useEffect } from 'react'

const STORAGE_KEY = 'll_milestones'

const CATEGORIES = ['Product', 'Revenue', 'Team', 'Legal', 'Marketing']

const CATEGORY_COLORS = {
  Product: 'bg-blue-100 text-blue-700',
  Revenue: 'bg-green-100 text-green-700',
  Team: 'bg-purple-100 text-purple-700',
  Legal: 'bg-red-100 text-red-700',
  Marketing: 'bg-yellow-100 text-yellow-700',
}

function loadMilestones() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveMilestones(milestones) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(milestones))
}

function sortMilestones(milestones) {
  return [...milestones].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    return new Date(a.targetDate) - new Date(b.targetDate)
  })
}

export default function MilestoneTracker() {
  const [milestones, setMilestones] = useState(() => loadMilestones())
  const [title, setTitle] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [category, setCategory] = useState('Product')
  const [error, setError] = useState('')

  useEffect(() => {
    saveMilestones(milestones)
  }, [milestones])

  const completed = milestones.filter((m) => m.completed).length
  const total = milestones.length
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0

  function addMilestone(e) {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required'); return }
    if (!targetDate) { setError('Target date is required'); return }
    setError('')
    const newMilestone = {
      id: Date.now(),
      title: title.trim(),
      targetDate,
      category,
      completed: false,
    }
    setMilestones((prev) => sortMilestones([...prev, newMilestone]))
    setTitle('')
    setTargetDate('')
    setCategory('Product')
  }

  function toggleComplete(id) {
    setMilestones((prev) =>
      sortMilestones(prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m)))
    )
  }

  function deleteMilestone(id) {
    setMilestones((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div className="card flex flex-col gap-6">
      <div>
        <h2 className="font-bold text-brand-800 text-lg mb-1">Milestone Tracker</h2>
        {total > 0 && (
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {completed} / {total} completed
            </span>
          </div>
        )}
      </div>

      {/* Add Form */}
      <form onSubmit={addMilestone} className="flex flex-col gap-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            className="input sm:col-span-1"
            placeholder="Milestone title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="date"
            className="input"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
          <select
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button type="submit" className="btn-primary self-start px-5 py-1.5 text-sm">
          + Add Milestone
        </button>
      </form>

      {/* Milestone List */}
      {milestones.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">No milestones yet. Add one above.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {sortMilestones(milestones).map((m) => (
            <li
              key={m.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                m.completed ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-200'
              }`}
            >
              <input
                type="checkbox"
                checked={m.completed}
                onChange={() => toggleComplete(m.id)}
                className="w-4 h-4 accent-blue-600 cursor-pointer flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${m.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {m.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Target: {new Date(m.targetDate + 'T00:00:00').toLocaleDateString()}
                </p>
              </div>
              <span className={`badge text-xs flex-shrink-0 ${CATEGORY_COLORS[m.category] || 'bg-gray-100 text-gray-600'}`}>
                {m.category}
              </span>
              <button
                onClick={() => deleteMilestone(m.id)}
                className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 text-base leading-none"
                title="Delete milestone"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
