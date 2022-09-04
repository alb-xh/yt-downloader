import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { ENV_FILE_PATH } from './constants';
import { AuthService } from './auth.service';

import { BearerStrategy } from './strategies';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ENV_FILE_PATH }),
    PassportModule,
  ],
  providers: [
    BearerStrategy,
    AuthService,
  ],
  exports: [
    BearerStrategy,
    AuthService,
  ],
})
export class AuthModule {}
