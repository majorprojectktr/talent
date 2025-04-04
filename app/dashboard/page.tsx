"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect } from "react";

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
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useRouter } from "next/navigation";
import AuthLoader from "@/components/auth-loader";

const Dashboard = () => {
  const roles = ["freelancer", "hirer"];
  const { push } = useRouter();
  const currentUser = useQuery(api.users.getCurrentUser);

  const { mutate, pending } = useApiMutation(api.users.store);

  const handleConfirm = async (role: string) => {
    if (currentUser?.role) return;
    await mutate({ role });
    if (role === "freelancer") {
      push(`/dashboard/freelancer/${currentUser?.username}/profile/edit`);
    } else if (role === "hirer") {
      push(`/dashboard/hirer/${currentUser?.username}/jobs/create`);
    }
  };

  //update username and profileImageUrl if user already exists
  useEffect(() => {
    const updateUser = async () => {
      await mutate({});
    };
    updateUser();
  }, []);

  //useEffects
  useEffect(() => {
    if (!currentUser) return;
    push(`dashboard/${currentUser.role}/${currentUser.username}/jobs`);
  }, [currentUser, push]);

  if (currentUser) return <AuthLoader />;

  return (
    <div className="w-full h-96 flex flex-col justify-center items-center gap-y-4">
      <h2 className="text-2xl md:text-4xl font-bold text-black leading-tight">
        Please select a role
      </h2>
      <div className="space-x-4">
        {roles.map((role, index) => (
          <AlertDialog key={index}>
            <AlertDialogTrigger asChild>
              <Button
                variant={pending ? "ghost" : "outline"}
                className="capitalize cursor-pointer"
                disabled={pending}
              >
                {role}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently set your
                  role to {role}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleConfirm(role)}
                  className="cursor-pointer"
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
