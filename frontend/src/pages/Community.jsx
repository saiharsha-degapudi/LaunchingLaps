import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = ['All', 'General', 'Fundraising', 'Legal', 'Marketing', 'Product', 'Tech', 'Networking']

function timeAgo(dateStr) {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function PostCard({ post, onUpvote, onOpenThread }) {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Upvote */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onUpvote(post.id)}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gold-100 hover:text-gold-600 text-gray-500 flex items-center justify-center transition"
            aria-label="Upvote"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <span className="text-xs font-bold text-gray-600">{post.upvotes}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <button
              onClick={() => onOpenThread(post)}
              className="text-left font-bold text-brand-800 hover:text-brand-600 transition-colors leading-tight"
            >
              {post.title}
            </button>
            <span className="badge bg-brand-100 text-brand-700 text-xs whitespace-nowrap">{post.category}</span>
          </div>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2 leading-relaxed">{post.body}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            <span>
              by <span className="font-medium text-gray-600">{post.author?.full_name}</span>
            </span>
            <span>{timeAgo(post.created_at)}</span>
            <button
              onClick={() => onOpenThread(post)}
              className="ml-auto text-brand-600 hover:text-brand-800 font-medium transition-colors"
            >
              View thread
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ThreadModal({ post, onClose, currentUser }) {
  const [replies, setReplies] = useState(post.replies || [])
  const [replyBody, setReplyBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [replyError, setReplyError] = useState('')

  async function handleReply(e) {
    e.preventDefault()
    if (!replyBody.trim()) return
    setSubmitting(true)
    setReplyError('')
    try {
      const { data } = await api.post(`/community/posts/${post.id}/replies`, { body: replyBody })
      setReplies((prev) => [...prev, data])
      setReplyBody('')
    } catch (err) {
      setReplyError(err?.response?.data?.detail || 'Failed to submit reply.')
    } finally {
      setSubmitting(false)
    }
  }

  // Also fetch fresh replies
  useEffect(() => {
    api.get(`/community/posts/${post.id}`).then(({ data }) => {
      setReplies(data.replies || [])
    }).catch(() => {})
  }, [post.id])

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        {/* Modal header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-100">
          <div className="flex-1">
            <span className="badge bg-brand-100 text-brand-700 text-xs mb-2">{post.category}</span>
            <h2 className="font-bold text-brand-800 text-xl leading-tight">{post.title}</h2>
            <p className="text-xs text-gray-400 mt-1">
              by <span className="font-medium text-gray-600">{post.author?.full_name}</span> &middot; {timeAgo(post.created_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center flex-shrink-0 transition"
            aria-label="Close"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Post body */}
        <div className="px-6 py-5 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap border-b border-gray-100">
          {post.body}
        </div>

        {/* Replies */}
        <div className="px-6 py-4 flex flex-col gap-4">
          <h3 className="font-semibold text-gray-700 text-sm">
            {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
          </h3>

          {replies.map((reply) => (
            <div key={reply.id} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {reply.author?.full_name?.[0] || 'U'}
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3">
                <p className="text-xs font-semibold text-brand-800 mb-1">{reply.author?.full_name}</p>
                <p className="text-gray-700 text-sm leading-relaxed">{reply.body}</p>
                <p className="text-gray-400 text-xs mt-1">{timeAgo(reply.created_at)}</p>
              </div>
            </div>
          ))}

          {/* Reply form */}
          <form onSubmit={handleReply} className="flex flex-col gap-3 pt-2 border-t border-gray-100">
            {replyError && (
              <p className="text-red-600 text-xs">{replyError}</p>
            )}
            <textarea
              rows={3}
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder="Write a reply…"
              className="input resize-none"
              required
            />
            <div className="flex justify-end">
              <button type="submit" disabled={submitting || !replyBody.trim()} className="btn-primary text-sm">
                {submitting ? 'Posting…' : 'Post Reply'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function Community() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('All')
  const [activePost, setActivePost] = useState(null)

  const [newPost, setNewPost] = useState({ title: '', body: '', category: 'General' })
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [category])

  async function fetchPosts() {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (category !== 'All') params.category = category
      const { data } = await api.get('/community/posts', { params })
      setPosts(data)
    } catch {
      setError('Failed to load posts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpvote(postId) {
    try {
      const { data } = await api.post(`/community/posts/${postId}/upvote`)
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, upvotes: data.upvotes } : p))
      )
    } catch {
      // silently ignore
    }
  }

  async function handleCreatePost(e) {
    e.preventDefault()
    setCreating(true)
    setCreateError('')
    try {
      const { data } = await api.post('/community/posts', newPost)
      setPosts((prev) => [data, ...prev])
      setNewPost({ title: '', body: '', category: 'General' })
      setShowForm(false)
    } catch (err) {
      setCreateError(err?.response?.data?.detail || 'Failed to create post.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title text-3xl">Community</h1>
          <p className="text-gray-500 text-sm mt-1">Ask questions, share insights, connect with peers</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="btn-gold flex-shrink-0"
        >
          {showForm ? 'Cancel' : '+ New Post'}
        </button>
      </div>

      {/* Create post form */}
      {showForm && (
        <div className="card border-2 border-gold-200 mb-8">
          <h2 className="font-bold text-brand-800 mb-4">Create a Post</h2>
          {createError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {createError}
            </div>
          )}
          <form onSubmit={handleCreatePost} className="flex flex-col gap-4">
            <div>
              <label className="label">Title *</label>
              <input
                type="text"
                required
                value={newPost.title}
                onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
                placeholder="What's on your mind?"
                className="input"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="label">Body *</label>
                <textarea
                  rows={4}
                  required
                  value={newPost.body}
                  onChange={(e) => setNewPost((p) => ({ ...p, body: e.target.value }))}
                  placeholder="Share your thoughts, question, or insight…"
                  className="input resize-none"
                />
              </div>
              <div>
                <label className="label">Category</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost((p) => ({ ...p, category: e.target.value }))}
                  className="input"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">
                Cancel
              </button>
              <button type="submit" disabled={creating} className="btn-gold text-sm">
                {creating ? 'Posting…' : 'Post'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              category === cat
                ? 'bg-brand-800 text-white border-brand-800'
                : 'border-gray-300 text-gray-600 hover:border-brand-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts */}
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
          <button onClick={fetchPosts} className="btn-primary mt-4">Retry</button>
        </div>
      ) : posts.length === 0 ? (
        <div className="card text-center py-16">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-gray-500 font-medium">No posts yet</p>
          <p className="text-gray-400 text-sm mt-1">Be the first to start a conversation!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onUpvote={handleUpvote}
              onOpenThread={setActivePost}
            />
          ))}
        </div>
      )}

      {/* Thread modal */}
      {activePost && (
        <ThreadModal
          post={activePost}
          onClose={() => setActivePost(null)}
          currentUser={user}
        />
      )}
    </div>
  )
}
