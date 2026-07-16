# Align portfolio site to domain model

## Goal

Make the Portfolio Site implementation match the domain language in root `CONTEXT.md`, so Visitors see one coherent Subject story (no dual Opening Copy / dual Project sources), and content structure maps cleanly to Section / Skill Group / Project / Award / Credential.

## Background

- Domain glossary: root `CONTEXT.md` (Portfolio Site context).
- Stack: Vite + TypeScript + `@chenglou/pretext`; `index.html` + `src/main.ts`.
- Confirmed drifts: dual Opening Copy (hero `slogan` vs About `summary-text`); Projects/Awards as canvas string blobs; Skills only in HTML; Display Name / Role Line duplicated in chrome.
- No CMS/Editor; content is repo-authored.
- Task `00-bootstrap-guidelines` (fill frontend specs) is separate and out of scope here.

## Scope

**In (MVP A — content single-source + structural alignment)**

- Extract Subject content model under `src/content/`.
- Unify Opening Copy; structure Project / Award / Credential / Skill Group / Skill Point.
- Keep current neo-brutalist canvas + card visuals (no redesign).
- Bind document title, nav logo, and footer to Display Name + Role Line.

**Out**

- Embedded/IoT product domain of Project subject matter
- CMS / auth / multi-Subject / Editor
- Full accessible non-canvas DOM for Projects/Awards
- Filling `.trellis/spec/frontend/*` (bootstrap task)
- Visual redesign
- Rewriting Skill / Project marketing copy (migrate existing wording)

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Single Opening Copy field drives hero canvas and About card body. |
| R2 | Projects are structured (`title`, `period`, `role`, `highlights[]`); canvas text is formatted from structure, not a parallel list. |
| R3 | Awards and Credentials are distinct collections in the content model. |
| R4 | Skills Section is runtime-rendered from Skill Groups / Skill Points in the content model. |
| R5 | Display Name, Role Line, Focus Tags live in the content model; title, nav logo, footer, and About header bind to them (no intentional second truth). |
| R6 | Types/module names prefer `CONTEXT.md` terms over avoid-list synonyms. |
| R7 | Subject identity fields are split: `displayName`, `roleLine`, `openingCopy` (hero composes for canvas; About body uses full `openingCopy`). |

## Content decisions

- Opening Copy wording: long self-description currently in hero `slogan` (after name/role lines); discard About’s independent paragraph as source.
- Skills: migrate existing Chinese card titles and bullets as-is.
- Projects: `title`, `period`, `role`, `highlights: string[]`.
- Awards: `{ title, result? }[]`; Credentials: `{ title }[]`; one canvas view formatted from both.
- Skills: HTML mount point + TS generates cards (preserve existing card CSS classes/variants).
- About: top chrome = Display Name + Focus Tags; body = full Opening Copy.
- Chrome: `document.title`, nav logo, footer mark/role line from Subject fields.

## Acceptance Criteria

- [ ] AC1: Editing Opening Copy in `src/content/` only updates both hero and About body (no second hardcoded About paragraph).
- [ ] AC2: Project data is structured; projects canvas input is derived via a formatter from that structure.
- [ ] AC3: Content model exports distinct `awards` and `credentials` collections.
- [ ] AC4: Skills grid DOM is produced from content-model Skill Groups/Points at runtime (no hand-maintained duplicate skill cards in HTML).
- [ ] AC5: Display Name and Role Line for title/nav/footer come from the content model.
- [ ] AC6: Content types/files use domain terms (Subject, Opening Copy fields, Project, Award, Credential, Skill Group, Skill Point, Focus Tag).
- [ ] AC7: Visual style remains current neo-brutalist canvas+cards (no redesign required).
- [ ] AC8: `npm run build` succeeds.

## Technical Notes (for design.md)

- Complex task: needs `design.md` + `implement.md` before `task.py start`.
- Formatters: pure functions stringifying Projects / Awards+Credentials for pretext canvas.
- About + Skills: small DOM hydrate from content; avoid large framework.
- Preserve existing canvas interaction behavior in `main.ts` where possible.
