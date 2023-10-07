import { ApiProperty } from '@nestjs/swagger';

export class GlomExceptionResponse {
  @ApiProperty({ type: String })
  path: string;

  @ApiProperty({ type: Number })
  timestamp: number;

  @ApiProperty({ type: String })
  error: string;

  @ApiProperty({ type: String })
  message: string;

  constructor(props: GlomExceptionResponse) {
    Object.assign(this, props);
  }
}
