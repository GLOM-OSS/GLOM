import { Module } from '@nestjs/common';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';
import { DemandController } from './demand.controller';
import { DemandService } from './demand.service';
import { GlomPaymentModule } from '@glom/payment';

@Module({
  imports: [
    GlomPaymentModule.forRoot({
      aggrConfigs: [
        {
          aggr: 'notchpay',
          options: {
            apiKey: process.env.NOTCH_API_KEY,
            endpoint: 'api.notchpay.co',
          },
        },
      ],
    }),
  ],
  providers: [DemandService, CodeGeneratorFactory],
  controllers: [DemandController],
})
export class DemandModule {}
