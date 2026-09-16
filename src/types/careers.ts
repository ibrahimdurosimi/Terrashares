export interface JobApplication {
  id: string;
  job_id: string;
  job_title: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  qualification: string;
  experience_years: string;
  linkedin_url?: string;
  portfolio_url?: string;
  resume_name?: string;
  resume_size?: string;
  resume_url?: string;
  cover_note: string;
  availability: string;
  industry_exposure?: string[];
  status: 'new' | 'reviewing' | 'shortlisted' | 'interview' | 'rejected' | 'hired';
  created_at: string;
  notes?: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  workplace_type: 'Hybrid' | 'On-site' | 'Remote';
  employment_type: 'Full-time' | 'Contract' | 'Internship';
  experience_level: string;
  salary_range?: string;
  posted_date: string;
  status: 'open' | 'closed';
  summary: string;
  responsibilities: {
    category: string;
    items: string[];
  }[];
  requirements: string[];
  nice_to_have: string[];
  benefits: string[];
}
