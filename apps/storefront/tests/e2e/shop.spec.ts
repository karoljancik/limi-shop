import { expect, test } from "@playwright/test";

test("shop lists products and opens product detail", async ({ page }) => {
  await page.goto("/shop");

  const firstProduct = page.getByTestId("product-card").first();
  await expect(firstProduct).toBeVisible();

  await firstProduct.click();

  await expect(page.getByTestId("add-to-cart")).toBeVisible();
  await expect(page).toHaveURL(/\/shop\//);
});
