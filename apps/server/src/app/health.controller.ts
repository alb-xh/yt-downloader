import {
  Controller,
  Get,
} from '@nestjs/common';

@Controller({
  path: 'health',
  version: '1',
})
export class HealthController {

  @Get('/')
  async isOnline () {
    return {
      online: true,
      message: 'API is online!',
    };
  }
}
