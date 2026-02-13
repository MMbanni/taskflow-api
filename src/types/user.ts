export interface User {
    username: string;
    password: string;
    email: string;
    role: string;
    reset?: ResetInfo    
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

export type SafeUser = Pick<User, 'username'> &
  Partial<Pick<User, 'role'  | 'email' >>;


export type UserFilters = Partial<Pick<User, 'username' | 'email' | 'role'>>;

type ResetInfo = {
    code: number;
    expiresAt: Date
}