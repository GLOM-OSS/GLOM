import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthSerializer } from './auth.serializer';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google/google.strategy';
import { LocalStrategy } from './local/local.strategy';

@Global()
@Module({
  providers: [AuthService, LocalStrategy, GoogleStrategy, AuthSerializer],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
