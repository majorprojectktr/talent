import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { formatDateTime, formatNumberWithCommas } from "@/lib/utils";
import { Job } from "@/types";
import { useQuery } from "convex/react";
import { formatDate } from "date-fns";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const statusColors: Record<string, string> = {
  open: "text-[#27548A]",
  cancelled: "text-[#F16767]",
  in_progress: "text-[#D3CA79]",
  completed: "text-[#5F8B4C]",
};

const pingColors: Record<string, string> = {
  open: "bg-[#27548A]",
  cancelled: "bg-[#F16767]",
  in_progress: "bg-[#D3CA79]",
  completed: "bg-[#5F8B4C]",
};

const JobCard = ({
  createdAt,
  id,
  title,
  budget,
  deadline,
  status,
  requiredskills,
  bookmarked,
}: Job) => {
  const currentUser = useQuery(api.users.getCurrentUser);
  const pathname = usePathname();
  const redirectUrl = pathname.includes("freelancer")
    ? `/dashboard/freelancer/${currentUser?.username}/jobs/${id}`
    : `/dashboard/hirer/${currentUser?.username}/jobs/edit/${id}`;

  const { mutate: addBookmark, pending: addBookmarkPending } = useApiMutation(
    api.jobs.addBookmark
  );

  const { mutate: removeBookmark, pending: removeBookmarkPending } =
    useApiMutation(api.jobs.removeBookmark);

  const toggleBookmark = async () => {
    if (bookmarked) {
      await removeBookmark({id});
    } else {
      await addBookmark({id});
    }
  };

  return (
    <Card className="overflow-hidden relative h-fit min-h-74 flex flex-col justify-between bg-[#F5F5F5]/10 shadow-md hover:translate-y-[-2px] hover:shadow-lg transition-all ease-in-out duration-200">
      <div className="absolute top-2 right-2">
        <Bookmark
          size={20}
          color="#344CB7"
          fill={bookmarked ? "#344CB7" : "none"}
          onClick={toggleBookmark}
          className="cursor-pointer"
        />
      </div>
      <CardHeader>
        <Link href={redirectUrl}>
          <CardTitle className="text-lg leading-tight">{title}</CardTitle>
        </Link>
        <CardDescription className="text-md leading-tight">
          <div className="flex flex-wrap items-center justify-start gap-1">
            {requiredskills.slice(0, 3).map((skill, index) => (
              <div
                key={index}
                className="bg-[#5DB996]/30 p-1 rounded-sm text-sm text-[#09122C] leading-tight space-x-1"
              >
                <span className="font-medium"> {skill}</span>
              </div>
            ))}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-[#344CB7] leading-tight space-x-1">
          <span className="font-medium"> Budget:</span>
          <span className="text-[#09122C]">{`$${formatNumberWithCommas(budget)}`}</span>
        </div>
        <div className="text-sm text-[#344CB7] leading-tight space-x-1">
          <span className="font-medium"> Created at:</span>
          <span className="text-[#09122C]">
            {formatDate(createdAt, "dd/MM/yyyy")}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-[#344CB7] leading-tight flex flex-col gap-x-1">
          <span className="font-medium"> Deadline:</span>
          <span className="text-[#09122C]">
            {formatDateTime(deadline).date}
          </span>
        </div>
        <div className="text-sm text-[#09122C] leading-tight flex items-center gap-x-1">
          <span className="relative flex size-3">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full  ${pingColors[status] || "bg-sky-400"} opacity-75`}
            ></span>
            <span
              className={`relative inline-flex size-3 rounded-full ${pingColors[status] || "bg-sky-500"} `}
            ></span>
          </span>
          <span
            className={`capitalize ${statusColors[status] || "text-black"}`}
          >
            {status === "in_progress" ? "In Progress" : status}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default JobCard;

JobCard.Skeleton = function JobCardSkeleton() {
  return (
    <div className="aspect-[130/100] rounded-lg overflow-hidden">
      <Skeleton className="h-full w-full" />
    </div>
  );
};
