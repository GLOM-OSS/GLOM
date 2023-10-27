import { Test, TestingModule } from '@nestjs/testing';
import { NotchPayService } from './notchpay.service';

describe('NotchPayService', () => {
  let service: NotchPayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotchPayService],
    }).compile();

    service = module.get<NotchPayService>(NotchPayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
