import { JobOpening, JobApplication } from '../types/careers';
import { supabase } from '../lib/supabase';

export const FEATURED_JOB: JobOpening = {
  id: 'ea-ceo-bd-support',
  title: 'Executive Assistant to the CEO & Business Development Support',
  department: 'Executive Office / Business Development',
  location: 'Lagos, Nigeria (Ajah / Hybrid)',
  workplace_type: 'Hybrid',
  employment_type: 'Full-time',
  experience_level: '0–2 Years (Internships Count)',
  salary_range: 'Competitive + Performance Bonuses & Growth',
  reports_to: 'Chief Executive Officer (CEO)',
  posted_date: 'March 2026',
  status: 'open',
  summary:
    'Terrashare is looking for a proactive, high-ownership Executive Assistant & Business Development Associate. In this hybrid role, you will work closely with the CEO, managing executive logistics, prioritizing key communications, coordinating client & investor engagements, and driving business development initiatives as our platform scales.',
  responsibilities: [
    {
      category: 'Personal & Administrative Support',
      items: [
        "Manage the CEO's calendar, scheduling appointments, meetings, and travel arrangements",
        "Screen and prioritize calls, emails, and correspondence on the CEO's behalf",
        'Prepare briefing materials, agendas, and minutes for meetings',
        'Organize and maintain files, records, and confidential documents',
        "Handle expense tracking, invoicing, and basic budget administration for the CEO's office",
        'Run errands and coordinate logistics as needed',
        'Act as a liaison between the CEO and internal teams/external stakeholders',
      ],
    },
    {
      category: 'Business Development Support',
      items: [
        'Assist in preparing client-facing presentations, pitch decks, and proposal documents',
        'Coordinate and help schedule client meetings, site visits, and investor engagements',
        'Take notes during client/BD meetings and follow up on action items',
        'Support research on prospective clients, partners, and market opportunities',
        'Help maintain a CRM or contact log of leads, clients, and partners',
        'Assist with follow-up communications after meetings and events',
      ],
    },
  ],
  requirements: [
    "OND/HND/Bachelor's degree in Business Administration, Communications, or related field",
    '0–2 years\' experience in an administrative, PA, or business support role (internships count)',
    'Excellent written and verbal communication skills',
    'Strong organizational skills and attention to detail',
    'Proficiency in Microsoft Office / Google Workspace (Word, Excel, PowerPoint/Slides)',
    'Comfortable working with basic presentation and scheduling tools',
    'Discretion in handling confidential and sensitive information',
    'Professional demeanor suitable for client and investor-facing interactions',
    'Ability to multitask and work under a hybrid schedule with flexibility',
  ],
  nice_to_have: [
    'Prior exposure to real estate, fintech, or investment industries',
    'Familiarity with CRM tools',
    'Interest in business development or client relationship management as a career path',
  ],
  benefits: [
    'Direct mentorship from and exposure to executive-level operations',
    'Hands-on experience in business development within a growing real estate investment platform',
    'Hybrid work flexibility',
    'Opportunity for accelerated growth as Terrashare scales',
  ],
};

export const DIGITAL_MARKETING_INTERN_JOB: JobOpening = {
  id: 'digital-marketing-intern',
  title: 'Digital Marketing Intern',
  department: 'Growth & Marketing',
  location: 'Lagos, Nigeria (Hybrid)',
  workplace_type: 'Hybrid',
  employment_type: 'Internship',
  experience_level: 'Entry-level (Current student / Recent graduate)',
  salary_range: 'Stipend-paid (6 months duration)',
  reports_to: 'Growth Manager',
  posted_date: 'March 2026',
  status: 'open',
  summary:
    'Terrashare is looking for a creative and proactive Digital Marketing Intern to support our growth efforts across social media, email, and community channels. This is a hands-on opportunity to build real marketing experience within a fast-scaling real estate investment platform, working directly under the Growth Manager.',
  responsibilities: [
    {
      category: 'Social Media Management',
      items: [
        'Plan, create, and schedule content across Facebook, Instagram, and LinkedIn',
        'Monitor engagement, comments, and messages, responding or escalating where needed',
        'Track platform performance and suggest improvements based on insights',
      ],
    },
    {
      category: 'Email Marketing',
      items: [
        'Assist in building and sending email campaigns and newsletters',
        'Help maintain and segment subscriber/contact lists',
        'Track open rates, click-throughs, and campaign performance',
      ],
    },
    {
      category: 'Community Management',
      items: [
        'Engage with followers and prospective investors across social platforms',
        'Monitor brand mentions and community sentiment',
        'Support responses to inquiries and escalate as needed to the Growth Manager',
      ],
    },
  ],
  requirements: [
    'Currently studying or recently graduated (Marketing, Communications, Business, or related field)',
    'Strong written communication skills',
    'Genuine interest in and familiarity with social media platforms',
    'Basic sense of visual/content design',
    'Organized, proactive, and eager to learn',
    'Comfortable working in a hybrid, fast-paced environment',
  ],
  nice_to_have: [
    'Prior experience running a personal or organizational social media page',
    'Interest in real estate, fintech, or investment industries',
    'Basic experience with email marketing or content scheduling tools',
  ],
  benefits: [
    'Monthly stipend for the duration of the 6-month internship',
    'Direct mentorship from the Growth Manager',
    'Hands-on experience across social media, email, and community marketing',
    'Potential for growth as Terrashare scales',
  ],
};

export const JOB_OPENINGS: JobOpening[] = [
  FEATURED_JOB,
  DIGITAL_MARKETING_INTERN_JOB,
];

const STORAGE_KEY = 'terrashare_job_applications';

const INITIAL_DEMO_APPLICATIONS: JobApplication[] = [
  {
    id: 'TS-APP-2026-084',
    job_id: 'ea-ceo-bd-support',
    job_title: 'Executive Assistant to the CEO & Business Development Support',
    full_name: 'Chioma Adeyemi',
    email: 'chioma.adeyemi@example.com',
    phone: '+234 803 456 7890',
    location: 'Lekki Phase 1, Lagos',
    qualification: "Bachelor's Degree (Business Administration)",
    experience_years: '1 year',
    linkedin_url: 'https://linkedin.com/in/chioma-adeyemi',
    portfolio_url: '',
    resume_name: 'Chioma_Adeyemi_CV.pdf',
    resume_size: '142 KB',
    cover_note: 'Passionate about prop-tech and executive administration. I recently completed a 1-year rotational internship supporting an executive director in Victoria Island and would love to bring my organizational rigor and presentation skills to Terrashare.',
    availability: 'Immediate',
    industry_exposure: ['Real Estate', 'Fintech'],
    status: 'shortlisted',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    notes: 'Strong academic background and high energy. Scheduled for initial screening.',
  },
  {
    id: 'TS-APP-2026-103',
    job_id: 'digital-marketing-intern',
    job_title: 'Digital Marketing Intern',
    full_name: 'David Oluwaseun',
    email: 'david.oluwaseun@example.com',
    phone: '+234 814 555 1290',
    location: 'Yaba, Lagos',
    qualification: "Final Year Student / B.Sc Mass Comm",
    experience_years: '0–1 year',
    linkedin_url: 'https://linkedin.com/in/david-oluwaseun-growth',
    portfolio_url: 'https://instagram.com/creativesbydavid',
    resume_name: 'David_Oluwaseun_Resume.pdf',
    resume_size: '180 KB',
    cover_note: 'I manage social media channels for our campus entrepreneurship club and create carousel designs on Canva. Excited by Terrashare\'s fractional real estate model and eager to learn email copywriting and performance reporting under the Growth Manager.',
    availability: 'Immediate',
    industry_exposure: ['Social Media / Content Design', 'Fintech / Investments'],
    status: 'new',
    created_at: new Date(Date.now() - 86400000 * 0.5).toISOString(),
    notes: 'Great visual portfolio link and clear written communication.',
  },
  {
    id: 'TS-APP-2026-092',
    job_id: 'ea-ceo-bd-support',
    job_title: 'Executive Assistant to the CEO & Business Development Support',
    full_name: 'Tunde Bakare',
    email: 'tunde.b@example.com',
    phone: '+234 812 987 6543',
    location: 'Ajah, Lagos',
    qualification: 'HND (Mass Communication)',
    experience_years: '2 years',
    linkedin_url: 'https://linkedin.com/in/tunde-bakare',
    portfolio_url: '',
    resume_name: 'Tunde_Bakare_Resume.pdf',
    resume_size: '210 KB',
    cover_note: 'I reside 10 minutes away from Ikota Shopping Complex in Ajah. Experienced with pitch deck designs, meeting coordination, and managing executive schedules in fast-paced teams.',
    availability: '2 weeks notice',
    industry_exposure: ['Investment / Finance'],
    status: 'new',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    notes: 'Local to Ajah office. Great presentation deck portfolio.',
  }
];

export function getJobApplications(): JobApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_APPLICATIONS));
      return INITIAL_DEMO_APPLICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_DEMO_APPLICATIONS;
  } catch (err) {
    console.error('Error reading job applications:', err);
    return INITIAL_DEMO_APPLICATIONS;
  }
}

export async function submitJobApplication(
  data: Omit<JobApplication, 'id' | 'created_at' | 'status'>
): Promise<{ success: boolean; applicationId: string; error?: string }> {
  const applicationId = `TS-APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const newApplication: JobApplication = {
    ...data,
    id: applicationId,
    status: 'new',
    created_at: now,
  };

  try {
    // 1. Save to local storage
    const current = getJobApplications();
    const updated = [newApplication, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // 2. Dispatch event for live UI updates
    window.dispatchEvent(new CustomEvent('terrashare_application_submitted', { detail: newApplication }));

    // 3. Sync to Supabase `leads` table so it persists in the backend
    try {
      const messageBody = [
        `[JOB APPLICATION] Application ID: ${applicationId}`,
        `Role: ${data.job_title}`,
        `Candidate: ${data.full_name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        `Location: ${data.location}`,
        `Qualification: ${data.qualification}`,
        `Experience: ${data.experience_years}`,
        `Availability: ${data.availability}`,
        `Industry Exposure: ${(data.industry_exposure || []).join(', ') || 'None'}`,
        `LinkedIn: ${data.linkedin_url || 'N/A'}`,
        `Portfolio: ${data.portfolio_url || 'N/A'}`,
        `Resume: ${data.resume_name || data.resume_url || 'Attached'}`,
        `\nCover Note / Pitch:\n${data.cover_note}`,
      ].join('\n');

      await supabase.from('leads').insert({
        name: data.full_name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        message: messageBody,
        status: 'new',
      } as any);
    } catch (dbErr) {
      console.warn('Supabase lead insert warning (local copy preserved):', dbErr);
    }

    return { success: true, applicationId };
  } catch (err: any) {
    console.error('Error submitting application:', err);
    return { success: false, applicationId, error: err?.message || 'Failed to submit application' };
  }
}

export function updateApplicationStatus(
  id: string,
  status: JobApplication['status'],
  notes?: string
): void {
  const list = getJobApplications();
  const updated = list.map(item => {
    if (item.id === id) {
      return {
        ...item,
        status,
        notes: notes !== undefined ? notes : item.notes,
      };
    }
    return item;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('terrashare_application_updated', { detail: { id, status } }));
}

export function deleteApplication(id: string): void {
  const list = getJobApplications();
  const filtered = list.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new CustomEvent('terrashare_application_deleted', { detail: { id } }));
}
