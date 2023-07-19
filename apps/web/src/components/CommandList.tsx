import Image, { StaticImageData } from "next/image";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { cn } from "@denoted/ui";
import { CommandConfiguration } from "./commands/types";
import { Card, CardContent } from "@denoted/ui";

export type CommandContext = {
  editor: any;
  range: Range;
};

export type CommandGroup = {
  name: string;
  items: CommandConfiguration<any>[];
};

export type CommandListItem = CommandGroup;

export type CommandListHandle = {
  onKeyDown: (props: any) => boolean;
};

export type CommandListProps = any;

export const CommandList = forwardRef<CommandListHandle, CommandListProps>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(1);

    const allCommands = useMemo(
      () => props.items.flatMap((item) => item.items),
      [props.items]
    );

    const totalItems = allCommands.length;

    const selectItem = (index: number) => {
      const item = allCommands[index];

      if (item) {
        props.command(item as any);
      }
    };

    const upHandler = () => {
      setSelectedIndex((selectedIndex + totalItems - 1) % totalItems);
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % totalItems);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: any) => {
        if (event.key === "ArrowUp") {
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }

        if (event.key === "Enter") {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    if (props.items.length === 0) {
      return (
        <div className="w-64 overflow-hidden rounded-2xl bg-zinc-100">
          <p className="w-full px-3 py-2 text-left">no result</p>
        </div>
      );
    }

    return (
      <Card className="w-64">
        <CardContent className="p-0">
          {props.items.map((item) => {
            return (
              <div key={item.name} className="border-t first:border-none">
                <p className="px-3 py-2 text-xs text-zinc-500">{item.name}</p>
                <div>
                  {item.items.map((item) => {
                    const index = allCommands
                      .map((c) => c.command)
                      .indexOf(item.command);
                    return (
                      <CommandItemButton
                        key={item.command}
                        item={item}
                        index={index}
                        selectedIndex={selectedIndex}
                        onSelect={selectItem}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  }
);

const CommandItemButton = <T extends Record<string, string>>({
  item,
  index,
  selectedIndex,
  onSelect,
}: {
  item: CommandConfiguration<T>;
  index: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
}) => {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 border-t border-zinc-50 px-3 py-2 text-left hover:bg-zinc-100",
        index === selectedIndex && "bg-zinc-100"
      )}
      onClick={() => onSelect(index)}
    >
      {item.icon ? (
        <Image {...item.icon} width={24} height={24} alt={item.title} />
      ) : (
        <div className="h-[24px] w-[24px] rounded-sm bg-zinc-100" />
      )}
      <div className="flex flex-col">
        <p>{item.title}</p>
        {item.description && (
          <p className="text-xs text-zinc-500">{item.description}</p>
        )}
      </div>
    </button>
  );
};

CommandList.displayName = "CommandList";
