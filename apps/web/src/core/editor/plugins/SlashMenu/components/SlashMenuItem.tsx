import { cn } from "@denoted/ui";
import { SlashMenuOption } from "../types";

export function SlashMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: SlashMenuOption;
}) {
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={cn(
        "flex w-full items-center gap-3 border-t border-slate-50 px-3 py-2 text-left hover:bg-slate-100",
        isSelected && "bg-slate-100"
      )}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={"typeahead-item-" + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {typeof option.icon === "string" ? (
        <img src={option.icon} alt={option.title} />
      ) : (
        <>{option.icon}</>
      )}
      <div className="flex flex-col">
        <p>{option.title}</p>
        {option.description && (
          <p className="text-xs text-slate-500">{option.description}</p>
        )}
      </div>
    </li>
  );
}
