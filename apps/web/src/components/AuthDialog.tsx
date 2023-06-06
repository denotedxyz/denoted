"use client";

import { AuthSteps } from "./AuthSteps";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@denoted/ui/src/components/dialog";

type AuthDialogProps = {
  open: boolean;
};

export function AuthDialog({ open }: AuthDialogProps) {
  return (
    <Dialog open={open} modal={false}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Setup account</DialogTitle>
        </DialogHeader>
        <AuthSteps />
      </DialogContent>
    </Dialog>
  );
}
