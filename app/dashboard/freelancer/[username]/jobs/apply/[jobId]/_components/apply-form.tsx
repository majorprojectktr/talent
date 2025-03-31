"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ApplyFormProps {
  username: string;
  jobId: string;
}

const ApplyFormSchema = z.object({
  coverLetter: z
    .string()
    .min(20, {
      message: "Cover letter must be at least 20 characters.",
    })
    .max(20000, {
      message: "Cover letter must not be longer than 20000 characters.",
    }),
  proposedRate: z
    .number()
    .min(50, {
      message: "Proposed Rate must be at least 50.",
    })
    .max(10000, {
      message: "Proposed Rate must not be longer than 10000.",
    }),
});

type ApplyFormValues = z.infer<typeof ApplyFormSchema>;

// preview item values
const defaultValues: Partial<ApplyFormValues> = {
  coverLetter: "",
  proposedRate: 0,
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
const ACCEPTED_FILE_TYPES = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
};

export const ApplyForm = ({ username, jobId }: ApplyFormProps) => {
  const { mutate, pending } = useApiMutation(api.applications.create);
  const currentUser = useQuery(api.users.getCurrentUser);
  const { push } = useRouter();
  const form = useForm<ApplyFormValues>({
    resolver: zodResolver(ApplyFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const generateUploadUrl = useMutation(api.applicationMedia.generateUploadUrl);

  const documentInput = useRef<HTMLInputElement>(null);
  const [document, setDocument] = useState<File>();
  const sendDocument = useMutation(api.applicationMedia.sendDocument);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(data: ApplyFormValues) {
    if (pending) return;
    if (!document) {
      toast.error("Please upload a document");
      return;
    }
    setIsLoading(true);
    try {
      const applicationId = await mutate({
        jobId,
        freelancerId: currentUser?._id,
        coverLetter: data.coverLetter,
        proposedRate: data.proposedRate,
      });

      if (applicationId) {
        // Step 1: Get a short-lived upload URL
        const postUrl = await generateUploadUrl();
        // Step 2: Upload the file to the URL
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": document.type },
          body: document,
        });

        const json = await result.json();

        if (!result.ok) {
          throw new Error(`Upload failed: ${JSON.stringify(json)}`);
        }
        const { storageId } = json;
        // Step 3: Save the newly allocated storage id to the database
        await sendDocument({
          storageId,
          format: "application/*",
          applicationId,
        });
        toast.success(`Application submitted successfully!`);
        setIsLoading(false);
        setDocument(undefined);
        documentInput.current!.value = ""; // Reset the file input value
        // Reset the form values
        form.reset();
        push(`/dashboard/freelancer/${username}/applications`);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error("Failed to appy for job");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full h-fit p-4 space-y-8 py-8 px-4"
      >
        <div className="space-y-2">
          <Label className="font-normal">Upload Resume</Label>

          <Input
            id="image"
            type="file"
            accept=".pdf,.doc,.docx"
            ref={documentInput}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;

              if (file.size > MAX_FILE_SIZE) {
                toast.error("File size must be less than 2MB");
                event.target.value = "";
                return;
              }

              if (!Object.keys(ACCEPTED_FILE_TYPES).includes(file.type)) {
                toast.error("File must be a PDF or Word document");
                event.target.value = "";
                return;
              }

              setDocument(file);
            }}
            className="cursor-pointer w-fit bg-zinc-100 text-zinc-700 border-zinc-300 hover:bg-zinc-200 hover:border-zinc-400 focus:border-zinc-400 focus:bg-zinc-200"
          />
          {/* <Button type="submit" disabled={!document} className="w-fit">
            Upload Resume
          </Button> */}
        </div>
        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Introduce yourself and explain why you are a good fit for this job"
                  {...field}
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="proposedRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proposed Rate </FormLabel>
              <FormControl>
                <Input
                  placeholder="50"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  type="number"
                  min="50"
                  max="10000"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading || pending}
          variant="prime"
          className="w-full"
        >
          Apply
        </Button>
      </form>
    </Form>
  );
};
