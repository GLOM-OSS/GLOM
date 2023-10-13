import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto, InquiryEntity } from './inquiries.dto';

@ApiTags('Inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private inquiriesService: InquiriesService) {}

  @Get('all')
  @ApiOkResponse({ type: [InquiryEntity] })
  getAllInquiries() {
    return this.inquiriesService.findAll();
  }

  @Post('new')
  @ApiCreatedResponse({ type: InquiryEntity })
  createInquiry(@Body() createInquiry: CreateInquiryDto) {
    return this.inquiriesService.create(createInquiry);
  }
}
