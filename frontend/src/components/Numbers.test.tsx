import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { careerStats } from '../data'
import Numbers from './Numbers'

describe('Numbers', () => {
  it('mostra um rótulo para cada número da carreira', () => {
    render(<Numbers />)
    for (const stat of careerStats()) expect(screen.getByText(stat.label)).toBeInTheDocument()
  })

  it('os contadores chegam ao valor final', async () => {
    render(<Numbers />)
    for (const stat of careerStats()) {
      const esperado = `${stat.n}${stat.suffix}`
      expect(await screen.findByText(esperado, {}, { timeout: 8000 })).toBeInTheDocument()
    }
  }, 30000)
})
