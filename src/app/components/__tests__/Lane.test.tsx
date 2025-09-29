import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Lane } from '../Lane'

describe('Lane', () => {
  const mockStatement = {
    id: '1',
    text: 'Test statement',
    createdAt: new Date('2025-01-01').toISOString(), // Use a date more than 3 days old
    totalVotes: 10,
    agreeWeight: 7,
    disagreeWeight: 3,
    balanceScore: 0.7
  }

  it('renders statement text', () => {
    render(<Lane statement={mockStatement} />)
    expect(screen.getByText('Test statement')).toBeInTheDocument()
  })

  it('displays vote count', () => {
    render(<Lane statement={mockStatement} />)
    expect(screen.getByText('Votes: 10')).toBeInTheDocument()
  })

  it('shows vote percentages when there are votes', () => {
    render(<Lane statement={mockStatement} />)
    expect(screen.getByText('👍 70.0%')).toBeInTheDocument()
    expect(screen.getByText('👎 30.0%')).toBeInTheDocument()
  })

  it('categorizes as Popular when votes >= 5', () => {
    render(<Lane statement={mockStatement} />)
    expect(screen.getByText('🌟 Popular')).toBeInTheDocument()
  })
})
