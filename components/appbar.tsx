import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Parkinsans } from "next/font/google";
import Link from "next/link";
import { DepositFund } from "./deposit-fund";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

const parkinsans = Parkinsans({ subsets: ["latin"] });

const Appbar = () => {


  return (
    <>
      <nav className="flex justify-between items-center p-4 gap-4 h-12">
        <Link href="/">
          <Label
            title="Talent Freelance Marketplace"
            className={`${parkinsans.className} text-[#344CB7] text-xl md:text-2xl font-bold leading-tight transition-colors cursor-pointer`}
          >
            Talent
          </Label>
        </Link>

        <div className="flex items-center gap-4">
          <DepositFund/>
          <SignedOut>
            <Button variant="ghost" asChild>
              <SignInButton mode="modal" />
            </Button>
            <Button variant="default" asChild>
              <SignUpButton mode="modal" />
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
      <Separator />
    </>
  );
};

export default Appbar;
