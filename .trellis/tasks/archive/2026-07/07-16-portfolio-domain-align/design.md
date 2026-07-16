# Design: Align portfolio site to domain model

## Boundaries

| Layer | Responsibility |
|-------|----------------|
| `src/content/` | Single source of Subject content: types + data + pure formatters for canvas strings |
| `src/main.ts` | Presentation: pretext canvas, mouse/resize loop, DOM hydrate for chrome / About / Skills |
| `index.html` | Shell, Section landmarks, mount points; no duplicate skill/about body copy |
| `CONTEXT.md` | Domain language only (not implementation) |

No new framework. No CMS. No second bounded context.

## Content contracts

```ts
// Conceptual shapes (names must track CONTEXT.md)

type FocusTag = { label: string; variant: 'yellow' | 'pink' | 'cyan' };

type SkillPoint = { text: string }; // may include simple emphasis markers if needed later; v1 plain + optional HTML-safe strong via structured parts only if already present

type SkillGroup = {
  title: string;
  variant: 'a' | 'b' | 'c' | 'd'; // maps to existing skill-card--*
  points: SkillPoint[];
};

type Project = {
  title: string;
  period: string;
  role: string;
  highlights: string[];
};

type Award = {
  title: string;
  result?: string; // e.g. 全国一等奖
};

type Credential = {
  title: string;
};

type Subject = {
  displayName: string;
  roleLine: string;
  openingCopy: string; // long self-description only
  focusTags: FocusTag[];
  skillGroups: SkillGroup[];
  projects: Project[];
  awards: Award[];
  credentials: Credential[];
};
```

### Formatters (pure)

- `formatHeroText(subject): string` — compose displayName + roleLine + openingCopy for hero canvas (preserve pre-wrap friendly newlines similar to current `slogan`).
- `formatProjectsCanvas(projects): string` — derive current multi-project canvas blob style from structured Projects.
- `formatAwardsCanvas(awards, credentials): string` — derive current honors wall string with two labeled groups.

Canvas code paths must call formatters; they must not keep parallel string arrays as source of truth.

### DOM hydrate (imperative)

On load (and only where content-driven):

1. **Chrome**: `document.title`, `.logo`, footer mark + role span from `displayName` / `roleLine`.
2. **About**: name title, focus-tag badges, `.summary-text` body from `openingCopy` (full text; preserve whitespace with CSS if needed).
3. **Skills**: empty `#skills-grid` (or `.skills-grid`) filled with articles matching existing classes `nb-card skill-card skill-card--{variant}`.

Projects / Awards Sections remain canvas-only (MVP A).

## Data flow

```
src/content/subject.ts  (data)
        │
        ├─► formatHeroText ──────────► hero pretext prepare/layout
        ├─► formatProjectsCanvas ────► projects pretext
        ├─► formatAwardsCanvas ──────► awards pretext
        ├─► hydrateChrome / About / Skills DOM
        └─► (types exported for main.ts)
```

## Compatibility

- Preserve existing CSS class names and canvas IDs (`pretext-hero`, `pretext-projects`, `pretext-awards`).
- Preserve mouse spotlight / resize / dynamic hero fit behavior; only swap text sources to formatters.
- Skill card visual variants `skill-card--a|b|c|d` remain.

## Trade-offs

| Choice | Why | Cost |
|--------|-----|------|
| Runtime DOM for Skills | True single source without SSG | Brief empty grid until JS runs |
| Canvas still for Projects/Awards | No visual redesign / a11y scope creep | Screen readers still weak on those sections |
| Split identity fields | Matches CONTEXT | Hero formatter must stay in sync with desired line breaks |
| `src/content/` module | Clear boundary | Small file split vs monolith main.ts |

## Rollback

- Revert content extraction commit; restore inline strings in `main.ts` and static HTML skills/about if needed.
- No data migration; content is static in repo.

## Non-goals in design

- Accessible HTML project cards
- Spec bootstrap for frontend guidelines
- i18n framework
