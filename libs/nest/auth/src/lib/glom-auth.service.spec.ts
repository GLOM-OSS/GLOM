import { faker } from '@faker-js/faker';
import { GlomMailerModule, GlomMailerService } from '@glom/nest-mailer';
import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { excludeKeys } from '@squoolr/utils';
import * as bcrypt from 'bcrypt';
import { isUUID } from 'class-validator';
import { Request } from 'express';
import { GlomAuthService } from './glom-auth.service';
import type { User } from './glom-auth.type.d';
import { GlomPrismaModule, GlomPrismaService } from '@glom/prisma';
import { LocalStrategy } from './local/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  const CLIENT_ORIGIN = 'localhost:4200';
  const sendResetPasswordMail = (GlomMailerService.prototype.sendEmail =
    jest.fn());

  const user: Omit<User, 'role_id'> = {
    gender: 'Male',
    preferred_lang: 'en',
    created_at: new Date(),
    login_id: faker.string.uuid(),
    email: faker.internet.email(),
    address: faker.location.city(),
    person_id: faker.string.uuid(),
    birth_date: faker.date.birthdate(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    phone_number: faker.phone.number(),
  };
  let service: GlomAuthService;
  let prisma: GlomPrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlomAuthService, LocalStrategy],
      imports: [
        ConfigModule.forRoot({
          envFilePath: 'lynkr.env',
        }),
        GlomPrismaModule.forRoot({
          async seedASync(prisma) {
            const count = await prisma.role.count();
            if (count === 0)
              await prisma.role.createMany({
                data: [
                  { origin: process.env.CLIENT_ORIGIN, role_name: 'Client' },
                  {
                    origin: process.env.ADMIN_ORIGIN,
                    role_name: 'Admin',
                  },
                  {
                    origin: process.env.MERCHANT_ORIGIN,
                    role_name: 'Merchant',
                  },
                  {
                    origin: process.env.TECHNICIAN_ORIGIN,
                    role_name: 'Technician',
                  },
                ],
              });
          },
        }),
        GlomMailerModule.forRoot({
          authType: 'Login',
          user: process.env.APP_EMAIL,
          host: process.env.EMAIL_HOST,
          pass: process.env.EMAIL_PASS,
          templatesDir: `${process.env.NX_API_BASE_URL}/templates`,
        }),
      ],
    }).compile();
    service = module.get<GlomAuthService>(GlomAuthService);
    prisma = module.get<GlomPrismaService>(GlomPrismaService);
    
    //test data
    const { login_id, ...person } = user;
    await prisma.login.create({
      data: {
        login_id,
        person: { create: person },
        role: { connect: { role_name: 'Client' } },
        password: bcrypt.hashSync('test-password', Number(process.env.SALT)),
      },
    });
  });

  afterAll(async () => {
    await prisma.person.delete({
      where: { person_id: user.person_id },
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register user', async () => {
    const userData = excludeKeys({ ...user, email: faker.internet.email() }, [
      'login_id',
      'person_id',
    ]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { login_id, role_id, ...registeredPerson } =
      await service.registerUser(
        {
          password: 'test-password',
          ...userData,
        },
        'Client'
      );
    expect(
      excludeKeys(registeredPerson, ['created_at', 'person_id'])
    ).toStrictEqual(excludeKeys(userData, ['created_at']));

    //clearing created user from database
    await prisma.person.delete({ where: { email: userData.email } });
  });

  it('should validate user', async () => {
    let request = {
      body: { email: faker.internet.email(), password: 'still testing' },
    } as Request;
    let validatedUser = await service.validateUser(
      request,
      request.body.email,
      request.body.password
    );
    expect(validatedUser).toBeNull();

    request = {
      body: { email: user.email, password: 'test-password' },
      headers: { origin: 'http://localhost:4200' },
    } as Request;
    validatedUser = await service.validateUser(
      request,
      request.body.email,
      request.body.password
    );
    expect(validatedUser).not.toBeNull();
    expect(excludeKeys(validatedUser, ['created_at', 'role_id'])).toStrictEqual(
      excludeKeys(user, ['created_at'])
    );
  });

  it('should verify user access', async () => {
    expect(
      await service.isAuthorized('localhost:4200', faker.string.uuid())
    ).toBeFalsy();
    const { role_id } = await prisma.login.findUniqueOrThrow({
      where: { login_id: user.login_id },
    });
    expect(await service.isAuthorized('localhost:4200', role_id)).toBeTruthy();
    expect(await service.isAuthorized('localhost:4201', role_id)).toBeFalsy();
    expect(
      await service.isAuthorized('localhost:4200', undefined, ['Client'])
    ).toBeTruthy();
    expect(
      await service.isAuthorized('localhost:4201', undefined, ['Client'])
    ).toBeFalsy();
  });

  it('should send reset password link email to knowned user', async () => {
    const resp = await service.resetPassword(user.email, CLIENT_ORIGIN);
    expect(sendResetPasswordMail).toHaveBeenCalled();
    expect(isUUID(resp.reset_password_id)).toBeTruthy();

    await expect(async () => {
      await service.resetPassword(faker.internet.email(), CLIENT_ORIGIN);
    }).rejects.toThrow();
  });

  it('should set new password', async () => {
    const { reset_password_id } = await service.resetPassword(
      user.email,
      CLIENT_ORIGIN
    );
    expect(sendResetPasswordMail).toHaveBeenCalled();

    const new_password = 'new-test-password';
    await service.setNewPassword(
      reset_password_id,
      new_password,
      CLIENT_ORIGIN
    );

    const login = await prisma.login.findFirst({
      select: { password: true },
      where: { person: { email: user.email }, role: { origin: CLIENT_ORIGIN } },
    });
    expect(bcrypt.compareSync(new_password, login.password)).toBeTruthy();
  });

  it('should cancel reset password request', async () => {
    const sendResetPasswordMail = (GlomMailerService.prototype.sendEmail =
      jest.fn());
    const { reset_password_id } = await service.resetPassword(
      user.email,
      CLIENT_ORIGIN
    );
    expect(sendResetPasswordMail).toHaveBeenCalled();

    await service.cancelResetPasswordRequet(reset_password_id);
    const resetPassword = await prisma.resetPassword.findUnique({
      where: { reset_password_id },
    });
    expect(resetPassword).not.toBeNull();
    expect(resetPassword.cancelled_at).not.toBeNull();
  });
});
