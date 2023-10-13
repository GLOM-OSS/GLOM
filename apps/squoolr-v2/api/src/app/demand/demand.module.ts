import { Module } from '@nestjs/common';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';
import { DemandController } from './demand.controller';
import { DemandService } from './demand.service';

@Module({
  providers: [DemandService, CodeGeneratorFactory],
  controllers: [DemandController],
})
export class DemandModule {}
