export class InventoryPage {
  constructor(page) {
    this.page = page;
    this.items      = page.locator('.inventory_item');
    this.sortSelect = page.locator('[data-test="product-sort-container"]');
    this.cartBadge  = page.locator('.shopping_cart_badge');
    this.cartLink   = page.locator('.shopping_cart_link');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async sortBy(option) {
    await this.sortSelect.selectOption(option);
  }

  async addToCartByName(itemSlug) {
    await this.page.locator(`[data-test="add-to-cart-${itemSlug}"]`).click();
  }

  async removeFromCartByName(itemSlug) {
    await this.page.locator(`[data-test="remove-${itemSlug}"]`).click();
  }

  async getItemNames() {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async getItemPrices() {
    const prices = await this.page.locator('.inventory_item_price').allTextContents();
    return prices.map(p => parseFloat(p.replace('$', '')));
  }

  async openItemDetail() {
    await this.page.locator('.inventory_item_name').first().click();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}