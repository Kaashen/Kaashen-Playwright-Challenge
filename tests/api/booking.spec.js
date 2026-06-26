import { test, expect } from '@playwright/test';
import { request as playwrightRequest } from '@playwright/test';
import { auth, bookings } from '../../helpers/testData.js';
import { ApiHelper } from '../../helpers/apiHelper.js';

test.describe('Booking CRUD', () => {

  let api;
  let bookingId;

  test.beforeAll(async () => {
    const context = await playwrightRequest.newContext({
      baseURL: 'https://restful-booker.herokuapp.com',
    });
    api = new ApiHelper(context);
    await api.getToken(auth);
  });

  test.afterAll(async () => {
    await api.request.dispose();
  });

  test('GET /booking returns list of bookings', async () => {
    const response = await api.getBookings();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body[0]).toHaveProperty('bookingid');
  });

  test('POST /booking creates a new booking', async () => {
    const response = await api.createBooking(bookings.create);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.bookingid).toBeDefined();
    expect(body.booking.firstname).toBe(bookings.create.firstname);
    bookingId = body.bookingid;
  });

  test('GET /booking/:id returns the created booking', async () => {
    const response = await api.getBooking(bookingId);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstname).toBe(bookings.create.firstname);
  });

  test('PUT /booking/:id fully updates the booking', async () => {
    const response = await api.updateBooking(bookingId, bookings.update);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstname).toBe(bookings.update.firstname);
    expect(body.totalprice).toBe(bookings.update.totalprice);
  });

  test('PATCH /booking/:id partially updates the booking', async () => {
    const response = await api.partialUpdateBooking(bookingId, bookings.partialUpdate);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstname).toBe(bookings.partialUpdate.firstname);
  });

  test('DELETE /booking/:id removes the booking', async () => {
    const response = await api.deleteBooking(bookingId);
    expect(response.status()).toBe(201);
    const verify = await api.getBooking(bookingId);
    expect(verify.status()).toBe(404);
  });

});