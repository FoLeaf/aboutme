# Portfolio Site

The public-facing personal portfolio: who the person is, what they have done, and how that content is presented to visitors. It is not the embedded/IoT engineering domain of the projects described inside the resume.

## Language

**Portfolio Site**:
The single bounded context of this repository — the about/portfolio experience a visitor browses.
_Avoid_: personal brand platform, homepage app, resume app (as the context name)

**Visitor**:
A person viewing the Portfolio Site in a browser. Not an authenticated account and not a content editor.
_Avoid_: user, client, reader, audience

**Opening Copy**:
The single primary self-description of the Subject, shown to a Visitor. The hero canvas and the About card are two presentations of this same copy, not two independent texts.
_Avoid_: slogan, summary, about text, tagline (as separate content entities)

**Subject**:
The person the Portfolio Site is about. There is exactly one Subject for this site; they are not a logged-in User or an editor account.
_Avoid_: user, profile, author, account, persona

**Display Name**:
The public name of the Subject as shown to Visitors (for example 19y).
_Avoid_: username, handle, brand name (as the field for the person)

**Role Line**:
A one-line professional positioning of the Subject (for example senior embedded / IoT engineer). Distinct from Opening Copy, which is the longer self-description.
_Avoid_: title alone, job title (when it is marketing positioning, not an employer title), headline alone

**Section**:
A named region of the Portfolio Site that groups one kind of content for the Visitor (for example About, Skills, Projects, Awards). Navigation targets Sections.
_Avoid_: page, chapter, block, tab (unless it is a true alternate view of the same Section)

**Skill Group**:
A themed bucket of related skills shown as one card in the Skills Section (for example core languages, embedded, IoT). It contains Skill Points. It is not a single skill.
_Avoid_: skill (for the card), category alone, expertise card

**Skill Point**:
One skill statement inside a Skill Group (for example a bullet about C, FreeRTOS, or MQTT).
_Avoid_: skill alone (when ambiguous with Skill Group), bullet, item

**Project**:
A portfolio work entry shown to the Visitor: a titled engagement with a time span, role framing, and bullet highlights. It is not a live product system in this context. One Project may be presented in shorter and longer forms (for example card vs canvas), but those forms are not separate Projects.
_Avoid_: case study, work item, product, repository (as the domain name for the entry)

**Award**:
A competition or contest result earned by the Subject (for example national first prize). Shown in the Awards Section.
_Avoid_: honor alone, prize (as the only term), credential

**Credential**:
A scholarship, certificate, license, or qualification held by the Subject (for example national scholarship, technician certificate). Not a contest result.
_Avoid_: award, certificate alone (when the broader term is needed), badge

**Focus Tag**:
A short label that highlights a primary focus of the Subject (for example STM32, RTOS, IoT). It is not a Skill Group and is not required to be a full skill inventory entry.
_Avoid_: badge (as the domain name), skill tag, chip, keyword alone
