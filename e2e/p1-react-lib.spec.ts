import { test, expect } from "@playwright/test";

test("should display all p1 title links", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000/");
  await page.getByRole("link", { name: "P1: react libs" }).click();

  await expect(
    page.getByRole("link", { name: "C0: error boundary" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "C2-react-flow" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "C3-react-query" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "C4-zustand" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "C5-react-hook-form-zod" }),
  ).toBeVisible();
});

test("should toggle boom panel on click a button", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000/");
  await page.getByRole("link", { name: "P1: react libs" }).click();
  await page.getByRole("link", { name: "C0: error boundary" }).click();
  await expect(
    page.getByRole("link", { name: "Demo 3: React-Error-Boundary" }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Demo 3: React-Error-Boundary" })
    .click();

  await page.waitForTimeout(1000); // ! sometimes this is needed
  const openBombPanelButton = page.getByRole("button", {
    name: "Open Bomb Panel",
  });
  await expect(openBombPanelButton).toBeVisible();

  await openBombPanelButton.click();

  await expect(
    page.getByText(
      "This is a bomb panel. It will explode if you click the button below.",
    ),
  ).toBeInViewport();
  await page.waitForTimeout(2000); // ! sometimes this is needed
  await openBombPanelButton.click();
  await expect(
    page.getByText(
      "This is a bomb panel. It will explode if you click the button below.",
    ),
  ).not.toBeInViewport({ ratio: 0.2 });
});

test.skip("should toggle boom panel on click a button - 2", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:3000/");
  await page.getByRole("link", { name: "P1: react libs" }).click();
  await page.getByRole("link", { name: "C0: error boundary" }).click();

  // Add a pause here to ensure navigation is complete
  await page.waitForTimeout(1000);

  await expect(
    page.getByRole("link", { name: "Demo 3: React-Error-Boundary" }),
  ).toBeVisible();

  await page
    .getByRole("link", { name: "Demo 3: React-Error-Boundary" })
    .click();

  // Add another pause after navigation
  await page.waitForTimeout(1000);

  const openBombPanelButton = page.getByRole("button", {
    name: "Open Bomb Panel",
  });

  // ! Debug information before click
  console.log("Before attempting click:");
  const buttonInfo = await openBombPanelButton.evaluate((el) => ({
    isVisible: window.getComputedStyle(el).display !== "none",
    position: window.getComputedStyle(el).position,
    zIndex: window.getComputedStyle(el).zIndex,
    boundingBox: el.getBoundingClientRect(),
    html: el.outerHTML,
  }));
  console.log(buttonInfo);

  // Take a screenshot before clicking
  // await page.screenshot({ path: "before-click.png" });

  // Try clicking with debugging
  try {
    await openBombPanelButton.click({
      timeout: 5000,
      // Add a delay before clicking
      delay: 1000,
    });
  } catch (error) {
    console.log("Click failed with error:", error);
    // Take a screenshot if click fails
    // await page.screenshot({ path: "click-failed.png" });
  }

  // Add pause after click
  await page.waitForTimeout(1000);

  // Take a screenshot after attempted click
  // await page.screenshot({ path: "after-click.png" });

  // Try to get panel text regardless of click success
  const panelText = await page
    .getByText(
      "This is a bomb panel. It will explode if you click the button below.",
    )
    .isVisible();
  console.log("Panel visible after click attempt:", panelText);
});
