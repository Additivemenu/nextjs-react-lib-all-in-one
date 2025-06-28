import React from "react";

import { faker } from "@faker-js/faker";
import { act, render, screen, waitFor } from "@testing-library/react";

import { renderModal } from "@/lib/test";

import { useModal } from "./hook";
import { ModalHocProps } from "./types";

import ModalManager from ".";

const TestModal = ModalManager.create<ModalHocProps & { message?: string }>(
  ({ message }) => {
    const modal = useModal();

    return (
      <div>
        <h1>{message ?? "Test Message"}</h1>
        <button onClick={() => modal.remove()}>Close</button>
        <button onClick={() => modal.hide()}>Hide</button>
      </div>
    );
  },
);

const TestModal2 = ModalManager.create<ModalHocProps & { message?: string }>(
  ({ message }) => {
    const modal = useModal();

    return (
      <div>
        <h1>{message ?? "Test Message"}</h1>
        <button onClick={() => modal.remove()}>Close</button>
        <button onClick={() => modal.hide()}>Hide</button>
      </div>
    );
  },
);

afterEach(() => {
  act(() => ModalManager.clear());
});

describe.skip("ModalManager", () => {
  it("should throw error if no Provider", async () => {
    render(<div />);

    let err: Error | null = null;

    act(() => {
      try {
        ModalManager.show("test");
      } catch (e) {
        err = e as Error;
      }

      expect(err).toBeInstanceOf(Error);
    });
  });

  it("should render modal with its content", async () => {
    const message = faker.lorem.sentence();
    renderModal(TestModal, { message });

    expect(screen.getByText(message)).toBeVisible();
  });

  it("should remove the modal", async () => {
    const message = faker.lorem.sentence();
    renderModal(TestModal, { message });

    expect(screen.getByText(message)).toBeVisible();

    act(() => {
      ModalManager.remove(TestModal);
    });

    expect(screen.queryByText(message)).toBeNull();
  });

  it("should hide the modal and show again", async () => {
    const message = faker.lorem.sentence();
    renderModal(TestModal, { message });

    expect(screen.getByText(message)).toBeVisible();

    act(() => {
      ModalManager.hide(TestModal);
    });

    await waitFor(() => expect(screen.queryByText(message)).toBeNull());

    act(() => {
      ModalManager.show(TestModal);
    });

    await waitFor(() => expect(screen.queryByText(message)).toBeVisible());
  });

  it("should close the top modal first", async () => {
    const message = faker.lorem.sentence();
    const message2 = faker.lorem.sentence();

    renderModal(TestModal, { message });
    await waitFor(() => expect(screen.queryByText(message)).toBeVisible());
    await waitFor(() => expect(screen.queryByText(message2)).toBeNull());

    renderModal(TestModal2, { message: message2 });
    await waitFor(() => expect(screen.queryByText(message)).toBeVisible());
    await waitFor(() => expect(screen.queryByText(message2)).toBeVisible());

    act(() => {
      ModalManager.remove(TestModal2);
    });
    await waitFor(() => expect(screen.queryByText(message)).toBeVisible());
    await waitFor(() => expect(screen.queryByText(message2)).toBeNull());

    act(() => {
      ModalManager.remove(TestModal);
    });
    // await waitFor(() => expect(screen.queryByText(message)).toBeNull());
    await waitFor(() => expect(screen.queryByText(message2)).toBeNull());
  });
});

describe("ModalManager useModal", () => {
  it("should render modal and show some text", async () => {
    const message = faker.lorem.sentence();
    renderModal(TestModal, { message });

    expect(screen.getByText(message)).toBeVisible();

    act(() => {
      screen.getByText("Close").click();
    });

    expect(screen.queryByText(message)).toBeNull();
  });

  it("should render modal and hide it", async () => {
    const message = faker.lorem.sentence();
    renderModal(TestModal, { message });

    expect(screen.getByText(message)).toBeVisible();

    act(() => {
      screen.getByText("Hide").click();
    });

    await waitFor(() => expect(screen.queryByText(message)).toBeNull());

    act(() => {
      ModalManager.show(TestModal);
    });

    await waitFor(() => expect(screen.queryByText(message)).toBeVisible());
  });
});
