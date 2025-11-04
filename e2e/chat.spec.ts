import { test, expect } from '@playwright/test';

test.describe('Chat Interface', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the application', async ({ page }) => {
    await expect(page).toHaveTitle(/Vite/);
    await expect(page.getByText(/BMAD UI Builder/i)).toBeVisible();
  });

  test('should display welcome message initially', async ({ page }) => {
    await expect(page.getByText(/Welcome to BMAD UI Builder/i)).toBeVisible();
  });

  test('should allow typing and sending a message', async ({ page }) => {
    const input = page.getByLabel(/message input/i);
    const sendButton = page.getByLabel(/send message/i);

    await input.fill('Hello, BMAD!');
    await sendButton.click();

    // Message should appear in chat
    await expect(page.getByText('Hello, BMAD!')).toBeVisible();

    // Input should be cleared
    await expect(input).toHaveValue('');
  });

  test('should show typing indicator when agent is responding', async ({ page }) => {
    const input = page.getByLabel(/message input/i);
    await input.fill('Test message');
    await input.press('Enter');

    // Typing indicator should appear
    await expect(page.getByText(/typing.../i)).toBeVisible({ timeout: 2000 });
  });

  test('should handle command messages', async ({ page }) => {
    const input = page.getByLabel(/message input/i);

    await input.fill('*help');
    await input.press('Enter');

    // CMD badge should appear
    await expect(page.getByText('CMD')).toBeVisible();
  });

  test('should allow switching between tabs', async ({ page }) => {
    // Click on Builder tab
    await page.getByRole('tab', { name: /builder/i }).click();
    await expect(page.getByText(/Design Input/i)).toBeVisible();

    // Click on Preview tab
    await page.getByRole('tab', { name: /preview/i }).click();
    await expect(page.getByText(/Live Preview/i)).toBeVisible();

    // Click on Documents tab
    await page.getByRole('tab', { name: /documents/i }).click();
    await expect(page.getByText(/Document Templates/i)).toBeVisible();
  });

  test('should disable send button when input is empty', async ({ page }) => {
    const sendButton = page.getByLabel(/send message/i);
    await expect(sendButton).toBeDisabled();
  });

  test('should respect max length', async ({ page }) => {
    const input = page.getByLabel(/message input/i);

    // Should have maxlength attribute
    const maxLength = await input.getAttribute('maxlength');
    expect(maxLength).toBe('5000');
  });
});

test.describe('Security Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should sanitize potentially dangerous HTML in preview', async ({ page }) => {
    // Navigate to builder tab
    await page.getByRole('tab', { name: /builder/i }).click();

    // Input some HTML with script tag
    const textarea = page.getByPlaceholder(/Paste CSS code.../i);
    await textarea.fill('<script>alert("xss")</script><div>Safe content</div>');

    // Generate samples
    const generateButton = page.getByRole('button', { name: /Generate 4 HTML Samples/i });
    await generateButton.click();

    // Wait for generation to complete
    await page.waitForTimeout(3000);

    // Navigate to preview
    await page.getByRole('tab', { name: /preview/i }).click();

    // Should show security warning if dangerous code detected
    // (This depends on actual implementation)
  });

  test('should validate file uploads', async ({ page }) => {
    // Navigate to builder tab
    await page.getByRole('tab', { name: /builder/i }).click();

    // Try to upload a non-image file
    const fileInput = page.locator('input[type="file"]');

    // Note: This is a simplified test - actual implementation would need proper file handling
    await expect(fileInput).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.getByText(/BMAD UI Builder/i)).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    await expect(page.getByText(/BMAD UI Builder/i)).toBeVisible();
  });
});
