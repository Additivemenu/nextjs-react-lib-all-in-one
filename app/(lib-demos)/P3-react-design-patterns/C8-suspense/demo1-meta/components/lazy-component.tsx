import { lazy } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Simulate async data fetching
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Lazy loaded component
export const LazyComponent = lazy(async () => {
  await delay(3000); // Simulate loading time
  return {
    default: () => (
      <Card>
        <CardHeader>
          <CardTitle>🎉 Lazy Loaded Component</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This component was loaded dynamically using React.lazy()!</p>
          <p className="text-sm text-gray-600 mt-2">
            It took 3 seconds to load to demonstrate the loading state.
          </p>
        </CardContent>
      </Card>
    ),
  };
});
