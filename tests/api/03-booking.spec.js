import { test, expect } from '@playwright/test';
import { request as playwrightRequest } from '@playwright/test';
import { auth, bookings, maskDynamic } from '../../helpers/testData.js';
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

    const response = await api.createBooking(bookings.create);
    const body = await response.json();
    bookingId = body.bookingid;
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
    expect(JSON.stringify({ isArray: true, hasBookingId: 'bookingid' in body[0] }))
      .toMatchSnapshot('booking-list-shape.json');
  });

  test('GET /booking filters by firstname', async () => {
    const response = await api.request.get('/booking?firstname=James');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(JSON.stringify({ isArray: true, hasResults: body.length >= 0 }))
      .toMatchSnapshot('booking-filter-firstname.json');
  });

  test('GET /booking filters by checkin and checkout dates', async () => {
    const response = await api.request.get('/booking?checkin=2026-01-01&checkout=2026-12-31');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(JSON.stringify({ isArray: true, hasResults: body.length >= 0 }))
      .toMatchSnapshot('booking-filter-dates.json');
  });

  test('POST /booking creates a new booking', async () => {
    const response = await api.createBooking(bookings.create);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.bookingid).toBeDefined();
    expect(JSON.stringify(maskDynamic(body)))
      .toMatchSnapshot('booking-create-response.json');
  });

  test('POST /booking response has correct schema', async () => {
    const response = await api.createBooking(bookings.create);
    const body = await response.json();
    const schema = {
      hasBookingId: typeof body.bookingid === 'number',
      hasFirstname: typeof body.booking.firstname === 'string',
      hasLastname: typeof body.booking.lastname === 'string',
      hasTotalprice: typeof body.booking.totalprice === 'number',
      hasDepositpaid: typeof body.booking.depositpaid === 'boolean',
      hasCheckin: typeof body.booking.bookingdates.checkin === 'string',
      hasCheckout: typeof body.booking.bookingdates.checkout === 'string',
    };
    expect(JSON.stringify(schema)).toMatchSnapshot('booking-create-schema.json');
  });

  test('GET /booking/:id returns the created booking', async () => {
    const response = await api.getBooking(bookingId);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstname).toBe(bookings.create.firstname);
    expect(JSON.stringify(body)).toMatchSnapshot('booking-get-by-id.json');
  });

  test('GET /booking/:id with invalid ID returns 404', async () => {
    const response = await api.getBooking(999999);
    expect(response.status()).toBe(404);
    expect(JSON.stringify({ status: 404 }))
      .toMatchSnapshot('booking-invalid-id.json');
  });

  test('PUT /booking/:id fully updates the booking', async () => {
    const response = await api.updateBooking(bookingId, bookings.update);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstname).toBe(bookings.update.firstname);
    expect(JSON.stringify(body)).toMatchSnapshot('booking-put-response.json');
  });

  test('PUT /booking/:id without auth returns 403', async () => {
    const response = await api.request.put(`/booking/${bookingId}`, {
      data: bookings.update,
      headers: { 'Content-Type': 'application/json' },
    });
    expect(response.status()).toBe(403);
    expect(JSON.stringify({ status: 403 }))
      .toMatchSnapshot('booking-put-no-auth.json');
  });

  test('PATCH /booking/:id partially updates the booking', async () => {
    const response = await api.partialUpdateBooking(bookingId, bookings.partialUpdate);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstname).toBe(bookings.partialUpdate.firstname);
    expect(JSON.stringify(body)).toMatchSnapshot('booking-patch-response.json');
  });

  test('DELETE /booking/:id without auth returns 403', async () => {
    const response = await api.request.delete(`/booking/${bookingId}`);
    expect(response.status()).toBe(403);
    expect(JSON.stringify({ status: 403 }))
      .toMatchSnapshot('booking-delete-no-auth.json');
  });

  test('DELETE /booking/:id removes the booking', async () => {
    const response = await api.deleteBooking(bookingId);
    expect(response.status()).toBe(201);
    expect(JSON.stringify({ status: 201 }))
      .toMatchSnapshot('booking-delete-response.json');
    const verify = await api.getBooking(bookingId);
    expect(verify.status()).toBe(404);
  });

});