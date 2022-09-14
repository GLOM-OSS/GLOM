import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Log, Prisma } from '@prisma/client';

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  async findOne(logWhereInput: Prisma.LogWhereInput): Promise<Log> {
    return this.prisma.log.findFirst({
      where: logWhereInput,
    });
  }

  async findUnique(
    logWhereUniqueInput: Prisma.LogWhereUniqueInput
  ): Promise<Log> {
    return this.prisma.log.findUnique({
      where: logWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.LogWhereUniqueInput;
    where?: Prisma.LogWhereInput;
    orderBy?: Prisma.LogOrderByWithRelationInput;
    select?: Prisma.LogSelect;
  }) {
    const { skip, take, cursor, where, orderBy, select } = params;
    return this.prisma.log.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async create(data: Prisma.LogCreateInput): Promise<Log> {
    return this.prisma.log.create({
      data,
    });
  }

  async createMany(data: Prisma.LogCreateManyInput[]) {
    return this.prisma.log.createMany({
      data,
    });
  }

  async update(params: {
    where: Prisma.LogWhereUniqueInput;
    data: Prisma.LogUpdateInput;
  }): Promise<Log> {
    const { where, data } = params;
    return this.prisma.log.update({
      data,
      where,
    });
  }

  async updateMany(params: {
    where: Prisma.LogWhereInput;
    data: Prisma.LogUpdateManyMutationInput;
  }): Promise<{ count: number }> {
    const { where, data } = params;
    return this.prisma.log.updateMany({
      data,
      where,
    });
  }

  async count(logWhereInput: Prisma.LogWhereInput): Promise<number> {
    return this.prisma.log.count({
      where: logWhereInput,
    });
  }
}
