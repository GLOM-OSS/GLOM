import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { School, Prisma } from '@prisma/client';

@Injectable()
export class SchoolService {
  constructor(private prisma: PrismaService) {}

  async findOne(schoolWhereInput: Prisma.SchoolWhereInput): Promise<School> {
    return this.prisma.school.findFirst({
      where: schoolWhereInput,
    });
  }

  async findUnique(
    schoolWhereUniqueInput: Prisma.SchoolWhereUniqueInput
  ): Promise<School> {
    return this.prisma.school.findUnique({
      where: schoolWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SchoolWhereUniqueInput;
    where?: Prisma.SchoolWhereInput;
    orderBy?: Prisma.SchoolOrderByWithRelationInput;
    select?: Prisma.SchoolSelect;
  }) {
    const { skip, take, cursor, where, orderBy, select } = params;
    return this.prisma.school.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async create(data: Prisma.SchoolCreateInput): Promise<School> {
    return this.prisma.school.create({
      data,
    });
  }

  async createMany(data: Prisma.SchoolCreateManyInput[]) {
    return this.prisma.school.createMany({
      data,
    });
  }

  async update(params: {
    where: Prisma.SchoolWhereUniqueInput;
    data: Prisma.SchoolUpdateInput;
  }): Promise<School> {
    const { where, data } = params;
    return this.prisma.school.update({
      data,
      where,
    });
  }

  async updateMany(params: {
    where: Prisma.SchoolWhereInput;
    data: Prisma.SchoolUpdateManyMutationInput;
  }): Promise<{ count: number }> {
    const { where, data } = params;
    return this.prisma.school.updateMany({
      data,
      where,
    });
  }

  async count(schoolWhereInput: Prisma.SchoolWhereInput): Promise<number> {
    return this.prisma.school.count({
      where: schoolWhereInput,
    });
  }
}
