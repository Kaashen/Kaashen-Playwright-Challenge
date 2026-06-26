import { test, expect } from '@playwright/test';
import { users } from '../../helpers/testData.js';
import { LoginPage } from '../../pages/LoginPage.js';
import { InventoryPage } from '../../pages/InventoryPage.js';
import { CartPage } from '../../pages/CartPage.js';
import { CheckoutPage } from '../../pages/CheckoutPage.js';

test.describe('Checkout', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    await loginPage.goto();
    await loginPage.login(users.valid.username, users.valid.password);
    await inventoryPage.addToCartByName('sauce-labs-backpack');
    await cartPage.goto();
  });

  test('complete checkout flow', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    await cartPage.checkout();
    await checkoutPage.fillCustomerInfo('John', 'Doe', '12345');
    await checkoutPage.continue();
    await expect(checkoutPage.summaryInfo).toBeVisible();
    await checkoutPage.finish();
    await expect(checkoutPage.confirmationHeader).toHaveText('Thank you for your order!');
  });

  test('checkout fails without customer info', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    await cartPage.checkout();
    await checkoutPage.continue();
    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('can cancel checkout and return to cart', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    await cartPage.checkout();
    await checkoutPage.cancel();
    await expect(page).toHaveURL(/cart/);
  });

  test('checkout fails without last name', async ({ page }) => {
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  await cartPage.checkout();
  await checkoutPage.fillCustomerInfo('John', '', '');
  await checkoutPage.continue();
  await expect(checkoutPage.errorMessage).toContainText('Last Name is required');
});

test('checkout fails without zip code', async ({ page }) => {
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  await cartPage.checkout();
  await checkoutPage.fillCustomerInfo('John', 'Doe', '');
  await checkoutPage.continue();
  await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
});

});