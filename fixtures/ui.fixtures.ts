import { test as base } from '@playwright/test';
import { LoginPage } from '../tests/ui/pages/LoginPage';
import { InventoryPage } from '../tests/ui/pages/InventoryPage';
import { CartPage } from '../tests/ui/pages/CartPage';
import { CheckoutInfoPage, CheckoutOverviewPage, CheckoutCompletePage } from '../tests/ui/pages/CheckoutPage';

type UiFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
};

// Auto-instantiating one fixture per page object keeps specs free of
// `new LoginPage(page)` boilerplate and gives every test the same
// well-typed set of page objects to compose from.
export const test = base.extend<UiFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutInfoPage: async ({ page }, use) => {
    await use(new CheckoutInfoPage(page));
  },
  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },
});

export { expect } from '@playwright/test';
