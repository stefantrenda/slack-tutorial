/* eslint-disable @next/next/no-img-element */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";
import { XIcon } from "lucide-react";

interface ThumbnailProps {
  url: string | null | undefined;
}

export const Thumbnail = ({ url }: ThumbnailProps) => {
  if (!url) return null;

  return (
    <div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in">
      <img
        src={url}
        alt="Message iamge"
        className="rounded-md object-cover size-full"
      />
    </div>
  );
};
