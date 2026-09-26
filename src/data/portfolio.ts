export interface ProofItem {
  id: string;
  name: string;
  url?: string;
}

export interface StackItem {
  n: string;
  key: number;
  p: string[];
}

export interface RoleItem {
  year: string;
  role: string;
  org: string;
  tag: string;
  detail: string;
}

export const PROOF: ProofItem[] = [
  { id: 'codequest',   name: 'CodeQuest',          url: 'https://github.com/Randevough/CodeQuest' },
  { id: 'aksaranetra', name: 'AksaraNetra',        url: 'https://aksaranetra.vercel.app/' },
  { id: 'ukm',         name: 'UKM Coding',         url: 'https://ukmcoding.site/' },
  { id: 'budayatutur', name: 'Budaya Tutur',       url: 'https://budayatutur.id/' },
  { id: 'songunlocked',name: 'SongUnlocked',       url: 'https://github.com/Randevough/SongUnlocked-2.0' },
  { id: 'andalasia',   name: 'Andalasia Creative', url: 'https://andalasiagroup.com/' },
  { id: 'robonetra',   name: 'Robonetra',          url: 'https://github.com/Randevough/Robonetra' },
  { id: 'jakartahitz', name: 'JakartaHitz',        url: 'https://jakartahitz.com/' },
  { id: 'pushansiber', name: 'PUSHANSIBER' }
];

export const STACK: StackItem[] = [
  { n: 'TypeScript',   key: 1, p: ['codequest', 'aksaranetra', 'ukm', 'songunlocked'] },
  { n: 'React',        key: 1, p: ['codequest', 'ukm', 'andalasia', 'songunlocked'] },
  { n: 'Next.js',      key: 1, p: ['codequest', 'aksaranetra'] },
  { n: 'Astro',        key: 1, p: ['ukm'] },
  { n: 'Tailwind CSS', key: 1, p: ['codequest', 'andalasia', 'ukm', 'budayatutur'] },
  { n: 'Laravel',      key: 1, p: ['budayatutur'] },
  { n: 'PostgreSQL',   key: 1, p: ['codequest'] },
  { n: 'Prisma',       key: 1, p: ['codequest'] },
  { n: 'Node.js',      key: 0, p: ['codequest', 'aksaranetra'] },
  { n: 'PHP',          key: 0, p: ['budayatutur', 'jakartahitz'] },
  { n: 'MySQL',        key: 0, p: ['budayatutur', 'jakartahitz'] },
  { n: 'Vite',         key: 0, p: ['andalasia', 'budayatutur'] },
  { n: 'Supabase',     key: 0, p: ['codequest'] },
  { n: 'REST APIs',    key: 0, p: ['codequest', 'aksaranetra', 'budayatutur'] },
  { n: 'Headless CMS', key: 0, p: ['ukm'] },
  { n: 'WordPress',    key: 0, p: ['jakartahitz'] },
  { n: 'NextAuth',     key: 0, p: ['codequest'] },
  { n: 'Playwright',   key: 0, p: ['aksaranetra'] },
  { n: 'Git',          key: 0, p: ['codequest', 'aksaranetra', 'ukm', 'andalasia', 'budayatutur', 'songunlocked'] },
  { n: 'Arduino',      key: 0, p: ['robonetra'] },
  { n: 'C / C++',      key: 0, p: ['robonetra'] },
  { n: 'MikroTik',     key: 0, p: ['pushansiber'] },
  { n: 'Networking',   key: 0, p: ['pushansiber'] }
];

export const ROLES: RoleItem[] = [
  { year: '2025 - Present', role: 'Freelance Web Developer', org: 'Client Projects', tag: 'Current',
    detail: 'Build custom websites and web applications for business clients, including Andalasia Creative. Handle frontend layouts, CMS setup, and live deployments on production servers.' },
  { year: '2024 - Present', role: 'Community Lead & President', org: 'UKM Coding, Cyber University', tag: 'Leadership',
    detail: 'Lead a campus developer community of 60+ members after serving as Vice President in 2024. Plan workshop schedules, manage club project repositories, and guide students building web applications.' },
  { year: '2026', role: 'Web Developer Intern', org: 'JakartaHitz, MillenialNews Group', tag: 'Internship',
    detail: 'Maintain and build responsive templates for an active digital news portal. Work with WordPress CMS and optimize media assets to keep pages loading fast for mobile readers.' },
  { year: '2026', role: 'Frontend Instructor', org: 'UKM Coding', tag: 'Teaching',
    detail: 'Taught a practical web development course for 30 university students under UKM Coding (NGOEPI initiative). Guided participants through HTML, CSS, and JavaScript basics up to deploying their first live websites.' },
  { year: '2025', role: 'International Project Lead', org: 'Cyber University', tag: 'Management',
    detail: 'Led the organizing committee for DECOMPE 4.0, an online UI/UX design competition and bootcamp between Indonesia and Malaysia. Coordinated cross-team execution, live workshop sessions, and participant communications.' },
  { year: '2023', role: 'Network Engineer Intern', org: 'PUSHANSIBER, Kemhan RI', tag: 'Infrastructure',
    detail: 'Assisted network operations: configured MikroTik routers and switches, monitored office network traffic, and troubleshot hardware connectivity in defense facilities.' }
];
