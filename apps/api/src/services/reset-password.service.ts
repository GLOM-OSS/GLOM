import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ResetPassword, Prisma } from '@prisma/client';

@Injectable()
export class ResetPasswordService {
  constructor(private prisma: PrismaService) {}

  async findOne(resetPasswordWhereInput: Prisma.ResetPasswordWhereInput): Promise<ResetPassword> {
    return this.prisma.resetPassword.findFirst({
      where: resetPasswordWhereInput,
    });
  }

  async findUnique(
    resetPasswordWhereUniqueInput: Prisma.ResetPasswordWhereUniqueInput
  ): Promise<ResetPassword> {
    return this.prisma.resetPassword.findUnique({
      where: resetPasswordWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ResetPasswordWhereUniqueInput;
    where?: Prisma.ResetPasswordWhereInput;
    orderBy?: Prisma.ResetPasswordOrderByWithRelationInput;
    select?: Prisma.ResetPasswordSelect;
  }) {
    const { skip, take, cursor, where, orderBy, select } = params;
    return this.prisma.resetPassword.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async create(data: Prisma.ResetPasswordCreateInput): Promise<ResetPassword> {
    return this.prisma.resetPassword.create({
      data,
    });
  }

  async createMany(data: Prisma.ResetPasswordCreateManyInput[]) {
    return this.prisma.resetPassword.createMany({
      data,
    });
  }

  async update(params: {
    where: Prisma.ResetPasswordWhereUniqueInput;
    data: Prisma.ResetPasswordUpdateInput;
  }): Promise<ResetPassword> {
    const { where, data } = params;
    return this.prisma.resetPassword.update({
      data,
      where,
    });
  }

  async updateMany(params: {
    where: Prisma.ResetPasswordWhereInput;
    data: Prisma.ResetPasswordUpdateManyMutationInput;
  }): Promise<{ count: number }> {
    const { where, data } = params;
    return this.prisma.resetPassword.updateMany({
      data,
      where,
    });
  }

  async count(resetPasswordWhereInput: Prisma.ResetPasswordWhereInput): Promise<number> {
    return this.prisma.resetPassword.count({
      where: resetPasswordWhereInput,
    });
  }
}
