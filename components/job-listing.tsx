"use client";

import { Images } from "@/components/images";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { formatDateTime, formatNumberWithCommas } from "@/lib/utils";
import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";

interface JobListingProps {
  jobId: string;
}

export const JobListing = ({ jobId }: JobListingProps) => {
  const id = jobId as Id<"jobs">;
  const job = useQuery(api.jobs.getJobsById, { jobId: id });

  if (!job) return null;

  return (
    <div className="w-full h-fit p-4 space-y-4 p-4">
      <div className="w-full ">
        <Images images={job.images} title={job.title} allowDelete={false} />
      </div>
      <Badge variant={"outline"}>
                {`Created: ${formatDistanceToNow(job._creationTime, { addSuffix: true })}`}
              </Badge>
      <div className="flex flex-col gap-1">
        <Label className="w-fit text-base font-medium text-black leading-tight">
          Title
   
        </Label>
        <div className="w-fit text-sm font-normal text-black leading-tight">
          {job.title}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Label className="w-fit text-base font-medium text-black leading-tight">
          Description
        </Label>
        <div className="w-fit text-sm font-normal text-black leading-tight">
          {job.description}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="w-fit text-base font-medium text-black leading-tight">
          Budget
        </Label>
        <div className="w-fit text-sm font-normal text-black leading-tight">
          {`$${formatNumberWithCommas(job.budget)}`}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="w-fit text-base font-medium text-black leading-tight">
          Skills
        </Label>
        <div className="w-fit text-sm font-normal text-black leading-tight">
          {job.requiredskills
            .map((skill) => skill.toLowerCase())
            // .map((skill) => skill.charAt(0).toUpperCase() + skill.slice(1))
            .join(", ")}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="w-fit text-base font-medium text-black leading-tight">
          Deadline
        </Label>
        <div className="w-fit text-sm font-normal text-black leading-tight">
          {formatDateTime(job.deadline).date}
        </div>
      </div>
    </div>
  );
};
