import { Doc } from "@/convex/_generated/dataModel";

export interface Job {
  createdAt: number;
  id: string;
  title: string;
  description?: string;
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
  proposal: string;
  proposedRate: number;
  status: string;
}

export interface Freelancer {
  createdAt: number;
  id: string;
  fullname: string;
  username: string;
  role: string;
  skills?: string[];
  email: string;
  profileImageUrl?: string;
  isActive?: boolean;
  profession?: string;
  experience?: string;
}

export type ApplicationWithJob = Application & Partial<Job>;

export type ImageWithUrlType = Doc<"jobMedia"> & {
  url: string
};