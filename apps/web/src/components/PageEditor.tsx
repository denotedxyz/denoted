"use client";

import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useAccount } from "wagmi";
import { useCeramic } from "../hooks/useCeramic";
import { useLit } from "../hooks/useLit";
import { deserializePage } from "../utils/page-helper";

import { Editor } from "../core/editor/Editor";

export type SavePageData = {
  page: {
    title: string;
    content: any;
  };
  address?: string;
  encryptionKey?: CryptoKey;
};

type PageEditorProps = {
  page?: ReturnType<typeof deserializePage>;
  encryptionKey?: CryptoKey;
  renderSubmit: (props: {
    isDisabled: boolean;
    getData: () => SavePageData;
  }) => React.ReactNode;
  mode: "CREATE" | "UPDATE";
};

export function PageEditor({
  page,
  encryptionKey,
  renderSubmit,
}: PageEditorProps) {
  const [title, setTitle] = useState(page?.title ?? "");
  const titleRef = useRef<HTMLTextAreaElement>(null);

  const ceramic = useCeramic();
  const lit = useLit();
  const account = useAccount();

  const isAuthenticated =
    account.isConnected &&
    ceramic.isComposeResourcesSigned &&
    ceramic.isSessionValid &&
    lit.isLitAuthenticated;

  const isEnabled = isAuthenticated && title.length > 0;

  const onEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      return false;
    }
  };

  return (
    <>
      {renderSubmit({
        isDisabled: !isEnabled,
        getData: () => ({
          page: {
            title,
            content: [],
          },
          address: account.address,
          encryptionKey,
        }),
      })}
      <Editor />
    </>
  );
}
