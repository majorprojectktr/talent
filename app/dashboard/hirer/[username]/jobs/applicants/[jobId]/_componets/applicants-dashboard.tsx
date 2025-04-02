"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { truncateText } from "@/lib/utils";
import { Application } from "@/types";
import { useQuery } from "convex/react";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo } from "react";

interface ApplicantsDashboardProps {
  username: string;
  jobId: string;
}

interface FullApplication extends Application {
  _id: Id<"applications">;
  _creationTime: number;
  applicationMedia?: {
    url: string;
    // Add other applicationMedia properties here
  } | null;
  applicant?: {
    fullname: string;
    _id: Id<"users">;
    // Add other applicant properties here
  } | null;
}

export const ApplicantsDashboard = ({ jobId, username }: ApplicantsDashboardProps) => {
  const id = jobId as Id<"jobs">;
  const applications = useQuery(api.applications.getApplicationsByJobId, {
    jobId: id,
  }) as FullApplication[] | undefined;

  const items = useMemo(
    () =>
      applications
        ?.map((application) => {
          if (!application.applicant || !application.applicationMedia)
            return null;
          return {
            id: application._id,
            proposedRate: application.proposedRate,
            status: application.status,
            coverLetter: application.coverLetter,
            applicant: application.applicant.fullname,
            applicantId: application.applicant._id,
            resumeUrl: application.applicationMedia.url,
            createdAt: application._creationTime,
          };
        })
        .filter(Boolean) ?? [],
    [applications]
  );

  useEffect(() => {
    console.log(applications, "✅");
  }, [applications]);

  return (
    <Table>
      <TableCaption>A list of job applicants.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Applicant</TableHead>
          <TableHead>Proposed Rate</TableHead>
          <TableHead>Cover Letter</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, index) => (
          <TableRow key={item?.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{item?.applicant}</TableCell>
            <TableCell>{item?.proposedRate}</TableCell>
            <TableCell>{truncateText(item?.coverLetter as string)}</TableCell>
            <TableCell
              className={`${item?.status === "accepted" ? "text-[#27548A]" : item?.status === "rejected" ? "text-[#F16767]" : item?.status === "pending" ? "text-[#D3CA79]" : "text-[#5F8B4C]"}`}
            >
              {item?.status}
            </TableCell>
            <TableCell>
              <Link
                href={`/dashboard/hirer/${username}/jobs/applicants/${jobId}/applicant/${item?.applicantId}`}
              >
                <Badge variant="outline">View</Badge>
              </Link>
            </TableCell>
           
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
