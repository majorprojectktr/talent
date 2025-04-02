"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Usable, use } from "react";

import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { JobListing } from "./_components/job-listing";

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

  const applications = useQuery(api.applications.get, {});
  const currentUser = useQuery(api.users.getCurrentUser);
  const submittedApplication = applications?.find(
    (application) => application.freelancerId === currentUser?._id
  );

  const router = useRouter();

  return (
    <div className="relative w-full h-fit max-w-2xl mx-auto p-4 space-y-2 border-2 rounded-xl">
      <div className="flex items-center justify-between">
        <Button
          variant={"outline"}
          className="capitalize cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} color="black" />
        </Button>

        <div className="w-fit mx-auto text-2xl font-bold text-black leading-tight">
          Job Details
        </div>

        {submittedApplication ? (
          <Button variant={"sec"} className="capitalize cursor-pointer">
            Applied
          </Button>
        ) : (
          <Link
            href={`/dashboard/freelancer/${unWrappedParams.username}/jobs/apply/${jobId}`}
          >
            <Button variant={"prime"} className="capitalize cursor-pointer">
              Apply
            </Button>
          </Link>
        )}
      </div>

      <Separator />

      <JobListing jobId={jobId} />
    </div>
  );
};

export default JobDetails;
