"use client";

import Link from "next/link";
import Image from "next/image";
import { Loader } from "lucide-react";
import { useRouter } from "next/router";
import VerificationInput from "react-verification-input";

import { useJoin } from "@/features/workspaces/api/use-join";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";

import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";

const JoinPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { mutate, isPendig } = useJoin();
  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });

  const handleComplete = (value) => {
    mutate(
      { workspaceId, joinCode: value },
      {
        onSuccess: (id) => {
          router.replace("")
          toast.success("Workspace joined");
        },
        onError: () => {
          toast.error("failed to join workspace");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image src={"/logo.svg"} width={60} height={60} alt="logo" />
      <div className="flex flex-col gap-y-4 items-center justify-center max-x-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join {data?.name}</h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <VerificationInput
          length={6}
          classNames={{
            container: "flex gap-x-2",
            character:
              "upperccase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-bold text-gray-500",
            characterInactive: "bg-muted",
            characterFilled: "bg-white text-black",
            characterSelected: "bg-white text-black",
          }}
          autoFocus
        />
      </div>
      <div className="flex gap-x-4 ">
        <Button size={"lg"} variant={"outline"} asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
