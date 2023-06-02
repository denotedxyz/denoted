"use client";

import { AuthSteps } from "./AuthSteps";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@denoted/ui";

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
