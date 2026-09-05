import { motion } from 'framer-motion'

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function Mascot({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 360" className={className} aria-label="Retrato ilustrado">
      <defs>
        <linearGradient id="skin" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f0c9a4" />
          <stop offset="1" stopColor="#c98d63" />
        </linearGradient>
        <linearGradient id="shirt" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#3f7a5b" />
          <stop offset="1" stopColor="#163024" />
        </linearGradient>
      </defs>

      <motion.circle
        cx="160"
        cy="155"
        r="132"
        fill="none"
        stroke="#e8c37a"
        strokeWidth="1.2"
        strokeDasharray="3 6"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '160px 155px' }}
      />
      <motion.circle
        cx="160"
        cy="155"
        r="108"
        fill="none"
        stroke="#8fb8a2"
        strokeWidth="0.8"
        strokeDasharray="1 8"
        initial={{ rotate: 0 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '160px 155px' }}
      />

      <path d="M40 340 C 70 260, 250 260, 280 340" fill="url(#shirt)" />
      <path d="M40 340 C 70 260, 250 260, 280 340" {...stroke} stroke="#0b1a12" />

      <path d="M135 250 L135 285 Q160 295 185 285 L185 250" fill="url(#skin)" stroke="#0b1a12" strokeWidth="1.4" />

      <path
        d="M90 165 C 90 100, 230 100, 230 165 L 230 210 C 230 250, 190 275, 160 275 C 130 275, 90 250, 90 210 Z"
        fill="url(#skin)"
        stroke="#0b1a12"
        strokeWidth="1.6"
      />
      {/* cabelo arrepiado — pontas em ziguezague */}
      <path
        d="M82 178
           L 88 148
           L 96 168
           L 104 118
           L 114 152
           L 122 108
           L 132 148
           L 142 100
           L 152 145
           L 162 96
           L 172 145
           L 182 100
           L 192 148
           L 202 108
           L 212 152
           L 220 118
           L 228 168
           L 236 148
           L 240 178
           C 220 158, 200 152, 160 152
           C 120 152, 100 158, 82 178 Z"
        fill="#1a1611"
        stroke="#0b1a12"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* mechas dourado-terra em cima do cabelo pra dar volume */}
      <path
        d="M104 118 L 108 108 L 112 118"
        fill="none"
        stroke="#6b4728"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M142 100 L 146 90 L 150 100"
        fill="none"
        stroke="#6b4728"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M172 100 L 176 92 L 180 100"
        fill="none"
        stroke="#6b4728"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path d="M92 172 C 112 156, 208 156, 228 172" {...stroke} stroke="#0b1a12" strokeWidth="1" />

      <path d="M118 175 Q 132 168 148 174" {...stroke} />
      <path d="M175 174 Q 191 168 205 175" {...stroke} />

      <circle cx="132" cy="195" r="18" {...stroke} stroke="#0b1a12" />
      <circle cx="192" cy="195" r="18" {...stroke} stroke="#0b1a12" />
      <path d="M150 195 L174 195" {...stroke} stroke="#0b1a12" />
      <path d="M114 195 L100 190" {...stroke} stroke="#0b1a12" />
      <path d="M210 195 L224 190" {...stroke} stroke="#0b1a12" />

      <path d="M160 205 L155 230 Q 160 235 168 232" {...stroke} stroke="#0b1a12" />

      <motion.path
        d="M138 250 Q 160 262 182 250"
        {...stroke}
        stroke="#0b1a12"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, delay: 0.6 }}
      />
      <path d="M130 245 Q 160 275 190 245" {...stroke} stroke="#6b4728" strokeDasharray="2 3" />

      <circle cx="135" cy="220" r="1.4" fill="#6b4728" />
      <circle cx="185" cy="220" r="1.4" fill="#6b4728" />
      <circle cx="150" cy="225" r="1" fill="#6b4728" />
      <circle cx="172" cy="225" r="1" fill="#6b4728" />
    </svg>
  )
}

export function ShieldIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full text-cream" aria-hidden>
      <motion.path
        d="M100 20 L 170 45 L 170 105 C 170 145, 135 175, 100 185 C 65 175, 30 145, 30 105 L 30 45 Z"
        {...stroke}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6 }}
      />
      <motion.path
        d="M70 100 L 90 122 L 135 78"
        {...stroke}
        strokeWidth={2.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      />
      <motion.circle
        cx="100"
        cy="100"
        r="70"
        {...stroke}
        strokeDasharray="2 6"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '100px 100px' }}
      />
    </svg>
  )
}

export function MouseIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full text-cream" aria-hidden>
      <motion.path
        d="M20 150 C 40 80, 80 40, 120 90 C 145 122, 165 100, 185 60"
        {...stroke}
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.4, repeat: Infinity, repeatType: 'reverse' }}
      />
      {[[30, 140], [55, 115], [80, 82], [100, 78], [120, 90], [140, 110], [160, 95], [180, 70]].map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r="3"
          fill="#e8c37a"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.4, 1] }}
          transition={{ delay: 0.2 * i, duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
        />
      ))}
      <motion.g
        initial={{ x: 20, y: 150 }}
        animate={{ x: [20, 80, 120, 160, 180], y: [150, 82, 90, 95, 70] }}
        transition={{ duration: 3.6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      >
        <path d="M0 0 L 12 5 L 6 8 L 10 16 L 6 18 L 3 10 L 0 12 Z" fill="#3f7a5b" stroke="#0b1a12" strokeWidth="0.8" />
      </motion.g>
    </svg>
  )
}

export function CreditIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full text-cream" aria-hidden>
      <motion.g
        initial={{ rotate: -8, y: 10 }}
        animate={{ rotate: [-8, 4, -8], y: [10, 4, 10] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '100px 110px' }}
      >
        <rect x="40" y="70" width="120" height="80" rx="10" fill="#163024" stroke="#f2ead8" strokeWidth="1.6" />
        <rect x="52" y="88" width="26" height="18" rx="3" fill="#e8c37a" />
        <rect x="52" y="120" width="60" height="4" fill="#f2ead8" />
        <rect x="52" y="130" width="38" height="4" fill="#f2ead8" opacity="0.6" />
        <circle cx="140" cy="130" r="8" fill="#b85c3d" />
        <circle cx="132" cy="130" r="8" fill="#e8c37a" opacity="0.8" />
      </motion.g>
      <motion.path
        d="M20 170 L 60 150 L 90 155 L 120 130 L 160 140 L 190 100"
        {...stroke}
        strokeWidth={2}
        stroke="#e8c37a"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2 }}
      />
      <circle cx="190" cy="100" r="4" fill="#e8c37a" />
    </svg>
  )
}

export function PipelineIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full text-cream" aria-hidden>
      {[[30, 60], [100, 40], [170, 60], [30, 140], [100, 160], [170, 140]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="10" fill="#0b1a12" stroke="#f2ead8" strokeWidth="1.6" />
          <circle cx={x} cy={y} r="3" fill="#b85c3d" />
        </g>
      ))}
      {[
        ['M30 60 L 100 40', 0],
        ['M100 40 L 170 60', 0.2],
        ['M30 60 L 100 160', 0.4],
        ['M100 40 L 170 140', 0.6],
        ['M30 140 L 100 160', 0.8],
        ['M100 160 L 170 140', 1],
        ['M170 60 L 170 140', 1.2],
      ].map(([d, delay], i) => (
        <motion.path
          key={i}
          d={String(d)}
          {...stroke}
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: Number(delay) }}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          r="3"
          fill="#e8c37a"
          initial={{ cx: 30, cy: 60 }}
          animate={{ cx: [30, 100, 170, 170, 100, 30], cy: [60, 40, 60, 140, 160, 140, 60] }}
          transition={{ duration: 6, delay: i * 1.4, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </svg>
  )
}

export function FingerprintIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full text-cream" aria-hidden>
      {[
        'M100 30 C 40 30, 20 80, 20 120',
        'M100 45 C 55 45, 35 85, 35 118',
        'M100 60 C 70 60, 50 90, 50 118',
        'M100 75 C 80 75, 65 95, 65 118',
        'M100 90 C 90 90, 80 100, 80 115',
        'M100 105 C 98 105, 95 108, 95 115',
        'M100 30 C 160 30, 180 80, 180 120',
        'M100 45 C 145 45, 165 85, 165 118',
        'M100 60 C 130 60, 150 90, 150 118',
        'M100 75 C 120 75, 135 95, 135 118',
        'M100 90 C 110 90, 120 100, 120 115',
      ].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          {...stroke}
          strokeWidth={1.4}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: i * 0.07 }}
        />
      ))}
      <motion.circle
        cx="100"
        cy="115"
        r="4"
        fill="#e8c37a"
        animate={{ scale: [1, 1.6, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.path
        d="M35 160 L 165 160"
        {...stroke}
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  )
}

export function LLMIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full text-cream" aria-hidden>
      <motion.path
        d="M100 40 C 70 40, 55 65, 60 90 C 40 100, 40 130, 60 140 C 60 165, 90 175, 100 160 C 110 175, 140 165, 140 140 C 160 130, 160 100, 140 90 C 145 65, 130 40, 100 40 Z"
        {...stroke}
        strokeWidth={1.8}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.4 }}
      />
      {[
        [80, 75],
        [120, 75],
        [70, 100],
        [130, 100],
        [80, 130],
        [120, 130],
        [100, 60],
        [100, 150],
        [100, 105],
      ].map(([cx, cy], i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r="4"
          fill="#8fb8a2"
          animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
          transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
      {[
        'M80 75 L 100 105 L 120 75',
        'M70 100 L 100 105 L 130 100',
        'M80 130 L 100 105 L 120 130',
        'M100 60 L 100 105 L 100 150',
      ].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          {...stroke}
          strokeDasharray="2 3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 1 + i * 0.15 }}
        />
      ))}
    </svg>
  )
}

export function IllustrationFor({
  kind,
}: {
  kind: 'shield' | 'mouse' | 'credit' | 'pipeline' | 'llm' | 'fingerprint'
}) {
  switch (kind) {
    case 'shield':
      return <ShieldIllustration />
    case 'mouse':
      return <MouseIllustration />
    case 'credit':
      return <CreditIllustration />
    case 'pipeline':
      return <PipelineIllustration />
    case 'llm':
      return <LLMIllustration />
    case 'fingerprint':
      return <FingerprintIllustration />
  }
}

export function ArrowScribble({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden>
      <motion.path
        d="M4 30 C 30 6, 70 6, 100 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      />
      <path d="M100 30 L 90 22 M 100 30 L 90 38" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function StarBurst({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '50px 50px' }}
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI) / 6
          const x1 = 50 + Math.cos(a) * 20
          const y1 = 50 + Math.sin(a) * 20
          const x2 = 50 + Math.cos(a) * 40
          const y2 = 50 + Math.sin(a) * 40
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        })}
      </motion.g>
      <circle cx="50" cy="50" r="12" fill="currentColor" />
    </svg>
  )
}

export function LeafSprig({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 120" className={className} aria-hidden>
      <path d="M40 115 L 40 30" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {[20, 40, 60, 80].map((y, i) => (
        <g key={i}>
          <path
            d={`M40 ${y + 20} Q ${20 - i * 2} ${y + 15}, ${10 - i * 2} ${y + 5}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d={`M40 ${y + 20} Q ${60 + i * 2} ${y + 15}, ${70 + i * 2} ${y + 5}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </g>
      ))}
      <circle cx="40" cy="28" r="3" fill="currentColor" />
    </svg>
  )
}

export function WaveScribble({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 30" className={className} aria-hidden>
      <motion.path
        d="M0 15 Q 25 0, 50 15 T 100 15 T 150 15 T 200 15 T 250 15 T 300 15"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6 }}
      />
    </svg>
  )
}

export function DotGrid({ className = '' }: { className?: string }) {
  const cols = 8
  const rows = 8
  return (
    <svg viewBox={`0 0 ${cols * 10} ${rows * 10}`} className={className} aria-hidden>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <circle key={`${r}-${c}`} cx={c * 10 + 5} cy={r * 10 + 5} r={1.2} fill="currentColor" opacity={0.4} />
        )),
      )}
    </svg>
  )
}

export function ConcentricRings({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      {[30, 55, 80, 105].map((r, i) => (
        <motion.circle
          key={i}
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray={i % 2 === 0 ? '0' : '3 4'}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: [0, 0.8, 0.3, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, delay: i * 0.4 }}
          style={{ transformOrigin: '100px 100px' }}
        />
      ))}
      <circle cx="100" cy="100" r="5" fill="currentColor" />
    </svg>
  )
}

export function CircuitLines({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      {[
        'M10 40 L 60 40 L 60 90 L 120 90',
        'M20 120 L 80 120 L 80 160 L 140 160',
        'M150 20 L 150 60 L 190 60',
        'M110 180 L 170 180 L 170 130',
      ].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: i * 0.3 }}
        />
      ))}
      {[
        [60, 40],
        [120, 90],
        [80, 120],
        [140, 160],
        [150, 60],
        [190, 60],
        [170, 130],
      ].map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r="3"
          fill="currentColor"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 + i * 0.1 }}
        />
      ))}
    </svg>
  )
}

export function BarChart({ className = '' }: { className?: string }) {
  const bars = [30, 55, 40, 72, 48, 90, 65]
  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden>
      <line x1="10" y1="105" x2="190" y2="105" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      {bars.map((h, i) => (
        <motion.rect
          key={i}
          x={16 + i * 25}
          width="16"
          rx="2"
          fill="currentColor"
          initial={{ y: 105, height: 0 }}
          whileInView={{ y: 105 - h, height: h }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </svg>
  )
}

export function Chip({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <rect x="50" y="50" width="100" height="100" rx="14" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="72" y="72" width="56" height="56" rx="6" fill="currentColor" opacity="0.15" />
      <rect x="82" y="82" width="36" height="36" rx="3" fill="currentColor" opacity="0.5" />
      {[30, 60, 100, 140, 170].map((c, i) => (
        <g key={`t-${i}`}>
          <line x1={c} y1="30" x2={c} y2="50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1={c} y1="150" x2={c} y2="170" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
      {[30, 60, 100, 140, 170].map((c, i) => (
        <g key={`l-${i}`}>
          <line x1="30" y1={c} x2="50" y2={c} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="150" y1={c} x2="170" y2={c} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
      <motion.circle
        cx="100"
        cy="100"
        r="6"
        fill="currentColor"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  )
}

export function Sparkles({ className = '' }: { className?: string }) {
  const seeds = [
    [30, 40, 6, 0],
    [160, 30, 4, 0.4],
    [80, 90, 8, 0.2],
    [140, 130, 5, 0.6],
    [50, 150, 6, 0.8],
    [180, 160, 4, 1],
  ] as const
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      {seeds.map(([cx, cy, r, delay], i) => (
        <motion.g
          key={i}
          animate={{ scale: [0.5, 1, 0.5], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: delay as number }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          <path
            d={`M${cx - r} ${cy} L ${cx} ${cy - r} L ${cx + r} ${cy} L ${cx} ${cy + r} Z`}
            fill="currentColor"
          />
        </motion.g>
      ))}
    </svg>
  )
}

export function BlobShape({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <motion.path
        d="M40 100 C 40 40, 160 40, 160 100 C 160 160, 40 160, 40 100 Z"
        fill="currentColor"
        opacity="0.15"
        animate={{
          d: [
            'M40 100 C 40 40, 160 40, 160 100 C 160 160, 40 160, 40 100 Z',
            'M50 90 C 30 30, 170 50, 165 110 C 155 170, 30 170, 50 90 Z',
            'M40 100 C 40 40, 160 40, 160 100 C 160 160, 40 160, 40 100 Z',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  )
}
