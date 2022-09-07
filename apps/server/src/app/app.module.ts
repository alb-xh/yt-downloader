import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@yt-downloader/auth';

import { ENV_FILE_PATH } from '../constants';
import { HealthController } from './health.controller';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ENV_FILE_PATH }),
    AuthModule
  ],
  controllers: [
    HealthController,
    VideoController,
  ],
  providers: [VideoService],
})
export class AppModule {}