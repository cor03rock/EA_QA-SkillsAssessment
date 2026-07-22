import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly inventoryItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.inventoryItems = page.getByTestId('inventory-item');
  }

  /** Product names map to `data-test="add-to-cart-<slugified-name>"`, e.g. "Sauce Labs Backpack" -> add-to-cart-sauce-labs-backpack. */
  private addToCartButton(productName: string): Locator {
    const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return this.page.getByTestId(`add-to-cart-${slug}`);
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.addToCartButton(productName).click();
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }
}
