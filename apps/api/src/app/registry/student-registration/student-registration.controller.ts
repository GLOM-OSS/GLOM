import {
  Controller, HttpException,
  HttpStatus,
  Param,
  Post, Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { Readable } from 'stream';
import { ERR20 } from '../../../errors';
import { readAndProcessFile } from '../../../utils/csv-parser';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Roles } from '../../app.decorator';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import {
  StudentImportInterface,
  StudentRegistrationService
} from './student-registration.service';

@Controller()
@UseGuards(AuthenticatedGuard)
export class StudentRegistrationController {
  constructor(private studentRegistrationService: StudentRegistrationService) {}

  @Post(':major_id/imports')
  @Roles(Role.REGISTRY)
  @UseInterceptors(FileInterceptor('students'))
  async importStudents(
    @Req() request: Request,
    @Param('major_id') major_id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    const {
      school_id,
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    if (!file)
      throw new HttpException(
        JSON.stringify(ERR20('file')),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    const columns = [
      'matricule',
      'email',
      'birthdate',
      'address',
      'religion',
      'handicap',
      'first_name',
      'last_name',
      'birthplace',
      'nationality',
      'home_region',
      'phone_number',
      'gender',
      'national_id_number',
      'civil_status',
      'employment_status',

      'tutor_email',
      'tutor_address',
      'tutor_firstname',
      'tutor_lastname',
      'tutor_birthdate',
      'tutor_nationality',
      'tutor_phone_number',
      'tutor_gender',
      'tutor_national_id_number',
    ];
    try {
      const importedStudentData =
        await readAndProcessFile<StudentImportInterface>(
          columns,
          Readable.from(file.buffer)
        );
      return this.studentRegistrationService.registerImportedStudents({
        school_id,
        academic_year_id,
        major_id,
        importedStudentData,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
