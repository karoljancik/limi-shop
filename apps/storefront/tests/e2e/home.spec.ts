import { expect, test } from "@playwright/test";

test("homepage renders hero and featured products", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /3D zazitkove nalepky/i })
  ).toBeVisible();

  await expect(page.getByTestId("featured-product")).toHaveCount(3);
});
