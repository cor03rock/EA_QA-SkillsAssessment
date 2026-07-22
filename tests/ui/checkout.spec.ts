import { test, expect } from '../../fixtures/ui.fixtures';
import { standardUser } from '../../test-data/users';

const PRODUCTS_TO_PURCHASE = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];

function parseDollarAmount(text: string): number {
  const match = text.match(/\$(\d+\.\d{2})/);
  if (!match) {
    throw new Error(`Could not parse a dollar amount from "${text}"`);
  }
  return Number(match[1]);
}

test.describe('Checkout - happy path', () => {
  test('a logged-in user can add items, check out, and receive an order confirmation', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    await loginPage.goto();
    await loginPage.login(standardUser.username, standardUser.password);
    await expect(page).toHaveURL(/inventory\.html/);

    for (const product of PRODUCTS_TO_PURCHASE) {
      await inventoryPage.addProductToCart(product);
    }
    await expect(inventoryPage.cartBadge).toHaveText(String(PRODUCTS_TO_PURCHASE.length));

    await inventoryPage.goToCart();
    await expect(cartPage.cartItems).toHaveCount(PRODUCTS_TO_PURCHASE.length);

    await cartPage.checkout();
    await checkoutInfoPage.fillInfo('John', 'Doe', '12345');
    await checkoutInfoPage.continueToOverview();
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // Assert the arithmetic rather than hardcoding dollar amounts, so the
    // test survives catalog price changes and still catches a broken total.
    const subtotal = parseDollarAmount(await checkoutOverviewPage.subtotalLabel.innerText());
    const tax = parseDollarAmount(await checkoutOverviewPage.taxLabel.innerText());
    const total = parseDollarAmount(await checkoutOverviewPage.totalLabel.innerText());
    expect(total).toBeCloseTo(subtotal + tax, 2);

    await checkoutOverviewPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
  });
});
