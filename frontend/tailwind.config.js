/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#0b1a12',   // fundo mais escuro
        pine:   '#0f2418',   // fundo médio
        moss:   '#163024',   // superfícies
        sage:   '#2b4a38',   // borders
        mint:   '#8fb8a2',   // acento suave
        jade:   '#3f7a5b',   // acento vivo
        cream:  '#f2ead8',   // texto
        gold:   '#e8c37a',   // destaque quente
        ochre:  '#d4a15a',   // destaque quente 2
        rust:   '#b85c3d',   // destaque escuro
        rose:   '#c6807a',
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        grain: {
          '0%, 100%': { transform: 'translate(0,0)' },
          '20%': { transform: 'translate(-2%, 3%)' },
          '40%': { transform: 'translate(3%, -2%)' },
          '60%': { transform: 'translate(-3%, 2%)' },
          '80%': { transform: 'translate(2%, -3%)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        grain: 'grain 6s steps(6) infinite',
        floaty: 'floaty 5s ease-in-out infinite',
        pulseSlow: 'pulseSlow 4s ease-in-out infinite',
      },
      backgroundImage: {
        'noise':
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.95 0 0 0 0 0.94 0 0 0 0 0.9 0 0 0 0.09 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
