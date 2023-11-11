import { Injectable } from '@nestjs/common';
import { AmbassadorEntity } from './ambassadors.dto';
import { GlomPrismaService } from '@glom/prisma';

@Injectable()
export class AmbassadorsService {
  constructor(private prismaService: GlomPrismaService) {}

  async findAll() {
    const ambassadors = await this.prismaService.ambassador.findMany();
    return ambassadors.map((ambassador) => new AmbassadorEntity(ambassador));
  }

  async findOne(ambassador_id: string) {
    const ambassador = await this.prismaService.ambassador.findUnique({
      where: { ambassador_id },
    });
    return new AmbassadorEntity(ambassador);
  }

  async verify(referral_code: string) {
    const ambassador = await this.prismaService.ambassador.findUnique({
      where: { referral_code },
    });
    return new AmbassadorEntity(ambassador);
  }
}
