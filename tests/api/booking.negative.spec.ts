import { test, expect } from '../../fixtures/api.fixtures';
import { buildBooking } from '../../test-data/booking';

test.describe('Booking API - negative cases', () => {
  test('GET with a non-existent booking id returns 404', async ({ bookingApi }) => {
    const response = await bookingApi.getBooking(999_999_999);
    expect(response.status()).toBe(404);
  });

  test('PUT without an auth token is rejected', async ({ bookingApi }) => {
    const created = await (await bookingApi.createBooking(buildBooking())).json();

    const response = await bookingApi.updateBooking(created.bookingid, buildBooking({ totalprice: 500 }), '');
    expect(response.status()).toBe(403);

    // Cleanup requires a real token since the rejected PUT above didn't change anything.
    const token = await bookingApi.createToken();
    await bookingApi.deleteBooking(created.bookingid, token);
  });

  test('DELETE without an auth token is rejected', async ({ bookingApi }) => {
    const created = await (await bookingApi.createBooking(buildBooking())).json();

    const response = await bookingApi.deleteBooking(created.bookingid, '');
    expect(response.status()).toBe(403);

    // The booking must still exist since the unauthenticated delete was rejected.
    const getResponse = await bookingApi.getBooking(created.bookingid);
    expect(getResponse.status()).toBe(200);

    const token = await bookingApi.createToken();
    await bookingApi.deleteBooking(created.bookingid, token);
  });

  test('POST with a required field missing does not silently succeed', async ({ bookingApi }) => {
    // bookingdates is required by the API's own docs but omitted here on purpose.
    const { bookingdates: _omitted, ...incompletePayload } = buildBooking();

    const response = await bookingApi.createBooking(incompletePayload);

    // Documented defect: restful-booker does not validate this server-side and
    // returns a 500 instead of a 400. We assert the *current* behavior so this
    // test fails loudly (rather than silently passing) if the payload is ever
    // accepted as a valid booking, which would be a worse regression.
    expect(response.status()).toBe(500);
  });
});
