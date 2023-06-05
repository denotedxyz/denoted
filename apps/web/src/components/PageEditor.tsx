"use client";

import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useAccount } from "wagmi";
import { useCeramic } from "../hooks/useCeramic";
import { useLit } from "../hooks/useLit";
import { deserializePage } from "../utils/page-helper";

const TITLE_PLACEHOLDER = "Untitled";

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

  useEffect(() => {
    document.title = `${title ?? TITLE_PLACEHOLDER} | denoted`;
  }, [title]);

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
    <div className="flex h-full flex-col">
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
      <TextareaAutosize
        ref={titleRef}
        placeholder={TITLE_PLACEHOLDER}
        className="mb-8 w-full resize-none text-5xl font-bold leading-tight placeholder:text-slate-200 focus:outline-none"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={onEnter}
        required
      />
    </div>
  );
}
