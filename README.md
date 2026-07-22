# EA QA Skills Assessment

Automated test suite covering two public, throwaway targets:

- **UI**: [Swag Labs](https://www.saucedemo.com) — login → add to cart → checkout
- **API**: [restful-booker](https://restful-booker.herokuapp.com) — CRUD on `/booking`, with token auth

## Why Playwright

- **One tool, two layers.** `@playwright/test` ships a first-class `APIRequestContext` alongside the browser automation, so the UI and API suites share one test runner, one config, one CI job, and one report instead of stitching together Selenium + a separate REST client.
- **Auto-waiting.** Playwright waits for elements to be actionable (visible, stable, enabled) before interacting, which removes most of the manual `sleep`/explicit-wait code that makes Selenium suites flaky.
- **Web-first assertions with built-in retry.** `expect(locator).toHaveText(...)` polls until it passes or times out, instead of asserting against a single snapshot in time — this matters on a React SPA like Swag Labs where content renders asynchronously.
- **Tracing and artifacts on failure.** Screenshots, video, and a step-by-step trace viewer are captured automatically on failure (configured in `playwright.config.ts`), which cuts down debugging time significantly versus log-only reports.
- **TypeScript support out of the box**, which pairs well with Page Object Model classes and a typed API client.
- Actively maintained by Microsoft with fast, direct browser-engine control (CDP for Chromium, equivalent protocols for Firefox/WebKit) rather than the WebDriver protocol, which tends to be faster and less flaky in practice.

## What belongs at the UI level vs. the API level

The suite deliberately does **not** push everything through the UI. The split follows a simple rule: **use the UI only for what can only be observed or triggered through the UI; use the API for everything else.**

- **UI tests** (`tests/ui/`) cover the actual user-facing flow: logging in, adding items to a cart, and completing checkout — plus what happens when that flow is misused (a locked-out account, an incomplete checkout form). These are things a user can actually do in a browser, and the assertions (error banners, cart badge count, order confirmation) only exist in the rendered DOM. There's no API to hit instead.
- **API tests** (`tests/api/`) cover full CRUD and its failure modes directly against `restful-booker`, without ever opening a browser. Data setup/teardown for a resource-oriented use case like a booking record is naturally CRUD — driving that through a UI would mean five browser interactions doing the job of one HTTP call, and would make the suite slower and more brittle for no added confidence.
- Each UI test creates only the state it needs (log in, add *one or two* products) rather than re-testing catalog browsing, filtering, sorting, etc., through the UI — those are better suited to component/API-level checks in a real product, not full end-to-end runs.
- The one deliberate exception is checkout form validation (`checkout-validation.spec.ts`): that validation logic and its error message only exist in the front end, so it has to be asserted through the UI.

In short: the UI suite proves the critical path works for a real user, including one predictable way it can break. The API suite proves the underlying resource operations (including auth and error handling) are correct, independent of any particular front end.

## Setup

```bash
npm install
npx playwright install chromium   # or omit --project chromium args below to install all browsers
```

Optional: copy `.env.example` to `.env` to point the suite at different targets/credentials.

## Running the tests

```bash
npm test              # everything (ui + api)
npm run test:ui       # Swag Labs UI suite only
npm run test:api      # restful-booker API suite only
npm run test:headed   # UI suite with a visible browser, useful for debugging
npm run test:report   # open the last HTML report
```

## Given more time, I would:
- Remove the credentials from the code and saved as a environment variables
- Add more test to cover other user accounts

## UI tooling used in:
- Structuring the automation testing project with best practices
- Readme.md file has added unnecessary informations so I had to modify and simplify it.

## CI

`.github/workflows/ci.yml` runs the full suite (`npx playwright test`) on every push and pull request to `main`, and uploads the HTML report as a build artifact.
