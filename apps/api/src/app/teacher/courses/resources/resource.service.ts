import { Injectable } from '@nestjs/common';
import { ResourceType } from '@prisma/client';
import { PrismaService } from 'apps/api/src/prisma/prisma.service';
import { LinkPostDto } from '../course.dto';

@Injectable()
export class ResourceService {
  constructor(private prismaService: PrismaService) {}

  async createResource(
    resource_type: ResourceType,
    resources: LinkPostDto[],
    created_by: string
  ) {
    return this.prismaService.resource.createMany({
      data: resources.map(
        ({ annual_credit_unit_subject_id, chapter_id, ...newLink }) => ({
          ...newLink,
          chapter_id,
          created_by,
          resource_type,
          annual_credit_unit_subject_id,
        })
      ),
    });
  }
}
