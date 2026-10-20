import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

type Metrics = {
  totals: { views: number; unique_visitors: number; events: number; sessions: number }
  last_24h: { views: number; unique_visitors: number }
  top_paths: { path: string; views: number }[]
  top_referrers: { referrer: string; views: number }[]
  top_events: { name: string; count: number }[]
  daily: { day: string; views: number; unique: number }[]
  recent: {
    at: string
    path: string
    referrer: string | null
    country: string | null
    user_agent: string | null
  }[]
}

export default function Admin() {
  const [user, setUser] = useState('admin')
  const [pass, setPass] = useState('')
  const [auth, setAuth] = useState<string | null>(sessionStorage.getItem('gr_auth'))
  const [data, setData] = useState<Metrics | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function fetchMetrics(headers: HeadersInit) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/metrics', { headers })
      if (res.status === 401) {
        setError('Credenciais inválidas.')
        sessionStorage.removeItem('gr_auth')
        setAuth(null)
        return
      }
      if (!res.ok) throw new Error(`erro ${res.status}`)
      const json = (await res.json()) as Metrics
      setData(json)
    } catch (e: any) {
      setError(e?.message ?? 'falhou')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (auth) void fetchMetrics({ Authorization: auth })
  }, [auth])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const token = 'Basic ' + btoa(`${user}:${pass}`)
    sessionStorage.setItem('gr_auth', token)
    setAuth(token)
  }

  function logout() {
    sessionStorage.removeItem('gr_auth')
    setAuth(null)
    setData(null)
  }

  if (!auth) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submit}
          className="w-full max-w-sm rounded-3xl border border-mint/20 bg-moss/50 backdrop-blur p-8 space-y-5"
        >
          <div>
            <p className="text-gold uppercase tracking-[0.35em] text-[10px]">admin</p>
            <h1 className="section-heading text-3xl text-cream mt-2">Métricas</h1>
            <p className="text-cream/50 text-sm mt-2">Acesso restrito</p>
          </div>
          <div>
            <label htmlFor="admin-user" className="text-xs uppercase tracking-widest text-cream/50">usuário</label>
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="mt-1 w-full rounded-xl bg-forest border border-mint/20 px-4 py-2 text-cream focus:outline-none focus:border-mint"
              id="admin-user"
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="admin-pass" className="text-xs uppercase tracking-widest text-cream/50">senha</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="mt-1 w-full rounded-xl bg-forest border border-mint/20 px-4 py-2 text-cream focus:outline-none focus:border-mint"
              id="admin-pass"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-rose text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-jade text-cream py-2.5 font-medium hover:bg-jade/90 transition"
          >
            entrar
          </button>
        </motion.form>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-14 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-10">
          <div>
            <p className="text-gold uppercase tracking-[0.35em] text-[10px]">admin</p>
            <h1 className="section-heading text-4xl text-cream mt-2">Métricas do site</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => auth && fetchMetrics({ Authorization: auth })}
              className="text-xs uppercase tracking-widest text-cream/80 hover:text-cream border border-mint/25 px-3 py-2 rounded-full"
            >
              recarregar
            </button>
            <button
              onClick={logout}
              className="text-xs uppercase tracking-widest text-cream/80 hover:text-cream border border-mint/25 px-3 py-2 rounded-full"
            >
              sair
            </button>
          </div>
        </div>

        {loading && <p className="text-cream/60">carregando…</p>}
        {error && <p className="text-rose">{error}</p>}
        {data && (
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Stat label="Views totais" value={data.totals.views} />
              <Stat label="Visitantes únicos" value={data.totals.unique_visitors} />
              <Stat label="Views 24h" value={data.last_24h.views} highlight />
              <Stat label="Únicos 24h" value={data.last_24h.unique_visitors} />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Panel title="Views por dia (últimos 30)">
                <DailyChart data={data.daily} />
              </Panel>
              <Panel title="Eventos">
                <ul className="divide-y divide-mint/10">
                  {data.top_events.length === 0 && <li className="py-2 text-cream/50 text-sm">nenhum ainda</li>}
                  {data.top_events.map((e) => (
                    <li key={e.name} className="py-2 flex items-center justify-between text-sm">
                      <code className="text-cream/80">{e.name}</code>
                      <span className="text-cream/60">{e.count}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Panel title="Páginas mais vistas">
                <ul className="divide-y divide-mint/10">
                  {data.top_paths.map((p) => (
                    <li key={p.path} className="py-2 flex items-center justify-between text-sm">
                      <code className="text-cream/80 truncate max-w-[70%]">{p.path}</code>
                      <span className="text-cream/60">{p.views}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
              <Panel title="De onde vieram">
                <ul className="divide-y divide-mint/10">
                  {data.top_referrers.length === 0 && <li className="py-2 text-cream/50 text-sm">direto/desconhecido</li>}
                  {data.top_referrers.map((r) => (
                    <li key={r.referrer} className="py-2 flex items-center justify-between text-sm">
                      <span className="text-cream/80 truncate max-w-[70%]">{r.referrer || '(direto)'}</span>
                      <span className="text-cream/60">{r.views}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>

            <Panel title="Últimos acessos">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-cream/50 uppercase tracking-widest text-[10px]">
                      <th className="py-2 pr-4">quando</th>
                      <th className="py-2 pr-4">path</th>
                      <th className="py-2 pr-4">região</th>
                      <th className="py-2 pr-4">referrer</th>
                      <th className="py-2">agent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent.map((r, i) => (
                      <tr key={i} className="border-t border-mint/10 text-cream/80">
                        <td className="py-2 pr-4 whitespace-nowrap text-cream/60">{new Date(r.at).toLocaleString('pt-BR')}</td>
                        <td className="py-2 pr-4"><code className="text-cream">{r.path}</code></td>
                        <td className="py-2 pr-4">{r.country ?? '-'}</td>
                        <td className="py-2 pr-4 truncate max-w-[240px]">{r.referrer ?? '-'}</td>
                        <td className="py-2 truncate max-w-[280px] text-cream/50">{r.user_agent ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight ? 'border-jade/60 bg-jade/10' : 'border-mint/15 bg-moss/40'
      }`}
    >
      <p className="text-cream/50 text-xs uppercase tracking-widest">{label}</p>
      <p className="mt-2 text-4xl font-display text-cream">{value.toLocaleString('pt-BR')}</p>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-mint/15 bg-moss/40 backdrop-blur p-5">
      <p className="text-cream/60 text-xs uppercase tracking-widest mb-3">{title}</p>
      {children}
    </div>
  )
}

function DailyChart({ data }: { data: { day: string; views: number; unique: number }[] }) {
  if (data.length === 0) return <p className="text-cream/50 text-sm">sem dados ainda.</p>
  const max = Math.max(1, ...data.map((d) => d.views))
  return (
    <div className="flex items-end gap-1 h-40">
      {data.map((d) => (
        <div key={d.day} className="flex-1 flex flex-col items-center gap-1" title={`${d.day}: ${d.views}`}>
          <div className="w-full rounded-t bg-mint/10 relative">
            <div
              className="w-full rounded-t bg-jade transition-all"
              style={{ height: `${(d.views / max) * 140}px` }}
            />
          </div>
          <span className="text-[9px] text-cream/40">{d.day.slice(5)}</span>
        </div>
      ))}
    </div>
  )
}
