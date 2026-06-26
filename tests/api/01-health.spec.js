import { test, expect } from '@playwright/test';

test.describe('Health Check', () => {

  test('GET /ping returns 201', async ({ request }) => {
    const response = await request.get('/ping');
    expect(response.status()).toBe(201);
    expect(JSON.stringify({ status: response.status() }))
      .toMatchSnapshot('ping-status.json');
  });

});