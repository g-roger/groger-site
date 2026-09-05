export async function trackPageview() {
  try {
    const path = window.location.pathname
    const ref = document.referrer || null
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, referrer: ref }),
      keepalive: true,
    })
  } catch {
    /* silent */
  }
}

export async function trackEvent(name: string, meta?: Record<string, unknown>) {
  try {
    await fetch('/api/track/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, meta: meta ?? {} }),
      keepalive: true,
    })
  } catch {
    /* silent */
  }
}
