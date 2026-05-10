"use client";

import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ─────────────────────────────────────────────
// Section 1 – basic motion: initial / animate / transition
// ─────────────────────────────────────────────
const BasicAnimationDemo = () => {
  const [visible, setVisible] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          1. Basic Motion —{" "}
          <code className="text-sm font-mono bg-muted px-1 rounded">
            initial / animate / transition
          </code>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          A <code>motion.div</code> accepts <code>initial</code> (start state),{" "}
          <code>animate</code> (target state) and <code>transition</code>{" "}
          (timing / easing).
        </p>
        <Button size="sm" onClick={() => setVisible((v) => !v)}>
          {visible ? "Reset" : "Animate"}
        </Button>
        <div className="h-20 flex items-center">
          <motion.div
            className="w-16 h-16 rounded-xl bg-violet-500"
            initial={{ opacity: 0, x: -60 }}
            animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">{`<motion.div
  initial={{ opacity: 0, x: -60 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
/>`}</pre>
      </CardContent>
    </Card>
  );
};

// ─────────────────────────────────────────────
// Section 2 – Variants
// ─────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      // stagger children by 0.15 s each
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const VariantsDemo = () => {
  const [show, setShow] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          2. Variants &amp; Staggered Children
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Named animation states (variants) can be shared across a parent and
          its children. The parent orchestrates the sequence with{" "}
          <code>staggerChildren</code>.
        </p>
        <Button size="sm" onClick={() => setShow((v) => !v)}>
          {show ? "Hide" : "Show list"}
        </Button>
        <motion.ul
          className="space-y-2"
          variants={containerVariants}
          initial="hidden"
          animate={show ? "visible" : "hidden"}
        >
          {["Alpha", "Beta", "Gamma", "Delta"].map((label) => (
            <motion.li
              key={label}
              variants={itemVariants}
              className="px-4 py-2 rounded-lg bg-sky-100 dark:bg-sky-900 text-sm font-medium"
            >
              {label}
            </motion.li>
          ))}
        </motion.ul>
        <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">{`const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

<motion.ul variants={container} initial="hidden" animate="visible">
  <motion.li variants={item}>…</motion.li>
</motion.ul>`}</pre>
      </CardContent>
    </Card>
  );
};

// ─────────────────────────────────────────────
// Section 3 – Gesture animations
// ─────────────────────────────────────────────
const GestureDemo = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">
        3. Gesture Animations —{" "}
        <code className="text-sm font-mono bg-muted px-1 rounded">
          whileHover / whileTap
        </code>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Framer Motion tracks pointer events and applies the given animation
        state while the gesture is active.
      </p>
      <div className="flex gap-4 flex-wrap">
        <motion.button
          className="px-5 py-2 rounded-xl bg-emerald-500 text-white font-semibold text-sm cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          Hover &amp; tap me
        </motion.button>

        <motion.div
          className="w-16 h-16 rounded-full bg-rose-400 cursor-pointer"
          whileHover={{ rotate: 180, backgroundColor: "#f97316" }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">{`<motion.button
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 15 }}
>…</motion.button>`}</pre>
    </CardContent>
  </Card>
);

// ─────────────────────────────────────────────
// Section 4 – AnimatePresence (mount / unmount)
// ─────────────────────────────────────────────
const AnimatePresenceDemo = () => {
  const [items, setItems] = useState([1, 2, 3]);

  const addItem = () =>
    setItems((prev) => [...prev, prev.length > 0 ? Math.max(...prev) + 1 : 1]);
  const removeItem = (id: number) =>
    setItems((prev) => prev.filter((i) => i !== id));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          4. AnimatePresence — animate mount &amp; unmount
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Wrap dynamic children in <code>{"<AnimatePresence>"}</code> so that
          elements can animate out before being removed from the DOM (the{" "}
          <code>exit</code> prop).
        </p>
        <div className="flex gap-2">
          <Button size="sm" onClick={addItem}>
            Add
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => removeItem(items[items.length - 1])}
            disabled={items.length === 0}
          >
            Remove last
          </Button>
        </div>
        <ul className="space-y-2 min-h-[3rem]">
          <AnimatePresence>
            {items.map((id) => (
              <motion.li
                key={id}
                layout
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between px-4 py-2 rounded-lg bg-amber-100 dark:bg-amber-900 text-sm"
              >
                <span>Item {id}</span>
                <button
                  onClick={() => removeItem(id)}
                  className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                >
                  ✕
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">{`<AnimatePresence>
  {items.map(id => (
    <motion.li
      key={id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
    />
  ))}
</AnimatePresence>`}</pre>
      </CardContent>
    </Card>
  );
};

// ─────────────────────────────────────────────
// Section 5 – useMotionValue + useTransform
// ─────────────────────────────────────────────
const MotionValueDemo = () => {
  const x = useMotionValue(0);
  // map x [-150, 150] → rotate [-30, 30] degrees
  const rotate = useTransform(x, [-150, 150], [-30, 30]);
  // map x [-150, 150] → background hue [200, 340]
  const background = useTransform(
    x,
    [-150, 150],
    ["hsl(200,70%,60%)", "hsl(340,70%,60%)"],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          5. useMotionValue + useTransform
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          <code>useMotionValue</code> creates a reactive value that doesn&apos;t
          trigger re-renders. <code>useTransform</code> maps it to derived
          values — great for scroll-driven or drag-driven effects.
        </p>
        <div className="flex justify-center items-center h-32 bg-muted rounded-xl overflow-hidden select-none">
          <motion.div
            drag="x"
            dragConstraints={{ left: -150, right: 150 }}
            style={{ x, rotate, background }}
            className="w-16 h-16 rounded-xl cursor-grab active:cursor-grabbing"
          />
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Drag the box left / right
        </p>
        <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">{`const x = useMotionValue(0);
const rotate = useTransform(x, [-150, 150], [-30, 30]);

<motion.div
  drag="x"
  dragConstraints={{ left: -150, right: 150 }}
  style={{ x, rotate }}
/>`}</pre>
      </CardContent>
    </Card>
  );
};

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function FramerMotionDemo1Page() {
  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Framer Motion — Core Concepts</h1>
          <div className="flex flex-wrap gap-2">
            {[
              "motion",
              "variants",
              "gestures",
              "AnimatePresence",
              "useMotionValue",
            ].map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <BasicAnimationDemo />
        <VariantsDemo />
        <GestureDemo />
        <AnimatePresenceDemo />
        <MotionValueDemo />
      </div>
    </div>
  );
}
