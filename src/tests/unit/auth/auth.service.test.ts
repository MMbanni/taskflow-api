import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as factory from '@/tests/helpers/factories.js';
import * as authService from '@/modules/auth/auth.service.js';
import * as tokenService from '@/modules/auth/token.service.js'
import * as userRepo from '@/modules/users/user.repository.js';
import * as tokenRepo from '@/modules/auth/refreshToken.repository.js';
import * as emailService from '@/infrastructure/mail/email.service.js';

vi.mock('bcrypt', () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn()
  }
}))


import bcrypt from 'bcrypt';
import { RefreshToken } from '@/types/auth.js';


describe('loginUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should login successfully with correct credentials', async () => {
    const userWithPassword = factory.makeUserWithPassword();

    vi.spyOn(userRepo, 'getUserForAuthByUsername')
      .mockResolvedValue(userWithPassword);

    (bcrypt.compare as any)
      .mockResolvedValue(true);

    vi.spyOn(tokenService, 'createAccessToken')
      .mockReturnValue('access token');

    vi.spyOn(tokenService, 'generateRefreshToken')
      .mockReturnValue({ token: 'token', expiresAt: new Date });

    vi.spyOn(tokenRepo, 'saveRefreshToken')
      .mockResolvedValue({ userId: 'userId', token: 'token', expiresAt: new Date });

    const result = await authService.loginUser({ username: 'username', password: 'password' });

    expect(tokenRepo.saveRefreshToken)
      .toHaveBeenCalledWith('userId', { token: 'token', expiresAt: expect.any(Date) });
    expect(result.safeUser).toEqual({ username: 'username', role: 'user' });
    expect(result.refreshToken).toBe('token');
    expect(result.accessToken).toBe('access token');


  })

  it('should throw if user not found', async () => {

    vi.spyOn(userRepo, 'getUserForAuthByUsername')
      .mockResolvedValue(null);

    await expect(authService.loginUser({ username: 'username', password: 'password' })).rejects.toThrow()
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  it('should throw if password is incorrect', async () => {
    const userWithPassword = factory.makeUserWithPassword();
    vi.spyOn(userRepo, 'getUserForAuthByUsername')
      .mockResolvedValue(userWithPassword);

    (bcrypt.compare as any)
      .mockResolvedValue(false)


    await expect(authService.loginUser({ username: 'username', password: 'wrongPassword' })).rejects.toThrow();
    expect(tokenService.createAccessToken).not.toHaveBeenCalled()
  })

})

describe('refreshAccessToken', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should provide new access and refresh tokens if token is valid', async () => {

    const refreshToken = factory.makeRefreshToken();
    const user = factory.makeUser();

    vi.spyOn(tokenRepo, 'findRefreshToken')
      .mockResolvedValue(refreshToken);

    vi.spyOn(userRepo, 'getUserById')
      .mockResolvedValue(user);

    vi.spyOn(tokenRepo, 'deleteRefreshToken')
      .mockResolvedValue(undefined);

    vi.spyOn(tokenService, 'createAccessToken')
      .mockReturnValue('access token');

    vi.spyOn(tokenService, 'generateRefreshToken')
      .mockReturnValue({ token: 'token', expiresAt: new Date });

    vi.spyOn(tokenRepo, 'saveRefreshToken')
      .mockResolvedValue({ userId: 'userId', token: 'token', expiresAt: new Date });

    const result = await authService.refreshAccessToken(refreshToken.token);

    expect(tokenRepo.deleteRefreshToken).toHaveBeenCalledWith(refreshToken.token);
    expect(tokenRepo.saveRefreshToken)
      .toHaveBeenCalledWith('userId', { token: 'token', expiresAt: expect.any(Date) });
    expect(tokenRepo.deleteRefreshToken).toHaveBeenCalledTimes(1);
    expect(result.safeUser).toEqual({ username: 'username', role: 'user' });
    expect(result.refreshToken).toBe('token');
    expect(result.accessToken).toBe('access token');

  });

  it('should throw if token not found', async () => {
    vi.spyOn(tokenRepo, 'findRefreshToken')
      .mockResolvedValue(null);

    await expect(authService.refreshAccessToken('invalidToken')).rejects.toThrow();
    expect(userRepo.getUserById).not.toHaveBeenCalled();
  })

  it('should delete token and throw if token expired', async () => {
    const expiredToken = factory.makeRefreshToken();
    expiredToken.expiresAt = new Date(Date.now() - 10000);

    vi.spyOn(tokenRepo, 'findRefreshToken')
      .mockResolvedValue(expiredToken);

    await expect(authService.refreshAccessToken(expiredToken.token)).rejects.toThrow();
    expect(tokenRepo.deleteRefreshToken).toHaveBeenCalledTimes(1);
    expect(userRepo.getUserById).not.toHaveBeenCalled();

  })


})

describe('revokeAllSessions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('should delete all refresh tokens', async () => {
    vi.spyOn(tokenRepo, 'deleteAllUserTokens')
      .mockResolvedValue(undefined);

    await authService.revokeAllSessions('userId');
    expect(tokenRepo.deleteAllUserTokens).toHaveBeenCalledWith('userId');
  })
})

describe('sendResetPasswordCode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('should save password reset code and send email if user exists', async () => {

    vi.spyOn(userRepo, 'getUserByEmail')
      .mockResolvedValue(factory.makeUser());

    vi.spyOn(userRepo, 'saveResetPasswordCode')
      .mockResolvedValue(undefined);

    vi.spyOn(emailService, 'sendResetPasswordMessage')
      .mockResolvedValue(true);

    await authService.sendResetPasswordCode({ email: 'email' });

    expect(userRepo.saveResetPasswordCode).toHaveBeenCalled();
    expect(emailService.sendResetPasswordMessage).toHaveBeenCalled();
  });

  it('should do nothing if user does not exist', async () => {

    vi.spyOn(userRepo, 'getUserByEmail')
      .mockResolvedValue(null);

    await authService.sendResetPasswordCode({ email: 'wrongEmail' });

    expect(userRepo.saveResetPasswordCode).not.toHaveBeenCalled();
    expect(emailService.sendResetPasswordMessage).not.toHaveBeenCalled();
  });
})

describe('checkPasswordResetCode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('should throw if user not found', async () => {
    vi.spyOn(userRepo, 'getUserForResetByEmail')
      .mockResolvedValue(null);

    await expect(authService.checkPasswordResetCode({ email: 'email', resetCode: 'invalidCode' }))
      .rejects.toThrow();
  });

  it('should throw if reset code is invalid', async () => {
    const userWithReset = factory.makeUserWithReset();

    vi.spyOn(userRepo, 'getUserForResetByEmail')
      .mockResolvedValue(userWithReset);

    await expect(
      authService.checkPasswordResetCode({ email: 'email', resetCode: 'invalidCode' })
    ).rejects.toThrow();
  });

  it('should not throw if reset code is valid', async () => {
    const userWithReset = factory.makeUserWithReset();

    vi.spyOn(userRepo, 'getUserForResetByEmail')
      .mockResolvedValue(userWithReset);

    await expect(
      authService.checkPasswordResetCode({ email: 'email', resetCode: 'resetCode' })
    ).resolves.toBeUndefined();
  });
})

describe('resetPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('should save new password and revoke sessions if input is correct', async () => {
    const resetPasswordBody = factory.makeResetPasswordBody();
    const user = factory.makeUser();

    (bcrypt.hash as any)
      .mockResolvedValue('hashedPassword');

    vi.spyOn(userRepo, 'savePassword')
      .mockResolvedValue(true);

    vi.spyOn(userRepo, 'getUserByEmail')
      .mockResolvedValue(user)

    vi.spyOn(authService, 'revokeAllSessions')
      .mockResolvedValue(undefined)

    await authService.resetPassword(resetPasswordBody);
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(userRepo.savePassword).toHaveBeenCalledWith('email', 'resetCode', 'hashedPassword')


  });

  it('should throw if email or reset code is invalid', async () => {
    (bcrypt.hash as any)
      .mockResolvedValue('hashedPassword');

    vi.spyOn(userRepo, 'savePassword')
      .mockResolvedValue(false);

    await expect(authService.resetPassword).rejects.toThrow()
    expect(userRepo.getUserByEmail).not.toBeCalled();

  });

  it('should not attempt to revoke sessions if user not found', async () => {
    (bcrypt.hash as any)
      .mockResolvedValue('hashedPassword');

    vi.spyOn(userRepo, 'savePassword')
      .mockResolvedValue(true);

    vi.spyOn(userRepo, 'getUserByEmail')
      .mockResolvedValue(null);

    await authService.resetPassword(factory.makeResetPasswordBody());
    expect(authService.revokeAllSessions).not.toHaveBeenCalled();

  });
})
