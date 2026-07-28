import { useState } from "react";
import {
  ButtonGroup,
  Button,
  Tabs,
  Tooltip,
  Dropdown,
  Label,
  toast,
} from "@heroui/react";
import {
  Plus,
  EllipsisVertical,
  StickyNoteX,
  StickyNotePlus,
  StickyNote,
  Timer,
  Clock,
  PenLine,
  FolderOpen,
  Trash2,
} from "lucide-react";
import { useBoardStore } from "../hooks/useBoardStore";
import RenameModal from "./modals/RenameModal";
import DeleteConfirmModal from "./modals/DeleteConfirmModal";

// ── Widget options in "Add Widget" dropdown ────────────────────────────────
const WIDGET_OPTIONS = [
  { key: "group", icon: FolderOpen },
  { key: "pomodoro", icon: Timer },
  { key: "clock", icon: Clock },
  { key: "note", icon: StickyNote },
];

const PageSettings = [
  { id: "rename-page", label: "Rename Page", icon: PenLine },
  { id: "delete-page", label: "Delete Page", variant: "danger", icon: Trash2 },
];

// ── Logo ───────────────────────────────────────────────────────────────────
export function Logo() {
  return (
    <div className="font-bold text-xl tracking-wide shrink-0">
      <img src="/logo.svg" alt="logo" className="w-20" />
    </div>
  );
}

// ── Pages ──────────────────────────────────────────────────────────────────
export function Pages() {
  const pages = useBoardStore((s) => s.pages);
  const activePageId = useBoardStore((s) => s.activePageId);
  const setActivePage = useBoardStore((s) => s.setActivePage);
  const addPage = useBoardStore((s) => s.addPage);
  const deletePage = useBoardStore((s) => s.deletePage);
  const renamePage = useBoardStore((s) => s.renamePage);

  const [hoveredId, setHoveredId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameTargetId, setRenameTargetId] = useState(null);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState(null);

  const renameTarget = pages.find((p) => p.id === renameTargetId);

  const handleAddPage = () => {
    addPage();
    toast.success("Page added", {
      description: "Your page was added successfully",
      indicator: <StickyNotePlus className="size-5 text-success shrink-0" />,
    });
  };

  const handleConfirmDelete = () => {
    if (!pageToDelete) return;
    deletePage(pageToDelete);
    toast.success("Deleted page", {
      description: "Your page was deleted successfully",
      indicator: <StickyNoteX className="size-5 text-success shrink-0" />,
    });
    setPageToDelete(null);
  };

  return (
    <div className="flex items-center gap-3 min-w-0 max-w-full">
      <Tabs
        selectedKey={activePageId}
        onSelectionChange={(key) => setActivePage(String(key))}
        className="min-w-0 overflow-hidden"
      >
        <Tabs.ListContainer className="min-w-0 bg-secondary">
          <Tabs.List aria-label="Pages" className="min-w-0 w-max">
            {pages.map((page) => {
              const isSelected = activePageId === page.id;
              const isHovered = hoveredId === page.id;
              const showDropdown =
                (isSelected && isHovered) || (isSelected && isMenuOpen);

              return (
                <Tabs.Tab
                  key={page.id}
                  id={page.id}
                  className="flex items-center gap-1.5 whitespace-nowrap transition-all duration-200"
                  onMouseEnter={() => setHoveredId(page.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ color: isSelected ? "#ffffff" : undefined }}
                >
                  <span className="whitespace-nowrap">{page.label}</span>
                  <Tabs.Indicator />

                  <div
                    className={`transition-all duration-200 ease-in-out ${
                      showDropdown
                        ? "w-6 opacity-100 scale-100 pointer-events-auto"
                        : "w-0 opacity-0 scale-75 pointer-events-none overflow-hidden"
                    }`}
                  >
                    <Dropdown onOpenChange={setIsMenuOpen}>
                      <Button
                        isIconOnly
                        aria-label="Menu"
                        variant="ghost"
                        size="sm"
                        className="hover:bg-transparent shadow-none w-6 h-6 min-w-6 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <EllipsisVertical
                          className={`size-4 shrink-0 transition-colors ${
                            isSelected ? "text-white" : "text-muted"
                          }`}
                        />
                      </Button>
                      <Dropdown.Popover placement="bottom left">
                        <Dropdown.Menu
                          onAction={(key) => {
                            if (key === "rename-page") {
                              setRenameTargetId(page.id);
                              setIsRenameOpen(true);
                            } else if (key === "delete-page") {
                              if (pages.length <= 1) {
                                toast.danger(
                                  "Cannot delete the only remaining page",
                                );
                                return;
                              }
                              setPageToDelete(page.id);
                              setIsDeleteConfirmOpen(true);
                            }
                          }}
                        >
                          {PageSettings.map(
                            ({ id, variant, icon: Icon, label }) => (
                              <Dropdown.Item
                                key={id}
                                id={id}
                                textValue={id}
                                variant={variant}
                              >
                                <div className="flex items-center gap-2 cursor-pointer">
                                  {Icon && (
                                    <Icon
                                      className={`size-4 ${
                                        variant ? "text-danger" : "text-muted"
                                      }`}
                                    />
                                  )}
                                  <Label className="cursor-pointer capitalize">
                                    {label}
                                  </Label>
                                </div>
                              </Dropdown.Item>
                            ),
                          )}
                        </Dropdown.Menu>
                      </Dropdown.Popover>
                    </Dropdown>
                  </div>
                </Tabs.Tab>
              );
            })}
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>

      {/* Add Page button */}
      <Tooltip delay={1000} closeDelay={300}>
        <Tooltip.Trigger>
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            onClick={handleAddPage}
            className="shrink-0 hover:bg-secondary"
          >
            <Plus />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Add Page</Tooltip.Content>
      </Tooltip>

      {/* Rename Modal */}
      <RenameModal
        isOpen={isRenameOpen}
        onOpenChange={setIsRenameOpen}
        itemType="page"
        currentName={renameTarget?.label || ""}
        onRename={(newName) => {
          renamePage(renameTargetId, newName);
          toast.success("Page renamed successfully");
        }}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Page?"
        description="Are you sure you want to delete this page? All widgets inside it will be removed permanently."
        confirmText="Delete Page"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

// ── Buttons ────────────────────────────────────────────────────────────────
export function Buttons({ onOpenSettings, onOpenCustomize }) {
  const [isOpen, setIsOpen] = useState(false);
  const addWidget = useBoardStore((state) => state.addWidget);

  const handleWidgetSelect = (key) => {
    setIsOpen(false);
    addWidget(key);
  };

  return (
    <div className="shrink-0">
      <ButtonGroup variant="tertiary">
        <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
          <Button className="bg-secondary" variant="tertiary">
            Add Widget
          </Button>
          <Dropdown.Popover placement="bottom right">
            <Dropdown.Menu onAction={handleWidgetSelect}>
              {WIDGET_OPTIONS.map(({ key, icon: Icon }) => (
                <Dropdown.Item key={key} id={key} textValue={key}>
                  <div className="flex items-center gap-2">
                    <Icon className="size-4" />
                    <Label className="cursor-pointer capitalize">{key}</Label>
                  </div>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
        <Button onPress={onOpenCustomize} className="bg-secondary">
          Customize
        </Button>
        <Button onPress={onOpenSettings} className="bg-secondary">
          Settings
        </Button>
        <Button
          className="bg-secondary"
          onPress={() => toast.danger("Something went wrong")}
        >
          About
        </Button>
      </ButtonGroup>
    </div>
  );
}

// ── Header ─────────────────────────────────────────────────────────────────
function Header({ onOpenSettings, onOpenCustomize }) {
  return (
    <header className="w-full flex items-center justify-start gap-6 px-6 py-4">
      <Logo />
      <div className="flex-1 min-w-0 flex justify-start">
        <Pages />
      </div>
      <Buttons
        onOpenSettings={onOpenSettings}
        onOpenCustomize={onOpenCustomize}
      />
    </header>
  );
}

export default Header;
