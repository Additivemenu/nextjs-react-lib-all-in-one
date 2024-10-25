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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  PauseCircle,
} from "lucide-react";

const QueryStatusDemo = () => {
  const [enabled, setEnabled] = React.useState(true);

  const {
    data,
    isLoading, // isLoading is true when the query is in the loading state
    isFetching, // isFetching is true when the query is in the background refetching state
    isError, // isError is true when the query has thrown an error
    isSuccess, // isSuccess is true when the query is successful
    error,
    refetch,
    status,
  } = useQuery({
    queryKey: ["demo-data"],
    queryFn: async () => {
      // Simulate API call with random delay and possible error
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Randomly throw error for demonstration
      if (Math.random() < 0.3) {
        throw new Error("Random API error occurred");
      }

      return {
        message: "Data successfully fetched",
        timestamp: new Date().toISOString(),
      };
    },
    retry: 0, // Disable retries for demo purposes
    enabled: enabled,
    refetchInterval: false,
  });

  const getStatusColor = () => {
    if (isError) return "bg-red-100 text-red-800";
    if (isSuccess) return "bg-green-100 text-green-800";
    if (isLoading) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = () => {
    if (isError) return <XCircle className="h-5 w-5 text-red-500" />;
    if (isSuccess) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (isLoading)
      return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    if (!enabled) return <PauseCircle className="h-5 w-5 text-gray-500" />;
    return <AlertCircle className="h-5 w-5 text-gray-500" />;
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Query Status Demo
          <Badge variant="secondary" className={`${getStatusColor()} ml-2`}>
            {status}
          </Badge>
        </CardTitle>
        <CardDescription>
          Demonstrating different states of useQuery
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Current Status:</span>
            {getStatusIcon()}
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>isLoading: {isLoading ? "✓" : "×"}</div>
            <div>isFetching: {isFetching ? "✓" : "×"}</div>
            <div>isSuccess: {isSuccess ? "✓" : "×"}</div>
            <div>isError: {isError ? "✓" : "×"}</div>
          </div>
        </div>

        {isSuccess && data && (
          <Alert className="bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              {data.message}
              <div className="text-xs text-gray-500 mt-1">
                Timestamp: {data.timestamp}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {isError && error instanceof Error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <div className="flex space-x-2">
          <Button
            onClick={() => refetch()}
            disabled={!enabled || isFetching}
            className="flex items-center space-x-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>Refetch</span>
          </Button>

          <Button
            onClick={() => setEnabled((prev) => !prev)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            {enabled ? "Disable" : "Enable"} Query
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QueryStatusDemo;
