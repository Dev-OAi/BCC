import { test, expect } from '@playwright/test';

test.describe('Real-Time Input Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display an error for an invalid email address', async ({ page }) => {
    const emailInput = page.locator('#email-address');
    const errorElement = page.locator('#email-address-error');

    // Test invalid input
    await emailInput.fill('invalid-email');
    await expect(errorElement).toHaveText('Invalid email address.');
    await expect(emailInput).toHaveClass(/invalid/);

    // Test valid input
    await emailInput.fill('valid@email.com');
    await expect(errorElement).toBeEmpty();
    await expect(emailInput).not.toHaveClass(/invalid/);
  });

  test('should display an error for an invalid SSN', async ({ page }) => {
    const ssnInput = page.locator('#applicant-ssn');
    const errorElement = page.locator('#applicant-ssn-error');

    // Test invalid input
    await ssnInput.fill('123456789');
    await expect(errorElement).toHaveText('Invalid SSN (must be XXX-XX-XXXX).');
    await expect(ssnInput).toHaveClass(/invalid/);

    // Test valid input
    await ssnInput.fill('123-45-6789');
    await expect(errorElement).toBeEmpty();
    await expect(ssnInput).not.toHaveClass(/invalid/);
  });

  test('should display an error for an invalid date of birth', async ({ page }) => {
    const dobInput = page.locator('#applicant-dob');
    const errorElement = page.locator('#applicant-dob-error');

    // Test invalid input
    await dobInput.fill('01-01-2000');
    await expect(errorElement).toHaveText('Invalid date format (must be MM/DD/YYYY).');
    await expect(dobInput).toHaveClass(/invalid/);

    // Test valid input
    await dobInput.fill('01/01/2000');
    await expect(errorElement).toBeEmpty();
    await expect(dobInput).not.toHaveClass(/invalid/);
  });

  test('should display an error for an invalid phone number', async ({ page }) => {
    const phoneInput = page.locator('#business-phone');
    const errorElement = page.locator('#business-phone-error');

    // Test invalid input
    await phoneInput.fill('1234567');
    await expect(errorElement).toHaveText('Invalid phone number.');
    await expect(phoneInput).toHaveClass(/invalid/);

    // Test valid input
    await phoneInput.fill('123-456-7890');
    await expect(errorElement).toBeEmpty();
    await expect(phoneInput).not.toHaveClass(/invalid/);
  });
});
