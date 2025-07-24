the logs is

```ts
// under React Strict mode
Effect running  //  mount in 1st render
Cleanup from previous effect // unmount in 1st render
Effect running // mount in 2nd render
```
