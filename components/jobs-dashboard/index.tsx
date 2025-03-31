"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { handleNavigation } from "@/lib/utils";
import { useQuery } from "convex/react";
import { usePathname, useRouter } from "next/navigation";
import { JobsList } from "./jobs-list";

interface JobsDashboardProps {
  query: {
    search?: string;
    favorites?: string;
  };
}
export const JobsDashboard = ({ query }: JobsDashboardProps) => {
  const currentUser = useQuery(api.users.getCurrentUser);
  const { push } = useRouter();
  const pathname = usePathname();
  const redirectUrl = pathname.includes("freelancer")
    ? `/dashboard/freelancer/${currentUser?.username}/applications`
    : `/dashboard/hirer/${currentUser?.username}/jobs/create`;

  return (
    <div className="space-y-4">
      <div className="w-full h-fit flex items-center justify-between p-4">
        <h2 className="text-xl md:text-2xl font-semibold text-black leading-tight">
          Dashboard overview
        </h2>
        <Button
          variant={"prime"}
          onClick={() => handleNavigation(currentUser!, redirectUrl, push)}
        >
          {pathname.includes("freelancer") ? "My Applications" : "Create Job"}
        </Button>
      </div>
      <JobsList query={query} />
    </div>
  );
};
