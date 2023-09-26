import { Person } from '@prisma/client';
import { GlomCaslAbilityFactory } from './glom-casl-ability.factory';

describe('GlomCaslAbilityFactory', () => {
  it('should be defined', () => {
    expect(new GlomCaslAbilityFactory([])).toBeDefined();
  });
});
