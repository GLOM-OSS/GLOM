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
}
