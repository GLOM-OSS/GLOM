import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { SchoolDemand, Prisma } from '@prisma/client';

@Injectable()
export class SchoolDemandService {
  constructor(private prisma: PrismaService) {}

  async findOne(schoolDemandWhereInput: Prisma.SchoolDemandWhereInput): Promise<SchoolDemand> {
    return this.prisma.schoolDemand.findFirst({
      where: schoolDemandWhereInput,
    });
  }

  async findUnique(
    schoolDemandWhereUniqueInput: Prisma.SchoolDemandWhereUniqueInput
  ): Promise<SchoolDemand> {
    return this.prisma.schoolDemand.findUnique({
      where: schoolDemandWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SchoolDemandWhereUniqueInput;
    where?: Prisma.SchoolDemandWhereInput;
    orderBy?: Prisma.SchoolDemandOrderByWithRelationInput;
    select?: Prisma.SchoolDemandSelect;
  }) {
    const { skip, take, cursor, where, orderBy, select } = params;
    return this.prisma.schoolDemand.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async create(data: Prisma.SchoolDemandCreateInput): Promise<SchoolDemand> {
    return this.prisma.schoolDemand.create({
      data,
    });
  }

  async createMany(data: Prisma.SchoolDemandCreateManyInput[]) {
    return this.prisma.schoolDemand.createMany({
      data,
    });
  }

  async update(params: {
    where: Prisma.SchoolDemandWhereUniqueInput;
    data: Prisma.SchoolDemandUpdateInput;
  }): Promise<SchoolDemand> {
    const { where, data } = params;
    return this.prisma.schoolDemand.update({
      data,
      where,
    });
  }

  async updateMany(params: {
    where: Prisma.SchoolDemandWhereInput;
    data: Prisma.SchoolDemandUpdateManyMutationInput;
  }): Promise<{ count: number }> {
    const { where, data } = params;
    return this.prisma.schoolDemand.updateMany({
      data,
      where,
    });
  }

  async count(schoolDemandWhereInput: Prisma.SchoolDemandWhereInput): Promise<number> {
    return this.prisma.schoolDemand.count({
      where: schoolDemandWhereInput,
    });
  }
}
