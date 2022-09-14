import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { AnnualRegistry, Prisma } from '@prisma/client';

@Injectable()
export class AnnualRegistryService {
  constructor(private prisma: PrismaService) {}

  async findOne(annualRegistryWhereInput: Prisma.AnnualRegistryWhereInput): Promise<AnnualRegistry> {
    return this.prisma.annualRegistry.findFirst({
      where: annualRegistryWhereInput,
    });
  }

  async findUnique(
    annualRegistryWhereUniqueInput: Prisma.AnnualRegistryWhereUniqueInput
  ): Promise<AnnualRegistry> {
    return this.prisma.annualRegistry.findUnique({
      where: annualRegistryWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AnnualRegistryWhereUniqueInput;
    where?: Prisma.AnnualRegistryWhereInput;
    orderBy?: Prisma.AnnualRegistryOrderByWithRelationInput;
    select?: Prisma.AnnualRegistrySelect;
  }) {
    const { skip, take, cursor, where, orderBy, select } = params;
    return this.prisma.annualRegistry.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async create(data: Prisma.AnnualRegistryCreateInput): Promise<AnnualRegistry> {
    return this.prisma.annualRegistry.create({
      data,
    });
  }

  async createMany(data: Prisma.AnnualRegistryCreateManyInput[]) {
    return this.prisma.annualRegistry.createMany({
      data,
    });
  }

  async update(params: {
    where: Prisma.AnnualRegistryWhereUniqueInput;
    data: Prisma.AnnualRegistryUpdateInput;
  }): Promise<AnnualRegistry> {
    const { where, data } = params;
    return this.prisma.annualRegistry.update({
      data,
      where,
    });
  }

  async updateMany(params: {
    where: Prisma.AnnualRegistryWhereInput;
    data: Prisma.AnnualRegistryUpdateManyMutationInput;
  }): Promise<{ count: number }> {
    const { where, data } = params;
    return this.prisma.annualRegistry.updateMany({
      data,
      where,
    });
  }

  async count(annualRegistryWhereInput: Prisma.AnnualRegistryWhereInput): Promise<number> {
    return this.prisma.annualRegistry.count({
      where: annualRegistryWhereInput,
    });
  }
}
