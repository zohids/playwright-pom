import { test, expect } from '@playwright/test';
import { OpenNewAccountPage } from '../pages/OpenNewAccountPage';
import { TransferFundsPage } from '../pages/TransferFundsPage';
import { faker } from '@faker-js/faker'
import { verify } from 'crypto';

let newAccountId
let fromAccountId

test.beforeEach(async({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/index.htm')
})

test('Open account', async ({ page }) => {
  const openNewAccount = new OpenNewAccountPage(page)
  await openNewAccount.goTo()
  await openNewAccount.selectAccountType('1')
  await page.waitForLoadState('networkidle')
  await openNewAccount.submitAccountForm()
  newAccountId = await openNewAccount.getNewAccountId()
  await openNewAccount.verifyAccountCreation(newAccountId)
});

test('Transfer funds', async ({ page }) => {
  test.skip(newAccountId === null || newAccountId === undefined, 'Skipping test because newAccountId is not set')
  const transferPage = new TransferFundsPage(page)
  await transferPage.goTo()
  let transferAmount = '100'
  fromAccountId = await transferPage.getFromAccountId()
  await transferPage.fillTransferDetails(transferAmount, newAccountId)
  await page.waitForLoadState('networkidle')
  await transferPage.submitTransfer()
  await transferPage.verifyTransferSuccess(transferAmount, fromAccountId, newAccountId)
})
