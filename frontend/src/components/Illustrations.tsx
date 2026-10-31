import { motion, useReducedMotion } from 'framer-motion'
import { useId } from 'react'
import { useStrings } from '../lib/i18n'

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

// Retrato do Gabriel em estilo de animação, a partir de uma foto dele: cabelo castanho-escuro curto
// nos lados e alto em cima, puxado para trás; sobrancelhas grossas; olhos grandes e castanhos; nariz
// pequeno; barba cheia ligada ao bigode; sorriso largo; jaqueta verde com frisos brancos e a alça
// da bolsa. Sem óculos.
export function Mascot({ className = '' }: { className?: string }) {
  const { portraitLabel } = useStrings().hero
  // o retrato aparece duas vezes na página (celular e desktop): cada um precisa dos próprios ids
  const id = useId().replace(/:/g, '')
  const url = (nome: string) => `url(#${nome}-${id})`
  const reduzir = useReducedMotion()
  const piscar = reduzir
    ? {}
    : {
        animate: { scaleY: [1, 1, 0.08, 1] },
        transition: { duration: 5, times: [0, 0.93, 0.96, 1], repeat: Infinity, ease: 'easeInOut' as const },
      }

  return (
    <svg viewBox="0 0 320 360" className={className} role="img" aria-label={portraitLabel}>
      <defs>
        <radialGradient id={`pele-${id}`} cx="0.42" cy="0.38" r="0.7">
          <stop offset="0" stopColor="#f7d5b4" />
          <stop offset="1" stopColor="#e0a47f" />
        </radialGradient>
        <linearGradient id={`jaqueta-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#1f4d3b" />
          <stop offset="1" stopColor="#123326" />
        </linearGradient>
        <linearGradient id={`cabelo-${id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#4a3324" />
          <stop offset="0.6" stopColor="#2a1c14" />
        </linearGradient>
        <radialGradient id={`barba-${id}`} cx="0.4" cy="0.25" r="0.85">
          <stop offset="0" stopColor="#4a3326" />
          <stop offset="0.55" stopColor="#33231a" />
          <stop offset="1" stopColor="#1e140d" />
        </radialGradient>
        <radialGradient id={`iris-${id}`} cx="0.5" cy="0.6" r="0.55">
          <stop offset="0" stopColor="#a8703f" />
          <stop offset="0.55" stopColor="#6b4224" />
          <stop offset="1" stopColor="#2e1a0d" />
        </radialGradient>
        <radialGradient id={`luzBarba-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#7a5a43" stopOpacity="0.55" />
          <stop offset="1" stopColor="#7a5a43" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`rubor-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ef8f74" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ef8f74" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`halo-${id}`} cx="0.5" cy="0.45" r="0.5">
          <stop offset="0" stopColor="#3f7a5b" stopOpacity="0.45" />
          <stop offset="1" stopColor="#3f7a5b" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`olhoE-${id}`}>
          <path d="M115 179 C118 169 127 164 136 164 C146 164 152 170 154 177 C149 184 141 187 133 187 C125 187 119 184 115 179 Z" />
        </clipPath>
        <clipPath id={`olhoD-${id}`}>
          <path d="M205 179 C202 169 193 164 184 164 C174 164 168 170 166 177 C171 184 179 187 187 187 C195 187 201 184 205 179 Z" />
        </clipPath>
      </defs>

      <circle cx="160" cy="160" r="130" fill={url('halo')} />
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

      {/* jaqueta verde com frisos brancos, camiseta por baixo e a alça da bolsa */}
      <g data-parte="jaqueta">
        <path d="M24 360 C28 316 64 296 116 288 L204 288 C256 296 292 316 296 360 Z" fill={url('jaqueta')} stroke="#2a1a10" strokeWidth="1.8" />
        <path d="M124 288 Q160 330 196 288 Z" fill="#f2ead8" stroke="#2a1a10" strokeWidth="1.4" />
        <path d="M130 292 Q160 322 190 292" fill="none" stroke="#cfc4b0" strokeWidth="1.4" />
        <path d="M116 288 L138 304 L146 360 M204 288 L182 304 L174 360" fill="none" stroke="#2a1a10" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M116 288 L138 304 L124 316 Z M204 288 L182 304 L196 316 Z" fill="#123326" stroke="#2a1a10" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M110 294 C76 302 48 324 38 360 M118 298 C86 306 58 328 50 360" fill="none" stroke="#f2ead8" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M210 294 C244 302 272 324 282 360 M202 298 C234 306 262 328 270 360" fill="none" stroke="#f2ead8" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M160 322 L160 360" stroke="#2a1a10" strokeWidth="1.2" strokeDasharray="2 2.5" />
        <rect x="157" y="322" width="6" height="11" rx="1.5" fill="#cfd3d1" stroke="#2a1a10" strokeWidth="1" />
        <path d="M72 330 q10 6 14 18 M248 330 q-10 6 -14 18" fill="none" stroke="#0b1f17" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
      </g>
      <g data-parte="alca">
        <path d="M214 292 L225 289 C236 312 244 336 250 360 L239 360 C233 336 225 314 214 292 Z" fill="#161616" stroke="#2a1a10" strokeWidth="1.2" />
        <rect x="226" y="322" width="16" height="10" rx="2" transform="rotate(-20 234 327)" fill="none" stroke="#cfd3d1" strokeWidth="2.2" />
      </g>

      {/* pescoço e orelhas */}
      <path d="M136 248 L134 300 Q160 312 186 300 L184 248 Z" fill={url('pele')} stroke="#2a1a10" strokeWidth="1.6" />
      <path d="M135 270 Q160 296 185 270 L185 254 L135 254 Z" fill="#c98563" opacity="0.5" />
      <path d="M102 172 C90 166 86 182 89 195 C92 206 98 211 105 207 Z" fill={url('pele')} stroke="#2a1a10" strokeWidth="1.6" />
      <path d="M98 180 C93 181 93 192 96 198" fill="none" stroke="#c98563" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M218 172 C230 166 234 182 231 195 C228 206 222 211 215 207 Z" fill={url('pele')} stroke="#2a1a10" strokeWidth="1.6" />
      <path d="M222 180 C227 181 227 192 224 198" fill="none" stroke="#c98563" strokeWidth="1.6" strokeLinecap="round" />

      {/* rosto redondo, com luz na testa e bochechas coradas */}
      <g data-parte="rosto">
        <path d="M98 150 C98 108 128 88 160 88 C192 88 222 108 222 150 L223 186 C223 228 198 262 160 266 C122 262 97 228 97 186 Z" fill={url('pele')} stroke="#2a1a10" strokeWidth="1.8" />
        <path d="M210 132 C220 154 222 182 218 206 C214 228 202 246 188 256 C204 234 210 206 208 180 C207 160 206 146 210 132 Z" fill="#c98563" opacity="0.3" />
        <ellipse cx="150" cy="134" rx="24" ry="8" fill="#fff8ee" opacity="0.35" />
        <ellipse cx="121" cy="204" rx="15" ry="9" fill={url('rubor')} />
        <ellipse cx="199" cy="204" rx="15" ry="9" fill={url('rubor')} />
      </g>

      {/* barba cheia e macia, com brilhos suaves, e o bigode ligado a ela */}
      <g data-parte="barba">
        <path d="M97 180 C97 200 104 214 117 220 C127 224 137 224 144 222 C152 219 168 219 176 222 C183 224 193 224 203 220 C216 214 223 200 223 180 C230 220 223 258 202 278 C196 284 190 286 184 286 C180 292 170 296 160 296 C150 296 140 292 136 286 C130 286 124 284 118 278 C97 258 90 220 97 180 Z" fill={url('barba')} stroke="#2a1a10" strokeWidth="1.6" strokeLinejoin="round" />
        <ellipse cx="126" cy="242" rx="17" ry="26" fill={url('luzBarba')} />
        <ellipse cx="160" cy="276" rx="22" ry="11" fill={url('luzBarba')} />
        <path d="M126 276 q4 6 10 8 M144 286 q6 5 13 6 M194 276 q-4 6 -10 8 M176 286 q-6 5 -13 6 M108 250 q2 8 7 14 M212 250 q-2 8 -7 14" fill="none" stroke="#6a4c37" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <path d="M136 230 C142 220 153 218 160 223 C167 218 178 220 184 230 C177 228 168 227 160 229 C152 227 143 228 136 230 Z" fill="#33231a" stroke="#2a1a10" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M144 224 C148 222 152 222 155 223 M165 223 C168 222 172 222 176 224" fill="none" stroke="#6a4c37" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* sorriso largo e suave, mostrando os dentes de cima */}
      <g data-parte="sorriso">
        <path d="M140 231 C150 237 170 237 180 231 C177 243 169 249 160 249 C151 249 143 243 140 231 Z" fill="#4a1717" stroke="#2a1a10" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M142 232 C151 237.5 169 237.5 178 232 C177 237 173 240.5 168 241.5 C163 242.5 157 242.5 152 241.5 C147 240.5 143 237 142 232 Z" fill="#fbf6ee" />
        <path d="M150 244.5 C155 247 165 247 170 244.5" fill="none" stroke="#c46a5a" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path d="M147 252 C153 255 167 255 173 252" fill="none" stroke="#b9705e" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* nariz pequeno */}
      <g data-parte="nariz">
        <path d="M157 184 C156 192 154 198 153 202" fill="none" stroke="#c98563" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
        <path d="M151 206 C154 211 166 211 169 206" fill="none" stroke="#2a1a10" strokeWidth="1.7" strokeLinecap="round" />
        <ellipse cx="161" cy="202" rx="5" ry="3.2" fill="#fff8ee" opacity="0.6" />
      </g>

      {/* olhos grandes, com a pálpebra cobrindo um pouco a íris; piscam de vez em quando */}
      <g data-parte="olhos">
        <motion.g {...piscar}>
          <path d="M115 179 C118 169 127 164 136 164 C146 164 152 170 154 177 C149 184 141 187 133 187 C125 187 119 184 115 179 Z" fill="#fffaf3" />
          <g clipPath={url('olhoE')}>
          <circle cx="135" cy="176.5" r="9.2" fill={url('iris')} />
          <circle cx="135" cy="176.5" r="4.4" fill="#140b05" />
          <path d="M112 164 C124 160 146 160 158 166 L158 172 C146 167 124 167 112 173 Z" fill="#000" opacity="0.14" />
          </g>
          <circle cx="138.4" cy="173" r="2.7" fill="#fff" />
          <circle cx="131.6" cy="180" r="1.2" fill="#fff" opacity="0.9" />
          <path d="M115 179 C118 168 127 162 136 162 C146 162 153 169 154 177 C150 171 144 166.5 136 166.5 C128 166.5 120 171 115 179 Z" fill="#2a1a10" />
        </motion.g>
        <motion.g {...piscar}>
          <path d="M205 179 C202 169 193 164 184 164 C174 164 168 170 166 177 C171 184 179 187 187 187 C195 187 201 184 205 179 Z" fill="#fffaf3" />
          <g clipPath={url('olhoD')}>
          <circle cx="185" cy="176.5" r="9.2" fill={url('iris')} />
          <circle cx="185" cy="176.5" r="4.4" fill="#140b05" />
          <path d="M208 164 C196 160 174 160 162 166 L162 172 C174 167 196 167 208 173 Z" fill="#000" opacity="0.14" />
          </g>
          <circle cx="188.4" cy="173" r="2.7" fill="#fff" />
          <circle cx="181.6" cy="180" r="1.2" fill="#fff" opacity="0.9" />
          <path d="M205 179 C202 168 193 162 184 162 C174 162 167 169 166 177 C170 171 176 166.5 184 166.5 C192 166.5 200 171 205 179 Z" fill="#2a1a10" />
        </motion.g>
        <path d="M121 185.5 C127 188.5 139 189 147 185" fill="none" stroke="#c98563" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        <path d="M199 185.5 C193 188.5 181 189 173 185" fill="none" stroke="#c98563" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* sobrancelhas grossas */}
      <g data-parte="sobrancelhas" transform="translate(0 3)">
        <path d="M114 156 C120 145 136 141 150 146 C152 149 151 152 149 153 C137 150 126 152 117 159 C114 160 113 158 114 156 Z" fill="#2a1c14" stroke="#2a1a10" strokeWidth="0.8" strokeLinejoin="round" />
        <path d="M206 156 C200 145 184 141 170 146 C168 149 169 152 171 153 C183 150 194 152 203 159 C206 160 207 158 206 156 Z" fill="#2a1c14" stroke="#2a1a10" strokeWidth="0.8" strokeLinejoin="round" />
      </g>

      {/* cabelo em ondas grandes: laterais curtas, alto e puxado para trás em cima */}
      <g data-parte="cabelo">
        <path d="M96 182 C92 152 94 128 104 114 C102 92 116 72 140 66 C136 74 137 80 142 85 C150 67 168 56 190 58 C184 64 184 72 188 79 C202 71 218 73 229 83 C224 87 224 93 226 99 C234 101 238 109 236 120 C234 138 230 160 224 182 L219 178 C220 152 214 134 204 126 C188 118 172 120 160 122 C148 120 132 118 116 126 C106 134 101 152 101 178 Z" fill={url('cabelo')} stroke="#1b130d" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M99 176 C97 156 99 140 106 128 L113 130 C107 142 104 158 103 176 Z" fill="#4b3729" opacity="0.85" />
        <path d="M221 176 C223 156 221 140 214 128 L207 130 C213 142 216 158 217 176 Z" fill="#4b3729" opacity="0.85" />
        <path d="M114 110 C118 92 130 80 146 74 C136 84 130 96 128 110 Z" fill="#7a5840" opacity="0.55" />
        <path d="M150 98 C158 82 172 72 190 68 C178 78 170 88 166 100 Z" fill="#7a5840" opacity="0.5" />
        <path d="M190 98 C198 88 210 84 222 86 C212 92 204 98 200 106 Z" fill="#7a5840" opacity="0.45" />
        <path d="M122 116 C138 106 152 102 166 102 M172 104 C188 104 202 108 214 116" fill="none" stroke="#7a5840" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      </g>
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
      {/* "respira" com escala e rotação: morph de `d` com keyframes deixava o path com d="undefined" */}
      <motion.path
        d="M50 90 C 30 30, 170 50, 165 110 C 155 170, 30 170, 50 90 Z"
        fill="currentColor"
        opacity="0.15"
        animate={{ scale: [1, 1.08, 0.96, 1], rotate: [0, 8, -6, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '100px 100px' }}
      />
    </svg>
  )
}
