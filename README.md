demo site for a range of libraries in react & javascript community

javascript lib

- XLSX

react lib

- framer motion
- react flow
- @tanstack/react-query
- react hook form + zod
  - with react hook form devtool
- shadcn (on top of radix ui)

css-in-js

- styled-component
- tailwind css is also used for styling

React design patterns

- compound component pattern
  - multi-select
  - dropdown-select

## devops practice

- github workflow actions & CICD pipelines
- unit test for demo component
- Eslint
- Prettier

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev  # preferred
# or
bun dev

# custom scripts -----
pnpm run generate-nav
# this generate nav link in json file (scripts/output/nav/navigation.json),
# it will be used for dynamically render file system based navbar

pnpm run generate-readme-path
# this generate `readme-path.ts` file automatically, so that we can import the readme file path automatically into a react component
# it will be used for displaying the readme content within the webapp, so we can have easier doc <-> app switching
# note the readme.md file for a demo should be sitting together with the demo's page.tsx file
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# in-app readme.md

simulate similar effect like in Docusaurus, but got limitations

- the md file cannot referencing to other md file
- essentially, the md file is sent from server that hosts this webapp. It works in localhost, but might work well in production

> note: Next.js will stripe out the markdown styling, so had to explicitly set styling for the markdown; see those styling in `@/components/viewers`

Two ways to see the readme.md content:

- embedded within the page
  - see React Libs > Ag Grid
  ```ts
  import { readmePath } from "./readme-path";
  import { MarkdownViewer } from "@/components/viewers/markdown-view";

  // in the React component
  <MarkdownViewer filePath={readmePath} />
  ```
- displayed in a modal

  - see React Design Pattern > CreatePortal > Demo2

  ```ts
  import SimpleModalTrigger from "@/app/_components/modals/simple-modal";
  import { MarkdownViewer } from "@/components/viewers/markdown-view";
  import { readmePath } from "./readme-path";

  // in the React component
  <SimpleModalTrigger
    triggerText="see notes"
    modal={{
      title: "Simple Modal",
      content: <MarkdownViewer filePath={readmePath} />,
    }}
  />;
  ```

# Testing

## Unit test

Jest setup in Next.js: https://nextjs.org/docs/app/building-your-application/testing/jest#manual-setup

- better download vscode jest extension for better experience
  - GUI for easy navigation of failed tests
  - pin a single failed test and debug it with breakpoint
- important to explicitly add `aria-label` and `getByRole` for testing

## E2E test

Playwright

see e2e tests in `./e2e`, github workflow action setup in `.github/workflows/playwright.yml`

start from this: https://playwright.dev/docs/intro

- basically the same as you use https://playwright.dev/docs/getting-started-vscode
- very good get started doc, easy to follow and also cover the key concepts in playwright e2e tests:
  - writing test with action and assertions
  - **codegen** for auto generate test scripts
  - run and debug test in UI mode
