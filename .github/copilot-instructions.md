This repo builds a Next.js based application with TypeScript, Tailwind CSS, and a custom theme. It is used for me to learn and experiment with these technologies and patterns:

- HTML, CSS, and vanilla JavaScript demos
- some javascript libraries
- some open source React libraries
  - React Tanstack Query
  - React Hook Form & Zod
  - AG Grid
  - Framer Motion
- React api and patterns
  - reducer patterns
  - controlled vs uncontrolled components
  - createPortal
  - forwardRef and useImperativeHandle
  - React events
- React components and hooks life cycles
- Next.js features
- TypeScript features
- Tailwind CSS features

All the code is written in TypeScript except for the HTML, CSS, and JavaScript demos (where I used iframe to embed them into the Next.js app). The code is organized in a way that allows for easy navigation and understanding of the different technologies and patterns used - each Next.js page corresponds to a specific standalone demo or example (the page are usually just independent unless I tell you explicitly), sometimes a readme.md file is also provided at the same level to the page.tsx file to explain the demo or example in more detail.

Often times I will ask you to help me with writing code for a specific demo or example, or to explain a concept related to the technologies and patterns mentioned above. I will also ask you to help me with writing documentation for the demos and examples, as well as for the overall project.

When you are working on this repo, please keep the following in mind:
- Follow the coding standards and best practices for TypeScript, React, and Tailwind CSS.
- For React code: 
  - Follow React's Unidirectional Data Flow: data flows down, events bubble up.
  - Follow SOLID principles and design patterns where applicable.
    - but don't over-engineer the code, keep it simple and easy to understand.
      - e.g. decompose complex components into smaller components (but don't overdo it, keep the number of components manageable).
    - Use hooks to encapsulate logic and state management.
    - where applicable, use reducer patterns to manage complex state.
- When you add new demo or modify existing ones, make sure to document them in the readme.md file of the corresponding page.
