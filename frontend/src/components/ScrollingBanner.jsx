import { useEffect, useRef } from 'react'

export default function ScrollingBanner({ items, bgColor = 'bg-gold-500', textColor = 'text-white', speed = 40 }) {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let x = 0
    let raf
    const step = () => {
      x -= speed / 60
      if (Math.abs(x) >= track.scrollWidth / 2) x = 0
      track.style.transform = `translateX(${x}px)`
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [speed])

  // Duplicate items so the scroll loops seamlessly
  const allItems = [...items, ...items]

  return (
    <div className={`${bgColor} overflow-hidden py-2.5`}>
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform" style={{ width: 'max-content' }}>
        {allItems.map((item, i) => (
          <span key={i} className={`${textColor} text-sm font-medium px-8 flex items-center gap-2 flex-shrink-0`}>
            <span className="opacity-60">✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
