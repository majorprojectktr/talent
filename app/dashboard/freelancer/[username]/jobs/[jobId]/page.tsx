"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Usable, use } from "react";

import { Id } from "@/convex/_generated/dataModel";
import { Listing } from "./_components/listing";

interface Params {
  username: string;
  jobId: string;
}

interface JobDetailsProps {
  params: Usable<Params>;
}

const JobDetails = ({ params }: JobDetailsProps) => {
  const unWrappedParams = use(params);
  const jobId = unWrappedParams.jobId as Id<"jobs">;

  return (
    <div className="relative w-full h-fit max-w-2xl mx-auto p-4 space-y-2 border-2 rounded-xl">
      <Link href={`/dashboard/freelancer/${unWrappedParams.username}/jobs`}>
        <Button
          variant={"outline"}
          className="capitalize absolute top-6 left-4 cursor-pointer"
        >
          <ArrowLeft size={20} color="black" />
        </Button>
      </Link>

      <div className="w-fit mx-auto text-2xl md:text-4xl font-bold text-black leading-tight">
        Job Details
      </div>

      <Link
        href={`/dashboard/freelancer/${unWrappedParams.username}/jobs/apply/${jobId}`}
      >
        <Button
          variant={"prime"}
          className="capitalize absolute top-6 right-4 cursor-pointer"
        >
          Apply
        </Button>
      </Link>

      <Listing jobId={jobId} />
    </div>
  );
};

export default JobDetails;
