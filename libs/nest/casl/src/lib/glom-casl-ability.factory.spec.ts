import { RequestMethod } from '@nestjs/common';
import { Login, Person } from '@prisma/client';
import { Action, GlomCaslAbilityFactory } from './glom-casl-ability.factory';

type Actors = Person | Login;
type Subjects = 'AuthController' | 'ProductsController' | 'UsersController';

describe('GlomCaslAbilityFactory', () => {
  let glomCaslAbility: GlomCaslAbilityFactory<Actors, Subjects>;

  beforeAll(() => {
    glomCaslAbility = new GlomCaslAbilityFactory<Actors, Subjects>([
      {
        ressources: [
          {
            subject: 'AuthController',
            method: RequestMethod.ALL,
          },
          {
            subject: 'ProductsController',
            method: RequestMethod.GET,
          },
        ],
      },
      {
        roleName: 'Admin',
        ressources: [
          {
            subject: 'UsersController',
            method: RequestMethod.ALL,
          },
        ],
      },
      {
        roleName: 'Client',
        ressources: [
          {
            subject: 'ProductsController',
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
    expect(abilities.can(Action.Manage, 'AuthController')).toBeTruthy();
    expect(abilities.can(Action.Manage, 'ProductsController')).toBeFalsy();
    expect(abilities.can(Action.Read, 'ProductsController')).toBeTruthy();
  });

  it('should check user abilities with roleName', () => {
    const abilities = glomCaslAbility.createForUser({ userRoles: ['Admin'] });
    expect(abilities).toBeDefined();
    expect(abilities.can(Action.Manage, 'AuthController')).toBeTruthy();
    expect(abilities.can(Action.Read, 'ProductsController')).toBeTruthy();
    expect(abilities.can(Action.Update, 'ProductsController')).toBeFalsy();
    expect(abilities.can(Action.Manage, 'UsersController')).toBeTruthy();
  });

  it('should check user abilities with roleName and criterials', () => {
    const abilities = glomCaslAbility.createForUser({
      userRoles: ['Client'],
      is_active: true,
    });
    expect(abilities).toBeDefined();
    expect(abilities.can(Action.Manage, 'AuthController')).toBeTruthy();
    expect(abilities.can(Action.Manage, 'ProductsController')).toBeTruthy();
    expect(abilities.can(Action.Read, 'UsersController')).toBeFalsy();
  });
});
