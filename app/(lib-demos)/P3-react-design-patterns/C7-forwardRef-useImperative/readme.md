# React useImperativeHandle vs Lifting State Up

## Best Practices

### Do:

- Expose only the minimum necessary methods
- Use descriptive method names
- Include proper TypeScript types
- Document the imperative API clearly
- Consider if lifting state up would be simpler first

### Don't:

- Expose internal state directly
- Use for general component communication
- Overuse - prefer declarative patterns when possible
- Forget to handle edge cases (component unmounting, etc.)

## Summary

- **Default choice**: Lift state up for most scenarios
- **Special cases**: Use useImperativeHandle for imperative methods and specific control patterns
- **Your VideoPlayer example**: Classic and valid use case for useImperativeHandle
- **Remember**: It's an escape hatch - use sparingly and purposefully

# Understanding useImperativeHandle

### What it does

- Uses `useImperativeHandle` with `forwardRef` to expose specific methods from child to parent component
- Allows parent to control child's internal state and behavior via a ref
- State remains encapsulated inside the child component
- Parent can interact with child through exposed API methods (play, pause, setVolume, etc.)

### Key benefit

- Keeps child component self-contained while still allowing parent control
- No need to lift state up to parent component

## Common Patterns Comparison

### Lifting State Up (Recommended Default)

- **Most common and recommended** React pattern
- Used when parent needs to fully control child's state
- Causes re-renders based on state changes
- Best for general data/state sharing

### useImperativeHandle (Escape Hatch)

- Officially supported but considered an **escape hatch**
- Used for specific scenarios, not general state management
- Avoids unnecessary re-renders
- Prevents prop drilling in certain cases

> **React Documentation Quote**: "Imperative code using refs should be avoided in most cases. However, sometimes it's necessary to expose imperative methods to the parent component."

### Code Example

```jsx
// Child component with useImperativeHandle
const VideoPlayer = forwardRef((props, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  useImperativeHandle(ref, () => ({
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    setVolume: (vol) => setVolume(vol),
    getStatus: () => ({ isPlaying, volume }),
  }));

  return <video {...props} />;
});

// Parent component
const App = () => {
  const videoRef = useRef();

  const handlePlay = () => videoRef.current?.play();
  const handlePause = () => videoRef.current?.pause();

  return (
    <div>
      <VideoPlayer ref={videoRef} src="video.mp4" />
      <button onClick={handlePlay}>Play</button>
      <button onClick={handlePause}>Pause</button>
    </div>
  );
};
```

## :white_check_mark: When to Use useImperativeHandle

Valid Use Cases: 

:white_check_mark: [Usage in UI Libraries vs Application Code](./docs/usage-in-UI-lib-vs-app-code.md)

1. **Focus, Selection, or Media Controls**

   - Exposing `.focus()` method for input fields
   - Exposing `.play()`, `.pause()` methods for media players
   - Managing selection states

2. **Triggering Animations or Resets**

   - Parent needs to trigger animations in child
   - Resetting child's internal state without lifting state up

3. **Third-Party Library Integration**

   - Child wraps non-React components (jQuery widgets, custom players)
   - Need to expose library methods to parent

4. **Performance Optimization**
   - Child manages its own state
   - Parent can trigger actions without causing re-renders
   - Avoiding unnecessary re-renders on parent state changes

## Decision Guidelines

### Use **Lifting State Up** when:

- General data/state sharing between components
- Parent needs to control and react to child state changes
- Standard UI state management

### Use **useImperativeHandle** when:

- Need to expose controlled, imperative API from child to parent
- Lifting state up would be awkward or inefficient
- Managing imperative actions rather than reactive state
- Working with media controls, focus management, or third-party integrations

### Potential Drawbacks

- **Breaks React's declarative paradigm** - introduces imperative code
- **Harder to test** - methods called via refs are less predictable
- **Debugging complexity** - state changes happen outside normal React flow
- **TypeScript complexity** - requires proper typing for ref methods

### Testing Challenges

- Need to test imperative methods separately
- State changes don't trigger normal React testing patterns
- May require more complex test setup

### Alternative Patterns to Consider

1. **Render Props** - For sharing behavior between components
2. **Custom Hooks** - For sharing stateful logic
3. **Context API** - For deeply nested state sharing
4. **State Management Libraries** - Redux, Zustand for complex state
