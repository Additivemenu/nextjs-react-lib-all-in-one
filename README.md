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
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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
