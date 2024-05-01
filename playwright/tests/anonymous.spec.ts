import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto(process.env.BASE_URL!);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "What you’ll get if you join?"
  );
  expect(
    await page.getByRole("link", { name: "Wizeline Log In" }).count()
  ).toBe(2);
  await page.getByRole("link", { name: "View Projects" }).click();
  await expect(page.getByRole("heading", { level: 2 })).toContainText(
    "All Projects"
  );
});
