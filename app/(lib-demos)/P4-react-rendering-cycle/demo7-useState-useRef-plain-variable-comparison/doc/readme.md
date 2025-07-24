I'll create a simple demo that illustrates the differences between useState, useRef, and normal variables in a React component. I'll use TypeScript, Tailwind CSS, shadcn/ui components, and lucide-react icons.

```tsx
import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Counter, Timer, Variable } from "lucide-react";

const StateDemo = () => {
  // 1. Normal variable - resets on every render
  let normalVariable = 0;

  // 2. useState - persists between renders and triggers re-render
  const [stateVariable, setStateVariable] = useState<number>(0);

  // 3. useRef - persists between renders but doesn't trigger re-render
  const refVariable = useRef<number>(0);

  const updateNormalVariable = () => {
    normalVariable += 1;
    console.log("Normal variable:", normalVariable);
    // This won't update the UI since it's just a regular variable
  };

  const updateStateVariable = () => {
    setStateVariable((prev) => prev + 1);
    // This will update the UI since useState triggers a re-render
  };

  const updateRefVariable = () => {
    refVariable.current += 1;
    console.log("Ref variable:", refVariable.current);
    // This updates the value but won't trigger a re-render
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Variable className="h-6 w-6" />
            Normal Variable
          </CardTitle>
          <CardDescription>
            Resets on every render. Current value: {normalVariable}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={updateNormalVariable} variant="outline">
            Increment Normal Variable
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Counter className="h-6 w-6" />
            useState Variable
          </CardTitle>
          <CardDescription>
            Persists and triggers re-render. Current value: {stateVariable}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={updateStateVariable} variant="default">
            Increment State Variable
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-6 w-6" />
            useRef Variable
          </CardTitle>
          <CardDescription>
            Persists but doesn't trigger re-render. Current value:{" "}
            {refVariable.current}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={updateRefVariable} variant="secondary">
            Increment Ref Variable
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StateDemo;
```

This demo showcases three different ways to store values in a React component:

1. **Normal Variable (`normalVariable`)**:

   - Gets reset to 0 on every render
   - Changes won't be visible in the UI
   - Good for temporary calculations within a single render

2. **useState (`stateVariable`)**:

   - Persists between renders
   - Triggers a re-render when updated using `setStateVariable`
   - Good for values that should update the UI when changed

3. **useRef (`refVariable`)**:
   - Persists between renders
   - Does NOT trigger a re-render when updated
   - Good for values that need to persist but shouldn't cause re-renders
   - Access value using `.current`

Key differences in behavior:

- Try clicking the normal variable button - the displayed value stays at 0, but you'll see updates in the console
- The state variable button will immediately update the UI
- The ref variable button will update the internal value (visible in console) but won't update the UI until something else causes a re-render

Common use cases:

- `useState`: Form inputs, toggles, counters, any UI state
- `useRef`: DOM references, interval IDs, previous values, any value you need to persist without causing re-renders
- Normal variables: Temporary calculations, values derived during render

Would you like me to add any additional examples or explain any part in more detail?


## example: Mutation Observer 

> question: if I am going to have a mutation observer instance for the web app (and I only need 1 instance, either it is null or it has a value), do you recommend me to use useState or useRef?

For a MutationObserver instance, I would definitely recommend using `useRef` over `useState`. Here's why:

1. A MutationObserver is a stateful object that you want to persist between renders but:
   - You don't need to trigger re-renders when it changes
   - You only need to create it once and store a reference to it
   - You typically need to clean it up in useEffect

Let me show you a practical example:



```tsx
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

const MutationObserverDemo = () => {
  // Using useRef since we don't need re-renders when the observer changes
  const observerRef = useRef<MutationObserver | null>(null);
  
  // Ref to the element we want to observe
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create the observer only once
    if (!observerRef.current) {
      observerRef.current = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          console.log('Mutation detected:', mutation.type);
          // Handle the mutation here
          // Note: If you need to update UI based on mutations,
          // you would use a useState here for that specific UI state
        });
      });
    }

    // Start observing when component mounts
    if (targetRef.current) {
      observerRef.current.observe(targetRef.current, {
        attributes: true,
        childList: true,
        subtree: true
      });
    }

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []); // Empty dependency array since we only want to set this up once

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-6 w-6" />
          Observed Content
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={targetRef} className="p-4 border rounded">
          This content is being observed for changes
        </div>
      </CardContent>
    </Card>
  );
};

export default MutationObserverDemo;

```

Here's why `useRef` is better than `useState` in this case:

1. **No Re-renders Needed**:
   - The MutationObserver instance itself doesn't need to trigger re-renders
   - If you used useState, every time you set the observer it would cause an unnecessary re-render

2. **Persistence Between Renders**:
   - `useRef` gives you a stable reference that persists across renders
   - The cleanup function in useEffect can always access the current observer

3. **Single Instance**:
   - As you mentioned, you only need one instance
   - `useRef` is perfect for storing singleton-like instances in React

4. **Performance**:
   - Using useState would trigger re-renders when setting/updating the observer
   - These re-renders would be wasteful since the observer's existence doesn't affect the UI

If you do need to update the UI based on mutations detected by the observer, you would:
1. Keep the observer in `useRef`
2. Use separate `useState` hooks for any UI state that needs to be updated based on the mutations

Would you like to see an example of how to handle UI updates based on mutations while keeping the observer in useRef?