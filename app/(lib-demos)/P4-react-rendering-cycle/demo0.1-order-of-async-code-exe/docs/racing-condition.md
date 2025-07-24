在 React 中，**竞态条件（Race Condition）** 通常指的是由于异步操作的执行顺序不确定，导致代码逻辑出现意外行为的情况。特别是在 `useEffect` 中处理副作用（如数据请求、订阅、定时器等）时，如果没有正确清理，可能会引发以下问题：

---

### **常见的竞态条件场景**
#### **1. 数据请求（Fetch）的竞态条件**
假设有一个组件根据 `id` 变化发起数据请求：
```jsx
useEffect(() => {
  let isActive = true; // 标志位

  fetch(`/api/data/${id}`)
    .then((res) => res.json())
    .then((data) => {
      if (isActive) { // 只有当前请求未被取消时更新状态
        setData(data);
      }
    });

  return () => {
    isActive = false; // 清理函数：取消未完成的请求
  };
}, [id]); // 依赖 id
```
**问题**：  
如果用户快速切换 `id`（如从 `id=1` 切换到 `id=2`），两个请求可能同时发出，且 `id=2` 的请求先返回，`id=1` 的请求后返回，导致最终显示的是 `id=1` 的错误数据。

**解决**：  
通过 cleanup 函数设置 `isActive` 标志位，确保只处理**最后一次请求**的结果。

---

#### **2. 定时器（setInterval）的竞态条件**
```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log("Timer tick");
  }, 1000);

  return () => clearInterval(timer); // 清理函数：清除定时器
}, [count]);
```
**问题**：  
如果 `count` 变化频繁，而旧的定时器未被清除，会导致多个定时器同时运行（内存泄漏）。

**解决**：  
通过 cleanup 函数清除旧的定时器。

---

#### **3. 订阅（Event Listeners / WebSocket）的竞态条件**
```jsx
useEffect(() => {
  const handleScroll = () => console.log("Scrolling");
  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll); // 清理函数：移除监听
  };
}, []);
```
**问题**：  
如果组件多次渲染，可能会重复绑定事件监听器。

**解决**：  
通过 cleanup 函数移除旧的监听器。

---

### **为什么 `useEffect` 的 Cleanup 能避免竞态条件？**
1. **保证顺序性**：  
   - 每次依赖项变化时，React 会**先执行上一次的 cleanup**，再运行新的 effect。  
   - 例如在数据请求中，cleanup 会标记旧请求为“废弃”，确保只处理最新请求。

2. **资源释放**：  
   - 清除定时器、取消订阅、终止请求等操作，防止内存泄漏或重复执行。

3. **与依赖项同步**：  
   - Cleanup 函数总能访问到**上一次渲染的依赖值**（闭包特性），而新的 effect 使用最新值。

---

### **竞态条件的本质**
竞态条件的核心是**“操作的完成顺序影响最终结果”**。在 React 中，由于以下原因容易引发竞态：
- 副作用是异步的（如请求、定时器）。
- 组件可能频繁重新渲染（依赖项变化）。
- 未清理的旧副作用与新副作用冲突。

---

### **最佳实践**
1. **始终为 `useEffect` 提供 cleanup 函数**，尤其是异步操作。
2. **使用标志位或 AbortController**（用于 fetch）显式取消旧操作。
   ```jsx
   useEffect(() => {
     const abortController = new AbortController();
     fetch(url, { signal: abortController.signal })
       .then(/* ... */)
       .catch((e) => {
         if (e.name !== 'AbortError') console.error(e);
       });

     return () => abortController.abort(); // 取消请求
   }, [url]);
   ```
3. **避免依赖项不完整的 `useEffect`**，否则 cleanup 可能无法正确触发。

---

### **总结**
React 的 `useEffect` + cleanup 机制通过以下方式解决竞态条件：
1. **清理旧副作用** → 避免残留操作干扰新状态。
2. **依赖项驱动** → 确保副作用与当前数据同步。
3. **异步安全** → 在浏览器绘制后执行，减少对性能的影响。

这就是为什么在 React 中正确处理 cleanup 是避免竞态条件的关键！