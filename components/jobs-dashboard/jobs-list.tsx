import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import JobCard from "./job-card";

interface JobsListProps {
  query: {
    search?: string;
    favorites?: string;
  };
}

export const JobsList = ({ query }: JobsListProps) => {
  const jobs = useQuery(api.jobs.get, {
    search: query.search,
    favorites: query.favorites,
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-8 pb-10 mx-10">
      {jobs?.map((job) => {
        return (
          <JobCard
            key={job._id}
            id={job._id}
            createdAt={job._creationTime}
            title={job.title}
            budget={job.budget}
            deadline={job.deadline}
            requiredSkills={job.requiredskills}
            status={job.status}
            hirerId={job.hirerId}
          />
        );
      })}
    </div>
  );
};
