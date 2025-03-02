import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NavigationGuardHookResult {
  showDialog: boolean;
  handleConfirm: () => void;
  handleCancel: () => void;
}

interface NavigationGuardProps {
  onConfirm?: () => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
  stayButtonText?: string;
  leaveButtonText?: string;
}

const useNavigationGuard = (): NavigationGuardHookResult => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [pendingUrl, setPendingUrl] = useState<string>("");

  useEffect(() => {
    // Push a new entry to create a history state we can intercept
    window.history.pushState(null, "", window.location.pathname);

    const handlePopState = (event: PopStateEvent): void => {
      // Prevent the default back navigation
      event.preventDefault();

      // Store the URL we're trying to navigate to
      setPendingUrl(document.referrer || "/");

      // Show the confirmation dialog
      setShowDialog(true);

      // Push another state to prevent immediate navigation
      window.history.pushState(null, "", window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleConfirm = (): void => {
    setShowDialog(false);
    window.location.href = pendingUrl;
  };

  const handleCancel = (): void => {
    setShowDialog(false);
  };

  return { showDialog, handleConfirm, handleCancel };
};

const NavigationGuard: React.FC<NavigationGuardProps> = ({
  onConfirm,
  onCancel,
  title = "Leave this page?",
  description = "Are you sure you want to leave this page? Any unsaved changes will be lost.",
  stayButtonText = "Stay",
  leaveButtonText = "Leave",
}) => {
  const { showDialog, handleConfirm, handleCancel } = useNavigationGuard();

  const handleConfirmClick = (): void => {
    onConfirm?.();
    handleConfirm();
  };

  const handleCancelClick = (): void => {
    onCancel?.();
    handleCancel();
  };

  return (
    <AlertDialog open={showDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancelClick}>
            {stayButtonText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmClick}>
            {leaveButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NavigationGuard;
