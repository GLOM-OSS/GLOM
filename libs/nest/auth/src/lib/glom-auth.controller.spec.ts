import { Test, TestingModule } from '@nestjs/testing';
import { GlomAuthController } from './glom-auth.controller';

describe('AuthController', () => {
  let controller: GlomAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GlomAuthController],
    }).compile();

    controller = module.get<GlomAuthController>(GlomAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
