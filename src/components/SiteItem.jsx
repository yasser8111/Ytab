import { useState, memo } from "react";
import { Card, Button, Label, Dropdown, toast } from "@heroui/react";
import { EllipsisVertical, Edit3, Trash2 } from "lucide-react";
import EditSiteModal from "./modals/EditSiteModal";
import { useBoardStore } from "../hooks/useBoardStore";

export const SiteItem = memo(function SiteItem({
  id,
  title,
  description,
  url,
  icon,
  onClick,
  isOverlay,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const deleteSite = useBoardStore((state) => state.deleteSite);
  const updateSite = useBoardStore((state) => state.updateSite);

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Card
        onClick={handleClick}
        className={`bg-secondary group/site w-full p-2 cursor-pointer rounded-xl  transition-all select-none ${
          isOverlay ? "shadow-md scale-101" : "shadow-none"
        }`}
      >
        <div className="flex gap-2 items-start">
          {icon && (
            <div className="shrink-0 w-5 h-5 rounded-md overflow-hidden flex items-center justify-center bg-white pointer-events-none mt-0.5">
              {typeof icon === "string" ? (
                <img
                  src={icon}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                icon
              )}
            </div>
          )}

          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex justify-between items-center gap-1 w-full h-full">
              <h3 className="font-medium text-[11px] text-foreground truncate line-clamp-1 leading-tight pointer-events-none flex-1 min-w-0">
                {title}
              </h3>

              <div
                className={`transition-opacity duration-200 shrink-0 ${
                  isMenuOpen ? "opacity-100" : "opacity-0 group-hover/site:opacity-100"
                }`}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <Dropdown onOpenChange={setIsMenuOpen}>
                  <Button
                    isIconOnly
                    aria-label="Site Menu"
                    variant="ghost"
                    size="sm"
                    className="hover:bg-transparent shadow-none w-4 h-3 min-w-4 p-0"
                  >
                    <EllipsisVertical className="size-4 shrink-0 transition-colors text-muted hover:text-foreground" />
                  </Button>
                  <Dropdown.Popover placement="bottom left">
                    <Dropdown.Menu
                      onAction={(key) => {
                        if (key === "edit") {
                          setIsEditOpen(true);
                        } else if (key === "delete") {
                          if (deleteSite) deleteSite(id);
                          toast.success("Site deleted successfully");
                        }
                      }}
                    >
                      <Dropdown.Item id="edit" textValue="edit">
                        <div className="flex items-center gap-2">
                          <Edit3 className="size-4" />
                          <Label className="cursor-pointer capitalize">Edit</Label>
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Item id="delete" textValue="delete" variant="danger">
                        <div className="flex items-center gap-2">
                          <Trash2 className="size-4 text-danger" />
                          <Label className="cursor-pointer capitalize text-danger">Delete</Label>
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              </div>
            </div>

            {description && (
              <p className="text-[10px] text-default-500 line-clamp-2 mt-0.5 leading-snug pointer-events-none w-full">
                {description}
              </p>
            )}
          </div>
        </div>
      </Card>

      <EditSiteModal
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        initialData={{ id, title, description, url }}
        onSave={(updatedData) => {
          if (updateSite) updateSite(id, updatedData);
          toast.success("Site updated successfully");
        }}
      />
    </>
  );
});

export default SiteItem;