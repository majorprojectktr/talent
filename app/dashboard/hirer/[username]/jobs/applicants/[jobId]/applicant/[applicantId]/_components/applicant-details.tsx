"use client";

import { DocumentViewer } from "@/components/document-viewer";
import { Label } from "@/components/ui/label";
import { formatNumberWithCommas } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface ListingProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export const ApplicantDetails = ({ data }: ListingProps) => {
  if (!data) return null;

  return (
    <div className="w-full h-fit p-4 space-y-4 p-4">
      {/* <div className="w-full ">
        <Images images={job.images} title={job.title} allowDelete={false} />
      </div> */}
      <div className="flex flex-col gap-1">
        <Label className="w-fit text-base font-medium text-black leading-tight">
          Name
        </Label>
        <div className="w-fit text-sm font-normal text-black leading-tight">
          {data.user.fullname}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Label className="w-fit text-base font-medium text-black leading-tight">
          Role
        </Label>
        <div className="w-fit text-sm font-normal text-black leading-tight">
          {data.user.role}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="w-fit text-base font-medium text-black leading-tight">
          Proposed Rate
        </Label>
        <div className="w-fit text-sm font-normal text-black leading-tight">
          {`$${formatNumberWithCommas(data.proposedRate)}`}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="w-fit text-base font-medium text-black leading-tight">
          Cover Letter
        </Label>
        <div className="w-fit text-sm font-normal text-black leading-tight">
          {data?.coverLetter}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="w-fit text-base font-medium text-black leading-tight">
          Submitted
        </Label>
        <div className="w-fit text-sm font-normal text-black leading-tight">
          {formatDistanceToNow(data._creationTime, { addSuffix: true })}
        </div>
      </div>
      <div className="flex flex-col gap-2 overflow-x-auto">
        <Label className="w-fit text-base font-medium text-black leading-tight">
          Resume
        </Label>
        <DocumentViewer file={data.applicationMedia.url} />
      </div>
    </div>
  );
};
