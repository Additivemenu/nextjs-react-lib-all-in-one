"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw } from "lucide-react";

/**
 * isLoading: Only true during first load with no cached data
 * isFetching: True during any data loading, including background refetches
 * @returns
 */
const LoadingVsFetchingDemo = () => {
  const [resetKey, setResetKey] = React.useState(0);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["demo", resetKey],
    queryFn: async () => {
      await new Promise<void>((resolve) =>
        setTimeout(() => {
          resolve();
        }, 2000),
      ); // 2s delay

      return {
        timestamp: new Date().toISOString(),
      };
    },
  });

  const clearCache = () => {
    setResetKey((prev) => prev + 1); // Force new query with no cache
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>isLoading vs isFetching Demo</CardTitle>
        <CardDescription>
          Watch how these flags behave differently during first load and
          refetches
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* isLoading indicator */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">isLoading</h3>
              <Badge variant={isLoading ? "default" : "secondary"}>
                {isLoading ? "true" : "false"}
              </Badge>
            </div>
            {isLoading && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin mr-2" />
                First load with no cache
              </div>
            )}
          </div>

          {/* isFetching indicator */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">isFetching</h3>
              <Badge variant={isFetching ? "default" : "secondary"}>
                {isFetching ? "true" : "false"}
              </Badge>
            </div>
            {isFetching && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin mr-2" />
                Any data loading
              </div>
            )}
          </div>
        </div>

        {/* Data display */}
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-2">Cached Data</h3>
          {data ? (
            <code className="text-sm">Last updated: {data.timestamp}</code>
          ) : (
            <div className="text-sm text-muted-foreground">No data yet</div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center space-x-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>Refetch</span>
          </Button>

          <Button onClick={clearCache} variant="outline" disabled={isFetching}>
            Clear Cache & Reload
          </Button>
        </div>

        {/* Status explanation */}
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>
            <strong>isLoading:</strong> Only true during first load with no
            cached data
          </p>
          <p>
            <strong>isFetching:</strong> True during any data loading, including
            background refetches
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingVsFetchingDemo;
