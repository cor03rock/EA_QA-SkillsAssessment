import { test, expect } from '../../fixtures/api.fixtures';
import { buildBooking } from '../../test-data/booking';

test.describe('Booking API - CRUD', () => {
  // Tracks whatever booking the current test created so afterEach can clean
  // it up regardless of which assertion path ran (or failed).
  let bookingId: number | undefined;

  test.afterEach(async ({ bookingApi, authToken }) => {
    if (bookingId !== undefined) {
      await bookingApi.deleteBooking(bookingId, authToken);
      bookingId = undefined;
    }
  });

  test('creates a booking and returns the submitted fields', async ({ bookingApi }) => {
    const payload = buildBooking();

    const response = await bookingApi.createBooking(payload);
    expect(response.status()).toBe(200);

    const body = await response.json();
    bookingId = body.bookingid;
    expect(body.bookingid).toEqual(expect.any(Number));
    expect(body.booking).toMatchObject(payload);
  });

  test('reads back a previously created booking', async ({ bookingApi }) => {
    const payload = buildBooking({ firstname: 'Read', lastname: 'Test' });
    const created = await (await bookingApi.createBooking(payload)).json();
    bookingId = created.bookingid;

    const response = await bookingApi.getBooking(bookingId);
    expect(response.status()).toBe(200);

    const fetched = await response.json();
    expect(fetched).toMatchObject(payload);
  });

  test('fully updates a booking with PUT', async ({ bookingApi, authToken }) => {
    const created = await (await bookingApi.createBooking(buildBooking())).json();
    bookingId = created.bookingid;

    const updatedPayload = buildBooking({ firstname: 'Updated', totalprice: 250 });
    const response = await bookingApi.updateBooking(bookingId, updatedPayload, authToken);
    expect(response.status()).toBe(200);

    const updated = await response.json();
    expect(updated).toMatchObject(updatedPayload);

    // Confirm the update actually persisted, not just echoed in the response.
    const refetched = await (await bookingApi.getBooking(bookingId)).json();
    expect(refetched).toMatchObject(updatedPayload);
  });

  test('partially updates a booking with PATCH', async ({ bookingApi, authToken }) => {
    const created = await (await bookingApi.createBooking(buildBooking())).json();
    bookingId = created.bookingid;

    const response = await bookingApi.patchBooking(bookingId, { totalprice: 999 }, authToken);
    expect(response.status()).toBe(200);

    const patched = await response.json();
    expect(patched.totalprice).toBe(999);
    // Fields not included in the PATCH payload should be untouched.
    expect(patched.firstname).toBe('Jim');
  });

  test('deletes a booking', async ({ bookingApi, authToken }) => {
    const created = await (await bookingApi.createBooking(buildBooking())).json();
    const idToDelete = created.bookingid;

    const deleteResponse = await bookingApi.deleteBooking(idToDelete, authToken);
    // restful-booker returns 201 Created (not 204/200) on a successful delete.
    expect(deleteResponse.status()).toBe(201);

    const getResponse = await bookingApi.getBooking(idToDelete);
    expect(getResponse.status()).toBe(404);
  });
});
