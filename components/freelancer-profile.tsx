"use client";

import { DocumentViewer } from "@/components/document-viewer";
import { TextareaCustom } from "@/components/textarea-custom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { truncateText } from "@/lib/utils";
import { useQuery } from "convex/react";
import { formatDate } from "date-fns";
import { ArrowRight, ChevronsRight, CircleChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "./ui/badge";

interface FreelancerProfileProps {
  freelancerId: string;
}

export const FreelancerProfile = ({ freelancerId }: FreelancerProfileProps) => {
  const userId = freelancerId as Id<"users">;
  const freelancer = useQuery(api.users.getUserById, {
    userId,
  });
  const reviews = useQuery(api.reviews.getByFreelancerId, {
    freelancerId: userId,
  });

  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const reviewsContainerRef = useRef<HTMLDivElement | null>(null);
  const [reviewIndex, setReviewIndex] = useState<number>(0);

  useEffect(() => {
    console.log(freelancer, "freelancer");
    console.log(reviews, "reviews");
  }, [freelancer, reviews]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => i + 1).map((star) => {
      return (
        <span
          key={star}
          className={`${
            rating >= star ? "text-yellow-400" : "text-gray-300"
          } text-sm`}
        >
          ★
        </span>
      );
    });
  };

  // Function to handle the 'next' click for cards
  const handleNextReviews = () => {
    if (reviewsContainerRef.current) {
      const container = reviewsContainerRef.current;
      const walletCardWidth = container.firstChild
        ? (container.firstChild as HTMLElement).offsetWidth + 12
        : 0;
      const totalWallets = reviews?.length || 0;

      const nextIndex = reviewIndex + 1;

      if (nextIndex >= totalWallets - 1) {
        container.scrollTo({ left: 0, behavior: "smooth" });
        setReviewIndex(0);
      } else {
        const targetScrollPosition = nextIndex * walletCardWidth;
        container.scrollTo({ left: targetScrollPosition, behavior: "smooth" });
        setReviewIndex(nextIndex);
      }
    }
  };

  if (!freelancer) return null;

  return (
    <div className="w-full h-fit p-4 space-y-4 p-4">
      <div className="space-y-4 md:flex gap-5 items-start justify-between">
        <div className="flex-shrink-0 space-y-2">
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
          <Badge variant="secondary">
            {`Joined: ${formatDate(freelancer._creationTime!, "dd/MM/yyyy")}`}
          </Badge>
        </div>
        <div className="w-full w-full flex-shrink-0 flex-1 grid grid-cols-1 space-y-2">
          <div className="w-full h-fit grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <div className="flex flex-col items-center justify-center h-fit border p-1 bg-[#C4D9FF]/20 rounded-sm">
              <span className="text-[12px] font-semibold text-[#344CB7]">
                Total Earnings
              </span>
              <span className="text-sm font-medium">$12450</span>
            </div>
            <div className="flex flex-col items-center justify-center h-fit border p-1 bg-[#C4D9FF]/20 rounded-sm">
              <span className="text-[12px] font-semibold text-[#344CB7]">
                This Month
              </span>
              <span className="text-sm font-medium">$450</span>
            </div>
            <div className="flex flex-col items-center justify-center h-fit border p-1 bg-[#C4D9FF]/20 rounded-sm">
              <span className="text-[12px] font-semibold text-[#344CB7]">
                Pending
              </span>
              <span className="text-sm font-medium">$670</span>
            </div>
            <div className="flex flex-col items-center justify-center h-fit border p-1 bg-[#C4D9FF]/20 rounded-sm">
              <span className="text-[12px] font-semibold text-[#344CB7]">
                Overall Rating
              </span>
              <span className="text-sm font-medium">5</span>
            </div>
            <div className="flex flex-col items-center justify-center h-fit border p-1 bg-[#C4D9FF]/20 rounded-sm">
              <span className="text-[12px] font-semibold text-[#344CB7]">
                Projects Completed
              </span>
              <span className="text-sm font-medium">2</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-normal text-md capitalize">Reviews</Label>
            <div className="relative w-full h-fit ">
              <div
                className="w-full h-fit flex gap-2 overflow-x-scroll no-scrollbar"
                ref={reviewsContainerRef}
              >
                {reviews?.map((review, index) => (
                  <div key={index} className="space-y-2 w-52">
                    <div className="flex items-start gap-x-2 bg-[#F1EFEC]/50 p-1 rounded-md">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={
                            review.author.profileImageUrl ||
                            "https://github.com/shadcn.png"
                          }
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="capitalize text-[10px] leading-tight">{`@${review.author.username}`}</div>
                        {renderStars(
                          (review.recommend_to_a_friend +
                            review.communication_level +
                            review.service_as_described) /
                            3
                        )}
                        <div className="text-[12px]">
                          {truncateText(review.comment, 40)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <CircleChevronRight
                onClick={handleNextReviews}
                size={30}
                className={`no-pointer-events absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer transition-all duration-300 ease-in-out ${
                  reviewIndex + 1 >=  (reviews ?? []).length - 1
                    ? "rotate-180"
                    : "rotate-0"
                }`}
                color="white"
                fill="#344CB7"
              />
            </div>
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
        <Badge
          className="cursor-pointer"
          variant={isResumeOpen ? "secondary" : "outline"}
          onClick={() => setIsResumeOpen(!isResumeOpen)}
        >
          {isResumeOpen ? "Hide" : "Show"}
        </Badge>
        {isResumeOpen && <DocumentViewer file={freelancer.resumeUrl} />}
      </div>
    </div>
  );
};
