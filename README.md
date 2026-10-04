# claude-mods

Mods for [Claude Code](https://claude.com/claude-code): plugins of function hooks that add live UI inside the session.

| Mod | What it does |
| --- | --- |
| [usage-band](plugins/usage-band) | Band above the prompt: 5h/7d rate-limit usage with reset countdowns, cache tokens and session cost |

## Install

### From the marketplace

Inside Claude Code:

```
/plugin marketplace add RektyRowdyy/claude-mods
/plugin install usage-band@claude-mods
```

### From a clone

```sh
git clone https://github.com/RektyRowdyy/claude-mods ~/code/claude-mods
```

Then either start Claude Code with the mod for one session:

```sh
claude --plugin-dir ~/code/claude-mods/plugins/usage-band
```

or load it in every session by adding this to `~/.claude/settings.json` (separate several mods with `:`):

```json
{
  "env": {
    "CLAUDE_CODE_PLUGIN_DIRS": "~/code/claude-mods/plugins/usage-band"
  }
}
```

A clone loaded this way hot-reloads when its files change, and `git pull` picks up updates.

## License

MIT
