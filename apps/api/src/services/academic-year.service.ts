import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { AcademicYear, Prisma } from '@prisma/client';

@Injectable()
export class AcademicYearService {
  constructor(private prisma: PrismaService) {}

  async findOne(academicYearWhereInput: Prisma.AcademicYearWhereInput): Promise<AcademicYear> {
    return this.prisma.academicYear.findFirst({
      where: academicYearWhereInput,
    });
  }

  async findUnique(
    academicYearWhereUniqueInput: Prisma.AcademicYearWhereUniqueInput
  ): Promise<AcademicYear> {
    return this.prisma.academicYear.findUnique({
      where: academicYearWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AcademicYearWhereUniqueInput;
    where?: Prisma.AcademicYearWhereInput;
    orderBy?: Prisma.AcademicYearOrderByWithRelationInput;
    select?: Prisma.AcademicYearSelect;
  }) {
    const { skip, take, cursor, where, orderBy, select } = params;
    return this.prisma.academicYear.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async create(data: Prisma.AcademicYearCreateInput): Promise<AcademicYear> {
    return this.prisma.academicYear.create({
      data,
    });
  }

  async createMany(data: Prisma.AcademicYearCreateManyInput[]) {
    return this.prisma.academicYear.createMany({
      data,
    });
  }

  async update(params: {
    where: Prisma.AcademicYearWhereUniqueInput;
    data: Prisma.AcademicYearUpdateInput;
  }): Promise<AcademicYear> {
    const { where, data } = params;
    return this.prisma.academicYear.update({
      data,
      where,
    });
  }

  async updateMany(params: {
    where: Prisma.AcademicYearWhereInput;
    data: Prisma.AcademicYearUpdateManyMutationInput;
  }): Promise<{ count: number }> {
    const { where, data } = params;
    return this.prisma.academicYear.updateMany({
      data,
      where,
    });
  }

  async count(academicYearWhereInput: Prisma.AcademicYearWhereInput): Promise<number> {
    return this.prisma.academicYear.count({
      where: academicYearWhereInput,
    });
  }
}
