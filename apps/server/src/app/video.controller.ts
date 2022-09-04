import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Response,
} from '@nestjs/common';
import { Response as Res } from 'express';

import { VideoService } from './video.service';

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
  async getVideoInfo (@Param('id') id: string) {
    this.validateVideoId(id);
    return this.videoService.getVideoInfo(id);
  }

  @Get(':id/download')
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
}
