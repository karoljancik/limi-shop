import { expect, test } from "@playwright/test";

test("user can add a product to cart and see it in cart page", async ({
  page,
}) => {
  await page.goto("/shop/kapi-kupelne-nalepky-limi");

  await page.getByTestId("add-to-cart").click();
  await expect(page.getByText("Produkt bol pridany do kosika.")).toBeVisible();

  await page.goto("/kosik");

  await expect(page.getByTestId("cart-summary")).toBeVisible();
  await expect(page.getByTestId("cart-item")).toContainText(
    "Kapi Kupelne Nalepky LIMI"
  );
  await expect(page.getByTestId("cart-total")).toContainText("5,99");
});
