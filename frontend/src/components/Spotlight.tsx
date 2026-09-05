import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

export default function Spotlight() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 60, damping: 20 })
  const sy = useSpring(y, { stiffness: 60, damping: 20 })
  const bg = useTransform([sx, sy], ([nx, ny]) =>
    `radial-gradient(600px circle at ${nx}px ${ny}px, rgba(143,184,162,0.16), transparent 55%)`,
  )

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [x, y])

  return (
    <motion.div
      aria-hidden
      style={{ background: bg as unknown as string }}
      className="pointer-events-none fixed inset-0 z-[5] hidden md:block"
    />
  )
}
