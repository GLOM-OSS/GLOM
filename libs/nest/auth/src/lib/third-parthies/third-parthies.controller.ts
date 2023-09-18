import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
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
import { UserEntity } from '../glom-auth.dto';
import { GoogleGuard } from './google/google.guard';
import { Request, Response } from 'express';
import { ClsService } from 'nestjs-cls';

@ApiTags('Authentication')
@Controller('auth/third-parthies')
@ApiBadRequestResponse({
  description:
    'Bad request. This often happens when the request payload it not respected.',
})
@ApiInternalServerErrorResponse({
  description: 'Internal server error. An unexpected exception was thrown',
})
export class ThirdParthiesController {
  constructor(private clsService: ClsService) {}

  @Post('google')
  @UseGuards(GoogleGuard)
  @ApiOperation({
    summary:
      'Google authentication. It redirects the provided callback on sucessfully authentication.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized request. incorrect email or password',
  })
  async googleAuth(@Req() req: Request) {
    return req.user;
  }

  @Post('google/callback')
  @UseGuards(GoogleGuard)
  @ApiExcludeEndpoint()
  @ApiResponse({ status: 201, type: UserEntity })
  async googleCallback(@Res() res: Response) {
    const refererUrl = this.clsService.get()['refererUrl'];
    return res.redirect(refererUrl);
  }
}
