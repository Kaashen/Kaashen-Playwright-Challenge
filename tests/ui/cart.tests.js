import { test, expect } from '@playwright/test';
import { users } from '../../helpers/testData.js';
import { LoginPage } from '../../pages/LoginPage.js';
import { InventoryPage } from '../../pages/InventoryPage.js';
import { CartPage } from '../../pages/CartPage.js';

test.describe('Shopping Cart', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.valid.username, users.valid.password);
  });

  test('@smoke add item to cart updates badge', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addToCartByName('sauce-labs-backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('@regression add multiple items to cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addToCartByName('sauce-labs-backpack');
    await inventoryPage.addToCartByName('sauce-labs-bike-light');
    await expect(inventoryPage.cartBadge).toHaveText('2');
  });

  test('@regression remove item from inventory page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addToCartByName('sauce-labs-backpack');
    await inventoryPage.removeFromCartByName('sauce-labs-backpack');
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('@regression remove item from cart page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    await inventoryPage.addToCartByName('sauce-labs-backpack');
    await cartPage.goto();
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    expect(await cartPage.getItemCount()).toBe(0);
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('@regression cart page shows added items', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    await inventoryPage.addToCartByName('sauce-labs-backpack');
    await cartPage.goto();
    expect(await cartPage.getItemCount()).toBe(1);
    expect(await cartPage.getItemName()).toBe('Sauce Labs Backpack');
  });

  test('@regression cart persists after page refresh', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    await inventoryPage.addToCartByName('sauce-labs-backpack');
    await page.reload();
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await cartPage.goto();
    expect(await cartPage.getItemCount()).toBe(1);
  });

});