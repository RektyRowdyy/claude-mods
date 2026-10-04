import { expect, mock, test } from 'claude-code/testing'

const BAND = {
  component: 'AbovePrompt',
  props: {
    hasSurvey: false, isWorking: false, maxRows: 4, bodyColumns: 160,
    scroll: { offset: 0, bodyRows: 4 }, view: {},
  },
} as const

test('band shows limits, token totals and cost', async ($, on) => {
  mock.clock(on, { now: Date.parse('2026-10-05T10:00:00Z') })
  on('session.measure', (_$, e) => ({ changed: e.changed }))
  on('turn.complete', (_$, e) => ({ text: e.answer }))
  await $.session.measure({
    context: { window: 200_000 },
    rateLimits: [
      { kind: 'five_hour', percentUsed: 20, resetsAt: '2026-10-05T12:40:00Z' },
      { kind: 'seven_day', percentUsed: 58, resetsAt: '2026-10-06T17:00:00Z' },
    ],
    cost: { usd: 4.32 },
    changed: ['rateLimits', 'cost'],
  })
  await $.turn.complete({
    answer: '', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer',
    usage: {
      model: 'claude-opus-5-5', input_tokens: 15_600, output_tokens: 3_000,
      cache_read_input_tokens: 900_000, cache_creation_input_tokens: 54_200,
    },
  })

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ plugin: 'usage-band', surface, ...BAND })
    const shown = async (text: RegExp) => (await ui.find({ type: 'Text', text }))?.text
    expect(await shown(/5h/)).toBe('󰓅 5h 20%  󰔟 2h 40m')
    expect(await shown(/7d/)).toBe('󰃭 7d 58%  󰔟 1d 7h')
    expect(await shown(/󰕒/)).toBeUndefined()
    expect(await shown(/󰇚/)).toBeUndefined()
    expect(await shown(/󰆼/)).toBe('󰆼 954.2k')
    expect(await shown(/\$/)).toBe('󰄔 $4.32')
    await ui.unmount()
  }
})
