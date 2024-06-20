import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { User } from './user.model';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret';
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        LocalAuthGuard,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user: User = { username: 'test', userId: 1 };
      const token = 'jwt_token';
      jest.spyOn(authService, 'login').mockImplementation(async () => ({ access_token: token }));

      expect(await controller.login({ user })).toEqual({ access_token: token });
    });

    it('should throw UnauthorizedException if login fails', async () => {
      jest.spyOn(authService, 'validateUser').mockImplementation(async (username, pass) => null);

      const req = { user: null }; // Simulating a failed login attempt
      await expect(controller.login(req)).rejects.toThrow(UnauthorizedException);
    });
  });
});
