import { Test, TestingModule } from '@nestjs/testing';
import { ThirdParthiesController } from './third-parthies.controller';

describe('ThirdParthiesController', () => {
  let controller: ThirdParthiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThirdParthiesController],
    }).compile();

    controller = module.get<ThirdParthiesController>(ThirdParthiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
