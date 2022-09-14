import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Login, Prisma } from '@prisma/client';

@Injectable()
export class LoginService {
  constructor(private prisma: PrismaService) {}

  async findOne(loginWhereInput: Prisma.LoginWhereInput): Promise<Login> {
    return this.prisma.login.findFirst({
      where: loginWhereInput,
    });
  }

  async findUnique(
    loginWhereUniqueInput: Prisma.LoginWhereUniqueInput
  ): Promise<Login> {
    return this.prisma.login.findUnique({
      where: loginWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.LoginWhereUniqueInput;
    where?: Prisma.LoginWhereInput;
    orderBy?: Prisma.LoginOrderByWithRelationInput;
    select?: Prisma.LoginSelect;
  }) {
    const { skip, take, cursor, where, orderBy, select } = params;
    return this.prisma.login.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async create(data: Prisma.LoginCreateInput): Promise<Login> {
    return this.prisma.login.create({
      data,
    });
  }

  async createMany(data: Prisma.LoginCreateManyInput[]) {
    return this.prisma.login.createMany({
      data,
    });
  }

  async update(params: {
    where: Prisma.LoginWhereUniqueInput;
    data: Prisma.LoginUpdateInput;
  }): Promise<Login> {
    const { where, data } = params;
    return this.prisma.login.update({
      data,
      where,
    });
  }

  async updateMany(params: {
    where: Prisma.LoginWhereInput;
    data: Prisma.LoginUpdateManyMutationInput;
  }): Promise<{ count: number }> {
    const { where, data } = params;
    return this.prisma.login.updateMany({
      data,
      where,
    });
  }

  async count(loginWhereInput: Prisma.LoginWhereInput): Promise<number> {
    return this.prisma.login.count({
      where: loginWhereInput,
    });
  }
}
