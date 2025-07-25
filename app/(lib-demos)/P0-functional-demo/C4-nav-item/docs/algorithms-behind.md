### Algorithm Characteristics

#### DFS Traversal Pattern

- **Pre-order traversal**: Process current node before children
- **Path tracking**: Accumulate parent nodes as we traverse down
- **Early termination**: Stop searching once target is found
- **Backtracking**: Return empty array if not found in current branch

#### Time Complexity

- **Best Case**: O(1) - target is at root level
- **Average Case**: O(log n) - for balanced trees
- **Worst Case**: O(n) - target is at deepest leaf or not found
- Where n = total number of nodes in the navigation tree

#### Space Complexity

- **Call Stack**: O(h) where h is the height of the tree
- **Path Storage**: O(h) for storing parent paths
- **Overall**: O(h) which is O(log n) for balanced trees, O(n) for skewed trees

### Supporting Algorithms

#### State Management Pattern

```typescript
// React state update pattern with functional updates
setExpandedKeys((prev) => {
  const newSet = new Set(prev);
  if (newSet.has(itemPath)) {
    newSet.delete(itemPath); // Toggle off
  } else {
    newSet.add(itemPath); // Toggle on
  }
  return newSet;
});
```

This uses:

- **Set data structure** for O(1) lookup/insertion/deletion
- **Immutable updates** for React state management
- **Toggle logic** for manual expand/collapse

#### Controlled Component Pattern

```typescript
// State propagation algorithm
const isOpen = expandedKeys ? expandedKeys.has(item.path) : localIsOpen;
```

This implements:

- **Controlled vs Uncontrolled state** decision tree
- **O(1) lookup** using Set.has()
- **Fallback mechanism** for backward compatibility

### Algorithm Design Patterns Used

#### 1. Visitor Pattern (Tree Traversal)

- The DFS function "visits" each node in the tree
- Applies a condition check at each node
- Accumulates state (parent path) during traversal

#### 2. Command Pattern (State Updates)

- `onToggleExpand` encapsulates state change operations
- Allows decoupling of UI events from state management
- Enables undo/redo possibilities

#### 3. Observer Pattern (React useEffect)

- `useEffect` observes pathname changes
- Triggers re-computation when dependencies change
- Implements reactive programming paradigm

### Why This Algorithm Choice?

#### DFS vs BFS Comparison

| Aspect             | DFS (Chosen)  | BFS (Alternative) |
| ------------------ | ------------- | ----------------- |
| **Memory**         | O(h) - height | O(w) - width      |
| **Path Tracking**  | Natural       | Complex           |
| **Early Exit**     | Efficient     | Less efficient    |
| **Tree Structure** | Perfect fit   | Overkill          |

#### Why DFS is Optimal Here

1. **Natural Path Tracking**: DFS naturally accumulates the path from root to target
2. **Memory Efficient**: Only stores current branch, not entire level
3. **Early Termination**: Stops immediately when target is found
4. **Tree Structure Match**: Navigation trees are typically deep but narrow

### Algorithm Optimization Techniques

#### Early Termination

```typescript
if (found.length > 0) {
  return found; // Stop searching other branches
}
```

#### Path Accumulation (Avoid Reconstruction)

```typescript
// Efficient: Build path during traversal
[...parents, item.path];

// vs Inefficient: Reconstruct path after finding target
```

#### Set-based Lookups

```typescript
// O(1) lookup instead of O(n) array search
expandedKeys.has(item.path);
```

### Algorithm Complexity Summary

For a navigation tree with n nodes and height h:

- **Time**: O(n) worst case, O(log n) average case
- **Space**: O(h) for call stack and path storage
- **Lookup**: O(1) for checking if item should be expanded
- **Update**: O(1) for toggling expansion state

This makes it very efficient even for large navigation structures, with the algorithm scaling well as the project grows!

## 7. Implementation Notes

### Key Design Decisions

1. **Controlled vs Uncontrolled Components**: We chose controlled components for predictable state management
2. **Set vs Array for State**: Set provides O(1) lookups vs O(n) for arrays
3. **DFS vs BFS**: DFS naturally tracks paths and uses less memory
4. **Recursive vs Iterative**: Recursive approach is more readable and natural for tree structures

### Performance Considerations

- The algorithm is optimized for typical navigation trees (deep but narrow)
- Early termination prevents unnecessary traversal
- Set-based state management ensures fast lookups
- Path accumulation avoids expensive reconstruction

### Edge Cases Handled

- **Path not found**: Returns empty array, no items expanded
- **Multiple matching paths**: Returns first found (DFS order)
- **Root level paths**: Handles efficiently with O(1) complexity
- **Deep nesting**: Scales well with tree height

## 8. Complete Implementation Example

Here's the complete implementation showing all the components working together:

### Sidebar Component

```typescript
export default function Sidebar() {
  const pathname = usePathname();
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const keysToExpand = getExpandedKeys(navigation, pathname);
    setExpandedKeys(new Set(keysToExpand));
  }, [pathname]);

  return (
    <nav>
      {navigation.map((item, index) => (
        <NavItem
          key={`root-${index}`}
          item={item}
          expandedKeys={expandedKeys}
          onToggleExpand={(itemPath: string) => {
            setExpandedKeys((prev) => {
              const newSet = new Set(prev);
              if (newSet.has(itemPath)) {
                newSet.delete(itemPath);
              } else {
                newSet.add(itemPath);
              }
              return newSet;
            });
          }}
        />
      ))}
    </nav>
  );
}
```

### NavItem Component

```typescript
function NavItem({
  item,
  level = 0,
  expandedKeys,
  onToggleExpand,
}: NavItemProps) {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const isOpen = expandedKeys ? expandedKeys.has(item.path) : localIsOpen;
  const hasChildren = item.children && item.children.length > 0;
  const pathname = usePathname();
  const isActive = pathname === item.path;

  const handleToggle = () => {
    if (onToggleExpand) {
      onToggleExpand(item.path);
    } else {
      setLocalIsOpen(!localIsOpen);
    }
  };

  return (
    <div>
      {item.hasPage && !hasChildren ? (
        <Link href={item.path} className={isActive ? "active" : ""}>
          📄 {item.name}
        </Link>
      ) : (
        <button onClick={handleToggle}>
          {item.hasPage ? "📄" : "📁"} {item.name}
          {hasChildren && <span>{isOpen ? "▼" : "▶"}</span>}
        </button>
      )}

      {hasChildren && isOpen && (
        <div>
          {item.children.map((child, index) => (
            <NavItem
              key={`${item.path}-${index}`}
              item={child}
              level={level + 1}
              expandedKeys={expandedKeys}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

This implementation demonstrates how **classic tree algorithms** can be effectively applied to **modern React state management** problems, showing the continued relevance of fundamental computer science concepts in practical web development.
