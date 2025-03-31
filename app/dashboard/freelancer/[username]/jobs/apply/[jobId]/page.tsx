import React, { Usable, use } from "react";
import { ApplyForm } from "./_components/apply-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Params = {
  username: string;
  jobId: string;
};

interface ApplyJobProps {
  params: Usable<Params>;
}

const ApplyJob = ({ params }: ApplyJobProps) => {
  const unWrappedParams = use(params);

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
        Apply for Job
      </div>
      <ApplyForm username={unWrappedParams.username} jobId={unWrappedParams.jobId}/>
    </div>
  );
};

export default ApplyJob;
