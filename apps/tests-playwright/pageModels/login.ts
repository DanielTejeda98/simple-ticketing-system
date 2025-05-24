import { Locator, Page } from "@playwright/test";

export class STSLoginPage {
    readonly page: Page;
    readonly usernameField: Locator;
    readonly passwordField: Locator;
    readonly submitButton: Locator;
    readonly googleLogin: Locator;
    readonly formError: Locator;
    readonly createAccountLink: Locator;
    readonly forgotPasswordLink: Locator;

    constructor(page: Page) {
        this.page;
        this.usernameField = page.locator("div", { hasText: "Username or Email" }).locator("input");
        this.passwordField = page.locator("div", { hasText: "Password" }).locator("input");
        this.submitButton = page.locator("button", { hasText: "Sign in" });
        this.googleLogin = page.locator("button", { hasText: "Sign in with Google" })
        this.createAccountLink = page.locator("a", { hasText: "Create an account" });
        this.forgotPasswordLink = page.locator("a", { hasText: "Forgot password?" })
    }

    async goto() {
        await this.page.goto(`${process.env.host}`);
    }

}