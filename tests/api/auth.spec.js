import { test, expect } from '@playwright/test';
import { auth } from '../../helpers/testData.js';
import { ApiHelper } from '../../helpers/apiHelper.js';

test.describe('Authentication', () => {

  test('valid credentials return a token', async ({ request }) => {
    const api = new ApiHelper(request);
    const token = await api.getToken(auth);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  test('invalid credentials return error', async ({ request }) => {
    const response = await request.post('/auth', {
      data: { username: 'wrong', password: 'wrong' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.reason).toBe('Bad credentials');
  });

});