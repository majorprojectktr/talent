"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Usable, use } from "react";

import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { FreelancerProfile } from "./_components/freelancer-profile";


interface Params {
  username: string;
  freelancerId: string;
}

interface JobDetailsProps {
  params: Promise<Params>;
}

const ProfessionalProfile = ({ params }: JobDetailsProps) => {
  const unWrappedParams = use(params);
  const currentUser = useQuery(api.users.getCurrentUser);

  const router = useRouter();

  if (!currentUser) return null;

  return (
    <div className="relative w-full h-fit max-w-4xl mx-auto p-4 space-y-2 border-2 rounded-xl">
      <div className="flex items-center justify-between">
        <Button
          variant={"outline"}
          className="capitalize cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} color="black" />
        </Button>

        <div className="w-fit mx-auto text-2xl font-bold text-black leading-tight">
          Freelancer Profile
        </div>

        <Button variant={"prime"} className="capitalize cursor-pointer">
          Portfolio
        </Button>
      </div>

      <Separator />

      <FreelancerProfile freelancerId={unWrappedParams.freelancerId} />
    </div>
  );
};

export default ProfessionalProfile;
