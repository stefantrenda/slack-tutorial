import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { WorkspaceHeader } from "./workspace-heder";
import { HashIcon, MessageSquareText, SendHorizontalIcon } from "lucide-react";
import { SidebarItem } from "./sidebar-items";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { WorkspaceSection } from "./workspace-section";

const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });

  return (
    <div className="flex flex-col bg-[#5E25F] h-full">
      {workspace && (
        <>
          <WorkspaceHeader
            workspace={workspace}
            isAdmin={member?.role === "admin"}
          />
          <div className="flex flex-col px-2 mt-3">
            <SidebarItem
              label="Threads"
              icon={MessageSquareText}
              id="threads"
            />
            <SidebarItem
              label="Drafts & Sent"
              icon={SendHorizontalIcon}
              id="drafts"
            />
          </div>

            <WorkspaceSection
              label="Channels"
              hint="New channel"
              onNew={() => {}}
            >
              {channels?.map((item) => (
                <SidebarItem
                  key={item._id}
                  icon={HashIcon}
                  label={item.name}
                  id={item._id}
                />
              ))}
            </WorkspaceSection>
        </>
      )}
    </div>
  );
};

export default WorkspaceSidebar;
