"use client";

import { DocumentViewer } from "@/components/document-viewer";
import { TextareaCustom } from "@/components/textarea-custom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useEffect } from "react";

interface FreelancerProfileProps {
  freelancerId: string;
}

export const FreelancerProfile = ({ freelancerId }: FreelancerProfileProps) => {
  const userId = freelancerId as Id<"users">;
  const freelancer = useQuery(api.users.getUserById, {
    userId,
  });

  useEffect(() => {
    console.log(freelancer, "✅");
  }, [freelancer]);

  if (!freelancer) return null;

  return (
    <div className="w-full h-fit p-4 space-y-4 p-4">
      <div className="space-y-2">
        <Label className="font-normal text-lg capitalize">
          {freelancer.profession}
        </Label>
        <div className="flex items-center gap-x-2">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src={
                freelancer.profileImageUrl || "https://github.com/shadcn.png"
              }
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-x-1">
              <div className="capitalize text-md">{freelancer.fullname}</div>

              <span className="relative flex size-2">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full  bg-[#5CB338]/80 opacity-75`}
                ></span>
                <span
                  className={`relative inline-flex size-2 rounded-full bg-[#5CB338]`}
                ></span>
              </span>
            </div>
            <div className="capitalize text-sm leading-tight">{`@${freelancer.username}`}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="w-fit text-base font-medium text-black leading-tight">
          Skills
        </Label>
        <div className="flex flex-wrap items-center justify-start gap-2">
          {freelancer.skills &&
            freelancer.skills.map((skill, index) => (
              <div
                key={index}
                className="bg-[#5DB996]/30 px-2 py-1 rounded-sm text-sm text-[#09122C] leading-tight space-x-1"
              >
                <span className="font-medium"> {skill}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="w-fit text-base font-medium text-black leading-tight">
          Experience
        </Label>
        <TextareaCustom
          value={freelancer.experience}
          disabled
          className="w-fit text-base font-medium text-black leading-tight cursor-default max-h-fit"
        />
      </div>

      <div className="flex flex-col gap-2 overflow-x-auto">
        <Label className="w-fit text-base font-medium text-black leading-tight">
          Resume
        </Label>
        <DocumentViewer file={freelancer.resumeUrl} />
      </div>
    </div>
  );
};
