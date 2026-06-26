export class CartPage {
  constructor(page) {
    this.page          = page;
    this.cartItems     = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async goto() {
    await this.page.locator('.shopping_cart_link').click();
  }

  async getItemCount() {
    return this.cartItems.count();
  }

  async getItemName() {
    return this.page.locator('.inventory_item_name').textContent();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}