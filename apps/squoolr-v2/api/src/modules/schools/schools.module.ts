import { Module } from '@nestjs/common';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';
import { SchoolsController } from './schools.controller';
import { SchoolsService } from './schools.service';
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
  providers: [SchoolsService, CodeGeneratorFactory],
  controllers: [SchoolsController],
})
export class SchoolsModule {}
