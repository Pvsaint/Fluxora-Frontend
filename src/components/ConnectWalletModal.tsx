import { CSSProperties, MouseEvent, useEffect, useRef, useState } from "react";

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectFreighter?: () => void;
  onConnectAlbedo?: () => void;
  onConnectWalletConnect?: () => void;
}

interface WalletOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  action: () => void;
}

export default function ConnectWalletModal({
  isOpen,
  onClose,
  onConnectFreighter,
  onConnectAlbedo,
  onConnectWalletConnect,
}: ConnectWalletModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [hoveredOptionId, setHoveredOptionId] = useState<string | null>(null);
  const [focusedOptionId, setFocusedOptionId] = useState<string | null>(null);
  const [isCloseFocused, setIsCloseFocused] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }

      if (e.key !== "Tab") {
        return;
      }

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const walletOptions: WalletOption[] = [
    {
      id: "freighter",
      name: "Freighter",
      description: "Recommended browser extension for Stellar wallets.",
      icon: "🚀",
      action: onConnectFreighter || (() => console.log("Freighter clicked")),
    },
    {
      id: "albedo",
      name: "Albedo",
      description: "Open in-browser wallet for quick secure approvals.",
      icon: "⭐",
      action: onConnectAlbedo || (() => console.log("Albedo clicked")),
    },
    {
      id: "walletconnect",
      name: "WalletConnect",
      description: "Pair with compatible mobile wallets via QR.",
      icon: "🔗",
      action:
        onConnectWalletConnect || (() => console.log("WalletConnect clicked")),
    },
  ];

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div
        id="connect-wallet-modal"
        style={styles.modal}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="connect-wallet-modal-title"
        aria-describedby="connect-wallet-modal-description"
      >
        <button
          type="button"
          ref={closeButtonRef}
          style={{
            ...styles.closeButton,
            boxShadow: isCloseFocused
              ? "0 0 0 2px var(--surface-base), 0 0 0 4px var(--interactive-focus-ring)"
              : "none",
          }}
          onClick={onClose}
          onFocus={() => setIsCloseFocused(true)}
          onBlur={() => setIsCloseFocused(false)}
          aria-label="Close wallet connection dialog"
        >
          ✕
        </button>

        <div style={styles.header}>
          <span style={styles.badge}>Step 1 of 1</span>
          <h2 id="connect-wallet-modal-title" style={styles.title}>
            Choose your wallet
          </h2>
          <p id="connect-wallet-modal-description" style={styles.subtitle}>
            Select a provider below to connect. You will review and approve the
            request in your wallet.
          </p>
        </div>

        <div style={styles.walletList} role="list" aria-label="Wallet providers">
          {walletOptions.map((wallet) => {
            const isActive =
              hoveredOptionId === wallet.id || focusedOptionId === wallet.id;

            return (
              <button
                key={wallet.id}
                type="button"
                style={{
                  ...styles.walletOption,
                  background: isActive ? "var(--surface-elevated)" : "var(--surface-neutral)",
                  borderColor: isActive ? "var(--border-interactive)" : "var(--border-neutral)",
                  boxShadow: isActive
                    ? "0 0 0 2px var(--surface-base), 0 0 0 4px var(--interactive-focus-ring)"
                    : "none",
                }}
                onClick={wallet.action}
                onMouseEnter={() => setHoveredOptionId(wallet.id)}
                onMouseLeave={() => setHoveredOptionId(null)}
                onFocus={() => setFocusedOptionId(wallet.id)}
                onBlur={() => setFocusedOptionId(null)}
                aria-label={`Connect with ${wallet.name}`}
              >
                <div style={styles.walletIcon} aria-hidden="true">
                  {wallet.icon}
                </div>
                <div style={styles.walletInfo}>
                  <div style={styles.walletName}>{wallet.name}</div>
                  <div style={styles.walletDescription}>{wallet.description}</div>
                </div>
                <div style={styles.chevron} aria-hidden="true">
                  →
                </div>
              </button>
            );
          })}
        </div>

        <p style={styles.footer}>
          By continuing, you agree to Fluxora&apos;s{" "}
          <a href="/terms" style={styles.termsLink}>
            Terms of Service
          </a>
          .
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(2, 8, 18, 0.8)",
    backdropFilter: "blur(5px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "clamp(12px, 4vw, 24px)",
  },
  modal: {
    position: "relative",
    background: "var(--surface-neutral)",
    borderRadius: 16,
    padding: "clamp(18px, 5vw, 30px)",
    maxWidth: 520,
    width: "100%",
    boxShadow: "0 24px 60px rgba(0, 0, 0, 0.45)",
    border: "1px solid var(--border-neutral)",
    maxHeight: "90vh",
    overflowY: "auto",
    fontFamily: '"Plus Jakarta Sans", Inter, system-ui, sans-serif',
  },
  closeButton: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    background: "transparent",
    border: "1px solid transparent",
    color: "var(--text-muted)",
    fontSize: "1.125rem",
    cursor: "pointer",
    borderRadius: 8,
    padding: "0.35rem 0.45rem",
    lineHeight: 1,
    transition: "all 160ms ease",
  },
  header: {
    marginBottom: "1rem",
    paddingRight: "2.2rem",
  },
  badge: {
    display: "inline-block",
    borderRadius: 999,
    border: "1px solid rgba(34, 211, 238, 0.35)",
    color: "var(--status-info)",
    background: "rgba(34, 211, 238, 0.12)",
    padding: "5px 9px",
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.03em",
    marginBottom: "0.75rem",
    textTransform: "uppercase",
  },
  title: {
    margin: 0,
    fontSize: "clamp(1.25rem, 4vw, 1.7rem)",
    fontWeight: 700,
    color: "var(--text-vivid)",
    marginBottom: "0.5rem",
    lineHeight: 1.25,
    letterSpacing: "-0.01em",
  },
  subtitle: {
    margin: 0,
    fontSize: "clamp(0.86rem, 2.8vw, 0.95rem)",
    color: "var(--text-secondary)",
    lineHeight: 1.55,
    maxWidth: 420,
  },
  walletList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginBottom: "1rem",
  },
  walletOption: {
    display: "flex",
    alignItems: "center",
    gap: "clamp(0.75rem, 3vw, 1rem)",
    border: "1px solid var(--border-neutral)",
    borderRadius: 12,
    padding: "clamp(0.75rem, 3vw, 1rem)",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
    transition: "all 150ms ease-in-out",
    color: "inherit",
  },
  walletIcon: {
    fontSize: "clamp(1.35rem, 4vw, 1.9rem)",
    flexShrink: 0,
    width: "clamp(38px, 11vw, 48px)",
    height: "clamp(38px, 11vw, 48px)",
    borderRadius: 10,
    background: "var(--surface-elevated)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    fontSize: "clamp(0.92rem, 2.5vw, 1rem)",
    fontWeight: 700,
    color: "var(--text-vivid)",
    marginBottom: "0.25rem",
  },
  walletDescription: {
    fontSize: "clamp(0.76rem, 2vw, 0.875rem)",
    color: "var(--text-secondary)",
    lineHeight: 1.4,
  },
  chevron: {
    fontSize: "1.1rem",
    color: "var(--text-muted)",
    flexShrink: 0,
  },
  footer: {
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    lineHeight: 1.5,
    textAlign: "center",
    margin: 0,
  },
  termsLink: {
    color: "var(--status-info)",
    textDecoration: "underline",
    textUnderlineOffset: "2px",
  },
};
