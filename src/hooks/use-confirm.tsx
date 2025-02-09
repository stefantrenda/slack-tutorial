import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { rejects } from "node:assert";

export const useConfirm = (title: string, message: string): [any, any] => {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void | null }>(
    null
  );

  const confirm = () => new Promise ((resolve, reject)) => {
    setPromise({resolve})
  }
  
  const handleClose = () => {
    setPromise(null)
  }


  return ["", ""];
};
