import { Module } from '@nestjs/common';
import { StudentRegistrationController } from './student-registration.controller';
import { StudentRegistrationService } from './student-registration.service';

@Module({
  providers: [StudentRegistrationService],
  controllers: [StudentRegistrationController],
})
export class StudentRegistrationModule {}
