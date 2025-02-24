"use client";

import { useRouter } from "next/navigation";
import { useMemo, useEffect } from "react";

import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

const WorkspaceIdPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModal();

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);

  useEffect(() => {
    if (!workspaceLoading || !workspace || channelsLoading) return;

    if (!channelId) {
      router.push(`/workspace/${workspaceId}/channels/${channelId}`);
    } else {
      
    }
  }, [channelId, workspace, workspaceLoading, channelsLoading]);

  return <div></div>;
};

export default WorkspaceIdPage;
