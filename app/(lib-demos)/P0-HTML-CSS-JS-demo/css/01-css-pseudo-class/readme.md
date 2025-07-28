# 如何理解 “pseudo class”

是的！你理解得很准确！**伪类(pseudo class)主要代表元素的状态**。

## 🎯 伪类 vs 伪元素的核心区别

**伪类**：描述元素的**状态**或**关系伪元素**：创建**不存在的元素**

## 伪类的几种类型

### 1. **交互状态类**

```css
button:hover { }     /* 鼠标悬停状态 */
input:focus { }      /* 获得焦点状态 */
a:visited { }        /* 链接已访问状态 */
button:active { }    /* 按钮激活状态 */
input:disabled { }   /* 禁用状态 */

```

### 2. **表单状态类**

```css
input:valid { }      /* 表单验证通过状态 */
input:invalid { }    /* 表单验证失败状态 */
input:required { }   /* 必填字段状态 */
input:checked { }    /* 复选框选中状态 */

```

### 3. **结构关系类**

```css
li:first-child { }   /* 第一个子元素状态 */
p:nth-child(2) { }   /* 第二个子元素状态 */
div:empty { }        /* 空内容状态 */

```

## 在渲染流水线中的处理

```
DOM Tree → Style计算 → Layout Tree
           ↗
      伪类在这里计算
    (检查元素当前状态)

```

**举例**：

```html
<button>Click me</button>

```

```css
button:hover {
  background: blue;
}

```

**Style计算阶段**：

- 浏览器检查：用户鼠标是否在button上？
- 如果是 → 应用 `:hover` 样式
- 如果不是 → 不应用

## 关键理解

**伪类不创建新元素**，它们只是：

- 检查现有元素的**当前状态**
- 根据状态决定是否应用特定样式
- 状态改变时，样式会动态更新

```css
/* 这不会创建新元素，只是在button处于hover状态时应用样式 */
button:hover { background: red; }

/* 这会创建一个新的虚拟元素 */
button::before { content: "►"; }

```

所以你的理解完全正确 - **伪类就是用来表示元素在不同状态下的样式变化**！