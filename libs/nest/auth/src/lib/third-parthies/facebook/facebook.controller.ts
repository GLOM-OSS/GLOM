import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiExcludeEndpoint,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserEntity } from '../../glom-auth.dto';
import { Request, Response } from 'express';
import { ClsService } from 'nestjs-cls';
import { FacebookGuard } from './facebook.guard';

@Controller()
@ApiTags('Authentication')
@ApiUnauthorizedResponse({
  description: 'Unauthorized request. incorrect email or password',
})
@ApiBadRequestResponse({
  description:
    'Bad request. This often happens when the request payload it not respected.',
})
@ApiInternalServerErrorResponse({
  description: 'Internal server error. An unexpected exception was thrown',
})
export class FacebookController {
  constructor(private clsService: ClsService) {}

  @Get()
  @UseGuards(FacebookGuard)
  @ApiOperation({
    summary:
      'Facebook authentication. It redirects the provided callback on sucessfully authentication.',
  })
  async facebookAuth(@Req() req: Request) {
    return req.user;
  }

  @Get('callback')
  @UseGuards(FacebookGuard)
  @ApiExcludeEndpoint()
  @ApiResponse({ status: 201, type: UserEntity })
  async facebookCallback(@Res() res: Response) {
    const refererUrl = this.clsService.get()['refererUrl'];
    return res.redirect(refererUrl);
  }
}
