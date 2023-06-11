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
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListChecks,
  ListOrdered,
  LucideIcon,
  SplitSquareVertical,
  TextQuote,
} from "lucide-react";

import { Card, CardContent } from "@denoted/ui";
import { SlashMenuItem } from "./components/SlashMenuItem";
import { SlashMenuOption } from "./types";
import groupBy from "lodash.groupby";

function SlashMenuItemIcon({ icon: Icon }: { icon: LucideIcon }) {
  return <Icon className="w-4 h-4" />;
}

export function SlashMenuPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  //   const [modal, showModal] = useModal();
  const [queryString, setQueryString] = useState<string | null>(null);

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
    minLength: 0,
  });

  const options = useMemo(() => {
    const baseOptions = [
      ...(
        [
          { level: 1, icon: Heading1 },
          { level: 2, icon: Heading2 },
          { level: 3, icon: Heading3 },
        ] as const
      ).map(
        ({ level: n, icon }) =>
          new SlashMenuOption(`Heading ${n}`, {
            icon: <SlashMenuItemIcon icon={icon} />,
            group: "basic",
            keywords: ["heading", "header", `h${n}`],
            onSelect: () =>
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createHeadingNode(`h${n}`));
                }
              }),
          })
      ),
      new SlashMenuOption("Numbered List", {
        icon: <SlashMenuItemIcon icon={ListOrdered} />,
        group: "basic",
        keywords: ["numbered list", "ordered list", "ol"],
        onSelect: () =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
      }),
      new SlashMenuOption("Bulleted List", {
        icon: <SlashMenuItemIcon icon={List} />,
        group: "basic",
        keywords: ["bulleted list", "unordered list", "ul"],
        onSelect: () =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
      }),
      new SlashMenuOption("Check List", {
        icon: <SlashMenuItemIcon icon={ListChecks} />,
        group: "basic",
        keywords: ["check list", "todo list"],
        onSelect: () =>
          editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
      }),
      new SlashMenuOption("Quote", {
        icon: <SlashMenuItemIcon icon={TextQuote} />,
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
        icon: <SlashMenuItemIcon icon={Code} />,
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
        icon: <SlashMenuItemIcon icon={SplitSquareVertical} />,
        group: "basic",
        keywords: ["horizontal rule", "divider", "hr"],
        onSelect: () =>
          editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
      }),
      ...(
        [
          { align: "left", icon: AlignLeft },
          { align: "center", icon: AlignCenter },
          { align: "right", icon: AlignRight },
        ] as const
      ).map(
        ({ align, icon }) =>
          new SlashMenuOption(`Align ${align}`, {
            icon: <SlashMenuItemIcon icon={icon} />,
            group: "basic",
            keywords: ["align", "justify", align],
            onSelect: () =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align),
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
