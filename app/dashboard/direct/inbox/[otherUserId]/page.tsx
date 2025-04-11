"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { use, useEffect, useState } from "react";
import Body from "./_components/body";
import Form from "./_components/form";

interface Params {
  otherUserId: string;
}

interface FormProps {
  params: Promise<Params>;
}

const ConversationPage = ({ params }: FormProps) => {
  const unwrappedParams = use(params);
  const [conversation, setConversation] = useState<Doc<"conversations"> | null>(
    null
  );

  const get = useMutation(api.conversations.getOrCreateConversation);
  const conv = useQuery(api.conversations.getConversation, {
    userId: unwrappedParams.otherUserId,
  });
  useEffect(() => {
    const callMutation = async () => {
      try {
        const result = await get({ otherUserId: unwrappedParams.otherUserId });
        setConversation(result);
      } catch (error) {
        console.error("Mutation failed:", error);
      }
    };

    callMutation();
  }, [get, unwrappedParams.otherUserId]);

  if (conversation === null || conv === undefined || conv === undefined) {
    return (
      <div className="text-center text-black text-md font-semibold p-4 animation-pulse">
        Loading...
      </div>
    );
  }

  console.log(conversation);
  return (
    <div className="h-full flex flex-col">
      <Body messages={conv.messagesWithUsers} />
      <Form
        userId={conversation.currentUser._id}
        conversationId={conversation.conversation._id}
      />
    </div>
  );
};
export default ConversationPage;
