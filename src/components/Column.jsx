import { memo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Group } from "./Group";
import { useBoardStore } from "../hooks/useBoardStore";

export const Column = memo(function Column({ id }) {
  const { setNodeRef } = useDroppable({ id });
  const items = useBoardStore(
    (s) => s.boards[s.activePageId]?.[id] ?? []
  );

  return (
    <div
      ref={setNodeRef}
      className="w-full h-full min-h-50 flex flex-col gap-4 pb-40 px-2"
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <Group key={item.id} {...item} />
        ))}
      </SortableContext>
    </div>
  );
});

export default Column;