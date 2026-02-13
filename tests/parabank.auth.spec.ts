import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { faker } from '@faker-js/faker'
import path from 'path';
import fs from 'fs'

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

test.beforeEach(async () => {
  const authFile = 'playwright/.auth/user.json'
  if (fs.existsSync(authFile)) {
    fs.writeFileSync(authFile, '{}', 'utf-8')
    console.log('Cleared auth file before test');
  }
})

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