import Link from 'next/link';
import { AlertTriangle, Loader, MailIcon, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useGetMember } from '../api/use-get-member';
import { Id } from '../../../../convex/_generated/dataModel';

interface ProfileProps {
  memberId: Id<'members'>;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const { data: memebr, isLoading: isLoadingMember } = useGetMember({
    id: memberId,
  });

  if (isLoadingMember) {
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

  if (!memebr) {
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

  const avatarFallbackText = memebr.user.name?.[0] ?? 'm';

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-4 border-b h-[49px]">
        <p className="text-lg font-bold">Profile</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <X className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className="flex flex-col  items-center justify-center p-4">
        <Avatar className="max-w-[250px] max-h-[256px] size-full">
          <AvatarImage src={memebr?.user?.image} alt="Profile" />
          <AvatarFallback className="aspect-square text-6xl">
            {avatarFallbackText}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col p-4 ">
        <p className="text-xl font-bold">{memebr?.user?.name}</p>
      </div>
      <Separator />
      <div className="flex flex-col p-4 ">
        <p className="text-sm font-bold mb-4">Contact information</p>
        <div className="flex items-center gap-2 ">
          <div className="size-9 rounded-md bg-muted flex items-center justify-center">
            <MailIcon className="size-4 " />
          </div>
          <div className="flex flex-col">
            <p className="text-[13px] font-semibold text-muted-foreground">
              Email Address
            </p>
            <Link
              href={`mailto:${memebr?.user?.email}`}
              className="text-sm hover:underline text-[#1264a3]"
            >
              {memebr.user.email}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
