import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PersonAudit, Prisma } from '@prisma/client';

@Injectable()
export class PersonAuditService {
  constructor(private prisma: PrismaService) {}

  async findOne(personAuditWhereInput: Prisma.PersonAuditWhereInput): Promise<PersonAudit> {
    return this.prisma.personAudit.findFirst({
      where: personAuditWhereInput,
    });
  }

  async findUnique(
    personAuditWhereUniqueInput: Prisma.PersonAuditWhereUniqueInput
  ): Promise<PersonAudit> {
    return this.prisma.personAudit.findUnique({
      where: personAuditWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PersonAuditWhereUniqueInput;
    where?: Prisma.PersonAuditWhereInput;
    orderBy?: Prisma.PersonAuditOrderByWithRelationInput;
    select?: Prisma.PersonAuditSelect;
  }) {
    const { skip, take, cursor, where, orderBy, select } = params;
    return this.prisma.personAudit.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async create(data: Prisma.PersonAuditCreateInput): Promise<PersonAudit> {
    return this.prisma.personAudit.create({
      data,
    });
  }

  async createMany(data: Prisma.PersonAuditCreateManyInput[]) {
    return this.prisma.personAudit.createMany({
      data,
    });
  }

  async update(params: {
    where: Prisma.PersonAuditWhereUniqueInput;
    data: Prisma.PersonAuditUpdateInput;
  }): Promise<PersonAudit> {
    const { where, data } = params;
    return this.prisma.personAudit.update({
      data,
      where,
    });
  }

  async updateMany(params: {
    where: Prisma.PersonAuditWhereInput;
    data: Prisma.PersonAuditUpdateManyMutationInput;
  }): Promise<{ count: number }> {
    const { where, data } = params;
    return this.prisma.personAudit.updateMany({
      data,
      where,
    });
  }

  async count(personAuditWhereInput: Prisma.PersonAuditWhereInput): Promise<number> {
    return this.prisma.personAudit.count({
      where: personAuditWhereInput,
    });
  }
}
