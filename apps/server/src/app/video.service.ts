import * as ytdl from 'ytdl-core';
import { Injectable } from '@nestjs/common';

import {
  VIDEO_FORMAT,
  VIDEO_QUALITY,
} from './constants';

@Injectable()
export class VideoService {
  validateId (id: string): boolean {
    return ytdl.validateID(id);
  }

  async getVideoInfo (id: string) {
    const { videoDetails } = await ytdl.getBasicInfo(id);
    const {
      title,
      description,
      video_url: videoUrl,
      thumbnails,
    } = videoDetails;

    return {
      title,
      description,
      videoUrl,
      thumbnailUrl: thumbnails && thumbnails[0].url,
      fileName: [title, VIDEO_FORMAT].join('.'),
    };
  }

  async downloadVideo (id: string) {
    const info = await ytdl.getInfo(id);
    const format = ytdl.chooseFormat(info.formats, {
      quality: VIDEO_QUALITY,
      filter: ({ container }) => container === VIDEO_FORMAT,
    });

    return {
      contentType: [ 'video', VIDEO_FORMAT ].join('/'),
      contentLength: format.contentLength,
      stream: ytdl.downloadFromInfo(info, { format }),
    };
  }
}