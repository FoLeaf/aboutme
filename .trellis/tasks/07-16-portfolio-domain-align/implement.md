# Implement: Align portfolio site to domain model

## Checklist

1. [x] Add `src/content/types.ts` — Subject, Project, Award, Credential, SkillGroup, SkillPoint, FocusTag
2. [x] Add `src/content/subject.ts` — migrate data from `main.ts` + `index.html` (Opening Copy from hero long copy; skills as-is; projects/awards split)
3. [x] Add `src/content/format.ts` — `formatHeroText`, `formatProjectsCanvas`, `formatAwardsCanvas`
4. [x] Add `src/content/index.ts` — re-export subject + formatters + types
5. [x] Slim `index.html`: About body empty or placeholder with id; Skills grid empty mount; keep Section chrome
6. [x] Update `src/main.ts`: import content; replace `slogan`/`projects`/`awards` constants; hydrate chrome/About/Skills; canvas uses formatters
7. [ ] Verify visual smoke: hero, about, skills cards, projects canvas, awards canvas, footer
8. [x] Run `npm run build`
9. [x] Spot-check AC1–AC8 against prd.md

## Validation

```bash
npm run build
npm run dev   # manual smoke
```

## Risk / rollback points

| Step | Risk | Rollback |
|------|------|----------|
| Data migrate | Wrong split of slogan into fields | Keep original slogan string in git history; adjust formatter |
| Skills hydrate | Class/markup mismatch | Copy previous HTML article markup into generator |
| Canvas formatters | Layout/wrap regression | Tune formatter newlines to match old blobs |

## Files likely touched

- `src/content/*` (new)
- `src/main.ts`
- `index.html`
- (no CSS change expected unless About whitespace needs `white-space` tweak)

## Review gate before start

User reviews `prd.md` + `design.md` + this file; then:

```bash
python ./.trellis/scripts/task.py start
```
