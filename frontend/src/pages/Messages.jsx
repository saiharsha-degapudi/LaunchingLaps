import { useEffect, useState, useRef } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { WordReveal, PageHeader, useScrollReveal } from '../utils/design'

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

function NewConversationModal({ onClose, onSent, currentUser }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      try {
        if (currentUser?.role === 'investor') {
          const { data } = await api.get('/pitches/')
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="bg-white border border-zinc-200 rounded-xl shadow-sm w-full max-w-lg"
        style={{ animation: 'convModalReveal 0.35s cubic-bezier(0.32,0.72,0,1)' }}
      >
        <style>{`
          @keyframes convModalReveal {
            from { opacity: 0; transform: translateY(20px) scale(0.98); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
        <div className="flex items-center justify-between p-5 border-b border-zinc-100">
          <h2 className="text-sm font-semibold text-zinc-900">
            {currentUser?.role === 'investor' ? 'Message a Founder' : 'Message an Investor'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors duration-200"
          >
            <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}

          <div>
            <p className="text-xs font-medium text-zinc-500 mb-2">
              Select {currentUser?.role === 'investor' ? 'a Founder' : 'an Investor'}:
            </p>
            {loading ? (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-700 rounded-full animate-spin" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-sm text-zinc-400 text-center py-4">No users found.</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                      selectedUser?.id === u.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-medium text-sm flex-shrink-0">
                      {u.full_name?.[0] || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate">{u.full_name}</p>
                      <p className="text-xs text-zinc-400 truncate capitalize">
                        {u.firm_name || u.industry_focus?.split(',')[0] || u.role}
                      </p>
                    </div>
                    {selectedUser?.id === u.id && (
                      <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">Your Message</label>
            <textarea
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Introduce yourself and explain why you'd like to connect..."
              className="w-full border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <button onClick={onClose} className="btn-secondary">Cancel</button>
            <button
              onClick={handleSend}
              disabled={sending || !selectedUser || !message.trim()}
              className="btn-primary disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Messages() {
  useScrollReveal()
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
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Page header */}
        <PageHeader
          label="Inbox"
          title="Messages"
          subtitle={user?.role === 'investor' ? 'Connect with founders directly' : 'Your conversations with investors'}
          action={
            <button onClick={() => setShowNewConv(true)} className="btn-primary">
              + New Message
            </button>
          }
        />

        {showNewConv && (
          <NewConversationModal
            onClose={() => setShowNewConv(false)}
            onSent={fetchMessages}
            currentUser={user}
          />
        )}

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-700 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-white border border-zinc-200 rounded-xl text-center py-12">
            <p className="text-sm text-red-600">{error}</p>
            <button onClick={fetchMessages} className="mt-4 btn-primary">Retry</button>
          </div>
        ) : conversations.length === 0 ? (
          <div className="reveal bg-white border border-zinc-200 rounded-xl text-center py-20">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-zinc-900 mb-1">No messages yet</h3>
            <p className="text-sm text-zinc-500 mb-6 max-w-sm mx-auto">
              {user?.role === 'investor'
                ? 'Start a conversation with a founder whose pitch excites you.'
                : 'Investors can reach out through your pitch page. You can also initiate contact.'}
            </p>
            <button onClick={() => setShowNewConv(true)} className="btn-primary">
              Start a Conversation
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ minHeight: '520px' }}>

            {/* Sidebar — conversation list */}
            <div className="lg:col-span-1 bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-zinc-100">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Inbox ({conversations.length})
                </p>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
                {conversations.map((conv, i) => {
                  const isActive = activeConv?.userId === conv.userId
                  return (
                    <button
                      key={conv.userId}
                      onClick={() => setActiveConv(conv)}
                      className={`reveal ${i < 5 ? `reveal-delay-${i + 1}` : ''} w-full text-left px-4 py-3.5 hover:bg-zinc-50 transition-colors duration-200 flex items-start gap-3 ${
                        isActive ? 'bg-zinc-50 border-l-2 border-blue-600' : ''
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center font-medium text-sm flex-shrink-0">
                        {conv.user?.full_name?.[0] || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-zinc-900 truncate">{conv.user?.full_name}</p>
                          {conv.unread > 0 && (
                            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium flex-shrink-0">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 truncate mt-0.5 capitalize">{conv.user?.role}</p>
                        <p className="text-xs text-zinc-400 truncate mt-0.5 leading-relaxed">
                          {conv.lastMessage?.body?.substring(0, 50)}...
                        </p>
                        <p className="text-xs text-zinc-300 mt-1">{timeAgo(conv.lastMessage?.created_at)}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Thread panel */}
            <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col">
              {!activeConv ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                  <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-sm text-zinc-400">Select a conversation to read messages</p>
                </div>
              ) : (
                <>
                  {/* Thread header with WordReveal */}
                  <div className="px-5 py-3.5 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/60">
                    <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {activeConv.user?.full_name?.[0] || '?'}
                    </div>
                    <div>
                      <WordReveal
                        text={activeConv.user?.full_name || 'Conversation'}
                        tag="p"
                        className="text-sm font-semibold text-zinc-900 tracking-tight"
                      />
                      <p className="text-xs text-zinc-400 capitalize mt-0.5">{activeConv.user?.role}</p>
                    </div>
                  </div>

                  {/* Message bubbles */}
                  <div
                    className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2.5"
                    style={{ maxHeight: '400px' }}
                  >
                    {activeConvMessages.map(msg => {
                      const isMine = msg.sender_id === user?.id
                      return (
                        <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-xs lg:max-w-sm px-4 py-2.5 text-sm leading-relaxed ${
                              isMine
                                ? 'bg-zinc-900 text-white rounded-2xl rounded-br-sm'
                                : 'bg-zinc-100 text-zinc-800 rounded-2xl rounded-bl-sm'
                            }`}
                            style={{ wordBreak: 'break-word' }}
                          >
                            <p>{msg.body}</p>
                            <p className="text-xs mt-1.5 opacity-50">
                              {timeAgo(msg.created_at)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={threadBottomRef} />
                  </div>

                  {/* Input bar */}
                  <div className="px-5 py-4 border-t border-zinc-100 bg-white">
                    {sendError && <p className="text-red-600 text-xs mb-2">{sendError}</p>}
                    <form onSubmit={handleSend} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition duration-200 bg-white"
                        required
                      />
                      <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="btn-primary flex-shrink-0 !px-3.5 !py-2.5 disabled:opacity-50 flex items-center justify-center"
                        aria-label="Send"
                      >
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
    </div>
  )
}
