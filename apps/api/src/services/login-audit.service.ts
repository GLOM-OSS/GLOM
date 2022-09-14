import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { LoginAudit, Prisma } from '@prisma/client';

@Injectable()
export class LoginAuditService {
  constructor(private prisma: PrismaService) {}

  async findOne(loginAuditWhereInput: Prisma.LoginAuditWhereInput): Promise<LoginAudit> {
    return this.prisma.loginAudit.findFirst({
      where: loginAuditWhereInput,
    });
  }

  async findUnique(
    loginAuditWhereUniqueInput: Prisma.LoginAuditWhereUniqueInput
  ): Promise<LoginAudit> {
    return this.prisma.loginAudit.findUnique({
      where: loginAuditWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.LoginAuditWhereUniqueInput;
    where?: Prisma.LoginAuditWhereInput;
    orderBy?: Prisma.LoginAuditOrderByWithRelationInput;
    select?: Prisma.LoginAuditSelect;
  }) {
    const { skip, take, cursor, where, orderBy, select } = params;
    return this.prisma.loginAudit.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async create(data: Prisma.LoginAuditCreateInput): Promise<LoginAudit> {
    return this.prisma.loginAudit.create({
      data,
    });
  }

  async createMany(data: Prisma.LoginAuditCreateManyInput[]) {
    return this.prisma.loginAudit.createMany({
      data,
    });
  }

  async update(params: {
    where: Prisma.LoginAuditWhereUniqueInput;
    data: Prisma.LoginAuditUpdateInput;
  }): Promise<LoginAudit> {
    const { where, data } = params;
    return this.prisma.loginAudit.update({
      data,
      where,
    });
  }

  async updateMany(params: {
    where: Prisma.LoginAuditWhereInput;
    data: Prisma.LoginAuditUpdateManyMutationInput;
  }): Promise<{ count: number }> {
    const { where, data } = params;
    return this.prisma.loginAudit.updateMany({
      data,
      where,
    });
  }

  async count(loginAuditWhereInput: Prisma.LoginAuditWhereInput): Promise<number> {
    return this.prisma.loginAudit.count({
      where: loginAuditWhereInput,
    });
  }
}
