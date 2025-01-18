"use client";

import { useState } from "react";
import { SingInFlow } from "../types";
import { SingInCard } from "./sing-in-card";
import { SingUpCard } from "./sing-up-card";

export const AuthScreen = () => {
  const [state, setState] = useState<SingInFlow>("singIn");

  return (
    <div className="h-full flex items-center justify-center bg-[#5C3B58]">
      <div className="md:h-auto md:w-[420px]">
        {state === "singIn" ? (
          <SingInCard setState={setState} />
        ) : (
          <SingUpCard setState={setState} />
        )}
      </div>
    </div>
  );
};
