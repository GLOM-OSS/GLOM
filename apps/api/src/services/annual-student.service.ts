import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { AnnualStudent, Prisma } from '@prisma/client';

@Injectable()
export class AnnualStudentService {
  constructor(private prisma: PrismaService) {}

  async findOne(annualStudentWhereInput: Prisma.AnnualStudentWhereInput): Promise<AnnualStudent> {
    return this.prisma.annualStudent.findFirst({
      where: annualStudentWhereInput,
    });
  }

  async findUnique(
    annualStudentWhereUniqueInput: Prisma.AnnualStudentWhereUniqueInput
  ): Promise<AnnualStudent> {
    return this.prisma.annualStudent.findUnique({
      where: annualStudentWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AnnualStudentWhereUniqueInput;
    where?: Prisma.AnnualStudentWhereInput;
    orderBy?: Prisma.AnnualStudentOrderByWithRelationInput;
    select?: Prisma.AnnualStudentSelect;
  }) {
    const { skip, take, cursor, where, orderBy, select } = params;
    return this.prisma.annualStudent.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async create(data: Prisma.AnnualStudentCreateInput): Promise<AnnualStudent> {
    return this.prisma.annualStudent.create({
      data,
    });
  }

  async createMany(data: Prisma.AnnualStudentCreateManyInput[]) {
    return this.prisma.annualStudent.createMany({
      data,
    });
  }

  async update(params: {
    where: Prisma.AnnualStudentWhereUniqueInput;
    data: Prisma.AnnualStudentUpdateInput;
  }): Promise<AnnualStudent> {
    const { where, data } = params;
    return this.prisma.annualStudent.update({
      data,
      where,
    });
  }

  async updateMany(params: {
    where: Prisma.AnnualStudentWhereInput;
    data: Prisma.AnnualStudentUpdateManyMutationInput;
  }): Promise<{ count: number }> {
    const { where, data } = params;
    return this.prisma.annualStudent.updateMany({
      data,
      where,
    });
  }

  async count(annualStudentWhereInput: Prisma.AnnualStudentWhereInput): Promise<number> {
    return this.prisma.annualStudent.count({
      where: annualStudentWhereInput,
    });
  }
}
