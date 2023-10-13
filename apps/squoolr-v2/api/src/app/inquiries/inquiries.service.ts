import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { CreateInquiryDto, InquiryEntity } from './inquiries.dto';

@Injectable()
export class InquiriesService {
  constructor(private prismaService: GlomPrismaService) {}

  async findAll() {
    const inquiries = await this.prismaService.inquiry.findMany();
    return inquiries.map((inquiry) => new InquiryEntity(inquiry));
  }

  async create(createInquiry: CreateInquiryDto) {
    const inquiry = await this.prismaService.inquiry.create({
      data: createInquiry,
    });
    return new InquiryEntity(inquiry);
  }
}
