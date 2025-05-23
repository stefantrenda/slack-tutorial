import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizontalIcon,
} from 'lucide-react';

import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';

import { useMemberId } from '@/hooks/use-member-id';
import { useChannelId } from '@/hooks/use-channel-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import UserItem from './user-item';
import { SidebarItem } from './sidebar-items';
import { WorkspaceHeader } from './workspace-heder';
import { WorkspaceSection } from './workspace-section';

const WorkspaceSidebar = () => {
  const memberId = useMemberId();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels } = useGetChannels({
    workspaceId,
  });
  const { data: members } = useGetMembers({
    workspaceId,
  });

  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex flex-col bg-[#5e2c5f] h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col gap-y-2 bg-[#5e2c5f] h-full items-center justify-center text-white">
        <AlertTriangle className="size-5" />
        Workspace not found
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#5E25F] h-full">
      {workspace && (
        <>
          <WorkspaceHeader workspace={workspace} isAdmin={member?.role === 'admin'} />
          <div className="flex flex-col px-2 mt-3">
            <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
            <SidebarItem label="Drafts & Sent" icon={SendHorizontalIcon} id="drafts" />
          </div>

          <WorkspaceSection
            label="Channels"
            hint="New channel"
            onNew={member.role === 'admin' ? () => setOpen(true) : undefined}
          >
            {channels?.map((item) => (
              <SidebarItem
                key={item._id}
                icon={HashIcon}
                label={item.name}
                id={item._id}
                variant={channelId === item._id ? 'active' : 'default'}
              />
            ))}
          </WorkspaceSection>
          <WorkspaceSection label="Direct messages" hint="New direct message" onNew={() => {}}>
            {members?.map((item) => (
              <UserItem
                key={item._id}
                id={item._id}
                label={item.user.name}
                image={item.user.image}
                variant={memberId === item._id ? 'active' : 'default'}
              />
            ))}
          </WorkspaceSection>
        </>
      )}
    </div>
  );
};

export default WorkspaceSidebar;
