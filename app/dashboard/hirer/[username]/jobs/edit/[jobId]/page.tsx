"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { Usable, use } from "react";

import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EditJob } from "./_components/edit-job";

interface Params {
  username: string;
  jobId: string;
}

interface JobProps {
  params: Usable<Params>;
}

const Edit = ({ params }: JobProps) => {
  const unWrappedParams = use(params);
  const jobId = unWrappedParams.jobId as Id<"jobs">;
  const deleteJob = useMutation(api.jobs.remove);
  const { push } = useRouter();

  const onDelete = () => {
    deleteJob({
      id: jobId,
    }).then(() => {
      toast.info("Job deleted!");
      push(`/dashboard/hirer`);
    });
  };

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
        Edit Job
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant={"outline"}
            className="capitalize absolute top-6 right-4 cursor-pointer"
          >
            <Trash2 color="red" size={20} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              job.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="cursor-pointer">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditJob id={unWrappedParams.jobId} />
    </div>
  );
};

export default Edit;
