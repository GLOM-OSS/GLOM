import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InquiriesService } from './inquiries.service';
import { InquiryEntity } from './inquiries.dto';

@ApiTags('Inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private inquiriesService: InquiriesService) {}

  @Get('all')
  @ApiOkResponse({ type: [InquiryEntity] })
  getAllInquiries() {
    return this.inquiriesService.findAll();
  }
}
