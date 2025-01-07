import { Platform, Alert } from "react-native";

interface ConfirmDialogProps {
  title?: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  cancelStyle?: "cancel" | "default" | "destructive";
  confirmStyle?: "cancel" | "default" | "destructive";
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function ConfirmDialog({
  title = "Confirmación",
  message,
  cancelText = "Cancelar",
  confirmText = "Aceptar",
  cancelStyle = "cancel",
  confirmStyle = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const showDialog = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(`${title}\n\n${message}`);
      if (confirmed && onConfirm) {
        onConfirm();
      } else if (!confirmed && onCancel) {
        onCancel();
      }
    } else {
      Alert.alert(title, message, [
        {
          text: cancelText,
          style: cancelStyle,
          onPress: onCancel,
        },
        {
          text: confirmText,
          style: confirmStyle,
          onPress: onConfirm,
        },
      ]);
    }
  };

  return { showDialog };
}
