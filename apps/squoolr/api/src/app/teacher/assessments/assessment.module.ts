import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '../../../multer/multer.service';
import { CodeGeneratorService } from '../../../utils/code-generator';
import { AssessmentController } from './assessment.controller';
import { AssessmentService } from './assessment.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [AssessmentController],
  providers: [AssessmentService, CodeGeneratorService],
})
export class AssessmentModule {}
