import { test, expect } from '@playwright/test';
import { auth } from '../../helpers/testData.js';
import { ApiHelper } from '../../helpers/apiHelper.js';

test.describe('Authentication', () => {

  test('valid credentials return a token', async ({ request }) => {
    const api = new ApiHelper(request);
    const token = await api.getToken(auth);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
    expect(JSON.stringify({ hasToken: true, type: 'string' }))
      .toMatchSnapshot('auth-valid-structure.json');
  });

  test('invalid credentials return error', async ({ request }) => {
    const response = await request.post('/auth', {
      data: { username: 'wrong', password: 'wrong' },
    });
    const body = await response.json();
    expect(body.reason).toBe('Bad credentials');
    expect(JSON.stringify(body)).toMatchSnapshot('auth-invalid-response.json');
  });

  test('empty credentials return error', async ({ request }) => {
    const response = await request.post('/auth', {
      data: { username: '', password: '' },
    });
    const body = await response.json();
    expect(body.reason).toBe('Bad credentials');
    expect(JSON.stringify(body)).toMatchSnapshot('auth-empty-response.json');
  });

  test('missing password field returns error', async ({ request }) => {
    const response = await request.post('/auth', {
      data: { username: 'admin' },
    });
    const body = await response.json();
    expect(body.reason).toBe('Bad credentials');
    expect(JSON.stringify(body)).toMatchSnapshot('auth-missing-password-response.json');
  });

  test('missing username field returns error', async ({ request }) => {
  const response = await request.post('/auth', {
    data: { password: 'password123' },
  });
  const body = await response.json();
  expect(body.reason).toBe('Bad credentials');
  expect(JSON.stringify(body)).toMatchSnapshot('auth-missing-username-response.json');
});

});