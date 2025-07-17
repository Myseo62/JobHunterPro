export interface SearchFilters {
  query?: string;
  location?: string;
  experience?: string;
  salaryMin?: number;
  salaryMax?: number;
  companyType?: string;
  skills?: string[];
}

export interface JobCardProps {
  job: any;
  onApply: (jobId: number) => void;
  hasApplied?: boolean;
}

export interface CompanyCardProps {
  company: any;
}

export interface AuthContextType {
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
}
