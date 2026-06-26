import { test, expect } from '@playwright/test';
import { users } from '../../helpers/testData.js';
import { LoginPage } from '../../pages/LoginPage.js';
import { InventoryPage } from '../../pages/InventoryPage.js';

test.describe('Visual Regression', () => {

  test('login page matches snapshot', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('login-page.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('inventory page matches snapshot', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.valid.username, users.valid.password);
    await expect(page).toHaveScreenshot('inventory-page.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('cart page matches snapshot', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login(users.valid.username, users.valid.password);
    await inventoryPage.addToCartByName('sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveScreenshot('cart-page.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('checkout step one matches snapshot', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login(users.valid.username, users.valid.password);
    await inventoryPage.addToCartByName('sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveScreenshot('checkout-page.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

});