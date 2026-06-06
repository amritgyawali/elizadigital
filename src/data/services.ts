export type ServiceKey =
  | 'marketing'
  | 'content'
  | 'video'
  | 'websites'
  | 'software'
  | 'branding';

export interface Service {
  id: ServiceKey;
  index: number;
  title: string;
  tagline: string;
  description: string;
  accent: string;
  accentHex: string;
  bullets: string[];
}

export const SERVICES: Service[] = [
  {
    id: 'marketing',
    index: 0,
    title: 'Digital Marketing',
    tagline: 'Performance campaigns that turn attention into revenue.',
    description:
      'We run data-driven paid media, SEO, and growth loops that compound. Every dollar is tracked, every decision is deliberate.',
    accent: 'indigo',
    accentHex: '#7C5CFF',
    bullets: ['Paid Media & SEM', 'SEO & Content Strategy', 'CRO & Analytics', 'Growth Loops'],
  },
  {
    id: 'content',
    index: 1,
    title: 'Content Creation',
    tagline: 'Scroll-stopping content, produced at scale.',
    description:
      'From brand storytelling to social calendars, we write, design, and produce content that earns attention instead of buying it.',
    accent: 'cyan',
    accentHex: '#22D3EE',
    bullets: ['Copywriting & Blogging', 'Social Media Content', 'Email Campaigns', 'Brand Storytelling'],
  },
  {
    id: 'video',
    index: 2,
    title: 'Video Ads',
    tagline: 'Ads engineered to be watched, shared, and remembered.',
    description:
      'Concept to cut, we produce short-form and long-form video that performs on every platform. Creative with data baked in.',
    accent: 'pink',
    accentHex: '#FF4D8D',
    bullets: ['Concept & Scripting', 'Production & Editing', 'Motion Graphics', 'Platform Optimization'],
  },
  {
    id: 'websites',
    index: 3,
    title: 'Websites',
    tagline: 'Fast, beautiful, conversion-built websites.',
    description:
      'We design and engineer web experiences that convert. From landing pages to full e-commerce platforms, built to last.',
    accent: 'teal',
    accentHex: '#2DD4BF',
    bullets: ['Design Systems', 'Next.js / React', 'E-commerce', 'CMS Integration'],
  },
  {
    id: 'software',
    index: 4,
    title: 'Software',
    tagline: 'Custom platforms and tools that scale with you.',
    description:
      'When off-the-shelf fails, we build. APIs, SaaS platforms, internal tools, and data systems, engineered for scale from day one.',
    accent: 'amber',
    accentHex: '#F5A524',
    bullets: ['SaaS Platforms', 'API Development', 'Internal Tools', 'Data Systems'],
  },
  {
    id: 'branding',
    index: 5,
    title: 'Branding',
    tagline: 'Identities that look inevitable.',
    description:
      'Strategy-first brand work. We dig into who you are, who you serve, and what you stand for, then build the visual system that makes it undeniable.',
    accent: 'violet',
    accentHex: '#7C5CFF',
    bullets: ['Brand Strategy', 'Visual Identity', 'Logo & Mark', 'Brand Guidelines'],
  },
];

export const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Discover',
    description: 'We start by understanding your business, audience, and ambitions. Deep research, honest conversations.',
  },
  {
    number: '02',
    title: 'Design',
    description: 'Strategy becomes systems. We design solutions that solve real problems with craft and intention.',
  },
  {
    number: '03',
    title: 'Build',
    description: 'Execution with precision. We ship fast, iterate faster, and never cut corners on quality.',
  },
  {
    number: '04',
    title: 'Scale',
    description: 'We measure what matters, learn from data, and double down on what is working.',
  },
];

export const TESTIMONIALS = [
  {
    quote: 'Eliza Digital transformed our online presence. Revenue from digital channels tripled in six months.',
    author: 'Sarah Chen',
    role: 'CEO, NovaTech',
  },
  {
    quote: 'The branding work they did for us did not just look incredible. It changed how our customers see us.',
    author: 'Marcus Reid',
    role: 'Founder, Luma Goods',
  },
  {
    quote: 'Best investment we have made. Our site now converts at 4x the industry average. Remarkable team.',
    author: 'Priya Nair',
    role: 'CMO, FlowState App',
  },
];

export const STATS = [
  { value: 200, suffix: '+', label: 'Clients Served' },
  { value: 4.2, suffix: 'x', label: 'Avg. ROAS Delivered', decimals: 1 },
  { value: 98, suffix: '%', label: 'Client Retention Rate' },
  { value: 12, suffix: 'M+', label: 'Impressions Generated' },
];
