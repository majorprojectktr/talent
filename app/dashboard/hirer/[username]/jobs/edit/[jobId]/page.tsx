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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { Usable, use, useState } from "react";

import { Separator } from "@/components/ui/separator";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EditJob } from "./_components/edit-job";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { pingColors, statusColors } from "@/lib/constants";

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
  const job = useQuery(api.jobs.getJobsById, { jobId });
  const updateJob = useMutation(api.jobs.update);
  const deleteJob = useMutation(api.jobs.remove);
  const router = useRouter();

  const [status, setStatus] = useState<string>("completed");

  const handleStatusChange = (newValue: string) => {
    setStatus(newValue);
  };

  const onUpdate = () => {
    updateJob({
      id: jobId,
      field: "status",
      value: status,
    }).then(() => {
      toast.info("Job updated!");
    });
  };

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

          {(job?.status === "completed" || job?.status === "cancelled") && (
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
          )}

          {
            (job?.status === "open" || job?.status === "in_progress") && (
              <Dialog>
              <DialogTrigger asChild>
                <Button variant="prime">Update Status</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Update</DialogTitle>
                </DialogHeader>
                <Select onValueChange={handleStatusChange} value={status}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <DialogFooter>
                  {job?.status === "in_progress" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="capitalize cursor-pointer"
                        >
                          <Trash2 color="red" size={20} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this job and all of it&apos;s related data
                            from our servers.
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
                  )}
                  <Button variant={"prime"} onClick={onUpdate}>
                    Update
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            )
          }
        </div>
      </div>
      <Separator />
      <EditJob id={unWrappedParams.jobId} />
    </div>
  );
};

export default Edit;
