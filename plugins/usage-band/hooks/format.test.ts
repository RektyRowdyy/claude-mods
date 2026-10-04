import { describe, expect, test } from 'claude-code/testing'

import { formatRemaining, formatTokens } from './format'

describe('formatTokens', () => {
  test('scales to k and M', async () => {
    expect(formatTokens(950)).toBe('950')
    expect(formatTokens(15_600)).toBe('15.6k')
    expect(formatTokens(954_213)).toBe('954.2k')
    expect(formatTokens(1_234_567)).toBe('1.2M')
  })
})

describe('formatRemaining', () => {
  test('shows the two largest units', async () => {
    expect(formatRemaining((2 * 60 + 40) * 60_000)).toBe('2h 40m')
    expect(formatRemaining((31 * 60 + 5) * 60_000)).toBe('1d 7h')
    expect(formatRemaining(12 * 60_000)).toBe('12m')
    expect(formatRemaining(-5)).toBe('0m')
  })
})
