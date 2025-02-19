"use client";

import Image from "next/image";

import VerificationInput from "react-verification-input";

const JoinPage = () => {
  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image src={"/logo.svg"} width={60} height={60} alt="logo" />
      <div className="flex flex-col gap-y-4 items-center justify-center max-x-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join workspace</h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <VerificationInput
          classNames={{
            container: "flex gap-x-2",
            character:
              "upperccase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-bold text-gray-500",
            characterInactive: "bg-muted",
            characterFilled: "bg-white text-black",
            characterSelected: "bg-white text-black",
          }}
        />
      </div>
    </div>
  );
};

export default JoinPage;
