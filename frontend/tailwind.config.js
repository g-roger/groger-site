/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#080d18',   // fundo mais escuro
        pine:   '#0e1728',   // fundo médio
        moss:   '#152239',   // superfícies
        sage:   '#2a4059',   // borders
        mint:   '#75e6dc',   // ciano claro
        jade:   '#136a78',   // ciano profundo
        cream:  '#edf4ff',   // texto
        gold:   '#b2a4ff',   // violeta
        ochre:  '#98b8ff',   // violeta 2
        rust:   '#e68e87',   // destaque escuro
        rose:   '#c6a1e8',
      },
      fontFamily: {
        display: ['"Inter Variable"', 'ui-sans-serif', 'system-ui'],
        body: ['"Inter Variable"', 'ui-sans-serif', 'system-ui'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'monospace'],
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
