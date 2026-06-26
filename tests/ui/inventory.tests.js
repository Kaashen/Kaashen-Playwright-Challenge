import { test, expect } from '@playwright/test';
import { users } from '../../helpers/testData.js';
import { LoginPage } from '../../pages/LoginPage.js';
import { InventoryPage } from '../../pages/InventoryPage.js';

test.describe('Inventory', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.valid.username, users.valid.password);
  });

  test('inventory page shows 6 products', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('sort by price low to high', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getItemPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort by name Z to A', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getItemNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('item detail page loads correctly', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.openItemDetail();
    await expect(page.locator('.inventory_details_name')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible();
  });

  test('sort by name A to Z', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.sortBy('az');
  const names = await inventoryPage.getItemNames();
  expect(names).toEqual([...names].sort());
});

test('sort by price high to low', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.sortBy('hilo');
  const prices = await inventoryPage.getItemPrices();
  expect(prices).toEqual([...prices].sort((a, b) => b - a));
});

test('add to cart from item detail page', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.openItemDetail();
  await page.locator('[data-test="add-to-cart"]').click();
  await expect(inventoryPage.cartBadge).toHaveText('1');
});

});