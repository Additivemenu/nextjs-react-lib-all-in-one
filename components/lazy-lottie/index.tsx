"use client";

import React, {lazy, Suspense} from "react";

import {useQuery} from "@tanstack/react-query";
import type {LottieOptions} from "lottie-react";

const LazyLottieComponent = lazy(() => import("lottie-react"));

interface LottieProps<T extends Record<string, unknown>> {
  getAnimationData: () => Promise<T>;
  id: string;
  loadingComponent: React.ReactNode | "default";
}

export type LazyLottieOptions = Omit<LottieOptions, "animationData">

const DefaultSkeleton = () => (
  <div className="loading loading-spinner loading-lg"/>
);

export function LazyLottie<T extends Record<string, unknown>>(
  {
    getAnimationData,
    id,
    loadingComponent = "default",
    ref,
    ...props
  }: LottieProps<T> & LazyLottieOptions) {
  const {data} = useQuery({
    queryKey: [id],
    queryFn: async () => {
      void import("lottie-react"); // Trigger the library lazy load even if the animationData is not ready
      return getAnimationData();
    },
    enabled: typeof window !== "undefined",
  });

  const LoadingComponent = loadingComponent === "default" ? <DefaultSkeleton /> : loadingComponent;

  if (!data) {
    return <>{LoadingComponent}</>;
  }

  return (
    <Suspense fallback={<>{LoadingComponent}</>}>
      <LazyLottieComponent animationData={data} {...props} />
    </Suspense>
  );
}

