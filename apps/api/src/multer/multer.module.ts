import { Global } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

@Global()
export class MulterFileModule extends MulterModule {}
