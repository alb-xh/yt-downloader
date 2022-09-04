import { Module } from '@nestjs/common';

import { AuthModule } from '@yt-downloader/auth';

import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  imports: [AuthModule],
  controllers: [VideoController],
  providers: [VideoService],
})
export class AppModule {}