"use client";
import React, { Usable, use } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TransactionsTable } from "@/components/transactions-table";

interface Params {
  username: string;
  userId: string;
}

interface TransactionsProps {
  params: Promise<Params>;
}

const Transactions = ({ params }: TransactionsProps) => {
  const unWrappedParams = use(params);
  const router = useRouter();

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
          Transactions List
        </div>

        <Link
          href={`/dashboard/hirer/${unWrappedParams.username}/jobs`}
          className="capitalize cursor-pointer"
        >
          <Button variant={"prime"} className="capitalize cursor-pointer">
            Jobs
          </Button>
        </Link>
      </div>
      <Separator />
      <TransactionsTable />
    </div>
  );
};

export default Transactions;
