import { expect, test, type Page } from "@playwright/test";

/**
 * Award pass 2, Phase 2: the contact form. The API is mocked with page.route where a test needs a
 * particular server answer; nothing here can reach a real forwarder (none is configured in e2e).
 */

async function fillRequired(page: Page) {
  await page.getByLabel(/^Name/).fill("Test Person");
  await page.getByLabel(/^Company/).fill("Example Ltd");
  await page.getByLabel(/^Work email/).fill("test@example.com");
  await page.getByLabel(/What work do you want to improve/).fill("Launch content approvals");
}

const submitButton = (page: Page) => page.locator("form.form button[type='submit']");

test.describe("2.2 without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("details never reach the URL, and the email route is offered", async ({ page }) => {
    await page.goto("/en/contact");
    const name = page.locator("#f-name");
    if (await name.isEnabled()) {
      await name.fill("Test Person");
      await page.locator("#f-email").fill("test@example.com");
    }
    const submit = submitButton(page);
    if (await submit.isEnabled()) {
      await submit.click();
      await page.waitForLoadState("load");
    }
    expect(page.url()).not.toContain("?");
    expect(page.url()).not.toContain("Test");
    await expect(page.locator("form.form")).toHaveAttribute("method", "post");
    await expect(page.getByRole("link", { name: /Open email app/ })).toHaveAttribute("href", /^mailto:business@fimmick\.com/);
  });
});

test.describe("2.2 validation and status", () => {
  test("an invalid field inside the collapsed details opens them and takes focus", async ({ page }) => {
    await page.goto("/en/contact");
    await fillRequired(page);
    const details = page.locator("form.form details");
    await details.locator("summary").click();
    await page.locator("#f-phone").fill("abc");
    await details.locator("summary").click();
    await expect(details).not.toHaveAttribute("open", "");
    await submitButton(page).click();
    await expect(details).toHaveAttribute("open", "");
    await expect(page.locator("#f-phone")).toBeFocused();
  });

  test("a work description over the limit is reported on that field", async ({ page }) => {
    await page.goto("/en/contact");
    await fillRequired(page);
    const work = page.getByLabel(/What work do you want to improve/);
    await work.evaluate((el: HTMLTextAreaElement) => el.removeAttribute("maxlength"));
    await work.fill("x".repeat(2001));
    await submitButton(page).click();
    await expect(work).toBeFocused();
    await expect(work).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#f-message")).not.toHaveAttribute("aria-invalid", "true");
  });

  test("success moves focus to the confirmation and is announced by a region that was already there", async ({ page }) => {
    await page.route("**/api/enquiries", (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"status":"accepted"}' }));
    await page.goto("/en/contact");
    const region = page.locator("[role='status']");
    await expect(region).toHaveCount(1);
    await fillRequired(page);
    await submitButton(page).click();
    await expect(region).toContainText("your request has been sent");
    await expect(page.getByRole("heading", { name: /request has been sent/ })).toBeFocused();
  });

  test("a retry reuses the request key; an edit after a timeout makes a new one", async ({ page }) => {
    const keys: string[] = [];
    await page.route("**/api/enquiries", async (route) => {
      keys.push(JSON.parse(route.request().postData() || "{}").idempotencyKey);
      await route.fulfill({ status: 504, contentType: "application/json", body: '{"status":"timeout"}' });
    });
    await page.goto("/en/contact");
    await fillRequired(page);
    await submitButton(page).click();
    await expect(page.getByText(/took too long/)).toBeVisible();
    await submitButton(page).click();
    await expect.poll(() => keys.length).toBe(2);
    expect(keys[1]).toBe(keys[0]);
    await page.getByLabel(/What work do you want to improve/).fill("Launch content approvals, and the store invitation");
    await submitButton(page).click();
    await expect.poll(() => keys.length).toBe(3);
    expect(keys[2]).not.toBe(keys[0]);
  });

  test("offline is reported as a failed send, not as a timeout", async ({ page, context }) => {
    await page.goto("/en/contact");
    await fillRequired(page);
    await context.setOffline(true);
    await submitButton(page).click();
    await expect(page.getByText(/couldn’t confirm that your request was received/)).toBeVisible();
    await expect(page.getByText(/took too long/)).toHaveCount(0);
    await context.setOffline(false);
  });
});

test.describe("2.2 context and email handoff", () => {
  test("the context chip's remove button is a 44 px target", async ({ page }) => {
    await page.goto("/en/contact?intent=configuration&product=creativemax");
    const remove = page.getByRole("button", { name: /Remove CreativeMax/ });
    const box = (await remove.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  });

  test("a long prepared email offers Copy before the email-app link", async ({ page }) => {
    await page.goto("/en/contact");
    await fillRequired(page);
    await page.locator("form.form summary").click();
    await page.locator("#f-message").fill("Details. ".repeat(250));
    await page.getByRole("button", { name: "Prepare email instead" }).click();
    const actions = page.locator(".email-preview ~ .btn-row > *");
    await expect(actions.first()).toHaveText(/Copy text/);
  });

  test("Copy confirms, then resets; a refused clipboard selects the text instead", async ({ page }) => {
    await page.addInitScript(() => {
      let allow = true;
      Object.defineProperty(window, "__allowClipboard", { set: (v: boolean) => (allow = v) });
      Object.defineProperty(navigator, "clipboard", { value: { writeText: () => (allow ? Promise.resolve() : Promise.reject(new Error("denied"))) } });
    });
    await page.goto("/en/contact");
    await fillRequired(page);
    await page.getByRole("button", { name: "Prepare email instead" }).click();
    const copy = page.getByRole("button", { name: /^(Copy text|Copied)$/ });
    await copy.click();
    await expect(copy).toHaveText("Copied");
    await expect(copy).toHaveText("Copy text", { timeout: 4000 });
    await page.evaluate(() => ((window as unknown as { __allowClipboard: boolean }).__allowClipboard = false));
    await copy.click();
    const selected = await page.evaluate(() => window.getSelection()?.toString() ?? "");
    expect(selected).toContain("test@example.com");
  });
});
