import { Locator, Page, expect } from '@playwright/test'

export class OpenNewAccountPage {
    readonly page: Page;
    readonly openNewAccountLink: Locator;
    readonly accountTypeSelect: Locator;
    readonly openAccountButton: Locator;
    readonly newAccountId: Locator;
    readonly accountOpenedHeading: Locator;
    readonly succesMessage: Locator;
    readonly newAccountMessage: Locator;

    constructor (page: Page) {
        this.page = page;
        this.openNewAccountLink = page.getByRole('link', { name: 'Open New Account'});
        this.accountTypeSelect = page.locator('#type');
        this.openAccountButton = page.locator('input.button[value="Open New Account"]')
        this.newAccountId = page.locator('#newAccountId')
        this.accountOpenedHeading = page.getByRole('heading', { name: 'Account Opened!'})
        this.succesMessage = page.getByText('Congratulations, your account is now open')
        this.newAccountMessage = page.locator('#openAccountResult')
    }

    async goTo() {
        await this.openNewAccountLink.click()
    }

    async selectAccountType(accountType: string) {
        await this.accountTypeSelect.selectOption(accountType)
    }

    async submitAccountForm() {
        await this.openAccountButton.click()
    }

    async getNewAccountId() {
        await this.newAccountId.waitFor()
        return await this.newAccountId.textContent()
    }

    async verifyAccountCreation(newAccountId: string) {
        await expect(this.accountOpenedHeading).toBeVisible()
        await expect(this.succesMessage).toBeVisible()
        const newAccountMessageText = await this.newAccountMessage.textContent()
        await expect(newAccountMessageText).toContain(newAccountId)
    }
}