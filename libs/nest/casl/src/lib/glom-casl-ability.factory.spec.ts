import { RequestMethod } from '@nestjs/common';
import { Login, Person } from '@prisma/client';
import { Action, GlomCaslAbilityFactory } from './glom-casl-ability.factory';

type Subjects = 'Auth' | 'Products' | 'Users';
type Actors = (Person & { kind: 'Person' }) | (Login & { kind: 'Login' });

describe('GlomCaslAbilityFactory', () => {
  let glomCaslAbility: GlomCaslAbilityFactory<Actors, Subjects>;

  beforeAll(() => {
    glomCaslAbility = new GlomCaslAbilityFactory<Actors, Subjects>([
      {
        ressources: [
          {
            subject: 'Auth',
            method: RequestMethod.ALL,
          },
          {
            subject: 'Products',
            method: RequestMethod.GET,
          },
        ],
      },
      {
        roleName: 'Admin',
        ressources: [
          {
            subject: 'Users',
            method: RequestMethod.ALL,
          },
        ],
      },
      {
        roleName: 'Client',
        ressources: [
          {
            subject: 'Products',
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
    expect(abilities.can(Action.Manage, 'Auth')).toBeTruthy();
    expect(abilities.can(Action.Manage, 'Products')).toBeFalsy();
    expect(abilities.can(Action.Read, 'Products')).toBeTruthy();
  });

  it('should check user abilities with roleName', () => {
    const abilities = glomCaslAbility.createForUser({ roles: ['Admin'] });
    expect(abilities).toBeDefined();
    expect(abilities.can(Action.Manage, 'Auth')).toBeTruthy();
    expect(abilities.can(Action.Read, 'Products')).toBeTruthy();
    expect(abilities.can(Action.Update, 'Products')).toBeFalsy();
    expect(abilities.can(Action.Manage, 'Users')).toBeTruthy();
  });

  it('should check user abilities with roleName and criterials', () => {
    const abilities = glomCaslAbility.createForUser({
      roles: ['Client'],
      is_active: true,
    });
    expect(abilities).toBeDefined();
    expect(abilities.can(Action.Manage, 'Auth')).toBeTruthy();
    expect(abilities.can(Action.Manage, 'Products')).toBeTruthy();
    expect(abilities.can(Action.Read, 'Users')).toBeFalsy();
  });
});
