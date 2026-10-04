# usage-band

A band above the Claude Code prompt showing how much of your plan you've used and what the session costs.

```
󰓅 5h 20%  󰔟 2h 40m   󰃭 7d 58%  󰔟 1d 7h   󰆼 954.2k   󰄔 $4.32
```

| Pill | Shows |
| --- | --- |
| 󰓅 **5h** | Rolling 5-hour rate limit: % used, then time until it resets |
| 󰃭 **7d** | Weekly rate limit: % used, then time until it resets |
| 󰆼 | Prompt-cache tokens (read + written) since the mod loaded |
| 󰄔 | Session cost, the same figure as `/cost` |

## Notes

- **Rate-limit pills need a subscription login** (Pro/Max). With an API key there are no windows to show, so only
  the cache and cost pills appear. They show up after the session's first API response.
- **Cache tokens count from when the mod loads**; the cost is the whole session's, as Claude Code keeps it.
- **Icons are [Nerd Font](https://www.nerdfonts.com/) glyphs.** Without a Nerd Font in your terminal they show as boxes.
- **Colours assume a dark terminal theme.**

## Development

```sh
claude plugin validate plugins/usage-band
claude plugin test plugins/usage-band
```

`hooks/register.tsx` holds the hooks (`session.start`, `session.measure`, `turn.complete`, and the
`ui.render` hook for `AbovePrompt`); `hooks/format.ts` holds the pure formatting helpers.
