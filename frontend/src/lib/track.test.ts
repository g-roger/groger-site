import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { trackEvent, trackPageview } from './track'

const fetchOriginal = globalThis.fetch
const fetchMock = vi.fn()

function setReferrer(value: string) {
  Object.defineProperty(document, 'referrer', { value, configurable: true })
}

beforeEach(() => {
  fetchMock.mockReset()
  fetchMock.mockResolvedValue({ ok: true, status: 204 })
  globalThis.fetch = fetchMock as unknown as typeof fetch
  window.history.pushState({}, '', '/')
  setReferrer('')
})

afterEach(() => {
  globalThis.fetch = fetchOriginal
})

function ultimaChamada() {
  const [url, init] = fetchMock.mock.calls[0]
  return { url: url as string, init: init as RequestInit, body: JSON.parse(init.body as string) }
}

describe('trackPageview', () => {
  it('envia o caminho atual para /api/track', async () => {
    window.history.pushState({}, '', '/admin')
    await trackPageview()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const { url, init, body } = ultimaChamada()
    expect(url).toBe('/api/track')
    expect(init.method).toBe('POST')
    expect(init.headers).toEqual({ 'Content-Type': 'application/json' })
    expect(init.keepalive).toBe(true)
    expect(body).toEqual({ path: '/admin', referrer: null })
  })

  it('envia o referrer quando existe', async () => {
    setReferrer('https://www.linkedin.com/')
    await trackPageview()
    expect(ultimaChamada().body.referrer).toBe('https://www.linkedin.com/')
  })

  it('não quebra a página se a rede falhar', async () => {
    fetchMock.mockRejectedValue(new Error('offline'))
    await expect(trackPageview()).resolves.toBeUndefined()
  })
})

describe('trackEvent', () => {
  it('envia o nome e o meta para /api/track/event', async () => {
    await trackEvent('project_click', { name: 'fraud-pix-model' })

    const { url, init, body } = ultimaChamada()
    expect(url).toBe('/api/track/event')
    expect(init.method).toBe('POST')
    expect(init.keepalive).toBe(true)
    expect(body).toEqual({ name: 'project_click', meta: { name: 'fraud-pix-model' } })
  })

  it('usa meta vazio quando não recebe nenhum', async () => {
    await trackEvent('expertise_open')
    expect(ultimaChamada().body).toEqual({ name: 'expertise_open', meta: {} })
  })

  it('não quebra a página se a rede falhar', async () => {
    fetchMock.mockRejectedValue(new Error('offline'))
    await expect(trackEvent('x')).resolves.toBeUndefined()
  })
})
