import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "../app/(lib-demos)/page";

describe("Page", () => {
  it("renders a heading", () => {
    render(<Home />);

    const headerElement = screen.getByText(
      "try to keep each page as independent as possible",
    );
    expect(headerElement).toBeInTheDocument();
    expect(headerElement.tagName.toLowerCase()).toBe("h2");
  });
});
