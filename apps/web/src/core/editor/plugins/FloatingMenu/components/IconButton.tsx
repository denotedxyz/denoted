import { cn } from "@denoted/ui";
import { LucideIcon } from "lucide-react";
import { ComponentProps, PropsWithChildren, forwardRef } from "react";

type IconButtonProps = {
  active?: boolean;
  icon: LucideIcon;
} & ComponentProps<"button">;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ active, className, icon: Icon, ...props }, ref) => {
    return (
      <button
        {...props}
        className={cn(
          "p-1.5 rounded-sm text-zinc-900",
          props.disabled && "opacity-50",
          !props.disabled &&
            "cursor-pointer hover:bg-zinc-400 hover:bg-opacity-10",
          className
        )}
      >
        <Icon className="w-4 h-4" strokeWidth={active ? 3 : undefined} />
      </button>
    );
  }
);
