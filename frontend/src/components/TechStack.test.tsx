import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { techStack } from '../data'
import TechStack from './TechStack'

describe('TechStack', () => {
  it('o título é "O que eu uso"', () => {
    render(<TechStack />)
    expect(screen.getByRole('heading', { level: 2, name: 'O que eu uso' })).toBeInTheDocument()
  })

  it.each(techStack.map((c) => [c.name, c] as const))('mostra a categoria "%s" com todos os itens', (_nome, categoria) => {
    render(<TechStack />)
    expect(screen.getByRole('heading', { level: 3, name: categoria.name })).toBeInTheDocument()
    for (const item of categoria.items) expect(screen.getAllByText(item).length).toBeGreaterThanOrEqual(1)
  })
})
