import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Limit, Tokens, Usage } from '../types'
import { formatRemaining, formatTokens } from './format'

const EMPTY_USAGE: Usage = { limits: [], costUsd: null }
const EMPTY_TOKENS: Tokens = { cache: 0 }
const usage = atom({ plugin: 'usage-band', key: 'usage' } as const, EMPTY_USAGE)
const tokens = atom({ plugin: 'usage-band', key: 'tokens' } as const, EMPTY_TOKENS)

const LABEL: Record<string, string> = { five_hour: '5h', seven_day: '7d' }
const ICON: Record<string, string> = { five_hour: '󰓅', seven_day: '󰃭' }
const TINT: Record<string, { bg: string; fg: string }> = {
  five_hour: { bg: '#24352c', fg: '#8fbf9f' },
  seven_day: { bg: '#2e2a3d', fg: '#b4a7e6' },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const now = await $.session.usage()
    await update($, usage, () => ({ limits: now.rateLimits, costUsd: now.cost?.usd ?? null }))
    return next(e)
  })

  on('session.measure', async ($, e, next) => {
    await update($, usage, () => ({ limits: e.rateLimits, costUsd: e.cost?.usd ?? null }))
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const u = e.usage
    if (u) {
      await update($, tokens, t => ({
        cache: t.cache + u.cache_read_input_tokens + u.cache_creation_input_tokens,
      }))
    }
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const { Box, Text } = $.ui.resolve(e)
    const [{ limits, costUsd }, t, now] = await Promise.all([
      read($, usage),
      read($, tokens),
      $.clock.now(),
    ])

    const pill = (key: string, bg: string, fg: string, text: string) => (
      <Box key={key} backgroundColor={bg} paddingX={1} marginRight={1}>
        <Text color={fg}>{text}</Text>
      </Box>
    )

    const limitPill = (l: Limit) => {
      const remaining = l.resetsAt ? Date.parse(l.resetsAt) - now : null
      const tint = TINT[l.kind] ?? { bg: '#33302a', fg: '#d8b56a' }
      const reset = remaining === null ? '' : `  󰔟 ${formatRemaining(remaining)}`
      const label = `${ICON[l.kind] ?? '󰾆'} ${LABEL[l.kind] ?? l.kind} ${Math.round(l.percentUsed)}%`
      return pill(`limit-${l.kind}`, tint.bg, tint.fg, label + reset)
    }

    return (
      <Box flexDirection="row" flexWrap="wrap">
        {limits.map(limitPill)}
        {pill('cache', '#262c40', '#8fa3e6', `󰆼 ${formatTokens(t.cache)}`)}
        {costUsd === null ? null : pill('cost', '#36311f', '#d8b56a', `󰄔 $${costUsd.toFixed(2)}`)}
      </Box>
    )
  })
}
