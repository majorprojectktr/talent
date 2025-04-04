import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Usable, use } from "react";
import { ApplicationTable } from "./_components/appication-table";

interface Params {
  username: string;
}

interface ApplicationsDashboardProps {
  params: Promise<Params>;
}

const ApplicationsDashboard = ({ params }: ApplicationsDashboardProps) => {
  const unWrappedParams = use(params);

  return (
    <div className="space-y-2 ">
      <div className="w-full h-fit flex items-center justify-between p-4">
        <h2 className="text-xl md:text-2xl font-semibold text-black leading-tight">
          Applied Jobs
        </h2>
        <Button variant={"prime"} asChild>
          <Link href={`/dashboard/freelancer/${unWrappedParams.username}/jobs`}>
            Find Jobs
          </Link>
        </Button>
      </div>
      <div className="w-full max-w-7xl mx-auto px-4">
        <ApplicationTable />
      </div>
    </div>
  );
};

export default ApplicationsDashboard;
