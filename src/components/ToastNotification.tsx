import "./ToastNotification.css";

export type ToastVariant = "success" | "error" | "info" | "warning";

interface ToastNotificationProps {
  message: string;
  variant: ToastVariant;
  onClose: () => void;
}

const TOAST_COPY: Record<ToastVariant, { label: string; icon: string }> = {
  success: { label: "Success", icon: "✓" },
  error: { label: "Error", icon: "!" },
  info: { label: "Info", icon: "i" },
  warning: { label: "Warning", icon: "⚠" },
};

export default function ToastNotification({
  message,
  variant,
  onClose,
}: ToastNotificationProps) {
  const semantics =
    variant === "error" || variant === "warning"
      ? { role: "alert" as const, "aria-live": "assertive" as const }
      : { role: "status" as const, "aria-live": "polite" as const };

  const { label, icon } = TOAST_COPY[variant];

  return (
    <div
      className={`toast-notification toast-notification--${variant}`}
      aria-atomic="true"
      {...semantics}
    >
      <div className="toast-notification__icon" aria-hidden="true">
        {icon}
      </div>
      <div className="toast-notification__content">
        <p className="toast-notification__eyebrow">{label}</p>
        <p className="toast-notification__message">{message}</p>
      </div>
      <button
        type="button"
        className="toast-notification__close"
        onClick={onClose}
        aria-label={`Dismiss ${label.toLowerCase()} notification`}
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}
