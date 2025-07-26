```shell
# initially
5. React useEffect after render
Cleanup from previous effect
5. React useEffect after render

# click +1 first time
1. Synchronous code start
4. React state update
1. Synchronous code end
4. React state update
Cleanup from previous effect
5. React useEffect after render
2. First microtask
3. Second microtask
6. Macrotask

# click +1 second time
1. Synchronous code start
4. React state update
1. Synchronous code end
4. React state update
Cleanup from previous effect
5. React useEffect after render
2. First microtask
3. Second microtask
6. Macrotask
```

TODO:

- 绘制一个流程图, 包含 render > commit > effect 以及 React FC 中各类 callback 对应的执行阶段
- question: 为什么 React 的 state update callback (callback in the setState())和 effect 会比手动注册的 micro-task 更早被执行?
  - [doc](./docs/react-vs-microtask.md)
- question: async await 之后的代码也算 Micro-task 吗?

## React FC 中 callback 的分类

是的，你的分类基本正确！在 React 函数组件中，回调函数（callback functions）的执行顺序和类型可以归纳为以下几种，按照**执行时机**和**任务类型**划分：

---

### **1. 同步代码（Sync Code）**

- **执行时机**：立即执行，属于当前调用栈。
- **示例**：
  ```jsx
  const handleClick = () => {
    console.log("1. Sync code"); // 同步代码
    setCount(count + 1);
  };
  ```
- **特点**：阻塞后续代码，直到执行完成。

---

### **2. `setState` 的回调函数（State Update Callback）**

- **执行时机**：在 **Render 阶段**（React 计算新状态时）同步执行。
- **示例**：
  ```jsx
  setCount((prevCount) => {
    console.log("2. State update callback"); // Render 阶段执行
    return prevCount + 1;
  });
  ```
- **特点**：
  - 用于基于前一个状态计算新状态。
  - 在 React 的渲染流程中同步执行，但**不直接触发副作用**。

---

### **3. `useEffect` 的 Cleanup 回调（Cleanup for Previous Effect）**

- **执行时机**：在 **Commit 阶段完成后**，**下一次 Effect 执行前**异步执行。
- **示例**：
  ```jsx
  useEffect(() => {
    console.log("4. Current effect");
    return () => {
      console.log("3. Cleanup from previous effect"); // 先执行清理
    };
  }, [count]);
  ```
- **特点**：
  - 清理上一次渲染的副作用（如取消请求、移除监听）。
  - 能访问到**上一次渲染的依赖值**（闭包特性）。

---

### **4. `useEffect` 的回调函数（Current Effect Callback）**

- **执行时机**：在 **Commit 阶段完成后**异步执行（浏览器绘制后）。
- **示例**：
  ```jsx
  useEffect(() => {
    console.log("4. Current effect"); // 异步执行
  }, [count]);
  ```
- **特点**：
  - 用于处理副作用（如数据请求、DOM 操作）。
  - 能访问到**最新的依赖值**。

---

### **5. 微任务（Microtask - e.g., `Promise.then`）**

- **执行时机**：在当前事件循环的同步代码之后、宏任务之前执行。
- **示例**：

  ```jsx
  Promise.resolve().then(() => {
    console.log("5. Microtask");
  });

  //! async await 之后的代码也算Micro-task吗?
  ```

- **特点**：
  - 优先级高于宏任务（如 `setTimeout`）。
  - 常用于异步操作的即时处理。

---

### **6. 宏任务（Macrotask - e.g., `setTimeout`）**

- **执行时机**：在当前事件循环的微任务之后、下一次事件循环时执行。
- **示例**：
  ```jsx
  setTimeout(() => {
    console.log("6. Macrotask");
  }, 0);
  ```
- **特点**：
  - 异步延迟执行，适合非紧急任务。

---

### **完整执行顺序示例**

假设有以下代码：

```jsx
const Component = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("4. Current effect");
    return () => console.log("3. Cleanup");
  }, [count]);

  const handleClick = () => {
    console.log("1. Sync start");
    setCount((prev) => {
      console.log("2. State update callback");
      return prev + 1;
    });
    Promise.resolve().then(() => console.log("5. Microtask"));
    setTimeout(() => console.log("6. Macrotask"), 0);
    console.log("1. Sync end");
  };

  return <button onClick={handleClick}>Click</button>;
};
```

**输出顺序**：

```plaintext
1. Sync start
1. Sync end
2. State update callback
3. Cleanup (如果之前有 effect)
4. Current effect
5. Microtask
6. Macrotask
```

---

### **关键总结**

1. **同步代码** → **State 更新回调** → **Effect Cleanup** → **Effect 回调** → **微任务** → **宏任务**。
2. React 的生命周期方法（如 `useEffect`）与 JavaScript 事件循环紧密结合。
3. **Cleanup 函数**是避免竞态条件和内存泄漏的核心机制。

你的分类完全正确！这是理解 React 执行模型和副作用管理的关键框架。

# React component re-render !== re-invoke useEffect

好的！我们来梳理完整的流程，包括 **`useEffect` 的 cleanup 函数**，当一个 state 变化时，React 的完整连锁反应如下：

---

### **1. State 变化触发更新**

注意这里只是 React state 变化, 触发 React component 的 re-rendering 流程, 还没到浏览器的 reflow/repaint那步

```jsx
const [count, setCount] = useState(0);
setCount(1); // 触发重新渲染
```

---

### **2. Render 阶段（计算新 Virtual DOM）**

对应 React Fiber 架构中的 scheduler(决定何时做), reconciler(决定做什么 - React Diffing 算法, 双 fiber tree (前缓存和后缓存)), 这个阶段纯纯在用浏览器主渲染线程跑 js 代码

- React 调用组件函数，生成新的 JSX（**此时 DOM 还未更新**）。
- 如果组件有子组件，递归执行相同过程。
- **注意**：此阶段可能被高优先级任务中断（React 18 并发模式）。

---

### **3. Commit 阶段（更新真实 DOM）**

对应 React Fiber 架构中的 renderer(拿 reconciler 给的 VDOM blueprint, 真正去更新 DOM tree, 这会进而触发浏览器的渲染管线对 DOM 的更新作出反应)

1. **Before Mutation**（突变前）：
   - 执行 `useLayoutEffect` 的 cleanup 函数（如果依赖项变化）。
2. **Mutation**（突变）：
   - 将 Virtual DOM 差异应用到真实 DOM（用户此时看到最新 UI）。
3. **Layout**（布局）：
   - 执行 `useLayoutEffect` 的回调函数（同步执行，阻塞浏览器绘制）。
4. **Paint**（浏览器绘制）：
   - 浏览器将更新后的 DOM 渲染到屏幕。

---

### **4. Effect 阶段（异步执行副作用）**

在浏览器的 paint 完成之后,

1. **Cleanup 上一次的 Effect**（如果依赖项变化）：
   ```jsx
   useEffect(() => {
     console.log("Effect ran");
     return () => {
       console.log("Cleanup from previous effect"); // 先执行清理！
     };
   }, [count]);
   ```
   - 如果 `count` 从 `0` 变为 `1`，React 会先执行**上一次 Effect 的 cleanup 函数**（如果有）。
   - **执行顺序**：
     ```plaintext
     Cleanup from previous effect (清理旧的 count=0 的 effect)
     Effect ran (运行新的 count=1 的 effect)
     ```
2. **执行新的 Effect**：
   - 在浏览器绘制完成后**异步**执行 `useEffect` 的回调。

---

### **完整流程总结（假设 `count` 从 0 → 1）**

1. **State 更新**：`setCount(1)` 触发重新渲染。
2. **Render 阶段**：生成新的 Virtual DOM。
3. **Commit 阶段**：
   - 更新真实 DOM。
   - 执行 `useLayoutEffect` 的 cleanup（如有）→ 回调（如有）。
4. **Effect 阶段**（异步）：
   - **先清理**：执行上一次 `useEffect` 的 cleanup（对应 `count=0`）。
   - **再执行**：运行新的 `useEffect` 回调（对应 `count=1`）。

---

### **关键点**

1. **Cleanup 的时机**：

   - 总是在**下一次 Effect 执行前**运行，且针对**上一次的依赖值**。
   - 类似 `componentWillUnmount` + 依赖项变化的组合。

2. **与 `useLayoutEffect` 的区别**：

   - `useLayoutEffect` 的 cleanup 和回调在 **Commit 阶段同步执行**（会阻塞绘制）。
   - `useEffect` 的 cleanup 和回调在 **绘制后异步执行**（不阻塞 UI）。

3. **首次渲染 vs 更新**：
   - **首次渲染**：只有 `useEffect` 回调执行（无 cleanup）。
   - **后续更新**：先 cleanup 上一次，再执行新回调。

---

### **示例场景**

```jsx
useEffect(() => {
  const timer = setInterval(() => console.log(count), 1000);
  return () => clearInterval(timer); // Cleanup 上一次的 timer
}, [count]);
```

- 当 `count` 变化时，React 会先清除旧的 timer（避免内存泄漏），再启动新的 timer。

---

通过这种机制，React 确保了副作用的**安全管理和资源释放**，避免内存泄漏或竞态条件！

# DOM 更新 !== 浏览器绘制

完全正确！这是两个完全不同的概念，很多人容易混淆：

## DOM 更新 vs 浏览器绘制

### 1. DOM 更新（JavaScript 层面）
```javascript
// 这些操作只是更新了 DOM 树的数据结构
element.innerHTML = 'new content';
element.style.color = 'red';
element.appendChild(newNode);

// 此时：
// ✅ DOM 树已经被修改
// ❌ 用户还看不到变化（屏幕上还是旧的）
```

### 2. 浏览器绘制（渲染引擎层面）
DOM 更新后，浏览器需要经过完整的渲染管线：

```
DOM 更新 → Style → Layout → Paint → Composite → 显示到屏幕
         ↑                                    ↑
      JS 操作完成                          用户看到变化
```

## React 中的精确时序

```javascript
function MyComponent() {
  const [count, setCount] = useState(0);
  
  useLayoutEffect(() => {
    console.log('1. DOM 已更新，但浏览器还未绘制');
    // 此时可以同步读取最新的 DOM 尺寸
    const height = document.getElementById('my-div').offsetHeight;
    // 但用户屏幕上还是旧的内容！
  });
  
  useEffect(() => {
    console.log('2. 浏览器已经绘制完成');
    // 此时用户已经看到了最新的 UI
    // 适合执行不影响布局的副作用
  });
  
  return <div id="my-div">{count}</div>;
}
```

## 实际执行流程

```
用户点击按钮 setCount(1)
     ↓
React Render 阶段（计算新 VDOM）
     ↓
React Commit 阶段：
├─ DOM 更新：div.textContent = "1"  ← DOM 树已变化
├─ useLayoutEffect 执行             ← 可读取新 DOM，但屏幕还是旧的
     ↓
浏览器渲染管线：
├─ Style Calculation
├─ Layout (Reflow)  
├─ Paint (Repaint)
├─ Composite                        ← 屏幕显示新内容
     ↓
useEffect 异步执行                   ← 用户已经看到变化
```

## 为什么这样设计？

### useLayoutEffect 的使用场景：
```javascript
function MeasureExample() {
  const [height, setHeight] = useState(0);
  
  useLayoutEffect(() => {
    // 需要在浏览器绘制前同步测量
    const element = document.getElementById('content');
    const newHeight = element.scrollHeight;
    
    if (newHeight !== height) {
      setHeight(newHeight); // 触发重新渲染，避免闪烁
    }
  });
  
  return (
    <div>
      <div id="content" style={{ height: `${height}px` }}>
        动态内容...
      </div>
    </div>
  );
}
```

### useEffect 的使用场景：
```javascript
function LogExample() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // 在用户看到变化后，异步执行不影响 UI 的操作
    analytics.track('count_changed', { count });
    localStorage.setItem('count', count);
  }, [count]);
  
  return <div>{count}</div>;
}
```

所以你的理解完全正确：**DOM 更新是数据层面的变化，浏览器绘制是视觉层面的呈现**，React 巧妙地利用了这个时间差来优化用户体验！