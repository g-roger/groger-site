import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Nav from './Nav'

describe('Nav', () => {
  it('mostra o cargo ao lado da marca', () => {
    render(<Nav />)
    expect(screen.getByText('tech lead e engenheiro de dados')).toBeInTheDocument()
  })

  it('a marca leva ao topo da página', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /g·r/ })).toHaveAttribute('href', '#top')
  })

  it.each([
    ['sobre', '#about'],
    ['áreas', '#expertise'],
    ['ferramentas', '#stack'],
    ['trajetória', '#trajetoria'],
    ['projetos', '#projetos'],
    ['contato', '#contato'],
  ])('o link "%s" aponta para %s', (nome, href) => {
    render(<Nav />)
    const links = screen.getAllByRole('link', { name: nome })
    expect(links.length).toBeGreaterThan(0)
    for (const link of links) expect(link).toHaveAttribute('href', href)
  })
})
