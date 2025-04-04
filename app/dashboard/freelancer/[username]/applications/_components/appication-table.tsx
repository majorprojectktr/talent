"use client";
import { useMemo } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export function ApplicationTable() {
  const applications = useQuery(api.applications.get, {});
  const items = useMemo(
    () =>
      applications
        ?.map((application) => {
          if (!application.job) return null;
          return {
            id: application._id,
            createdAt: application._creationTime,
            jobId: application.jobId,
            freelancerId: application.freelancerId,
            proposal: application.proposal,
            proposedRate: application.proposedRate,
            status: application.status,
            title: application.job.title,
            description: application.job.description,
            budget: application.job.budget,
            deadline: application.job.deadline,
          };
        })
        .filter(Boolean) ?? [],
    [applications]
  );

  return (
    <Table>
      <TableCaption>A list of your recent applications.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Budget</TableHead>
          <TableHead>Proposed Rate</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item?.title}>
            <TableCell>{item?.title}</TableCell>
            <TableCell>{item?.budget}</TableCell>
            <TableCell>{item?.proposedRate}</TableCell>
            <TableCell
              className={`${item?.status === "accepted" ? "text-[#27548A]" : item?.status === "rejected" ? "text-[#F16767]" : item?.status === "pending" ? "text-[#D3CA79]" : "text-[#5F8B4C]"}`}
            >
              {item?.status}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
