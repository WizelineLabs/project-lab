import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  const url = new URL(process.env.BASE_URL!);
  await page.context().addCookies([
    {
      name: "__session",
      value: process.env.ADMIN_COOKIE!,
      domain: url.hostname,
      path: "/",
    },
  ]);
  // End of authentication steps.

  await page.goto(process.env.BASE_URL!);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "What you’ll get if you join?"
  );
  expect(
    await page.getByRole("link", { name: "Wizeline Log In" }).count()
  ).toBe(0);
  await page.getByRole("link", { name: "View Projects" }).click();
  await expect(page.getByRole("heading", { level: 2 })).toContainText(
    "Projects"
  );
});
