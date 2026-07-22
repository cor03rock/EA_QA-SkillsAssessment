import { APIRequestContext, APIResponse } from '@playwright/test';
import { Booking } from '../test-data/booking';

const AUTH_USERNAME = process.env.API_AUTH_USERNAME ?? 'admin';
const AUTH_PASSWORD = process.env.API_AUTH_PASSWORD ?? 'password123';

/**
 * Thin wrapper around the restful-booker endpoints used by this suite.
 * Keeping raw `request.*` calls out of the specs means a future change to
 * auth headers, base paths, etc. only needs to happen in one place.
 */
export class BookingApiClient {
  constructor(private readonly request: APIRequestContext) {}

  /** POST /auth — restful-booker issues a short-lived token used as a Cookie on writes/deletes. */
  async createToken(username = AUTH_USERNAME, password = AUTH_PASSWORD): Promise<string> {
    const response = await this.request.post('/auth', {
      data: { username, password },
    });
    const body = await response.json();
    return body.token;
  }

  async createBooking(payload: Partial<Booking>): Promise<APIResponse> {
    return this.request.post('/booking', { data: payload });
  }

  async getBooking(bookingId: number | string): Promise<APIResponse> {
    return this.request.get(`/booking/${bookingId}`);
  }

  async updateBooking(bookingId: number | string, payload: Booking, token: string): Promise<APIResponse> {
    return this.request.put(`/booking/${bookingId}`, {
      data: payload,
      headers: { Cookie: `token=${token}` },
    });
  }

  async patchBooking(
    bookingId: number | string,
    payload: Partial<Booking>,
    token: string,
  ): Promise<APIResponse> {
    return this.request.patch(`/booking/${bookingId}`, {
      data: payload,
      headers: { Cookie: `token=${token}` },
    });
  }

  async deleteBooking(bookingId: number | string, token: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
    });
  }
}
