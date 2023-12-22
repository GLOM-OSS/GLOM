import { GlomPrismaService } from '@glom/prisma';
import { GlomRedisService } from '@glom/redis';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import RedisStore from 'connect-redis';
import { LogCreateInput, LogUpdateInput, LogWhereInput } from './log';

@Injectable()
export class LogsService {
  private redisStore: RedisStore;
  constructor(
    redisService: GlomRedisService,
    private prismaService: GlomPrismaService
  ) {
    this.redisStore = new RedisStore({ client: redisService.client });
    this.closeSessionTask();
  }

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

  count(loginId: string, params?: LogWhereInput) {
    return this.prismaService.log.count({
      where: { ...params, login_id: loginId },
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  private async closeSessionTask() {
    const logs = await this.prismaService.log.findMany({
      where: { closed_at: null, logged_out_at: null },
    });
    const sessionIDs: string[] = [];
    await Promise.all(
      logs.map(
        (log) =>
          new Promise((resolve) =>
            this.redisStore.get(log.log_id, (error, result) => {
              if (!error && !result) sessionIDs.push(log.log_id);
              resolve(1);
            })
          )
      )
    );
    await this.prismaService.$transaction(
      logs
        .filter((_) => sessionIDs.includes(_.log_id))
        .map(({ log_id, updated_at, logged_in_at }) =>
          this.prismaService.log.update({
            data: {
              closed_at: new Date(
                new Date(updated_at ?? logged_in_at).getTime() +
                  Number(process.env.SESSION_AGE)
              ),
            },
            where: { log_id },
          })
        )
    );
  }
}
