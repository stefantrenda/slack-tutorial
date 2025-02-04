import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { WorkspaceHeader } from "./workspace-heder";

const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  return (
    <div className="flex flex-col bg-[#5E25F] h-full">
      {workspace && (
        <WorkspaceHeader
          workspace={workspace}
          isAdmin={member?.role === "admin"}
        />
      )}
    </div>
  );
};

export default WorkspaceSidebar;
