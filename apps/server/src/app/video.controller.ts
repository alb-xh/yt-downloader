import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Response,
  UseGuards,
} from '@nestjs/common';
import * as path from 'path';
import { Response as Res } from 'express';

import { BearerAuthGuard } from '@yt-downloader/auth';

import { VideoService } from './video.service';
import { DOWNLOADER_LOCATION } from '../constants';

@Controller({
  path: 'video',
  version: '1',
})
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  private validateVideoId (id: string) {
    if (!this.videoService.validateId(id)) {
      throw new BadRequestException('Video id is invalid!');
    }
  }

  @Get(':id/info')
  @UseGuards(BearerAuthGuard)
  async getVideoInfo (@Param('id') id: string) {
    this.validateVideoId(id);
    return this.videoService.getVideoInfo(id);
  }

  @Get(':id/download')
  @UseGuards(BearerAuthGuard)
  async downloadVideo(@Param('id') id: string, @Response() res: Res) {
    this.validateVideoId(id);

    const {
      contentType,
      contentLength,
      stream,
    } = await this.videoService.downloadVideo(id);

    stream.pipe(
      res.set({
        'Content-Type': contentType,
        'Content-Length': contentLength,
      })
    );
  }

  @Get('downloader')
  getDownloader(@Response() res: Res) {
    const fileLocation = path.resolve(DOWNLOADER_LOCATION)
    res.sendFile(fileLocation);
  }
}
