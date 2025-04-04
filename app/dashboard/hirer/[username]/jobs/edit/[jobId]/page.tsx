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
import { Usable, use } from "react";

import { Separator } from "@/components/ui/separator";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EditJob } from "./_components/edit-job";
import Link from "next/link";

interface Params {
  username: string;
  jobId: string;
}

interface JobProps {
  params: Promise<Params>;
}

const Edit = ({ params }: JobProps) => {
  const unWrappedParams = use(params);
  const jobId = unWrappedParams.jobId as Id<"jobs">;
  const deleteJob = useMutation(api.jobs.remove);
  const router = useRouter();

  const onDelete = () => {
    deleteJob({
      id: jobId,
    }).then(() => {
      toast.info("Job deleted!");
      router.push(`/dashboard/hirer/${unWrappedParams.username}/jobs`);
    });
  };

  return (
    <div className="w-full h-fit max-w-4xl mx-auto p-4 space-y-2 border-2 rounded-xl">
      <div className="flex items-center justify-between">
        <Button
          variant={"outline"}
          className="capitalize cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} color="black" />
        </Button>
        <div className="w-fit mx-auto text-2xl font-bold text-black leading-tight">
          Edit Job
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/hirer/${unWrappedParams.username}/jobs/applicants/${unWrappedParams.jobId}`}
          >
            <Button variant={"sec"} className="capitalize cursor-pointer">
              Applicants
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"outline"} className="capitalize cursor-pointer">
                <Trash2 color="red" size={20} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this job and all of it&apos;s related data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="cursor-pointer"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <Separator />
      <EditJob id={unWrappedParams.jobId} />
    </div>
  );
};

export default Edit;
