export interface SwagLabsUser {
  username: string;
  password: string;
}

/**
 * Swag Labs ships several accounts that misbehave on purpose (documented on the
 * login page itself). We only rely on the two below to keep the suite stable:
 * - standardUser: the well-behaved account, used for the happy path.
 * - lockedOutUser: deliberately rejected at login, used for the unhappy path.
 * The remaining accounts (problem_user, performance_glitch_user, error_user,
 * visual_user) simulate UI/product bugs rather than auth failures and are out
 * of scope for this suite — see README "Known accounts" section.
 */
export const standardUser: SwagLabsUser = {
  username: 'standard_user',
  password: 'secret_sauce',
};

export const lockedOutUser: SwagLabsUser = {
  username: 'locked_out_user',
  password: 'secret_sauce',
};

export const invalidPasswordUser: SwagLabsUser = {
  username: 'standard_user',
  password: 'not_the_real_password',
};
