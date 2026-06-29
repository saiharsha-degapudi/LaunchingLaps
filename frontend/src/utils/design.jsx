/**
 * Shared design system utilities — web design trends 2025
 * Import from any page: import { WordReveal, Card3D, ... } from '../utils/design'
 */
import { useState, useEffect, useRef, useCallback } from 'react'

/* ── Scroll reveal hook ─────────────────────────────────── */
export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal, .word-reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  })
}

/* ── Animated counter (reveal on scroll) ────────────────── */
function useCounter(target, active) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0
    const increment = target / (1400 / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) { setValue(target); clearInterval(timer) }
      else setValue(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [active, target])
  return value
}

export function StatCounter({ target, suffix = '', prefix = '', label }) {
  const ref = useRef(null)
  const [active, setActive] = useState(false)
  const value = useCounter(target, active)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setActive(true); observer.disconnect() }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} className="reveal text-center">
      <p className="text-4xl font-bold text-zinc-900 tracking-tight tabular-nums">
        {prefix}{value.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-zinc-500 mt-1.5">{label}</p>
    </div>
  )
}

/* ── 3D card hover tilt (Trend 10) ─────────────────────── */
export function Card3D({ children, className = '' }) {
  const ref = useRef(null)
  function onMove(e) {
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    ref.current.style.transform = `perspective(800px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) scale(1.02)`
  }
  function onLeave() {
    ref.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)'
  }
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className={`card-3d ${className}`}
      style={{ transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)', willChange: 'transform' }}>
      {children}
    </div>
  )
}

/* ── Word reveal heading (Trend 8) ─────────────────────── */
export function WordReveal({ text, className = '', tag: Tag = 'h1' }) {
  return (
    <Tag className={`word-reveal ${className}`}>
      {text.split(' ').map((word, i) => (
        <span key={i} style={{ marginRight: '0.28em' }}>{word}</span>
      ))}
    </Tag>
  )
}

/* ── Animated mesh gradient backdrop (Trend 2) ──────────── */
export function MeshGradient({ dark = false }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className={`mesh-orb w-96 h-96 top-[-4rem] right-[10%] ${dark ? 'bg-blue-500/10' : 'bg-blue-100/60'}`}
        style={{ animationDuration: '14s' }} />
      <div className={`mesh-orb w-72 h-72 top-[40%] right-[-5%] ${dark ? 'bg-violet-500/10' : 'bg-violet-100/40'}`}
        style={{ animationDuration: '18s', animationDelay: '-6s' }} />
      <div className={`mesh-orb w-64 h-64 bottom-[5%] right-[20%] ${dark ? 'bg-indigo-500/10' : 'bg-sky-100/50'}`}
        style={{ animationDuration: '10s', animationDelay: '-3s' }} />
    </div>
  )
}

/* ── Voice search button (Trend 4) ─────────────────────── */
export function VoiceSearchButton({ onResult, className = '' }) {
  const [listening, setListening] = useState(false)
  const recogRef = useRef(null)

  function toggle() {
    if (listening) { recogRef.current?.stop(); setListening(false); return }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Voice search not supported. Please use Chrome.'); return }
    const r = new SR()
    r.lang = 'en-IN'
    r.interimResults = false
    r.onresult = e => { onResult(e.results[0][0].transcript); setListening(false) }
    r.onerror = () => setListening(false)
    r.onend = () => setListening(false)
    recogRef.current = r
    r.start()
    setListening(true)
  }

  return (
    <button onClick={toggle} title={listening ? 'Stop' : 'Search by voice'}
      className={`relative flex-shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-200 ${
        listening
          ? 'bg-red-50 border-red-200 text-red-500'
          : 'bg-white border-zinc-200 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600'
      } ${className}`}>
      {listening && <span className="absolute inset-0 rounded-lg border-2 border-red-300 animate-ping opacity-60" />}
      {listening ? (
        <svg className="w-4 h-4 relative" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      )}
    </button>
  )
}

/* ── Page header with animated title ───────────────────── */
export function PageHeader({ label, title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        {label && <p className="reveal text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">{label}</p>}
        <WordReveal text={title} tag="h1"
          className="text-2xl font-bold text-zinc-900 tracking-tight" />
        {subtitle && <p className="reveal reveal-delay-1 text-sm text-zinc-500 mt-1.5">{subtitle}</p>}
      </div>
      {action && <div className="reveal reveal-delay-2 flex-shrink-0">{action}</div>}
    </div>
  )
}

/* ── Section header ─────────────────────────────────────── */
export function SectionHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-end justify-between mb-5 ${className}`}>
      <div>
        <h2 className="reveal text-base font-semibold text-zinc-900 tracking-tight">{title}</h2>
        {subtitle && <p className="reveal reveal-delay-1 text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

/* ── Drag-to-scroll horizontal strip hook (Trend 7) ──────── */
export function useDragScroll() {
  const ref = useRef(null)
  const isDragging = useRef(false)
  const dragStart = useRef(0)
  const scrollStart = useRef(0)
  const onMouseDown = useCallback(e => {
    isDragging.current = true
    dragStart.current = e.pageX
    scrollStart.current = ref.current?.scrollLeft ?? 0
  }, [])
  const onMouseMove = useCallback(e => {
    if (!isDragging.current || !ref.current) return
    e.preventDefault()
    ref.current.scrollLeft = scrollStart.current - (e.pageX - dragStart.current)
  }, [])
  const onMouseUp = useCallback(() => { isDragging.current = false }, [])
  return { ref, onMouseDown, onMouseMove, onMouseUp }
}
