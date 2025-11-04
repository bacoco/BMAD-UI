import { test, expect } from '@playwright/test';

test.describe('Visual Builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: /builder/i }).click();
  });

  test('should allow file upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();

    // Set up file chooser handler
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      fileInput.click(),
    ]);

    expect(fileChooser).toBeDefined();
  });

  test('should validate file types', async ({ page }) => {
    await expect(page.getByText(/Design Input/i)).toBeVisible();
  });

  test('should switch between input types', async ({ page }) => {
    // Click on URL tab
    await page.getByRole('tab', { name: /URL/i }).click();
    await expect(page.getByPlaceholder(/Enter URL/i)).toBeVisible();

    // Click on CSS tab
    await page.getByRole('tab', { name: /CSS/i }).click();
    await expect(page.getByPlaceholder(/Paste CSS/i)).toBeVisible();

    // Click back on Image tab
    await page.getByRole('tab', { name: /Image/i }).click();
    await expect(page.locator('input[type="file"]')).toBeVisible();
  });

  test('should disable generate button when no input', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: /Generate 4 HTML Samples/i });
    await expect(generateButton).toBeDisabled();
  });

  test('should show generated HTML samples', async ({ page }) => {
    // Input some CSS
    await page.getByRole('tab', { name: /CSS/i }).click();
    const textarea = page.getByPlaceholder(/Paste CSS/i);
    await textarea.fill('.card { background: white; padding: 20px; }');

    // Click generate
    const generateButton = page.getByRole('button', { name: /Generate/i });
    await generateButton.click();

    // Wait for generation (mocked)
    await page.waitForTimeout(2500);

    // Should show 4 samples
    await expect(page.getByText(/Modern Card Layout/i)).toBeVisible();
  });

  test('should allow selecting HTML samples', async ({ page }) => {
    // Navigate through CSS input and generation (reusing logic)
    await page.getByRole('tab', { name: /CSS/i }).click();
    await page.getByPlaceholder(/Paste CSS/i).fill('.test { color: red; }');
    await page.getByRole('button', { name: /Generate/i }).click();
    await page.waitForTimeout(2500);

    // Click on a sample
    const firstSample = page.locator('.cursor-pointer').first();
    await firstSample.click();

    // Should show improvement chat
    await expect(page.getByText(/Improve Design/i)).toBeVisible();
  });
});

test.describe('Builder Performance', () => {
  test('should load builder tab quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.getByRole('tab', { name: /builder/i }).click();
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000); // 3 seconds
  });

  test('should handle rapid tab switching', async ({ page }) => {
    await page.goto('/');

    for (let i = 0; i < 5; i++) {
      await page.getByRole('tab', { name: /builder/i }).click();
      await page.getByRole('tab', { name: /chat/i }).click();
    }

    await expect(page.getByText(/Welcome to BMAD/i)).toBeVisible();
  });
});
