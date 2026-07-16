import type { Award, Credential, Project, Subject } from './types';

/** Hero canvas: Display Name + Role Line + Opening Copy (pre-wrap friendly). */
export function formatHeroText(subject: Subject): string {
  return (
    `${subject.displayName}.\n\n` +
    `${subject.roleLine}\n\n` +
    subject.openingCopy
  );
}

/** One Project blob in the existing canvas card style. */
export function formatProjectCanvas(project: Project): string {
  const header = `【${project.title}】 (${project.period}) · ${project.role}`;
  const body = project.highlights.map((h) => `• ${h}`).join('\n');
  return `${header}\n${body}`;
}

/** All Projects as parallel canvas strings (one card each). */
export function formatProjectsCanvas(projects: Project[]): string[] {
  return projects.map(formatProjectCanvas);
}

/** Awards + Credentials wall with labeled groups (single canvas string). */
export function formatAwardsCanvas(
  awards: Award[],
  credentials: Credential[]
): string {
  const awardLines = awards.map((a) => {
    if (a.result) {
      return `  • ${a.title} — [${a.result}]`;
    }
    return `  • ${a.title}`;
  });

  const credentialLines = credentials.map((c) => `  • ${c.title}`);

  return (
    '🏆 顶级荣誉墙 与 专业技能认证\n' +
    '--------------------------------------------------\n' +
    '🥇 赛事奖励：\n' +
    awardLines.join('\n') +
    '\n\n' +
    '📙 权威凭证：\n' +
    credentialLines.join('\n')
  );
}
