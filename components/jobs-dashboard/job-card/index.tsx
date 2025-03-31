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
import { formatDateTime } from "@/lib/utils";
import { Job } from "@/types";
import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { usePathname } from "next/navigation";


const JobCard = ({
  createdAt,
  id,
  title,
  description,
  budget,
  deadline,
  status,
}: Job) => {
  const createdAtLabel = formatDistanceToNow(createdAt, { addSuffix: true });
  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };
  const currentUser = useQuery(api.users.getCurrentUser);
  const pathname = usePathname()
  const redirectUrl = pathname.includes("freelancer" ) ? `/dashboard/freelancer/${currentUser?.username}/jobs/${id}` : `/dashboard/hirer/${currentUser?.username}/jobs/edit/${id}`;

  return (
    <Link href={redirectUrl}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{truncateText(description)}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Deadline:
            {formatDateTime(deadline).date}
          </p>
          <p>
            Budget:
            {budget}
          </p>
        </CardContent>
        <CardFooter>
          <div>Status: {status}</div>
          <div>Created At: {createdAtLabel}</div>
        </CardFooter>
      </Card>
    </Link>
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
