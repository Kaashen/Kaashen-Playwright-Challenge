import { test, expect } from '@playwright/test';
import { auth, bookings } from '../../helpers/testData.js';
import { ApiHelper } from '../../helpers/apiHelper.js';

test.describe('Authentication', () => {

  test('@smoke valid credentials return a token', async ({ request }) => {
    const api = new ApiHelper(request);
    const token = await api.getToken(auth);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
    expect(JSON.stringify({ hasToken: true, type: 'string' }))
      .toMatchSnapshot('auth-valid-structure.json');
  });

  test('@regression invalid credentials return error', async ({ request }) => {
    const response = await request.post('/auth', {
      data: { username: 'wrong', password: 'wrong' },
    });
    const body = await response.json();
    expect(body.reason).toBe('Bad credentials');
    expect(JSON.stringify(body)).toMatchSnapshot('auth-invalid-response.json');
  });

  test('@regression empty credentials return error', async ({ request }) => {
    const response = await request.post('/auth', {
      data: { username: '', password: '' },
    });
    const body = await response.json();
    expect(body.reason).toBe('Bad credentials');
    expect(JSON.stringify(body)).toMatchSnapshot('auth-empty-response.json');
  });

  test('@regression missing password field returns error', async ({ request }) => {
    const response = await request.post('/auth', {
      data: { username: 'admin' },
    });
    const body = await response.json();
    expect(body.reason).toBe('Bad credentials');
    expect(JSON.stringify(body)).toMatchSnapshot('auth-missing-password-response.json');
  });

  test('@regression missing username field returns error', async ({ request }) => {
    const response = await request.post('/auth', {
      data: { password: 'password123' },
    });
    const body = await response.json();
    expect(body.reason).toBe('Bad credentials');
    expect(JSON.stringify(body)).toMatchSnapshot('auth-missing-username-response.json');
  });

  test('@regression invalid token returns 403 on protected route', async ({ request }) => {
    const response = await request.put('/booking/1', {
      data: bookings.update,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'token=invalidtoken123',
      },
    });
    expect(response.status()).toBe(403);
    expect(JSON.stringify({ status: 403 }))
      .toMatchSnapshot('auth-invalid-token-response.json');
  });

});