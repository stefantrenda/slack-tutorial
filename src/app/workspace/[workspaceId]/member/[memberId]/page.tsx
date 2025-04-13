"use client";
import { useEffect } from "react";
import { AlertTriangle, Loader } from "lucide-react";

import { useCreateOrGetConversations } from "@/features/conversations/api/use-create-or-get-conversation";

import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const MemberIdPage = () => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();

  const { data, mutate, isPending } = useCreateOrGetConversations();

  console.log("data", {data});
  

  useEffect(() => {
    mutate(
      {
        workspaceId,
        memberId,
      },
      {
        onSuccess: (data) => {
          console.log("data", data);
        },
        onError: (error) => {
          console.error("Error fetching conversations:", error);
        },
      }
    );
  }, [memberId, workspaceId, mutate]);

  if (isPending) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="h-full flex flex-col gap-y-2 items-center justify-center">
        <AlertTriangle className="size-6  text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Conversatiion not found </span>
      </div>
    );
  }

  return <div>{JSON.stringify({ data })}</div>;
};

export default MemberIdPage;
