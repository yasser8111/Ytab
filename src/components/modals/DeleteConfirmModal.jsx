import { AlertDialog, Button } from "@heroui/react";
export function DeleteConfirmModal({
  isOpen,
  onOpenChange,
  title = "Delete Item?",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
}) {
  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange?.(false);
  };

  return (
    <AlertDialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <AlertDialog.Backdrop>
        <AlertDialog.Container placement="center">
          <AlertDialog.Dialog className="sm:max-w-100">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger"  />
              <AlertDialog.Heading>{title}</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p className="text-sm text-default-500">{description}</p>
            </AlertDialog.Body>
            <AlertDialog.Footer className="flex justify-end gap-2">
              <Button
                variant="tertiary"
                onPress={() => onOpenChange?.(false)}
              >
                {cancelText}
              </Button>
              <Button
                variant="danger"
                onPress={handleConfirm}
              >
                {confirmText}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}

export default DeleteConfirmModal;