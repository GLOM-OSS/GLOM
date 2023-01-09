import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '../../../multer/multer.service';
import { AssessmentController } from './assessment.controller';
import { AssessmentService } from './assessment.service';

@Module({
  imports: [MulterModule.registerAsync({
    useClass: MulterConfigService,
  })],
  controllers: [AssessmentController],
  providers: [AssessmentService],
})
export class AssessmentModule {}
