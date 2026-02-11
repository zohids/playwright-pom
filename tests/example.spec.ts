import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { faker } from '@faker-js/faker'
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

test('Register at the bank', async ({ page }) => {
  const MAX_RETRIES = 3
  const password = faker.internet.password()
  const registerPage = new RegisterPage(page)
  for(let i = 0; i <= MAX_RETRIES; i++){
    const username = faker.internet.username()
    await registerPage.goTo()
    await registerPage.fillForm()
    await registerPage.fillCreds(username, password)
    await registerPage.submitForm()
    await page.waitForLoadState('networkidle')

    if(await registerPage.isErrorVisible()){
      continue;
    }
    await registerPage.verifyAccountCreation(username)
    await page.context().storageState({ path: authFile });
    break;
  }
});

// test('Open account', async ({ page }) => {
//   await page.getByRole('link', { name: 'Open New Account' }).click();
//   await page.getByRole('button', { name: 'Open New Account' }).click();
//   await expect(page.locator('#openAccountResult')).toContainText('Account Opened!');
//   await expect(page.locator('#openAccountResult')).toContainText('Congratulations, your account is now open.');
//   await expect(page.locator('#openAccountResult')).toContainText('Your new account number: 18117');
// });

// test('Transfer funds', async ({ page }) => {
//   await page.getByRole('link', { name: 'Transfer Funds' }).click();
//   await page.locator('#amount').fill('100');
//   await page.locator('#toAccountId').selectOption('18117');
//   await page.getByRole('button', { name: 'Transfer' }).click();
//   await expect(page.locator('#showResult')).toContainText('Transfer Complete!');
//   await expect(page.locator('#showResult')).toContainText('$100.00 has been transferred from account #17007 to account #18117.');
// })
