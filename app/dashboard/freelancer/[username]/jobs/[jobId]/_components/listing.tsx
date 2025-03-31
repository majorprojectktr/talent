"use client";

import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { formatDateTime, formatNumberWithCommas } from "@/lib/utils";
import { useQuery } from "convex/react";

interface ListingProps {
  jobId: string;
}

export const Listing = ({ jobId }: ListingProps) => {
  const id = jobId as Id<"jobs">;
  const job = useQuery(api.jobs.getJobsById, { jobId: id });

  if (!job) return null;

  return (
    <div className="w-full h-fit p-4 space-y-6 py-8 px-4">
      <div className="flex flex-col space-y-2">
        <Label className="w-fit">Title</Label>
        <div className="w-fit text-xl md:text-2xl font-bold text-black leading-tight">
          {job.title}
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Label className="w-fit">Description</Label>
        <div className="w-fit text-md font-normal text-black leading-tight">
          {job.description}
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Label className="w-fit">Budget</Label>
        <div className="w-fit text-md font-semibold text-black leading-tight">
          {formatNumberWithCommas(job.budget)}
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <Label className="w-fit">Skills</Label>
        <div className="w-fit text-sm font-normal text-black leading-tight">
          {job.requiredskills
            .map((skill) => skill.toLowerCase())
            .map((skill) => skill.charAt(0).toUpperCase() + skill.slice(1))
            .join(", ")}
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Label className="w-fit">Deadline</Label>
        <div className="w-fit text-2xl md:text-4xl font-bold text-black leading-tight">
          {formatDateTime(job.deadline).date}
        </div>
        <Calendar
          mode="single"
          selected={new Date(job.deadline)}
          className="w-fit rounded-md border"
        />
      </div>
    </div>
  );
};
