# Usage in UI Libraries vs Application Code

### More Common in UI Libraries/Design Systems

useImperativeHandle is much more frequently used in UI libraries and design systems than in typical application code:

### UI Library Examples

Material-UI (MUI): Components like TextField, Select expose .focus(), .blur() methods
Ant Design: Form components expose validation and reset methods
React Hook Form: Field components expose imperative validation APIs
Headless UI: Components expose imperative focus management
Custom component libraries: Modal components exposing .open(), .close() methods

### Why UI Libraries Use It

Standardized APIs - Provide consistent imperative interfaces across components
DOM Integration - Need to expose native DOM methods (focus, scroll, etc.)
Framework Agnostic - Allow consumers to integrate with different state management patterns
Performance - Avoid unnecessary re-renders in complex components
Accessibility - Programmatic focus management for screen readers

### In Application Code

Less common - Most app logic should use declarative patterns
Used sparingly - Only for specific cases like media players, forms, modals
Often indicates - Might need to reconsider component architecture
