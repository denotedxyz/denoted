"use client";

import { $createCodeNode } from "@lexical/code";
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import {
  LexicalTypeaheadMenuPlugin,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  TextNode,
} from "lexical";
import { useCallback, useMemo, useState } from "react";
import * as ReactDOM from "react-dom";

import { Card, CardContent } from "@denoted/ui";
import { SlashMenuItem } from "./components/SlashMenuItem";
import { SlashMenuOption } from "./types";
import groupBy from "lodash.groupby";

export function SlashMenuPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  //   const [modal, showModal] = useModal();
  const [queryString, setQueryString] = useState<string | null>(null);

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
    minLength: 0,
  });

  const options = useMemo(() => {
    const baseOptions = [
      new SlashMenuOption("Paragraph", {
        group: "other",
        keywords: ["normal", "paragraph", "p", "text"],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createParagraphNode());
            }
          }),
      }),
      ...Array.from({ length: 3 }, (_, i) => i + 1).map(
        (n) =>
          new SlashMenuOption(`Heading ${n}`, {
            group: "basic",
            keywords: ["heading", "header", `h${n}`],
            onSelect: () =>
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () =>
                    // @ts-ignore Correct types, but since they're dynamic TS doesn't like it.
                    $createHeadingNode(`h${n}`)
                  );
                }
              }),
          })
      ),
      new SlashMenuOption("Numbered List", {
        group: "other",
        keywords: ["numbered list", "ordered list", "ol"],
        onSelect: () =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
      }),
      new SlashMenuOption("Bulleted List", {
        group: "basic",
        keywords: ["bulleted list", "unordered list", "ul"],
        onSelect: () =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
      }),
      new SlashMenuOption("Check List", {
        group: "basic",
        keywords: ["check list", "todo list"],
        onSelect: () =>
          editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
      }),
      new SlashMenuOption("Quote", {
        group: "basic",
        keywords: ["block quote"],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createQuoteNode());
            }
          }),
      }),
      new SlashMenuOption("Code", {
        group: "basic",
        keywords: ["javascript", "python", "js", "codeblock"],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
              if (selection.isCollapsed()) {
                $setBlocksType(selection, () => $createCodeNode());
              } else {
                // Will this ever happen?
                const textContent = selection.getTextContent();
                const codeNode = $createCodeNode();
                selection.insertNodes([codeNode]);
                selection.insertRawText(textContent);
              }
            }
          }),
      }),
      new SlashMenuOption("Divider", {
        group: "basic",
        keywords: ["horizontal rule", "divider", "hr"],
        onSelect: () =>
          editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
      }),
      ...(["left", "center", "right", "justify"] as const).map(
        (alignment) =>
          new SlashMenuOption(`Align ${alignment}`, {
            group: "basic",
            keywords: ["align", "justify", alignment],
            onSelect: () =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment),
          })
      ),
    ];

    return queryString
      ? baseOptions.filter((option) => {
          return new RegExp(queryString, "gi").exec(option.title) ||
            option.keywords != null
            ? option.keywords.some((keyword) =>
                new RegExp(queryString, "gi").exec(keyword)
              )
            : false;
        })
      : baseOptions;
  }, [editor, queryString /*, showModal*/]);

  const onSelectOption = useCallback(
    (
      selectedOption: SlashMenuOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
      matchingString: string
    ) => {
      editor.update(() => {
        if (nodeToRemove) {
          nodeToRemove.remove();
        }
        selectedOption.onSelect(matchingString);
        closeMenu();
      });
    },
    [editor]
  );

  return (
    <>
      {/* {modal} */}
      <LexicalTypeaheadMenuPlugin<SlashMenuOption>
        onQueryChange={setQueryString}
        onSelectOption={onSelectOption}
        triggerFn={checkForTriggerMatch}
        options={options}
        menuRenderFn={(
          anchorElementRef,
          { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
        ) => {
          if (!anchorElementRef.current || !options.length) {
            return null;
          }

          const groupedOptions = groupBy(options, (option) => option.group);
          const optionIndexMap = new Map(
            Object.values(groupedOptions)
              .flat()
              .map((option, index) => [option.key, index])
          );

          return ReactDOM.createPortal(
            <Card className="w-64 mt-6">
              <CardContent className="p-0">
                <ul className="list-none m-0 p-0 max-h-80 overflow-y-scroll scrollbar-hide">
                  {Object.entries(groupedOptions).map(
                    ([group, groupOptions]) => {
                      return (
                        <li key={group}>
                          <h2 className="px-3 py-2 text-xs text-slate-500">
                            {group}
                          </h2>
                          <ul className="list-none m-0 p-0">
                            {groupOptions.map((option) => {
                              const index =
                                optionIndexMap.get(option.key) ?? NaN;
                              return (
                                <SlashMenuItem
                                  key={option.key}
                                  index={index}
                                  isSelected={selectedIndex === index}
                                  onClick={() => {
                                    setHighlightedIndex(index);
                                    selectOptionAndCleanUp(option);
                                  }}
                                  onMouseEnter={() =>
                                    setHighlightedIndex(index)
                                  }
                                  option={option}
                                />
                              );
                            })}
                          </ul>
                        </li>
                      );
                    }
                  )}
                </ul>
              </CardContent>
            </Card>,
            anchorElementRef.current
          );
        }}
      />
    </>
  );
}
