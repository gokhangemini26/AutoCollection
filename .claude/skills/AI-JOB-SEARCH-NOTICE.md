# Third-party skill notice

The following skills are vendored from [MadsLorentzen/ai-job-search](https://github.com/MadsLorentzen/ai-job-search), MIT License, Copyright (c) 2026 Mads Lorentzen:

- `.claude/skills/job-application-assistant/`
- `.claude/skills/job-scraper/`
- `.claude/skills/upskill/`
- `.agents/skills/freehire-search/`
- `.agents/skills/jobbank-search/`
- `.agents/skills/jobdanmark-search/`
- `.agents/skills/jobindex-search/`
- `.agents/skills/jobnet-search/`
- `.agents/skills/linkedin-search/`

Full license text: https://github.com/MadsLorentzen/ai-job-search/blob/main/LICENSE

## Dependencies not vendored

The upstream project is a full forkable framework, not a drop-in skill. Only the
skill directories above were copied. The following upstream pieces were **not**
copied and some skill features will not work until they are added:

- `job-application-assistant` expects `cv/main_example.tex`, `cover_letters/`,
  `documents/`, `CLAUDE.md`'s Candidate Profile section, `salary_lookup.py`, and
  `tools/robots_check.py` at the repo root (LaTeX CV/cover-letter output,
  salary lookups, robots.txt checks).
- `job-scraper` and `upskill` read/write `job_search_tracker.csv` and
  `job_scraper/seen_jobs.json` at the repo root — these are created at runtime
  on first use, so no setup is required beyond letting the skill create them.
- The six portal-search skills under `.agents/skills/*/cli` are Bun/TypeScript
  CLIs. Run `bun install` inside each `cli/` directory before first use.
  `jobdanmark-search` and `jobindex-search` ship disabled by default
  (Danish-market portals); flip `enabled: true` in their `SKILL.md` frontmatter
  to turn them on.
