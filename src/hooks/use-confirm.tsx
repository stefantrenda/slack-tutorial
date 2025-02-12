import { useState, JSX } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const useConfirm = (title: string, message: string): [() => JSX.Element, () => Promise<boolean>] => {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

  const confirm = () => new Promise<boolean>((resolve) => {
    setPromise({ resolve });
  });

  const handleClose = () => {
    setPromise(null);
  };

  const handleCancel = () => {
    if (promise) {
      promise.resolve(false);
    }
    handleClose();
  };

  const handleConfirm = () => {
    if (promise) {
      promise.resolve(true);
    }
    handleClose();
  };

  const ConfirmDialog = () => (
    <Dialog open={promise !== null}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmDialog, confirm];
};
