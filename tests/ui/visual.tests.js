import { test, expect } from '@playwright/test';
import { users } from '../../helpers/testData.js';
import { LoginPage } from '../../pages/LoginPage.js';
import { InventoryPage } from '../../pages/InventoryPage.js';
import { CartPage } from '../../pages/CartPage.js';
import { CheckoutPage } from '../../pages/CheckoutPage.js';

test.describe('Visual Regression', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.valid.username, users.valid.password);
  });

  test('@regression login page matches snapshot', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page).toHaveScreenshot('login-page.png', { fullPage: true });
  });

  test('@regression inventory page matches snapshot', async ({ page }) => {
    await expect(page).toHaveScreenshot('inventory-page.png', { fullPage: true });
  });

  test('@regression cart page matches snapshot', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    await inventoryPage.addToCartByName('sauce-labs-backpack');
    await cartPage.goto();
    await expect(page).toHaveScreenshot('cart-page.png', { fullPage: true });
  });

  test('@regression checkout page matches snapshot', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    await inventoryPage.addToCartByName('sauce-labs-backpack');
    await cartPage.goto();
    await cartPage.checkout();
    await expect(page).toHaveScreenshot('checkout-page.png', { fullPage: true });
  });

});