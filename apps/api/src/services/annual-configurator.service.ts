import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { AnnualConfigurator, Prisma } from '@prisma/client';

@Injectable()
export class AnnualConfiguratorService {
  constructor(private prisma: PrismaService) {}

  async findOne(annualConfiguratorWhereInput: Prisma.AnnualConfiguratorWhereInput): Promise<AnnualConfigurator> {
    return this.prisma.annualConfigurator.findFirst({
      where: annualConfiguratorWhereInput,
    });
  }

  async findUnique(
    annualConfiguratorWhereUniqueInput: Prisma.AnnualConfiguratorWhereUniqueInput
  ): Promise<AnnualConfigurator> {
    return this.prisma.annualConfigurator.findUnique({
      where: annualConfiguratorWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AnnualConfiguratorWhereUniqueInput;
    where?: Prisma.AnnualConfiguratorWhereInput;
    orderBy?: Prisma.AnnualConfiguratorOrderByWithRelationInput;
    select?: Prisma.AnnualConfiguratorSelect;
  }) {
    const { skip, take, cursor, where, orderBy, select } = params;
    return this.prisma.annualConfigurator.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async create(data: Prisma.AnnualConfiguratorCreateInput): Promise<AnnualConfigurator> {
    return this.prisma.annualConfigurator.create({
      data,
    });
  }

  async createMany(data: Prisma.AnnualConfiguratorCreateManyInput[]) {
    return this.prisma.annualConfigurator.createMany({
      data,
    });
  }

  async update(params: {
    where: Prisma.AnnualConfiguratorWhereUniqueInput;
    data: Prisma.AnnualConfiguratorUpdateInput;
  }): Promise<AnnualConfigurator> {
    const { where, data } = params;
    return this.prisma.annualConfigurator.update({
      data,
      where,
    });
  }

  async updateMany(params: {
    where: Prisma.AnnualConfiguratorWhereInput;
    data: Prisma.AnnualConfiguratorUpdateManyMutationInput;
  }): Promise<{ count: number }> {
    const { where, data } = params;
    return this.prisma.annualConfigurator.updateMany({
      data,
      where,
    });
  }

  async count(annualConfiguratorWhereInput: Prisma.AnnualConfiguratorWhereInput): Promise<number> {
    return this.prisma.annualConfigurator.count({
      where: annualConfiguratorWhereInput,
    });
  }
}
