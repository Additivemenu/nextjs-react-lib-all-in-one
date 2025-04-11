// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";

// interface NavigationGuardProps {
//   protectedPaths?: string[];
// }

// export const handleNavigation = (
//   currentPath: string,
//   targetUrl: string,
//   protectedPaths: string[],
// ): boolean => {
//   const isProtected = protectedPaths.some((path) =>
//     currentPath.startsWith(path),
//   );
//   return !isProtected;
// };

// export default function NavigationGuard({
//   protectedPaths = ["/workflow"],
// }: NavigationGuardProps): JSX.Element {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [showDialog, setShowDialog] = useState<boolean>(false);
//   const [pendingUrl, setPendingUrl] = useState<string | null>(null);

//   const isProtectedPath = useCallback(
//     (path: string): boolean => {
//       return protectedPaths.some((protectedPath) =>
//         path.startsWith(protectedPath),
//       );
//     },
//     [protectedPaths],
//   );

//   useEffect(() => {
//     const handleBeforeUnload = (event: BeforeUnloadEvent) => {
//       if (isProtectedPath(pathname)) {
//         event.preventDefault();
//         return (event.returnValue = "Are you sure you want to leave?");
//       }
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);

//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [pathname, isProtectedPath]);

//   const handleNavigationAttempt = (url: string): boolean => {
//     if (isProtectedPath(pathname)) {
//       setPendingUrl(url);
//       setShowDialog(true);
//       return false;
//     }
//     return true;
//   };

//   const handleConfirm = (): void => {
//     setShowDialog(false);
//     if (pendingUrl) {
//       router.push(pendingUrl);
//     }
//   };

//   const handleCancel = (): void => {
//     setShowDialog(false);
//     setPendingUrl(null);
//   };

//   return (
//     <>
//       <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Exit Confirmation</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to leave this page? Any unsaved changes will
//               be lost.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleConfirm}>
//               Continue
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }
