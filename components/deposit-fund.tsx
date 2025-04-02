"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { formatNumberWithCommas } from "@/lib/utils";
import { useAction, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

export function DepositFund() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const pay = useAction(api.stripe.pay);
  const verifyPayment = useAction(api.stripe.verifyPayment);
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeposit = async () => {
    if (!currentUser || !amount) return;
    setIsLoading(true);
    try {
      const session = await pay({
        amount,
        path: pathname,
      });
      if (!session) throw new Error("Error: Stripe session error.");
      push(session.url);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error(error as string);
    }
    setIsLoading(true);
  };

  const handlePaymentVerification = useDebouncedCallback(
    async (sessionId: string) => {
      try {
        const result = await verifyPayment({ sessionId });
        if (result.success) {
          toast.success("Payment successful!");
          push(pathname);
        } else {
          toast.error("Payment was not successful!");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
      }
    },
    1000
  );

  useEffect(() => {
    const sessionId = searchParams.get("sessionId");
    if (sessionId) {
      handlePaymentVerification(sessionId);
    }
  }, [searchParams]);

  if (!currentUser) return null;

  return pathname.includes("freelance") ? (
    <Button variant="prime">
      <span className="text-sm font-normal ">
        Balance: {`$${formatNumberWithCommas(currentUser?.balance)}`}
      </span>
    </Button>
  ) : (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="prime">
          <span className="text-sm font-normal ">
            Balance: {`$${formatNumberWithCommas(currentUser?.balance)}`}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deposit</DialogTitle>
          <DialogDescription>
            Add funds to your wallet. You can deposit any amount you want.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mb-4">
          <Label htmlFor="name" className="text-right">
            Enter Amount
          </Label>
          <Input
            type="number"
            value={amount}
            className="col-span-3"
            onChange={(e) => setAmount(parseInt(e.target.value))}
          />
        </div>
        <DialogFooter>
          <Button
            variant={"prime"}
            onClick={handleDeposit}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="animate-spin" />}
            Pay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
