"use client";

import { Button, Input } from "@denoted/ui";
import * as Form from "@radix-ui/react-form";
import { Loader2 } from "lucide-react";
import { trackEvent } from "../lib/analytics";
import { useMutation } from "@tanstack/react-query";

export function EmailSignup() {
  const emailSignup = useMutation(async (email: string) => {
    const response = await fetch("/api/email", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    trackEvent("Email Signed Up");

    return result;
  });

  return (
    <div>
      <Form.Root
        className="flex w-full max-w-sm items-end gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const data = Object.fromEntries(new FormData(event.currentTarget));
          emailSignup.mutate(data.email.toString());
        }}
      >
        <Form.Field name="email" className="flex flex-1 flex-col">
          <Form.Message match="typeMismatch" className="mb-2 text-gray-500">
            please provide a valid email
          </Form.Message>
          <Form.Control asChild>
            <Input
              type="email"
              required
              placeholder="denoted@example.com"
              disabled={emailSignup.isLoading}
            />
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild>
          <Button disabled={emailSignup.isLoading}>
            {emailSignup.isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign up
          </Button>
        </Form.Submit>
      </Form.Root>
      {emailSignup.isSuccess && <p>you are signed up!</p>}
    </div>
  );
}
