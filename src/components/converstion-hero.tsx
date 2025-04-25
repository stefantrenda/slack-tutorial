import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

interface ConversationHeroProps {
  name?: string;
  image?: string;
}

export const ConversationHero = ({
  name = 'Member',
  image,
}: ConversationHeroProps) => {
  const avatarFallback = name?.charAt(0).toUpperCase();

  return (
    <div className="mt-[88px] mx-5 mb-4">
      <div className="flex items-center gap-x-1 mb-2">
        <Avatar className="size-14 mr-2">
          <AvatarImage src={image} />
          <AvatarFallback
          // className="bg-slate-200 text-slate-500 font-bold"
          >
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <p className="text-2xl font-bold ">{name}</p>
      </div>

      <p className="font-normal text-slate-800 mb-4">
        This conversation is between you and <strong>{name}</strong>. You can send
        messages, images, and files to each other.
      </p>
    </div>
  );
};
