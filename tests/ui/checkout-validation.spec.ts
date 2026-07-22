import { test, expect } from '../../fixtures/ui.fixtures';
import { standardUser } from '../../test-data/users';

test.describe('Checkout - unhappy path', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(standardUser.username, standardUser.password);
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
  });

  test('submitting the checkout form without a first name is rejected and keeps the user on the form', async ({
    page,
    cartPage,
    checkoutInfoPage,
  }) => {
    await cartPage.checkout();

    await checkoutInfoPage.fillInfo('', 'Doe', '12345');
    await checkoutInfoPage.continueToOverview();

    await expect(checkoutInfoPage.errorMessage).toHaveText('Error: First Name is required');
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });
});
