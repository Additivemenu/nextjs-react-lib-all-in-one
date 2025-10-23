// https://mp.weixin.qq.com/s/eR4obTw_qFcu-Tng2dVhDw
document.addEventListener("click", (ev) => {
  const { clientX, clientY } = ev;

  document.body.style.setProperty("--left", `${clientX}px`);
  document.body.style.setProperty("--top", `${clientY}px`);

  // 创建一个 div 盒子
  // 该盒子上面也挂上 --left 和 --top 两个变量
  const tips = document.createElement("div");
  tips.style.setProperty("--left", `${clientX}px`);
  tips.style.setProperty("--top", `${clientY}px`);
  // 挂上一个样式类
  tips.className = "custom-tips";
  // 添加到页面上
  document.body.appendChild(tips);

  const dots = createDots(["🎉", "😘", "🎊", "🤡", "🥳", "🤪", "💗"]);
  tips.appendChild(dots);

  document.body.appendChild(createNum());
});

/**
 *
 * @param {*} emojis
 * @returns
 */
function createDots(emojis) {
  const temp = document.createDocumentFragment();
  // 核心就是新增了下面这段逻辑，打乱 emoji 的顺序
  const random_emojis = emojis
    .slice(0, Math.ceil(Math.random() * emojis.length))
    .sort(() => Math.random() - 0.5);

  random_emojis.forEach((emoji) => {
    const dot = document.createElement("div");
    dot.className = "custom-tips-dot";
    dot.setAttribute("emoji", emoji);
    dot.style.setProperty("--d", `${Math.random() * 0.2}s`); // 每个点0 ~ 0.2s 随机延迟，避免"同时起跳"的死板感。
    dot.style.setProperty("--x", `${(Math.random() - 0.5) * 1000}%`); // 范围 (-500% ~ 500%)，也就是向左/右最多 10× 自身宽度的位移
    temp.appendChild(dot);

    // 新增逻辑
    dot.addEventListener("animationend", () => {
      console.log(
        "dot.parentNode",
        dot.parentNode,
        dot.parentNode?.childElementCount,
      );
      if (dot?.parentNode?.childElementCount <= 1) {
        dot.parentNode.remove();
      } else {
        dot.remove();
      }
    });
  });
  return temp;
}

/**
 *
 * @returns
 */
function createNum() {
  const current = document.querySelector(".custom-num");
  let num = 1;
  if (current) {
    num = parseInt(current.getAttribute("num")) + 1; // 数字递增
    current.remove(); // 将旧的移除
  }
  const numDiv = document.createElement("div");
  numDiv.className = "custom-num";
  if (num > 1) {
    numDiv.style.setProperty("--d", "-.3s");
  }
  numDiv.setAttribute("num", num);

  // 新增逻辑
  numDiv.addEventListener("animationend", () => {
    numDiv.remove();
  });
  return numDiv;
}
