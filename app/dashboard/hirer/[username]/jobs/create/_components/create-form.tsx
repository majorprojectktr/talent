"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface CreateFormProps {
  username: string;
}

const CreateFormSchema = z.object({
  title: z
    .string()
    .min(20, {
      message: "Title must be at least 20 characters.",
    })
    .max(100, {
      message: "Title must not be longer than 100 characters.",
    }),
  description: z
    .string()
    .min(20, {
      message: "Description must be at least 20 characters.",
    })
    .max(20000, {
      message: "Description must not be longer than 20000 characters.",
    }),
  budget: z
    .number()
    .min(50, {
      message: "Budget must be at least 50.",
    })
    .max(10000, {
      message: "Budget must not be longer than 10000.",
    }),
  requiredskills: z.array(z.string()),
  deadline: z.date(),
});

type CreateFormValues = z.infer<typeof CreateFormSchema>;

// preview item values
const defaultValues: Partial<CreateFormValues> = {
  title: "",
  description: "",
  budget: 0,
  requiredskills: [],
};

export const CreateForm = ({ username }: CreateFormProps) => {
  const { mutate, pending } = useApiMutation(api.jobs.create);

  const { push } = useRouter();
  const form = useForm<CreateFormValues>({
    resolver: zodResolver(CreateFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: CreateFormValues) {
    if (pending) return;
    try {
      const jobId = await mutate({
        title: data.title,
        description: data.description,
        budget: data.budget,
        requiredSkills: data.requiredskills.map((skill) => skill.trim()),
        deadline: data.deadline.toISOString(),
      });

      if (jobId) {
        toast.success(`Job created successfully!`);
        form.reset();
        push(`/dashboard/hirer/${username}/jobs`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create job");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-fit p-4 space-y-8 py-8 px-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Mobile App UI Design" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Designing user interfaces for a healthcare app"
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
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget</FormLabel>
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
        <FormField
          control={form.control}
          name="requiredskills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Skills</FormLabel>
              <FormControl>
                <Input
                  placeholder="Photoshop, Illustrator, Figma - use , to separate skills"
                  {...field}
                  type="text"
                  value={field.value?.join(", ") || ""}
                  onChange={(e) => field.onChange(e.target.value.split(","))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Skills</FormLabel>
              <FormControl>
                <Calendar
                  mode="single"
                  selected={field.value || new Date()}
                  onSelect={field.onChange}
                  className="w-fit rounded-md border"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={pending}
          variant="prime"
          className="w-full"
        >
          Create
        </Button>
      </form>
    </Form>
  );
};
