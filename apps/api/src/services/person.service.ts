import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Person, Prisma } from '@prisma/client';

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {}

  async findOne(personWhereInput: Prisma.PersonWhereInput): Promise<Person> {
    return this.prisma.person.findFirst({
      where: personWhereInput,
    });
  }

  async findUnique(
    personWhereUniqueInput: Prisma.PersonWhereUniqueInput
  ): Promise<Person> {
    return this.prisma.person.findUnique({
      where: personWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PersonWhereUniqueInput;
    where?: Prisma.PersonWhereInput;
    orderBy?: Prisma.PersonOrderByWithRelationInput;
    select?: Prisma.PersonSelect;
  }) {
    const { skip, take, cursor, where, orderBy, select } = params;
    return this.prisma.person.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async create(data: Prisma.PersonCreateInput): Promise<Person> {
    return this.prisma.person.create({
      data,
    });
  }

  async createMany(data: Prisma.PersonCreateManyInput[]) {
    return this.prisma.person.createMany({
      data,
    });
  }

  async update(params: {
    where: Prisma.PersonWhereUniqueInput;
    data: Prisma.PersonUpdateInput;
  }): Promise<Person> {
    const { where, data } = params;
    return this.prisma.person.update({
      data,
      where,
    });
  }

  async updateMany(params: {
    where: Prisma.PersonWhereInput;
    data: Prisma.PersonUpdateManyMutationInput;
  }): Promise<{ count: number }> {
    const { where, data } = params;
    return this.prisma.person.updateMany({
      data,
      where,
    });
  }

  async count(personWhereInput: Prisma.PersonWhereInput): Promise<number> {
    return this.prisma.person.count({
      where: personWhereInput,
    });
  }
}
