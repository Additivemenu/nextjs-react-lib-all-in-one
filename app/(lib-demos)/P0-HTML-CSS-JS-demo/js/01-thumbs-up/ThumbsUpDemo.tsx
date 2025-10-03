"use client";

import React, { useEffect } from "react";

const ThumbsUpDemo = () => {
  useEffect(() => {
    // The same JavaScript logic but as a React effect
    const handleClick = (ev: MouseEvent) => {
      const { clientX, clientY } = ev;

      document.body.style.setProperty("--left", `${clientX}px`);
      document.body.style.setProperty("--top", `${clientY}px`);

      const tips = document.createElement("div");
      tips.style.setProperty("--left", `${clientX}px`);
      tips.style.setProperty("--top", `${clientY}px`);
      tips.className = "custom-tips";
      document.body.appendChild(tips);

      const dots = createDots(["🎉", "😘", "🎊", "🤡", "🥳", "🤪", "💗"]);
      tips.appendChild(dots);

      document.body.appendChild(createNum());
    };

    // Helper functions (same as original)
    function createDots(emojis: string[]) {
      const temp = document.createDocumentFragment();
      const random_emojis = emojis
        .slice(0, Math.ceil(Math.random() * emojis.length))
        .sort(() => Math.random() - 0.5);

      random_emojis.forEach((emoji) => {
        const dot = document.createElement("div");
        dot.className = "custom-tips-dot";
        dot.setAttribute("emoji", emoji);
        dot.style.setProperty("--d", `${Math.random() * 0.2}s`);
        dot.style.setProperty("--x", `${(Math.random() - 0.5) * 1000}%`);
        temp.appendChild(dot);

        dot.addEventListener("animationend", () => {
          if (
            dot?.parentNode &&
            (dot.parentNode as Element).childElementCount <= 1
          ) {
            (dot.parentNode as Element).remove();
          } else {
            dot.remove();
          }
        });
      });
      return temp;
    }

    function createNum() {
      const current = document.querySelector(".custom-num");
      let num = 1;
      if (current) {
        num = parseInt(current.getAttribute("num") || "1") + 1;
        current.remove();
      }
      const numDiv = document.createElement("div");
      numDiv.className = "custom-num";
      if (num > 1) {
        numDiv.style.setProperty("--d", "-.3s");
      }
      numDiv.setAttribute("num", num.toString());

      numDiv.addEventListener("animationend", () => {
        numDiv.remove();
      });
      return numDiv;
    }

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="h-full w-full bg-black text-white flex items-center justify-center relative overflow-hidden">
      <style jsx global>{`
        .custom-tips {
          position: absolute;
          width: 1em;
          height: 1em;
          margin-left: -0.5em;
          margin-top: -0.5em;
          left: 0;
          top: 0;
          transform: translate(var(--left, 50%), var(--top, 50%));
          border: 1px solid red;
        }

        .custom-tips-dot {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 1;
          outline: 1px solid yellowgreen;
          animation: custom-x 1s var(--d, 0s) linear forwards;
        }

        .custom-tips-dot::before {
          content: attr(emoji, "🎉");
          animation: custom-y 1s var(--d, 0s)
            cubic-bezier(0.56, -1.35, 0.85, 0.36) forwards;
        }

        @keyframes custom-x {
          0% {
            opacity: 1;
            transform: translateX(0%);
          }
          10%,
          90% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: translateX(var(--x, 300%));
          }
        }

        @keyframes custom-y {
          100% {
            transform: translateY(50vh) rotate(1turn);
          }
        }

        .custom-num {
          position: absolute;
          left: 0;
          top: 0;
          display: flex;
          width: 2em;
          height: 2em;
          font-size: 2em;
          color: #fff;
          justify-content: center;
          align-items: center;
          margin-left: -1em;
          margin-top: -2em;
          font-weight: bold;
          text-shadow: 4px 4px 0 rgba(255, 0, 0);
          transform: translate(var(--left), var(--top));
        }

        .custom-num::before {
          content: "+" attr(num);
          opacity: 0;
          animation: count-shark 1s var(--d, 0s);
        }

        @keyframes count-shark {
          0%,
          100% {
            opacity: 0;
            transform: scale(0.4);
          }
          30%,
          70% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      <div className="text-4xl text-white/20">点击屏幕</div>
    </div>
  );
};

export default ThumbsUpDemo;
