import { useEffect, useState, useRef } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function timeAgo(dateStr) {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getConversations(messages, currentUserId) {
  const convMap = new Map()
  messages.forEach(msg => {
    const otherId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id
    const otherUser = msg.sender_id === currentUserId ? msg.receiver : msg.sender
    const key = String(otherId)
    if (!convMap.has(key)) {
      convMap.set(key, { userId: otherId, user: otherUser, messages: [], lastMessage: null, unread: 0 })
    }
    const conv = convMap.get(key)
    conv.messages.push(msg)
    if (!conv.lastMessage || new Date(msg.created_at) > new Date(conv.lastMessage.created_at)) {
      conv.lastMessage = msg
    }
    if (!msg.is_read && msg.receiver_id === currentUserId) conv.unread += 1
  })
  return Array.from(convMap.values()).sort(
    (a, b) => new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at)
  )
}

// Modal to start a new conversation — shows real user list
function NewConversationModal({ onClose, onSent, currentUser }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  // Determine who to show: entrepreneurs see investors, investors see entrepreneurs
  const targetRole = currentUser?.role === 'investor' ? 'entrepreneur' : 'investor'

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      try {
        // Fetch pitches or investors depending on role
        if (currentUser?.role === 'investor') {
          const { data } = await api.get('/pitches/')
          // Deduplicate by owner
          const seen = new Set()
          const founders = []
          data.forEach(p => {
            if (p.owner && !seen.has(p.owner.id)) {
              seen.add(p.owner.id)
              founders.push(p.owner)
            }
          })
          setUsers(founders)
        } else {
          const { data } = await api.get('/investors/')
          setUsers(data.map(inv => ({ ...inv.user, firm_name: inv.firm_name, industry_focus: inv.industry_focus })))
        }
      } catch {
        setError('Failed to load users.')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [currentUser?.role])

  async function handleSend(e) {
    e.preventDefault()
    if (!selectedUser || !message.trim()) return
    setSending(true)
    setError('')
    try {
      await api.post('/community/messages', {
        receiver_id: selectedUser.id,
        body: message.trim(),
      })
      onSent()
      onClose()
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to send message.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-black text-brand-800 text-lg">
            {currentUser?.role === 'investor' ? 'Message a Founder' : 'Message an Investor'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

          {/* User list */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-3">
              Select {currentUser?.role === 'investor' ? 'a Founder' : 'an Investor'}:
            </p>
            {loading ? (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 border-2 border-brand-200 border-t-brand-700 rounded-full animate-spin" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No users found.</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                {users.map(u => (
                  <button key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      selectedUser?.id === u.id
                        ? 'border-brand-500 bg-brand-50 shadow-sm'
                        : 'border-gray-100 hover:border-brand-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-brand-800 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {u.full_name?.[0] || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-brand-800 text-sm truncate">{u.full_name}</p>
                      <p className="text-xs text-gray-500 truncate capitalize">
                        {u.firm_name || u.industry_focus?.split(',')[0] || u.role}
                      </p>
                    </div>
                    {selectedUser?.id === u.id && (
                      <svg className="w-4 h-4 text-brand-700 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Your Message</label>
            <textarea
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Introduce yourself and explain why you'd like to connect..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <button onClick={onClose} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition">
              Cancel
            </button>
            <button onClick={handleSend}
              disabled={sending || !selectedUser || !message.trim()}
              className="px-6 py-2.5 bg-brand-800 hover:bg-brand-700 text-white text-sm font-bold rounded-xl transition disabled:opacity-50">
              {sending ? 'Sending…' : 'Send Message'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Messages() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeConv, setActiveConv] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [showNewConv, setShowNewConv] = useState(false)
  const threadBottomRef = useRef(null)

  useEffect(() => { fetchMessages() }, [])

  useEffect(() => {
    threadBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConv])

  async function fetchMessages() {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/community/messages')
      setMessages(data)
    } catch {
      setError('Failed to load messages.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSend(e) {
    e.preventDefault()
    if (!newMessage.trim() || !activeConv) return
    setSending(true)
    setSendError('')
    try {
      const { data } = await api.post('/community/messages', {
        receiver_id: activeConv.userId,
        body: newMessage.trim(),
      })
      setMessages(prev => [...prev, data])
      setNewMessage('')
    } catch (err) {
      setSendError(err?.response?.data?.detail || 'Failed to send message.')
    } finally {
      setSending(false)
    }
  }

  const conversations = getConversations(messages, user?.id)
  const activeConvMessages = activeConv
    ? messages
        .filter(m =>
          (m.sender_id === user?.id && m.receiver_id === activeConv.userId) ||
          (m.sender_id === activeConv.userId && m.receiver_id === user?.id)
        )
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-brand-800">Messages</h1>
          <p className="text-gray-500 text-sm mt-1">
            {user?.role === 'investor' ? 'Connect with founders directly' : 'Your conversations with investors'}
          </p>
        </div>
        <button onClick={() => setShowNewConv(true)}
          className="bg-gold-500 hover:bg-gold-600 text-white font-black px-5 py-2.5 rounded-xl transition flex-shrink-0 text-sm">
          + New Message
        </button>
      </div>

      {showNewConv && (
        <NewConversationModal
          onClose={() => setShowNewConv(false)}
          onSent={fetchMessages}
          currentUser={user}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-700 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-12">
          <p className="text-red-600 font-medium">{error}</p>
          <button onClick={fetchMessages} className="mt-4 bg-brand-800 text-white px-5 py-2 rounded-xl text-sm font-bold">Retry</button>
        </div>
      ) : conversations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-20">
          <div className="text-5xl mb-4">💬</div>
          <h3 className="text-xl font-black text-brand-800 mb-2">No messages yet</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            {user?.role === 'investor'
              ? 'Start a conversation with a founder whose pitch excites you.'
              : 'Investors can reach out through your pitch page. You can also initiate contact.'}
          </p>
          <button onClick={() => setShowNewConv(true)}
            className="bg-brand-800 hover:bg-brand-700 text-white font-black px-6 py-3 rounded-xl transition">
            Start a Conversation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ minHeight: '520px' }}>
          {/* Inbox */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="font-bold text-brand-800 text-sm">Inbox ({conversations.length})</p>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {conversations.map(conv => {
                const isActive = activeConv?.userId === conv.userId
                return (
                  <button key={conv.userId} onClick={() => setActiveConv(conv)}
                    className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition flex items-start gap-3 ${
                      isActive ? 'bg-brand-50 border-l-2 border-brand-800' : ''
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-brand-800 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {conv.user?.full_name?.[0] || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-brand-800 text-sm truncate">{conv.user?.full_name}</p>
                        {conv.unread > 0 && (
                          <span className="bg-gold-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold flex-shrink-0">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs truncate mt-0.5 capitalize">{conv.user?.role}</p>
                      <p className="text-gray-400 text-xs truncate mt-0.5">{conv.lastMessage?.body?.substring(0, 50)}…</p>
                      <p className="text-gray-400 text-xs mt-1">{timeAgo(conv.lastMessage?.created_at)}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Thread */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            {!activeConv ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                <div className="text-5xl mb-4">👈</div>
                <p className="text-gray-400 text-sm font-medium">Select a conversation to read messages</p>
              </div>
            ) : (
              <>
                {/* Thread header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
                  <div className="w-9 h-9 rounded-full bg-brand-800 text-white flex items-center justify-center font-bold text-sm">
                    {activeConv.user?.full_name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="font-bold text-brand-800 text-sm">{activeConv.user?.full_name}</p>
                    <p className="text-xs text-gray-400 capitalize">{activeConv.user?.role}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3" style={{ maxHeight: '400px' }}>
                  {activeConvMessages.map(msg => {
                    const isMine = msg.sender_id === user?.id
                    return (
                      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-sm px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isMine ? 'bg-brand-800 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                        }`}>
                          <p>{msg.body}</p>
                          <p className={`text-xs mt-1 ${isMine ? 'text-brand-300' : 'text-gray-400'}`}>
                            {timeAgo(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={threadBottomRef} />
                </div>

                {/* Reply */}
                <div className="px-5 py-4 border-t border-gray-100">
                  {sendError && <p className="text-red-600 text-xs mb-2">{sendError}</p>}
                  <form onSubmit={handleSend} className="flex gap-3">
                    <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
                      placeholder="Type a message…" className="input flex-1" required />
                    <button type="submit" disabled={sending || !newMessage.trim()}
                      className="bg-brand-800 hover:bg-brand-700 text-white px-5 py-2 rounded-xl transition disabled:opacity-50 flex-shrink-0">
                      {sending ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      )}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
