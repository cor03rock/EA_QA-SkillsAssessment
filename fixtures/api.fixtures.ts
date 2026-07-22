import { test as base } from '@playwright/test';
import { BookingApiClient } from '../api/bookingApiClient';

type ApiFixtures = {
  bookingApi: BookingApiClient;
  authToken: string;
};

export const test = base.extend<ApiFixtures>({
  bookingApi: async ({ request }, use) => {
    await use(new BookingApiClient(request));
  },

  // Most write operations need a valid token; resolving it once per test
  // keeps that setup out of individual test bodies.
  authToken: async ({ bookingApi }, use) => {
    const token = await bookingApi.createToken();
    await use(token);
  },
});

export { expect } from '@playwright/test';
