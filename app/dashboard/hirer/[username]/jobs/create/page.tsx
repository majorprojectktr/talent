"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Usable, use } from "react";
import { CreateForm } from "./_components/create-form";

type Params = {
  username: string;
};

interface CreateJobProps {
  params: Usable<Params>;
}

const CreateJob = ({ params }: CreateJobProps) => {
  const unWrappedParams = use(params);

  return (
    <div className="relative w-full h-fit max-w-2xl mx-auto p-4 space-y-2 border-2 rounded-xl">
      <Link href={`/dashboard/hirer/${unWrappedParams.username}/jobs`}>
        <Button
          variant={"outline"}
          className="capitalize absolute top-6 left-4 cursor-pointer"
        >
          <ArrowLeft size={20} color="black" />
        </Button>
      </Link>
      <div className="w-fit mx-auto text-2xl md:text-4xl font-bold text-black leading-tight">
        Create Job
      </div>
      <CreateForm username={unWrappedParams.username} />
    </div>
  );
};

export default CreateJob;
