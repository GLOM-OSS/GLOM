import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { LogCreateInput, LogUpdateInput } from './log';

@Injectable()
export class LogsService {
  constructor(private prismaService: GlomPrismaService) {}

  findOne(log_id: string) {
    return this.prismaService.log.findUnique({ where: { log_id } });
  }

  create({ login_id, ...log }: LogCreateInput) {
    return this.prismaService.log.create({
      data: { ...log, Login: { connect: { login_id } } },
    });
  }

  update(log_id: string, payload: LogUpdateInput) {
    return this.prismaService.log.update({ data: payload, where: { log_id } });
  }
}
