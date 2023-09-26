import { RequestMethod } from '@nestjs/common';
import { Login, Person } from '@prisma/client';
import { GlomCaslAbilityFactory } from './glom-casl-ability.factory';

type Subjects = Person | Login;
describe('GlomCaslAbilityFactory', () => {
  let glomCaslAbility: GlomCaslAbilityFactory<Subjects>;

  beforeAll(() => {
    glomCaslAbility = new GlomCaslAbilityFactory<Subjects>([
      {
        ressources: [
          {
            url: '/auth',
            method: RequestMethod.ALL,
          },
          {
            url: '/products',
            method: RequestMethod.GET,
          },
        ],
      },
      {
        roleName: 'Admin',
        ressources: [
          {
            url: '/users',
            method: RequestMethod.ALL,
          },
        ],
      },
      {
        roleName: 'Client',
        ressources: [
          {
            url: '/products',
            method: RequestMethod.ALL,
          },
        ],
        criterials: { is_active: true },
      },
    ]);
  });

  it('should be defined', () => {
    expect(glomCaslAbility).toBeDefined();
  });

  it('should create abilities for user', () => {
    const abilities = glomCaslAbility.createForUser({});
    expect(abilities).toBeDefined();
  });

  it('should check user abilities without roleName not criterials', () => {
    const abilities = glomCaslAbility.createForUser({});
    expect(abilities).toBeDefined();
    expect(abilities.can('manage', '/auth')).toBeTruthy();
    expect(abilities.can('manage', '/products')).toBeFalsy();
    expect(abilities.can('read', '/products')).toBeTruthy();
  });

  it('should check user abilities with roleName', () => {
    const abilities = glomCaslAbility.createForUser({ roles: ['Admin'] });
    expect(abilities).toBeDefined();
    expect(abilities.can('manage', '/auth')).toBeTruthy();
    expect(abilities.can('read', '/products')).toBeTruthy();
    expect(abilities.can('update', '/products')).toBeFalsy();
    expect(abilities.can('manage', '/users')).toBeTruthy();
  });

  it('should check user abilities with roleName and criterials', () => {
    const abilities = glomCaslAbility.createForUser({
      roles: ['Client'],
      is_active: true,
    });
    expect(abilities).toBeDefined();
    expect(abilities.can('manage', '/auth')).toBeTruthy();
    expect(abilities.can('manage', '/products')).toBeTruthy();
    expect(abilities.can('read', '/users')).toBeFalsy();
  });
});
