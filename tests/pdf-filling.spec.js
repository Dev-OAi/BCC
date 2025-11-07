const { test, expect } = require('@playwright/test');

test.describe('PDF Filling Test', () => {
  test('should fill the PDF with the complete form data', async ({ page }) => {
    await page.goto(`file://${__dirname}/../app/index.html`);

    // Fill out the entire form
    await page.fill('#credit-line-requested', '75000');
    await page.fill('#business-name', 'Complete Test Business');
    await page.fill('#business-tin', '12-3456789');
    await page.fill('#type-of-business', 'LLC');
    await page.fill('#business-address', '123 Complete St');
    await page.fill('#business-city', 'Testville');
    await page.fill('#business-state', 'CA');
    await page.fill('#business-zip', '90210');
    await page.fill('#mailing-address', 'PO Box 123');
    await page.fill('#mailing-city', 'Mailville');
    await page.fill('#mailing-state', 'CA');
    await page.fill('#mailing-zip', '90211');
    await page.fill('#business-phone', '555-123-4567');
    await page.fill('#primary-banking-relationship', 'Test Bank');
    await page.fill('#branch-location', 'Downtown');
    await page.fill('#email-address', 'test@business.com');
    await page.fill('#date-of-origin', '01/01/2020');
    await page.fill('#years-in-business', '5');
    await page.fill('#gross-annual-revenue', '1000000');
    await page.fill('#number-of-employees', '10');
    await page.check('#llc');

    // Primary Applicant
    await page.fill('#applicant-name', 'Complete Test Applicant');
    await page.check('#owner');
    await page.fill('#applicant-title', 'CEO');
    await page.fill('#applicant-ownership', '50');
    await page.fill('#applicant-annual-income', '200000');
    await page.fill('#applicant-ssn', '123-45-6789');
    await page.fill('#applicant-home-address', '456 Applicant Ave');
    await page.fill('#applicant-city', 'Homeville');
    await page.fill('#applicant-state', 'CA');
    await page.fill('#applicant-zip', '90212');
    await page.fill('#applicant-dob', '01/01/1980');
    await page.fill('#applicant-home-phone', '555-987-6543');
    await page.fill('#applicant-business-email', 'ceo@business.com');
    await page.fill('#applicant-mothers-maiden-name', 'Smith');

    // Second Applicant
    await page.fill('#applicant2-name', 'Second Test Applicant');
    await page.check('#gm2');
    await page.fill('#applicant2-title', 'COO');
    await page.fill('#applicant2-ownership', '50');
    await page.fill('#applicant2-annual-income', '180000');
    await page.fill('#applicant2-ssn', '987-65-4321');
    await page.fill('#applicant2-home-address', '789 Partner Pl');
    await page.fill('#applicant2-city', 'Workville');
    await page.fill('#applicant2-state', 'CA');
    await page.fill('#applicant2-zip', '90213');
    await page.fill('#applicant2-dob', '02/02/1982');
    await page.fill('#applicant2-home-phone', '555-123-9876');
    await page.fill('#applicant2-business-email', 'coo@business.com');
    await page.fill('#applicant2-mothers-maiden-name', 'Jones');

    // Authorized Cardholders
    await page.fill('#cardholder1-name', 'Cardholder One');
    await page.fill('#cardholder1-ssn', '111-22-3333');
    await page.fill('#cardholder1-home-address', '1 Holder High');
    await page.fill('#cardholder1-city', 'Cardcity');
    await page.fill('#cardholder1-state', 'CA');
    await page.fill('#cardholder1-zip', '90214');
    await page.fill('#cardholder1-dob', '03/03/1990');
    await page.fill('#cardholder1-mothers-maiden-name', 'Davis');
    await page.fill('#cardholder1-business-email', 'ch1@business.com');

    await page.fill('#cardholder2-name', 'Cardholder Two');
    await page.fill('#cardholder2-ssn', '444-55-6666');
    await page.fill('#cardholder2-home-address', '2 Holder High');
    await page.fill('#cardholder2-city', 'Cardcity');
    await page.fill('#cardholder2-state', 'CA');
    await page.fill('#cardholder2-zip', '90214');
    await page.fill('#cardholder2-dob', '04/04/1992');
    await page.fill('#cardholder2-mothers-maiden-name', 'Miller');
    await page.fill('#cardholder2-business-email', 'ch2@business.com');

    await page.fill('#cardholder3-name', 'Cardholder Three');
    await page.fill('#cardholder3-ssn', '777-88-9999');
    await page.fill('#cardholder3-home-address', '3 Holder High');
    await page.fill('#cardholder3-city', 'Cardcity');
    await page.fill('#cardholder3-state', 'CA');
    await page.fill('#cardholder3-zip', '90214');
    await page.fill('#cardholder3-dob', '05/05/1994');
    await page.fill('#cardholder3-mothers-maiden-name', 'Wilson');
    await page.fill('#cardholder3-business-email', 'ch3@business.com');

    // Balance Transfers
    await page.fill('#creditor1-name', 'Old Bank');
    await page.fill('#creditor1-account-number', '123456789');
    await page.fill('#creditor1-remittance-address', '1 Old Bank Rd');

    await page.fill('#creditor2-name', 'Another Bank');
    await page.fill('#creditor2-account-number', '987654321');
    await page.fill('#creditor2-remittance-address', '2 Another Bank Rd');

    await page.fill('#creditor3-name', 'Third Bank');
    await page.fill('#creditor3-account-number', '192837465');
    await page.fill('#creditor3-remittance-address', '3 Third Bank Rd');

    // Beneficial Owners
    await page.fill('#owner1-name', 'Complete Test Owner 1');
    await page.fill('#owner1-ownership', '25');
    await page.fill('#owner2-name', 'Complete Test Owner 2');
    await page.fill('#owner2-ownership', '25');
    await page.fill('#owner3-name', 'Complete Test Owner 3');
    await page.fill('#owner3-ownership', '25');
    await page.fill('#owner4-name', 'Complete Test Owner 4');
    await page.fill('#owner4-ownership', '25');

    // Controlling Person
    await page.fill('#controller-name', 'Complete Test Controller');
    await page.fill('#controller-title', 'President');

    // Click the "Fill PDF" button
    await page.click('#fill-pdf-btn');

    // Wait for the PDF to be updated
    await page.waitForTimeout(2000);

    await expect(page).toHaveScreenshot('complete-filled-pdf.png');
  });
});
