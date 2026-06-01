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

  messages.forEach((msg) => {
    const otherId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id
    const otherUser = msg.sender_id === currentUserId ? msg.receiver : msg.sender
    const key = String(otherId)

    if (!convMap.has(key)) {
      convMap.set(key, {
        userId: otherId,
        user: otherUser,
        messages: [],
        lastMessage: null,
        unread: 0,
      })
    }
    const conv = convMap.get(key)
    conv.messages.push(msg)
    if (!conv.lastMessage || new Date(msg.created_at) > new Date(conv.lastMessage.created_at)) {
      conv.lastMessage = msg
    }
    if (!msg.is_read && msg.receiver_id === currentUserId) {
      conv.unread += 1
    }
  })

  // Sort conversations by last message time (newest first)
  return Array.from(convMap.values()).sort(
    (a, b) => new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at)
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

  const [newRecipientId, setNewRecipientId] = useState('')
  const [showNewConv, setShowNewConv] = useState(false)

  const threadBottomRef = useRef(null)

  useEffect(() => {
    fetchMessages()
  }, [])

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
      setMessages((prev) => [...prev, data])
      setNewMessage('')
    } catch (err) {
      setSendError(err?.response?.data?.detail || 'Failed to send message.')
    } finally {
      setSending(false)
    }
  }

  async function handleNewConversation(e) {
    e.preventDefault()
    const receiverId = parseInt(newRecipientId)
    if (!receiverId || isNaN(receiverId)) return
    setSending(true)
    setSendError('')
    try {
      const { data } = await api.post('/community/messages', {
        receiver_id: receiverId,
        body: newMessage.trim() || 'Hello! I found your profile on LaunchingLaps and would like to connect.',
      })
      setMessages((prev) => [...prev, data])
      setNewMessage('')
      setNewRecipientId('')
      setShowNewConv(false)
    } catch (err) {
      setSendError(err?.response?.data?.detail || 'Failed to send message. Make sure the recipient ID is correct.')
    } finally {
      setSending(false)
    }
  }

  const conversations = getConversations(messages, user?.id)

  const activeConvMessages = activeConv
    ? messages
        .filter(
          (m) =>
            (m.sender_id === user?.id && m.receiver_id === activeConv.userId) ||
            (m.sender_id === activeConv.userId && m.receiver_id === user?.id)
        )
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title text-3xl">Messages</h1>
          <p className="text-gray-500 text-sm mt-1">Your private conversations</p>
        </div>
        <button
          onClick={() => setShowNewConv((v) => !v)}
          className="btn-primary flex-shrink-0 text-sm"
        >
          {showNewConv ? 'Cancel' : '+ New Conversation'}
        </button>
      </div>

      {/* New conversation form */}
      {showNewConv && (
        <div className="card border-2 border-brand-200 mb-6">
          <h2 className="font-bold text-brand-800 mb-3 text-sm">Start a New Conversation</h2>
          <p className="text-gray-500 text-xs mb-4">
            Enter the user ID of the person you want to message. You can find user IDs from pitch pages or the investor directory.
          </p>
          {sendError && (
            <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">
              {sendError}
            </div>
          )}
          <form onSubmit={handleNewConversation} className="flex flex-col gap-3">
            <input
              type="number"
              required
              min="1"
              value={newRecipientId}
              onChange={(e) => setNewRecipientId(e.target.value)}
              placeholder="Recipient user ID"
              className="input"
            />
            <textarea
              rows={3}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Introductory message (optional)…"
              className="input resize-none"
            />
            <div className="flex justify-end">
              <button type="submit" disabled={sending || !newRecipientId} className="btn-primary text-sm">
                {sending ? 'Sending…' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      )}

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
          <button onClick={fetchMessages} className="btn-primary mt-4">Retry</button>
        </div>
      ) : conversations.length === 0 ? (
        <div className="card text-center py-16">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-gray-500 font-medium">No messages yet</p>
          <p className="text-gray-400 text-sm mt-1">Start a conversation with an investor or entrepreneur.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ minHeight: '520px' }}>
          {/* Inbox list */}
          <div className="lg:col-span-1 card p-0 overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="font-semibold text-brand-800 text-sm">Inbox ({conversations.length})</p>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {conversations.map((conv) => {
                const isActive = activeConv?.userId === conv.userId
                return (
                  <button
                    key={conv.userId}
                    onClick={() => setActiveConv(conv)}
                    className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition flex items-start gap-3 ${
                      isActive ? 'bg-brand-50 border-l-2 border-brand-800' : ''
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-brand-800 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {conv.user?.full_name?.[0] || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-brand-800 text-sm truncate">{conv.user?.full_name}</p>
                        {conv.unread > 0 && (
                          <span className="bg-gold-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold flex-shrink-0">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs truncate mt-0.5 leading-snug">
                        {conv.lastMessage?.body}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">{timeAgo(conv.lastMessage?.created_at)}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Thread panel */}
          <div className="lg:col-span-2 card p-0 overflow-hidden flex flex-col">
            {!activeConv ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                <svg className="w-12 h-12 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-400 text-sm">Select a conversation to view messages</p>
              </div>
            ) : (
              <>
                {/* Thread header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
                  <div className="w-9 h-9 rounded-full bg-brand-800 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {activeConv.user?.full_name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="font-bold text-brand-800 text-sm">{activeConv.user?.full_name}</p>
                    <p className="text-xs text-gray-400 capitalize">{activeConv.user?.role}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3" style={{ maxHeight: '400px' }}>
                  {activeConvMessages.map((msg) => {
                    const isMine = msg.sender_id === user?.id
                    return (
                      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-xs lg:max-w-sm px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isMine
                              ? 'bg-brand-800 text-white rounded-br-sm'
                              : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                          }`}
                        >
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

                {/* Reply form */}
                <div className="px-5 py-4 border-t border-gray-100">
                  {sendError && (
                    <p className="text-red-600 text-xs mb-2">{sendError}</p>
                  )}
                  <form onSubmit={handleSend} className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message…"
                      className="input flex-1"
                      required
                    />
                    <button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      className="btn-primary flex-shrink-0 text-sm px-5"
                    >
                      {sending ? (
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
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
