import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ChevronDown, Loader, MailIcon, X } from 'lucide-react';

import { useConfirm } from '@/hooks/use-confirm';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';

import { useGetMember } from '../api/use-get-member';
import { useUpdateMember } from '../api/use-update-member';
import { useRemoveMember } from '../api/use-remove-member';
import { useCurrentMember } from '../api/use-current-member';

import { Id } from '../../../../convex/_generated/dataModel';

interface ProfileProps {
  memberId: Id<'members'>;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const [UpdateDialog, confirmUpdate] = useConfirm(
    'Change role',
    'Are you sure you want to change this member role?'
  );

  const [LeaveDialog, confirmLeave] = useConfirm(
    'Leave workspce',
    'Are you sure you want to leave the workspace?'
  );

  const [RemoveDialog, confirmRemove] = useConfirm(
    'Remove member',
    'Are you sure you want to remove this member?'
  );

  const { data: member, isLoading: isLoadingMember } = useGetMember({ id: memberId });
  const { data: currnetMemmber, isLoading: isLoadingCurrenetMember } = useCurrentMember({
    workspaceId,
  });

  const { mutate: updateMember, isPending: isUpdatingMember } = useUpdateMember();
  const { mutate: removeMember, isPending: isRemovingMember } = useRemoveMember();

  const onRemove = async () => {
    const ok = await confirmRemove();
    if (!ok) return;
    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success('Member removed successfully');
          onClose();
        },
        onError: () => {
          toast.error('Failed to remove member');
        },
      }
    );
  };

  const onLeave = async () => {
    const ok = await confirmLeave();

    if (!ok) return;

    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          router.replace('/');
          toast.success('You left the workspace successfully');
          onClose();
        },
        onError: () => {
          toast.error('Failed to leave the workspace');
        },
      }
    );
  };

  const onUpdate = async (role: 'admin' | 'member') => {
    const ok = await confirmUpdate();
    if (!ok) return;

    updateMember(
      { id: memberId, role },
      {
        onSuccess: () => {
          toast.success('Role updated successfully');
          onClose();
        },
        onError: () => {
          toast.error('Failed to update role');
        },
      }
    );
  };

  if (isLoadingMember || isLoadingCurrenetMember) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 border-b h-[49px]">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <X className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 border-b h-[49px]">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <X className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5  text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }

  const avatarFallbackText = member.user.name?.[0] ?? 'm';

  return (
    <>
      <UpdateDialog />
      <LeaveDialog />
      <RemoveDialog />
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 border-b h-[49px]">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <X className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col  items-center justify-center p-4">
          <Avatar className="max-w-[250px] max-h-[256px] size-full">
            <AvatarImage src={member?.user?.image} alt="Profile" />
            <AvatarFallback className="aspect-square text-6xl">{avatarFallbackText}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col p-4 ">
          <p className="text-xl font-bold">{member?.user?.name}</p>
          {currnetMemmber?.role === 'admin' && currnetMemmber?._id !== memberId ? (
            <div className="flex items-center gap-2 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full capitalize">
                    {member?.role} <ChevronDown className="size-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup
                    value={member?.role}
                    onValueChange={(role) => onUpdate(role as 'admin' | 'member')}
                  >
                    <DropdownMenuRadioItem
                      value="admin"
                      // onClick={() => onUpdate('admin')}
                      // disabled={isUpdatingMember}
                    >
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="member"
                      // onClick={() => onUpdate('member')}
                      // disabled={isUpdatingMember}
                    >
                      Member
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={onRemove} variant="outline" className="w-full">
                Remove
              </Button>
            </div>
          ) : currnetMemmber?._id === memberId && currnetMemmber?.role !== 'admin' ? (
            <div className="mt-4">
              <Button onClick={onLeave} variant="outline" className="w-full ">
                Leave
              </Button>
            </div>
          ) : null}
        </div>
        <Separator />
        <div className="flex flex-col p-4 ">
          <p className="text-sm font-bold mb-4">Contact information</p>
          <div className="flex items-center gap-2 ">
            <div className="size-9 rounded-md bg-muted flex items-center justify-center">
              <MailIcon className="size-4 " />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-semibold text-muted-foreground">Email Address</p>
              <Link
                href={`mailto:${member?.user?.email}`}
                className="text-sm hover:underline text-[#1264a3]"
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
