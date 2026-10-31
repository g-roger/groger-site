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

// Traços do retrato desenhados a partir de uma foto do Gabriel: cabelo castanho-escuro curto nos
// lados e alto e arrepiado em cima, sobrancelhas grossas, barba cheia ligada ao bigode, sorriso
// largo e a jaqueta verde com frisos brancos. Os fios da barba e as mechas foram gerados uma vez
// (com semente fixa) e ficam aqui prontos, para o desenho ser sempre o mesmo.
const RETRATO = {
  cabelo: 'M96 182C92 152 94 128 104 114C103.0 105.7 115.1 85.4 122.1 86.4C120.1 90.9 121.1 93.6 120.1 97.4C119.1 84.9 130.7 65.9 141.9 66.9C139.9 74.4 139.7 78.9 138.7 83.9C137.7 68.6 149.8 54.4 163.8 55.4C161.8 64.9 160.8 70.6 159.8 76.4C158.8 61.8 169.9 55.4 185.3 56.4C183.3 65.4 181.9 72.8 180.9 78.4C179.9 65.9 188.5 60.4 203.9 61.4C201.9 68.9 200.5 82.8 199.5 87.8C198.5 78.1 205.6 73.8 219.6 74.8C217.6 80.3 216.6 96.6 215.6 100.8C214.6 93.9 220.0 90.8 231.2 91.8C229.2 95.3 229.0 110.6 228.0 114.0C232 132 228 158 224 182L219 178C220 152 214 134 204 126C188 118 172 120 160 122C148 120 132 118 116 126C106 134 101 152 101 178Z',
  mechas: 'M109.1 119.7C110.1 112.5 117.1 91.8 119.1 91.4M126.4 104.7C127.4 92.7 133.9 75.9 138.9 71.9M146.3 94.2C147.3 79.0 153.8 66.8 160.8 60.4M167.3 91.4C168.3 77.0 174.3 67.2 182.3 61.4M187.2 97.1C188.2 85.1 192.9 70.4 200.9 66.4M204.5 108.3C205.5 99.5 209.6 81.4 216.6 79.8M218.8 121.4C219.8 115.8 223.2 96.0 228.2 96.8',
  barba: 'M96 180C96 200 104 216 118 222C128 228 136 228 142 226C152 222 168 222 178 226C184 228 192 228 202 222C216 216 224 200 224 180C232 224 222 272 196 290C180 302 140 302 124 290C98 272 88 224 96 180Z',
  fiosClaros:
    'M165.2 223.3Q164.6 226.1 166.6 229.2M149.1 280.5Q150.3 284.1 150.7 285.1M171.1 227.2Q171.4 228.6 169.8 231.2M132.4 279.2Q134.2 281.7 135.2 284.9M96.6 203.5Q96.3 206.6 97.0 209.2M202.4 264.7Q202.1 268.9 201.6 270.9M148.2 271.9Q147.8 275.2 150.0 277.6M198.1 249.1Q197.6 251.7 196.0 253.9M171.5 234.6Q170.5 238.8 169.6 242.1M143.6 260.9Q143.7 262.5 145.8 266.3M144.3 286.1Q145.7 289.7 146.8 291.3M128.1 229.5Q130.1 232.2 129.6 236.9M121.6 238.1Q120.5 240.4 122.1 243.2M144.5 227.5Q144.2 229.4 146.4 233.7M102.6 223.1Q104.7 225.4 106.1 229.7M155.1 238.0Q155.2 239.5 156.3 242.2M212.3 264.3Q210.9 267.8 211.3 269.7M164.7 274.6Q165.7 278.4 165.0 279.5M205.8 269.7Q204.9 271.4 204.8 275.7M125.3 263.9Q126.4 268.1 125.0 269.7M225.5 223.2Q224.5 224.8 225.3 228.1M177.9 289.6Q177.0 293.1 175.2 294.9M196.0 237.3Q195.7 241.7 196.3 244.4M145.8 295.4Q145.1 296.7 146.5 300.0M163.8 293.8Q164.6 296.7 163.6 301.3M122.6 250.7Q122.5 254.5 124.5 256.1M138.9 234.8Q138.9 239.8 139.2 242.4M112.8 236.7Q112.5 239.9 113.2 242.9M168.0 275.2Q167.8 277.7 169.0 281.4M199.2 241.0Q199.6 244.2 197.8 247.8M156.8 294.7Q157.9 297.8 156.4 302.2M168.6 295.0Q166.7 296.9 166.9 299.2M98.4 207.8Q100.6 212.0 101.3 213.9M110.2 266.8Q111.8 270.3 111.3 271.2M145.3 238.4Q143.6 241.8 143.7 245.6M167.8 232.6Q168.8 235.2 169.1 237.8M103.1 210.9Q104.0 213.1 106.2 217.3M148.8 291.0Q147.8 294.7 148.7 296.0M170.2 264.9Q171.1 266.7 170.9 269.0M179.4 277.4Q178.4 282.1 179.9 284.8M167.6 292.9Q167.7 294.4 167.7 297.4M95.3 203.0Q96.7 204.9 96.8 208.0M193.6 246.3Q194.9 248.2 193.7 252.2M205.9 231.6Q205.0 235.2 204.7 238.8M137.3 281.2Q137.4 284.0 138.1 287.7M95.8 194.1Q96.6 196.3 98.7 200.4M213.4 261.1Q212.3 263.5 212.4 266.0M110.7 233.3Q113.3 237.1 113.2 240.7M156.3 240.3Q155.5 242.6 157.5 246.2M100.9 227.5Q101.3 228.6 102.8 231.2M196.1 259.5Q194.5 262.6 193.6 266.6M192.3 257.8Q193.7 261.8 192.9 265.1M193.7 278.7Q193.4 282.7 193.1 284.8M203.9 280.5Q202.7 284.4 200.4 287.2M107.2 222.7Q108.8 226.4 110.1 229.4M178.2 262.4Q178.8 265.1 177.7 266.4M98.7 210.9Q99.5 214.7 98.9 215.7M159.1 225.4Q159.9 229.1 159.2 232.2M96.7 211.3Q97.5 214.1 97.3 218.1M162.4 235.6Q163.5 237.0 162.4 240.1M118.3 250.1Q120.9 251.9 120.8 255.7M206.1 241.1Q203.9 245.3 203.3 247.3M108.3 220.7Q107.9 224.9 110.3 227.7M217.8 213.9Q218.9 217.0 217.3 219.5M139.9 231.1Q139.3 234.1 140.8 235.2M141.8 296.6Q142.7 301.3 142.9 303.7M193.5 233.9Q191.9 235.8 191.6 240.2M130.9 269.6Q131.1 271.6 130.5 274.7M168.3 226.9Q167.8 230.3 169.0 231.5M170.0 288.0Q169.0 290.8 168.4 293.4M96.9 212.4Q96.7 215.0 96.5 216.9M145.6 233.3Q145.8 235.6 144.0 240.5M217.0 236.7Q216.1 239.8 215.9 240.5M181.2 272.8Q179.5 276.7 180.3 279.0M179.6 264.6Q179.9 267.0 180.1 268.9M131.4 235.1Q132.0 238.3 130.4 241.6M184.1 292.7Q183.2 294.5 183.1 296.7M202.8 269.7Q203.4 271.4 201.3 274.2M119.9 272.3Q121.5 275.0 123.2 279.4M120.2 229.7Q119.4 233.3 120.5 237.5M96.7 226.8Q97.3 231.9 96.6 234.3M222.1 218.8Q222.8 221.4 222.0 226.6M225.6 193.3Q224.2 196.4 223.5 197.7M206.4 231.6Q206.3 235.7 206.9 237.5M115.8 223.2Q115.4 226.1 115.4 227.3M220.5 209.9Q218.8 212.8 218.0 217.1M125.8 266.9Q125.2 270.0 127.5 271.7M121.7 236.9Q120.9 240.1 120.8 244.7M149.9 239.2Q150.3 242.2 148.9 243.8M206.5 273.8Q204.9 275.9 204.3 278.7M116.4 271.4Q116.1 273.4 118.4 275.1M101.9 239.8Q101.5 242.5 102.6 245.6M177.3 261.6Q176.9 264.1 175.5 268.7M169.6 224.2Q168.5 225.9 168.8 229.0M204.4 259.0Q203.2 261.8 202.1 262.8M93.8 214.4Q96.1 216.8 95.8 218.7M221.9 224.2Q220.1 227.6 219.5 229.4M224.2 191.1Q222.7 193.9 222.8 197.4M124.7 252.3Q123.6 254.2 125.1 257.1M202.5 246.0Q202.4 248.3 202.8 250.4M111.6 264.2Q111.9 267.9 113.4 269.0M133.0 248.2Q134.6 252.4 134.2 253.8M149.0 279.7Q149.5 282.5 150.3 287.2M180.3 290.8Q179.7 294.1 179.9 297.3M163.0 292.8Q164.4 297.0 164.1 298.6M221.4 226.1Q220.8 228.1 218.5 231.9M146.2 282.9Q145.3 285.0 146.0 287.7M162.6 225.6Q163.7 229.1 163.7 230.4M152.3 232.4Q153.3 234.7 154.3 238.5M198.0 274.7Q197.2 275.9 196.6 279.2M106.5 231.4Q107.8 232.7 109.0 236.6M193.6 274.4Q193.0 276.1 192.4 278.5M224.9 194.9Q224.1 199.5 221.9 202.3M158.8 296.6Q159.1 300.1 157.8 301.2M97.4 221.5Q98.7 223.2 97.7 226.1M160.3 292.1Q160.8 294.1 161.2 297.0M185.9 289.0Q184.2 292.6 184.8 296.1M213.7 246.8Q211.5 251.8 211.5 254.0M178.7 226.9Q179.4 229.6 177.5 231.8M139.9 272.8Q141.0 273.9 140.8 277.4M176.7 231.6Q175.4 234.6 176.2 239.2M103.3 222.3Q104.7 224.4 105.5 228.2M177.8 236.9Q177.7 239.7 179.0 244.6M101.8 257.1Q101.9 260.0 102.5 264.2M181.0 233.0Q179.1 237.4 178.6 239.6M223.5 195.6Q223.6 199.3 223.6 202.1M200.7 266.7Q201.5 270.3 200.9 274.1M194.8 234.1Q194.1 235.0 194.9 238.5M136.3 271.0Q137.1 274.0 136.8 278.3M167.7 232.1Q166.5 235.5 166.5 238.0M214.7 218.7Q215.0 223.1 214.6 226.4M155.6 282.1Q155.2 286.5 155.1 289.5M118.5 255.2Q119.3 257.3 122.0 262.0M187.7 256.6Q185.6 260.2 185.9 263.3M140.3 279.4Q139.1 284.2 140.3 286.9M179.3 280.3Q177.5 281.7 177.9 285.3M134.0 230.5Q134.3 233.5 135.8 235.2M210.6 254.7Q210.5 258.3 210.7 260.3M137.9 265.4Q139.3 266.6 138.5 270.2M158.8 276.8Q158.9 280.7 160.0 282.7M188.7 239.8Q187.9 243.8 189.5 246.3M188.4 275.6Q187.3 277.9 186.7 280.7M217.8 240.1Q216.4 243.8 216.5 247.6M164.5 271.6Q163.5 274.3 163.3 278.0M183.3 270.0Q184.2 273.1 183.5 275.8M106.2 235.3Q105.2 237.2 106.1 240.2M189.3 282.6Q188.3 284.4 188.8 287.2M102.6 225.6Q103.0 229.0 102.0 232.8M116.3 257.1Q117.1 257.9 118.5 261.4M145.5 276.1Q145.9 279.0 145.5 282.1',
  fiosEscuros:
    'M221.1 235.7Q219.5 238.6 219.7 241.3M178.7 276.3Q177.7 279.6 179.1 281.2M182.2 254.3Q182.4 255.1 182.5 258.4M151.4 282.5Q151.7 285.9 151.9 288.4M209.0 265.8Q207.9 266.9 208.0 270.4M198.3 227.6Q198.8 231.0 196.6 232.5M219.1 236.3Q216.6 238.9 216.5 240.8M100.5 219.2Q99.2 221.7 100.0 225.5M168.5 233.5Q168.0 236.9 169.5 239.6M104.8 230.2Q107.0 233.3 106.5 234.6M131.8 287.7Q134.1 290.3 134.4 292.2M101.0 250.3Q101.9 252.8 103.5 255.5M170.7 285.4Q172.0 288.6 171.0 289.9M215.0 252.8Q213.2 256.2 214.0 257.0M122.3 265.4Q123.8 267.8 124.8 271.3M113.3 267.3Q114.7 270.3 115.8 271.3M220.1 203.3Q220.2 204.4 220.7 208.1M113.4 223.7Q113.3 227.0 113.9 228.1M187.5 250.5Q186.3 253.7 187.9 254.6M157.4 268.6Q156.7 272.2 158.3 275.5M194.1 289.6Q193.2 293.3 190.6 294.6M138.7 263.0Q138.1 267.1 138.0 269.5M212.3 249.0Q211.7 251.8 210.7 253.9M192.9 226.2Q192.0 229.9 191.4 231.7M188.6 239.7Q187.2 241.6 187.3 246.3M131.3 262.1Q133.3 264.7 132.9 266.3M151.6 288.6Q151.4 291.3 152.9 294.4M214.8 225.7Q213.1 228.1 213.6 230.5M118.8 229.3Q118.5 233.0 119.2 234.8M190.0 248.8Q188.6 250.9 189.8 255.1M178.6 233.4Q179.0 237.6 177.7 239.3M188.4 242.5Q187.5 246.4 187.2 248.7M106.7 234.2Q106.8 237.8 107.6 240.9M224.0 235.5Q223.8 238.6 222.4 239.8M180.4 267.0Q181.8 271.7 180.6 273.7M165.3 276.1Q166.5 279.0 165.7 282.8M99.9 232.7Q100.5 234.4 101.2 238.9M136.2 275.7Q137.2 278.4 138.1 279.8M209.0 263.5Q208.7 264.6 206.0 268.1M119.9 243.3Q121.2 246.3 121.7 249.2M209.5 247.4Q210.1 251.1 208.9 252.5M118.0 283.5Q118.6 285.4 118.9 289.0M165.2 240.4Q166.3 242.5 164.8 244.5M145.7 277.3Q146.5 278.8 146.2 282.8M165.6 229.3Q163.9 232.5 163.6 235.8M106.3 231.8Q106.3 234.6 106.4 238.5M115.6 254.6Q116.3 255.5 115.5 259.0M139.2 254.9Q139.2 257.8 141.3 260.7M164.4 232.2Q164.6 233.8 164.7 237.4M117.4 256.3Q118.8 259.4 118.3 261.8M194.7 278.5Q192.8 281.8 192.0 282.7M122.5 268.1Q124.2 269.8 124.2 272.0M146.0 263.0Q147.4 266.3 147.7 267.2M160.8 272.0Q159.9 273.8 160.8 278.1M154.5 272.8Q155.0 275.3 155.3 278.2M188.9 282.7Q189.3 285.1 188.3 288.0M189.5 284.7Q188.7 287.1 187.4 289.5M195.2 274.5Q195.1 277.9 192.8 279.1M188.1 273.1Q187.7 274.4 186.1 278.0M137.2 236.1Q138.5 238.8 139.1 240.8M183.0 248.6Q184.1 251.6 182.3 253.8M189.0 272.5Q188.3 274.9 187.0 276.0M125.0 227.8Q125.5 228.8 126.7 232.0M174.0 272.1Q173.6 275.4 175.1 278.8M112.4 239.4Q113.9 241.3 112.9 243.6M128.8 266.9Q128.8 267.5 130.2 270.7M110.5 271.6Q112.7 273.4 113.4 277.6M149.9 237.2Q149.3 240.7 148.7 241.8M192.1 236.1Q191.1 237.9 189.5 242.0M177.9 234.5Q178.2 235.5 178.3 238.6M171.8 230.0Q172.6 234.0 170.7 235.5M200.9 255.5Q201.1 258.1 200.3 260.3M127.0 230.7Q127.2 231.7 127.2 235.0M141.7 237.3Q143.0 240.7 143.0 242.2M204.5 255.3Q203.4 256.8 202.7 259.6M204.6 223.7Q203.3 227.3 202.9 230.5M169.2 238.1Q169.7 239.4 168.5 243.0M118.7 260.1Q120.5 262.8 121.0 264.4M139.5 268.0Q140.6 270.3 140.5 272.3M219.5 232.3Q218.0 234.3 217.6 236.8M145.0 226.1Q146.5 228.9 146.3 231.6M208.4 247.8Q209.4 250.3 208.2 254.1M166.7 275.7Q167.8 278.9 167.5 279.9M108.7 270.5Q108.6 273.5 110.0 275.0M163.1 272.8Q164.5 275.8 163.3 277.8M191.8 265.8Q191.6 268.6 189.5 270.5M163.4 266.1Q162.7 267.6 162.4 271.2M117.4 230.7Q117.2 233.5 119.4 237.3M104.5 258.3Q103.6 260.5 105.2 262.8M172.1 290.8Q171.4 292.1 172.5 295.1',
}

const TINTA = '#1b130d'
const PELE_SOMBRA = '#c27f5b'
const CABELO = '#2a1c14'
const CABELO_LUZ = '#6e4e37'
const BARBA_LUZ = '#5a4231'
const CREME = '#f2ead8'

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
        <linearGradient id={`pele-${id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f2c8a2" />
          <stop offset="1" stopColor="#dea27b" />
        </linearGradient>
        <linearGradient id={`cabelo-${id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#3f2b1f" />
          <stop offset="1" stopColor={CABELO} />
        </linearGradient>
        <linearGradient id={`barba-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#2b1d15" />
          <stop offset="1" stopColor="#1a110b" />
        </linearGradient>
        <linearGradient id={`jaqueta-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#1f4d3b" />
          <stop offset="1" stopColor="#123326" />
        </linearGradient>
        <radialGradient id={`halo-${id}`} cx="0.5" cy="0.45" r="0.5">
          <stop offset="0" stopColor="#3f7a5b" stopOpacity="0.45" />
          <stop offset="1" stopColor="#3f7a5b" stopOpacity="0" />
        </radialGradient>
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
        <path d="M24 360 C28 316 64 296 116 288 L204 288 C256 296 292 316 296 360 Z" fill={url('jaqueta')} stroke={TINTA} strokeWidth="2" />
        <path d="M124 288 Q160 330 196 288 Z" fill={CREME} stroke={TINTA} strokeWidth="1.6" />
        <path d="M130 292 Q160 322 190 292" fill="none" stroke="#cfc4b0" strokeWidth="1.4" />
        <path d="M116 288 L138 304 L146 360 M204 288 L182 304 L174 360" fill="none" stroke={TINTA} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M116 288 L138 304 L124 316 Z M204 288 L182 304 L196 316 Z" fill="#123326" stroke={TINTA} strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M110 294 C76 302 48 324 38 360 M118 298 C86 306 58 328 50 360" fill="none" stroke={CREME} strokeWidth="3.4" strokeLinecap="round" />
        <path d="M210 294 C244 302 272 324 282 360 M202 298 C234 306 262 328 270 360" fill="none" stroke={CREME} strokeWidth="3.4" strokeLinecap="round" />
        <path d="M160 322 L160 360" stroke={TINTA} strokeWidth="1.2" strokeDasharray="2 2.5" />
        <rect x="157" y="322" width="6" height="11" rx="1.5" fill="#cfd3d1" stroke={TINTA} strokeWidth="1" />
        <path d="M94 320 C102 332 106 346 106 360 M226 320 C218 332 214 346 214 360" fill="none" stroke={TINTA} strokeWidth="1.1" opacity="0.6" />
        <path d="M72 330 q10 6 14 18 M248 330 q-10 6 -14 18" fill="none" stroke="#0b1f17" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
      </g>
      <g data-parte="alca">
        <path d="M214 292 L225 289 C236 312 244 336 250 360 L239 360 C233 336 225 314 214 292 Z" fill="#161616" stroke={TINTA} strokeWidth="1.2" />
        <rect x="226" y="322" width="16" height="10" rx="2" transform="rotate(-20 234 327)" fill="none" stroke="#cfd3d1" strokeWidth="2.2" />
      </g>

      {/* pescoço e orelhas */}
      <path d="M134 250 L132 300 Q160 314 188 300 L186 250 Z" fill={url('pele')} stroke={TINTA} strokeWidth="1.8" />
      <path d="M133 272 Q160 300 187 272 L187 256 L133 256 Z" fill={PELE_SOMBRA} opacity="0.6" />
      <path d="M99 170 C84 162 78 182 82 198 C85 212 94 218 102 213 Z" fill={url('pele')} stroke={TINTA} strokeWidth="1.8" />
      <path d="M95 179 C88 179 87 193 91 201 C93 205 96 205 97 202" fill="none" stroke={PELE_SOMBRA} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M221 170 C236 162 242 182 238 198 C235 212 226 218 218 213 Z" fill={url('pele')} stroke={TINTA} strokeWidth="1.8" />
      <path d="M225 179 C232 179 233 193 229 201 C227 205 224 205 223 202" fill="none" stroke={PELE_SOMBRA} strokeWidth="1.8" strokeLinecap="round" />

      {/* rosto, com sombra do lado direito, sob o cabelo e bochechas */}
      <g data-parte="rosto">
        <path d="M96 152 C96 112 126 94 160 94 C194 94 224 112 224 152 L226 188 C226 230 202 266 160 272 C118 266 94 230 94 188 Z" fill={url('pele')} stroke={TINTA} strokeWidth="2" />
        <path d="M208 128 C222 150 226 180 222 208 C218 236 202 256 186 266 C206 240 214 208 210 178 C208 158 206 142 208 128 Z" fill={PELE_SOMBRA} opacity="0.45" />
        <path d="M106 128 C130 120 190 120 214 128 C200 136 120 136 106 128 Z" fill={PELE_SOMBRA} opacity="0.5" />
        <ellipse cx="146" cy="142" rx="20" ry="6" fill="#fff6ea" opacity="0.25" />
        <ellipse cx="120" cy="206" rx="12" ry="6.5" fill="#e0866a" opacity="0.35" />
        <ellipse cx="200" cy="206" rx="12" ry="6.5" fill="#e0866a" opacity="0.35" />
      </g>

      {/* barba cheia, com fios claros e escuros, e o bigode ligado a ela */}
      <g data-parte="barba">
        <path d={RETRATO.barba} fill={url('barba')} stroke={TINTA} strokeWidth="1.8" strokeLinejoin="round" />
        <path d={RETRATO.fiosClaros} fill="none" stroke={BARBA_LUZ} strokeWidth="0.9" strokeLinecap="round" opacity="0.85" />
        <path d={RETRATO.fiosEscuros} fill="none" stroke="#0d0805" strokeWidth="0.9" strokeLinecap="round" opacity="0.7" />
        <path d="M132 236 C140 226 152 223 160 228 C168 223 180 226 188 236 C180 235 170 233 160 235 C150 233 140 235 132 236 Z" fill="#2b1d15" stroke={TINTA} strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M138 232 l4 -3 M144 230 l3 -3 M150 229 l2 -3 M170 229 l-2 -3 M176 230 l-3 -3 M182 232 l-4 -3" stroke={BARBA_LUZ} strokeWidth="0.9" strokeLinecap="round" />
      </g>

      {/* sorriso aberto, mostrando os dentes */}
      <g data-parte="sorriso">
        <path d="M134 238 C146 242 174 242 186 238 C182 258 170 266 160 266 C150 266 138 258 134 238 Z" fill="#5b1d1d" stroke={TINTA} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M137 240 C148 244 172 244 183 240 L181 249 C170 252 150 252 139 249 Z" fill="#fbf6ee" />
        <path d="M149 243 L149 251 M160 244 L160 252 M171 243 L171 251" stroke="#dcd2c3" strokeWidth="0.8" />
        <ellipse cx="160" cy="260" rx="10" ry="4" fill="#c56a63" />
      </g>

      {/* nariz */}
      <path d="M155 168 C153 184 147 198 144 210 C150 206 155 198 157 186 Z" fill={PELE_SOMBRA} opacity="0.55" />
      <path d="M145 210 C141 214 143 221 150 222 C154 225 158 224 160 222 C162 224 166 225 170 222 C177 221 179 214 175 210" fill="none" stroke={TINTA} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M151 216 q3 2 5 0 M164 216 q3 2 5 0" fill="none" stroke={TINTA} strokeWidth="1.4" strokeLinecap="round" />
      <ellipse cx="163" cy="208" rx="5" ry="3.4" fill="#fff3e6" opacity="0.55" />

      {/* olhos sorrindo, que piscam de vez em quando */}
      <g data-parte="olhos">
        <motion.g {...piscar}>
          <path d="M120 178 Q134 168 148 176 Q134 184 120 178 Z" fill="#fffaf2" />
          <circle cx="134" cy="176.5" r="5.4" fill="#4b2e1c" />
          <circle cx="134" cy="176.5" r="2.5" fill="#120c08" />
          <circle cx="136" cy="174.5" r="1.4" fill="#fff" />
          <path d="M118 178 Q133 164 149 175" fill="none" stroke={TINTA} strokeWidth="2.8" strokeLinecap="round" />
        </motion.g>
        <motion.g {...piscar}>
          <path d="M200 178 Q186 168 172 176 Q186 184 200 178 Z" fill="#fffaf2" />
          <circle cx="186" cy="176.5" r="5.4" fill="#4b2e1c" />
          <circle cx="186" cy="176.5" r="2.5" fill="#120c08" />
          <circle cx="188" cy="174.5" r="1.4" fill="#fff" />
          <path d="M202 178 Q187 164 171 175" fill="none" stroke={TINTA} strokeWidth="2.8" strokeLinecap="round" />
        </motion.g>
        <path d="M123 185 Q134 190 145 183 M197 185 Q186 190 175 183" fill="none" stroke={PELE_SOMBRA} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M115 180 q-4 2 -7 1 M205 180 q4 2 7 1" fill="none" stroke={PELE_SOMBRA} strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* sobrancelhas grossas */}
      <g data-parte="sobrancelhas" fill={CABELO} stroke={TINTA} strokeWidth="1" strokeLinejoin="round">
        <path d="M114 162 C122 149 140 146 152 152 L151 160 C140 155 128 157 117 167 Z" />
        <path d="M206 162 C198 149 180 146 168 152 L169 160 C180 155 192 157 203 167 Z" />
      </g>

      {/* cabelo numa peça só: laterais curtas e topete arrepiado, puxado para trás */}
      <g data-parte="cabelo">
        <path d={RETRATO.cabelo} fill={url('cabelo')} stroke={TINTA} strokeWidth="2" strokeLinejoin="round" />
        <path d="M99 176 C97 156 99 140 106 128 L113 130 C107 142 104 158 103 176 Z" fill="#4b3729" opacity="0.85" />
        <path d="M221 176 C223 156 221 140 214 128 L207 130 C213 142 216 158 217 176 Z" fill="#4b3729" opacity="0.85" />
        <path d="M118 104 C134 92 150 88 164 88 C150 94 136 100 124 110 Z" fill={CABELO_LUZ} opacity="0.55" />
        <path d={RETRATO.mechas} fill="none" stroke={CABELO_LUZ} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M128 112 C140 106 152 104 162 104 M170 104 C184 104 198 108 210 114" fill="none" stroke={CABELO_LUZ} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
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
