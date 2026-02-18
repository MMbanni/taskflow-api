type ResetInfo = {
  code: string;
  expiresAt: Date
}
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface UserWithReset extends User {
  reset?: ResetInfo;
}


export interface RegisterBody {
  email: string;
  username: string;
  password: string;
}
export interface LoginBody {
  username: string;
  password: string;
}

export interface SendResetCodeBody {
  email: string;
}

export interface CheckResetBody {
  email: string;
  resetCode: string;
}

export interface ResetPasswordBody {
  email: string;
  resetCode: string;
  password: string;
}

export type SafeUser = Pick<User, 'username' |'role'>;

export type UserFilters = Partial<Pick<User, 'username' | 'email' | 'role'>>;
