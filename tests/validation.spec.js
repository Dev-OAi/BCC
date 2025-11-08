const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Real-Time Input Validation', () => {
    const filePath = `file://${path.join(__dirname, '..', 'app', 'index.html')}`;

    test.beforeEach(async ({ page }) => {
        await page.goto(filePath);
    });

    test('should display an error for an invalid email address', async ({ page }) => {
        const emailInput = page.locator('#email-address');
        const errorElement = page.locator('#email-address-error');

        await emailInput.fill('invalid-email');
        await expect(errorElement).toHaveText('Invalid email address.');
        await expect(emailInput).toHaveClass(/invalid/);

        await emailInput.fill('valid@email.com');
        await expect(errorElement).toBeEmpty();
        await expect(emailInput).not.toHaveClass(/invalid/);
    });

    test('should display an error for an invalid SSN', async ({ page }) => {
        const ssnInput = page.locator('#applicant-ssn');
        const errorElement = page.locator('#applicant-ssn-error');

        await ssnInput.fill('123456789');
        await expect(errorElement).toHaveText('Invalid SSN (must be XXX-XX-XXXX).');
        await expect(ssnInput).toHaveClass(/invalid/);

        await ssnInput.fill('123-45-6789');
        await expect(errorElement).toBeEmpty();
        await expect(ssnInput).not.toHaveClass(/invalid/);
    });

    test('should display an error for an invalid date of birth', async ({ page }) => {
        const dobInput = page.locator('#applicant-dob');
        const errorElement = page.locator('#applicant-dob-error');

        await dobInput.fill('01-01-2000');
        await expect(errorElement).toHaveText('Invalid date format (must be MM/DD/YYYY).');
        await expect(dobInput).toHaveClass(/invalid/);

        await dobInput.fill('01/01/2000');
        await expect(errorElement).toBeEmpty();
        await expect(dobInput).not.toHaveClass(/invalid/);
    });

    test('should display an error for an invalid phone number', async ({ page }) => {
        const phoneInput = page.locator('#business-phone');
        const errorElement = page.locator('#business-phone-error');

        await phoneInput.fill('1234567');
        await expect(errorElement).toHaveText('Invalid phone number.');
        await expect(phoneInput).toHaveClass(/invalid/);

        await phoneInput.fill('123-456-7890');
        await expect(errorElement).toBeEmpty();
        await expect(phoneInput).not.toHaveClass(/invalid/);
    });
});
