import { Module } from '@nestjs/common';
import { CodeGeneratorService } from '../../utils/code-generator';
import { DemandController } from './demand.controller';
import { DemandService } from './demand.service';

@Module({
  providers: [DemandService, CodeGeneratorService],
  controllers: [DemandController],
})
export class DemandModule {}
