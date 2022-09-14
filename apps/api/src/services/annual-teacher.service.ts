import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { AnnualTeacher, Prisma } from '@prisma/client';

@Injectable()
export class AnnualTeacherService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    annualTeacherWhereInput: Prisma.AnnualTeacherWhereInput
  ): Promise<AnnualTeacher> {
    return this.prisma.annualTeacher.findFirst({
      where: annualTeacherWhereInput,
    });
  }

  async findUnique(
    annualTeacherWhereUniqueInput: Prisma.AnnualTeacherWhereUniqueInput
  ): Promise<AnnualTeacher> {
    return this.prisma.annualTeacher.findUnique({
      where: annualTeacherWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AnnualTeacherWhereUniqueInput;
    where?: Prisma.AnnualTeacherWhereInput;
    orderBy?: Prisma.AnnualTeacherOrderByWithRelationInput;
    select?: Prisma.AnnualTeacherSelect;
  }) {
    const { skip, take, cursor, where, orderBy, select } = params;
    return this.prisma.annualTeacher.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async create(data: Prisma.AnnualTeacherCreateInput): Promise<AnnualTeacher> {
    return this.prisma.annualTeacher.create({
      data,
    });
  }

  async createMany(data: Prisma.AnnualTeacherCreateManyInput[]) {
    return this.prisma.annualTeacher.createMany({
      data,
    });
  }

  async update(params: {
    where: Prisma.AnnualTeacherWhereUniqueInput;
    data: Prisma.AnnualTeacherUpdateInput;
  }): Promise<AnnualTeacher> {
    const { where, data } = params;
    return this.prisma.annualTeacher.update({
      data,
      where,
    });
  }

  async updateMany(params: {
    where: Prisma.AnnualTeacherWhereInput;
    data: Prisma.AnnualTeacherUpdateManyMutationInput;
  }): Promise<{ count: number }> {
    const { where, data } = params;
    return this.prisma.annualTeacher.updateMany({
      data,
      where,
    });
  }

  async count(
    annualTeacherWhereInput: Prisma.AnnualTeacherWhereInput
  ): Promise<number> {
    return this.prisma.annualTeacher.count({
      where: annualTeacherWhereInput,
    });
  }
}
