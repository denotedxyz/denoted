import { cn } from "@denoted/ui";
import { LucideIcon } from "lucide-react";
import { ComponentProps, PropsWithChildren } from "react";

type IconButtonProps = {
  active?: boolean;
  icon: LucideIcon;
} & ComponentProps<"button">;

export function IconButton({
  active,
  className,
  icon: Icon,
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "py-[1px] px-1 rounded-sm",
        active && "text-slate-900",
        `${
          props.disabled
            ? `bg-slate-50 text-slate-400`
            : active
            ? `bg-slate-100 text-slate-900 hover:bg-slate-200 hover:text-slate-900 cursor-pointer`
            : `bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 cursor-pointer`
        }`,
        className
      )}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
