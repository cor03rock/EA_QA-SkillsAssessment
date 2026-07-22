import { test, expect } from '../../fixtures/ui.fixtures';
import { standardUser, lockedOutUser, invalidPasswordUser } from '../../test-data/users';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('a locked-out account is rejected with a specific error and stays on the login page', async ({
    page,
    loginPage,
  }) => {
    await loginPage.login(lockedOutUser.username, lockedOutUser.password);

    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    await expect(page).toHaveURL('/');
  });

  test('an incorrect password is rejected without revealing which field was wrong', async ({
    page,
    loginPage,
  }) => {
    await loginPage.login(invalidPasswordUser.username, invalidPasswordUser.password);

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username and password do not match any user in this service',
    );
    await expect(page).toHaveURL('/');
  });

  test('valid credentials reach the inventory page', async ({ page, loginPage }) => {
    await loginPage.login(standardUser.username, standardUser.password);

    await expect(page).toHaveURL(/inventory\.html/);
  });
});
