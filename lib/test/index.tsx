import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  render as baseRender,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";

import ModalManager from "@/components/modal";
import { ModalHocProps } from "@/components/modal/types";
// import { PipelineProvider } from "@/hooks/workflow";
// import { mockReactFlow } from "@/mocks/entities";
import { AnyObj } from "@/types";

/**
 * Renders a component within a workflow to simulate /workflow/{project}
 *
 * @param ui - The component to render.
 * @param options - The render options.
 * @returns The render result.
 */
// export const renderWithinWorkflow = (
//   ui: React.ReactNode,
//   options?: Omit<RenderOptions, "queries">,
// ): RenderResult => {
//   mockReactFlow();

//   jest.mock("next/navigation", () => ({
//     useParams: jest.fn(() => ({
//       project: "1",
//     })),
//   }));
//   return baseRender(
//     <QueryClientProvider client={new QueryClient()}>
//       <ReactFlowProvider>
//         <PipelineProvider>{ui}</PipelineProvider>
//       </ReactFlowProvider>
//     </QueryClientProvider>,
//     options,
//   );
// };

/**
 * Renders a modal component.
 *
 * @param modal - The modal component to render.
 * @param props - The props to pass to the modal component.
 * @param contexts - The contexts to wrap the modal component in.
 * @param options - The render options.
 * @returns The render result.
 */
export const renderModal = (
  modal: React.FC<AnyObj & ModalHocProps>,
  props?: Record<string, unknown>,
  contexts?: {
    component: React.FC<{ children?: React.ReactNode }>;
    props?: Record<string, unknown>;
  }[],
  options?: Omit<RenderOptions, "queries">,
): RenderResult => {
  let screen;
  if (!contexts) {
    screen = baseRender(<ModalManager.Provider />, options);
  } else {
    screen = baseRender(
      contexts
        .toReversed()
        .reduce(
          (acc, { component: ContextComponent, props }) => (
            <ContextComponent {...props}>{acc}</ContextComponent>
          ),
          <ModalManager.Provider />,
        ),
      options,
    );
  }

  act(() => {
    ModalManager.show(modal, props);
  });

  return screen;
};

/**
 * Temporarily ignore act() errors. This is useful when testing components that
 * trigger state updates outside of act().
 *
 * @example
 * ```tsx
 * ignoreActError();
 *
 * test("should render without errors", () => {
 *  render(<Component />);
 *  screen.getByText("Hello, World!");
 *  });
 *  ```
 */
export const ignoreActError = (): void => {
  const consoleError = console.error;
  let mockConsoleError: jest.SpyInstance;
  beforeAll(() => {
    mockConsoleError = jest
      .spyOn(console, "error")
      .mockImplementation((...args) => {
        const message = typeof args[0] === "string" ? args[0] : "";
        if (
          message.includes(
            "When testing, code that resolves suspended data should be wrapped into act(...)",
          )
        ) {
          return;
        }

        return consoleError.call(console, args);
      });
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });
};
