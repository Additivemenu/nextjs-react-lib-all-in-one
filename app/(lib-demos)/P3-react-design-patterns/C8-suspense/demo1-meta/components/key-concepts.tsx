import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const KeyConcepts: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>🔑 Key Concepts Demonstrated</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Suspense Benefits:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Declarative loading states</li>
              <li>• Better user experience</li>
              <li>• Prevents layout shifts</li>
              <li>• Composable async patterns</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Pattern Used:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Resource pattern for data fetching</li>
              <li>• Throwing promises to trigger Suspense</li>
              <li>• Nested Suspense boundaries</li>
              <li>• Error boundaries for error handling</li>
            </ul>
          </div>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Try this:</strong> Click &quot;Switch User&quot; or
            &quot;Refresh Data&quot; to see how Suspense gracefully handles the
            loading states without flickering or layout jumps!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
