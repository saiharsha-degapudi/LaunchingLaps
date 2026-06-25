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
    <div className="bg-white border border-zinc-200 rounded-xl p-5 hover:border-zinc-300 transition-colors">
      <div className="flex items-start gap-4">
        {/* Upvote */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onUpvote(post.id)}
            className="w-8 h-8 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex items-center justify-center transition border border-zinc-200"
            aria-label="Upvote"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <span className="text-xs font-medium text-zinc-600">{post.upvotes}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
            <button
              onClick={() => onOpenThread(post)}
              className="text-left text-sm font-semibold text-zinc-900 hover:text-zinc-600 transition-colors leading-snug"
            >
              {post.title}
            </button>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600 whitespace-nowrap flex-shrink-0">
              {post.category}
            </span>
          </div>
          <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">{post.body}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
            <span>
              by <span className="font-medium text-zinc-600">{post.author?.full_name}</span>
            </span>
            <span>{timeAgo(post.created_at)}</span>
            <button
              onClick={() => onOpenThread(post)}
              className="ml-auto text-zinc-500 hover:text-zinc-900 font-medium transition-colors"
            >
              View thread →
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

  useEffect(() => {
    api.get(`/community/posts/${post.id}`).then(({ data }) => {
      setReplies(data.replies || [])
    }).catch(() => {})
  }, [post.id])

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/40 overflow-y-auto">
      <div className="bg-white border border-zinc-200 rounded-xl shadow-xl w-full max-w-2xl">
        {/* Modal header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-zinc-100">
          <div className="flex-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600 mb-2">{post.category}</span>
            <h2 className="text-base font-semibold text-zinc-900 leading-snug">{post.title}</h2>
            <p className="text-xs text-zinc-400 mt-1">
              by <span className="font-medium text-zinc-600">{post.author?.full_name}</span> &middot; {timeAgo(post.created_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center flex-shrink-0 transition"
            aria-label="Close"
          >
            <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Post body */}
        <div className="px-6 py-5 text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap border-b border-zinc-100">
          {post.body}
        </div>

        {/* Replies */}
        <div className="px-6 py-4 flex flex-col gap-4">
          <h3 className="text-xs font-medium text-zinc-500">
            {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
          </h3>

          {replies.map((reply) => (
            <div key={reply.id} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-zinc-100 text-zinc-700 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                {reply.author?.full_name?.[0] || 'U'}
              </div>
              <div className="flex-1 bg-zinc-50 rounded-lg px-4 py-3">
                <p className="text-xs font-medium text-zinc-900 mb-1">{reply.author?.full_name}</p>
                <p className="text-sm text-zinc-600 leading-relaxed">{reply.body}</p>
                <p className="text-xs text-zinc-400 mt-1">{timeAgo(reply.created_at)}</p>
              </div>
            </div>
          ))}

          {/* Reply form */}
          <form onSubmit={handleReply} className="flex flex-col gap-3 pt-2 border-t border-zinc-100">
            {replyError && (
              <p className="text-red-600 text-xs">{replyError}</p>
            )}
            <textarea
              rows={3}
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder="Write a reply…"
              className="w-full border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white resize-none"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !replyBody.trim()}
                className="bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
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
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Community</h1>
            <p className="text-sm text-zinc-500 mt-1">Ask questions, share insights, connect with peers</p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex-shrink-0 bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {showForm ? 'Cancel' : '+ New Post'}
          </button>
        </div>

        {/* Create post form */}
        {showForm && (
          <div className="bg-white border border-zinc-200 rounded-xl p-5 mb-6">
            <p className="text-base font-semibold text-zinc-900 mb-4">Create a Post</p>
            {createError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {createError}
              </div>
            )}
            <form onSubmit={handleCreatePost} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5">Title *</label>
                <input
                  type="text"
                  required
                  value={newPost.title}
                  onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
                  placeholder="What's on your mind?"
                  className="w-full border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5">Body *</label>
                  <textarea
                    rows={4}
                    required
                    value={newPost.body}
                    onChange={(e) => setNewPost((p) => ({ ...p, body: e.target.value }))}
                    placeholder="Share your thoughts, question, or insight…"
                    className="w-full border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5">Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost((p) => ({ ...p, category: e.target.value }))}
                    className="w-full border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
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
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                category === cat
                  ? 'bg-zinc-900 text-white'
                  : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-700 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-white border border-zinc-200 rounded-xl text-center py-12">
            <p className="text-sm text-red-600">{error}</p>
            <button onClick={fetchPosts} className="mt-4 bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">Retry</button>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl text-center py-16">
            <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-zinc-700">No posts yet</p>
            <p className="text-xs text-zinc-400 mt-1">Be the first to start a conversation!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
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
    </div>
  )
}
