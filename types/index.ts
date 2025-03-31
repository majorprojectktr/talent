export interface Job {
  createdAt: number;
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  requiredSkills: string[];
  status: string;
  hirerId: string;
}

export interface Application {
  createdAt: number;
  id: string;
  jobId: string;
  freelancerId: string;
  coverLetter: string;
  proposedRate: number;
  status: string;
}

export type ApplicationWithJob = Application & Partial<Job>;
