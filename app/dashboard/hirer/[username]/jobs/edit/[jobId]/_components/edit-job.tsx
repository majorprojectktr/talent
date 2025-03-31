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
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

interface EditJobProps {
  id: string;
}

export const EditJob = ({ id }: EditJobProps) => {
  const jobId = id as Id<"jobs">;
  const job = useQuery(api.jobs.getJobsById, {
    jobId,
  });
  const updateJob = useMutation(api.jobs.update);
  const deleteJob = useMutation(api.jobs.remove);
  const currentUser = useQuery(api.users.getCurrentUser);

  const [data, setData] = useState<Doc<"jobs"> | undefined | null>(job);

  const { push } = useRouter();

  const onInput = useDebouncedCallback(
    (value: string | string[] | number, field: string) => {
      updateJob({
        id: jobId,
        field,
        value,
      }).then(() => {
        toast.info(
          `${field.charAt(0).toUpperCase() + field.slice(1)} updated!`
        );
      });
    },
    1000
  );

  const onDelete = () => {
    deleteJob({
      id: jobId,
    }).then(() => {
      toast.info("Job deleted!");
      push(`/dashboard/hirer`);
    });
  };

  useEffect(() => {
    if (job && data === undefined) {
      setData(job);
    }
  }, [job]);

  if (!job || !data || !currentUser) return <div>Loading...</div>;

  return (
    <div className="relative w-full h-fit max-w-2xl mx-auto p-4 space-y-2 border-2 rounded-xl">
      <Link href={`/dashboard/hirer/${currentUser.username}/jobs`}>
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
      <div className="w-full h-fit p-4 space-y-6 py-8 px-4">
        <div className="flex flex-col space-y-2">
          <Label className="w-fit">Title</Label>
          <Input
            placeholder="title"
            value={data.title}
            onChange={(e) => {
              setData({ ...data, title: e.target.value });
              onInput(e.target.value, "title");
            }}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Label className="w-fit">Description</Label>
          <Textarea
            placeholder="description"
            value={data.description}
            onChange={(e) => {
              setData({ ...data, description: e.target.value });
              onInput(e.target.value, "description");
            }}
            rows={4}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Label className="w-fit">Budget</Label>
          <Input
            placeholder="budget"
            value={data.budget}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              setData({ ...data, budget: value });
              onInput(value, "budget");
            }}
            type="number"
            min="50"
            max="10000"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Label className="w-fit">Skills</Label>

          <Input
            placeholder="required skills"
            value={data.requiredskills.join(", ")}
            onChange={(e) => {
              const value = e.target.value
                .split(",")
                .map((skill) => skill.trim());
              setData({ ...data, requiredskills: value });
              onInput(value, "requiredskills");
            }}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Label className="w-fit">Deadline</Label>
          <Calendar
            mode="single"
            selected={new Date(data.deadline)}
            onSelect={(date) => {
              if (date) {
                onInput(date.toISOString(), "deadline");
                setData({ ...data, deadline: date.toISOString() });
              }
            }}
            className="w-fit rounded-md border"
          />
        </div>
      </div>
    </div>
  );
};
