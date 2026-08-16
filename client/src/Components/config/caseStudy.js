// config/caseStudyConfig.js
export const DISPLAY_CONFIG = {
  title: { label: 'Title', truncate: false },
  client: { label: 'Client', truncate: false },
  industry: { label: 'Industry', truncate: false },
  problem: { label: 'Problem', truncate: 80, showInCard: true },
  approach: { label: 'Approach', truncate: false, showInCard: false },
  solution: { label: 'Solution', truncate: false, showInCard: false },
  technologies: { label: 'Technologies', format: 'tags', showInCard: true },
};