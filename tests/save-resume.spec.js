const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Save and Resume Functionality', () => {
    const filePath = `file://${path.join(__dirname, '..', 'app', 'index.html')}`;

    test.beforeEach(async ({ page }) => {
        await page.goto(filePath);
        await page.evaluate(() => localStorage.clear());
    });

    test('should save form data to localStorage on input', async ({ page }) => {
        await page.fill('#business-name', 'Save Test Business');
        await page.check('#sole-proprietorship');

        const savedData = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('savedFormData'));
        });

        expect(savedData['business-name']).toBe('Save Test Business');
        expect(savedData['sole-proprietorship']).toBe(true);
    });

    test('should restore form data from localStorage on page load', async ({ page }) => {
        const testData = {
            'business-name': 'Restore Test Business',
            'sole-proprietorship': true,
        };

        await page.evaluate((data) => {
            localStorage.setItem('savedFormData', JSON.stringify(data));
        }, testData);

        page.once('dialog', async (dialog) => {
            await dialog.accept();
        });

        await page.reload();

        await expect(page.locator('#business-name')).toHaveValue('Restore Test Business');
        await expect(page.locator('#sole-proprietorship')).toBeChecked();
    });

    test('should not restore form data if user cancels the prompt', async ({ page }) => {
        const testData = {
            'business-name': 'No Restore Business',
        };

        await page.evaluate((data) => {
            localStorage.setItem('savedFormData', JSON.stringify(data));
        }, testData);

        page.once('dialog', async (dialog) => {
            await dialog.dismiss();
        });

        await page.reload();

        await expect(page.locator('#business-name')).toBeEmpty();
    });

    test('should clear localStorage when the form is reset', async ({ page }) => {
        await page.fill('#business-name', 'Reset Test Business');

        page.once('dialog', async (dialog) => {
            await dialog.accept();
        });

        await page.click('#reset-btn');

        const savedData = await page.evaluate(() => {
            return localStorage.getItem('savedFormData');
        });

        expect(savedData).toBeNull();
    });
});
