/** Domain types for the Portfolio Site Subject (see CONTEXT.md). */

export type FocusTagVariant = 'yellow' | 'pink' | 'cyan';

export type FocusTag = {
  label: string;
  variant: FocusTagVariant;
};

export type SkillPoint = {
  text: string;
};

export type SkillGroupVariant = 'a' | 'b' | 'c' | 'd';

export type SkillGroup = {
  title: string;
  variant: SkillGroupVariant;
  points: SkillPoint[];
};

export type Project = {
  title: string;
  period: string;
  role: string;
  highlights: string[];
};

export type Award = {
  title: string;
  result?: string;
};

export type Credential = {
  title: string;
};

export type Subject = {
  displayName: string;
  roleLine: string;
  openingCopy: string;
  focusTags: FocusTag[];
  skillGroups: SkillGroup[];
  projects: Project[];
  awards: Award[];
  credentials: Credential[];
};
