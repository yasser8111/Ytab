import { useState, useEffect, useRef } from "react";
import { Modal, Button, Input } from "@heroui/react";

export function RenameModal({
  isOpen,
  onOpenChange,
  itemType,
  currentName,
  onRename,
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setName(currentName || "");
      setError("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, currentName]);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name cannot be empty");
      return;
    }
    if (trimmed === currentName) {
      onOpenChange(false);
      return;
    }
    onRename(trimmed);
    onOpenChange(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      onOpenChange(false);
    }
  };

  const labels = { site: "Site", page: "Page", group: "Group", note: "Note" };
  const label = labels[itemType] || "Item";

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop>
        <Modal.Container placement="center">
          <Modal.Dialog className="max-w-sm">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Rename {label}</Modal.Heading>
            </Modal.Header>

            <Modal.Body className="py-4">
              <Input
                ref={inputRef}
                aria-label={`${label} name`}
                placeholder={`Enter ${label.toLowerCase()} name...`}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                fullWidth={true}
                onKeyDown={handleKeyDown}
                isInvalid={!!error}
                autoFocus
                variant="secondary"
              />
              {error && <p className="text-xs text-danger mt-1">{error}</p>}
            </Modal.Body>

            <Modal.Footer className="flex justify-end gap-2 pt-2">
              <Button variant="tertiary" onPress={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onPress={handleSubmit}
                isDisabled={!name.trim() || name.trim() === currentName}
              >
                Rename
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default RenameModal;
