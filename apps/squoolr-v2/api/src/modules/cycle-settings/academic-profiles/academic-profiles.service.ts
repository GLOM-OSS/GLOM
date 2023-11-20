import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { QueryAcademicProfile } from './academic-profile';
import { AcademicProfileEntity } from './academic-profile.dto';

@Injectable()
export class AcademicProfilesService {
  constructor(private prismaService: GlomPrismaService) {}

  async getAcademicProfiles(metaParams: QueryAcademicProfile) {
    const academicProfiles =
      await this.prismaService.annualAcademicProfile.findMany({
        where: { ...metaParams, is_deleted: false },
      });

    return academicProfiles.map(
      (academicProfile) => new AcademicProfileEntity(academicProfile)
    );
  }
}
