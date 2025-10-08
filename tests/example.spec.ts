import { test, expect, Page } from '@playwright/test';

/** ---------- Bootstrapping ---------- **/
const gotoApp = async (page: Page) => {
  await page.goto('http://localhost:9000/#/');                 // ← your app URL
  await expect(page.locator('#q-app')).toBeVisible();          // Quasar root
  await expect(page.locator('form')).toBeVisible();            // form is rendered
};

/** ---------- Locator helpers ---------- **/
const fieldByLabel = (page: Page, label: string) =>
  page.locator('.q-field, .q-input').filter({ hasText: label });

// During Quasar enter/leave animations, two .q-field__messages can exist.
// Using .last() reliably picks the "entering/current" node.
const messagesOf = (page: Page, label: string) =>
  fieldByLabel(page, label).locator('.q-field__messages').last();

// Prefer accessible locators Quasar renders via <label for=...>
const nameInput   = (page: Page) => page.getByLabel('Name');
const emailInput  = (page: Page) => page.getByLabel('Email');
const genderInput = (page: Page) => page.getByLabel('Gender');
const submitBtn   = (page: Page) => page.getByRole('button', { name: /submit/i });
const resetBtn    = (page: Page) => page.getByRole('button', { name: /reset|clear/i });
const termsSwitch = (page: Page) => page.getByLabel('I accept the terms');

/** ---------- Assertion helpers ---------- **/
const expectNoErrorMessages = async (page: Page) => {
  // Wait for any leaving transitions to finish
  await expect(page.locator('.q-transition--field-message-leave-active')).toHaveCount(0);
  // Ensure there are zero messages containing error-like text
  await expect(
    page.locator('.q-field__messages').filter({ hasText: /please|invalid|error/i })
  ).toHaveCount(0);
};

// Centralize copy variants your UI shows (add here if you see new texts)
const NAME_EMPTY_REGEX = /please type something/i;
const AGE_EMPTY_REGEX  = /please type (your|something) age/i;          // handles “Please type your age”
const AGE_NEG_REGEX    = /positive|greater than 0|invalid|please type (your|a real) age|please type something/i;

test.describe('Quasar Form Input Validation', () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp(page);
  });

  test('should validate name and email inputs', async ({ page }) => {
    // Submit empty form -> should not pass
    await submitBtn(page).click();

    // The page shows form-level feedback via alerts in our simple app; check that form still visible
    await expect(page.locator('form')).toBeVisible();

    await nameInput(page).fill('John Doe');
    await emailInput(page).fill('john@example.com');

    // Re-submit and ensure no error-like messages exist
    await submitBtn(page).click();
    await expectNoErrorMessages(page);
  });

  test('should handle terms acceptance and reset', async ({ page }) => {
    await nameInput(page).fill('John Doe');
    await emailInput(page).fill('john@example.com');

    // Terms switch should be unchecked initially
    await expect(termsSwitch(page)).toHaveAttribute('aria-checked', 'false');

    // Turn it ON and submit again
    await termsSwitch(page).click();
    await expect(termsSwitch(page)).toHaveAttribute('aria-checked', 'true');
    await submitBtn(page).click();

    // Reset should clear values
    await resetBtn(page).click();
    await expect(nameInput(page)).toHaveValue('');
    await expect(emailInput(page)).toHaveValue('');
    await expect(termsSwitch(page)).toHaveAttribute('aria-checked', 'false');
  });
});
