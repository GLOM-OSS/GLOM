import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Student, Prisma } from '@prisma/client';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async findOne(studentWhereInput: Prisma.StudentWhereInput): Promise<Student> {
    return this.prisma.student.findFirst({
      where: studentWhereInput,
    });
  }

  async findUnique(
    studentWhereUniqueInput: Prisma.StudentWhereUniqueInput
  ): Promise<Student> {
    return this.prisma.student.findUnique({
      where: studentWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.StudentWhereUniqueInput;
    where?: Prisma.StudentWhereInput;
    orderBy?: Prisma.StudentOrderByWithRelationInput;
    select?: Prisma.StudentSelect;
  }) {
    const { skip, take, cursor, where, orderBy, select } = params;
    return this.prisma.student.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async create(data: Prisma.StudentCreateInput): Promise<Student> {
    return this.prisma.student.create({
      data,
    });
  }

  async createMany(data: Prisma.StudentCreateManyInput[]) {
    return this.prisma.student.createMany({
      data,
    });
  }

  async update(params: {
    where: Prisma.StudentWhereUniqueInput;
    data: Prisma.StudentUpdateInput;
  }): Promise<Student> {
    const { where, data } = params;
    return this.prisma.student.update({
      data,
      where,
    });
  }

  async updateMany(params: {
    where: Prisma.StudentWhereInput;
    data: Prisma.StudentUpdateManyMutationInput;
  }): Promise<{ count: number }> {
    const { where, data } = params;
    return this.prisma.student.updateMany({
      data,
      where,
    });
  }

  async count(studentWhereInput: Prisma.StudentWhereInput): Promise<number> {
    return this.prisma.student.count({
      where: studentWhereInput,
    });
  }
}
