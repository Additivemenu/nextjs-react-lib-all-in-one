"use client";

import { Suspense, useState, lazy } from "react";
// import { ErrorBoundary } from "./components/error-boundary";
// import { DemoControls } from "./components/demo-controls";
// import { LoadingSkeletons } from "./components/loading-skeletons";
// import { KeyConcepts } from "./components/key-concepts";
// import PageToolbar from "@/app/_components/toolbars/page-toolbar";
import { readmePath } from "./readme-path";

// React.lazy() - This is what activates Suspense!
const LazyUserProfile = lazy(() => import("./components/lazy-user-profile"));
const LazyUserPosts = lazy(() => import("./components/lazy-user-posts"));

export default function SuspensePage() {
  const [userId, setUserId] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUserChange = (newUserId: number) => {
    setUserId(newUserId);
  };

  const handleRefresh = () => {
    // Force re-render by updating key (this will re-import the lazy components)
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <></>
    // <div className="h-full bg-gray-50 p-8">
    //   <PageToolbar readmePath={readmePath} />
    //   <div className="max-w-4xl mx-auto space-y-8">
    //     <div className="text-center">
    //       <h1 className="text-3xl font-bold text-gray-900 mb-4">
    //         React Suspense Demo
    //       </h1>
    //       <p className="text-gray-600">
    //         Using React.lazy() to activate Suspense - much simpler!
    //       </p>
    //     </div>

    //     <div className="bg-blue-50 p-4 rounded-lg">
    //       <h3 className="font-semibold text-blue-900 mb-2">How this works:</h3>
    //       <ul className="text-sm text-blue-800 space-y-1">
    //         <li>
    //           • <code>React.lazy()</code> creates components that load
    //           asynchronously
    //         </li>
    //         <li>
    //           • <code>Suspense</code> catches the loading state and shows
    //           fallback
    //         </li>
    //         <li>• No complex promise wrapping or resource patterns needed!</li>
    //         <li>• This is the simplest way to activate Suspense</li>
    //       </ul>
    //     </div>

    //     <KeyConcepts />

    //     <DemoControls
    //       currentUserId={userId}
    //       onUserChange={handleUserChange}
    //       onRefresh={handleRefresh}
    //     />

    //     <div key={refreshKey} className="grid md:grid-cols-2 gap-6">
    //       {/* User Profile Section */}
    //       <div>
    //         <h2 className="text-xl font-semibold mb-4">Lazy User Profile</h2>
    //         <ErrorBoundary>
    //           {/* <Suspense fallback={<LoadingSkeletons.UserProfile />}> */}
    //             {/* FIXME: well, it's still fetching data and manage loading state manually in the demo */}
    //             <LazyUserProfile userId={userId} />
    //           {/* </Suspense> */}
    //         </ErrorBoundary>
    //       </div>

    //       {/* User Posts Section */}
    //       <div>
    //         <h2 className="text-xl font-semibold mb-4">Lazy User Posts</h2>
    //         <ErrorBoundary>
    //           {/* <Suspense fallback={<LoadingSkeletons.UserPosts />}> */}
    //             {/* FIXME: well, it's still fetching data and manage loading state manually in the demo */}
    //             <LazyUserPosts userId={userId} />
    //           {/* </Suspense> */}
    //         </ErrorBoundary>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
