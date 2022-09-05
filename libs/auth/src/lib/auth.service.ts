import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { API_TOKENS_CONFIG_KEY } from './constants';

@Injectable()
export class AuthService {
  private apiTokens: string[];
  constructor(configService: ConfigService) {
    this.apiTokens = configService.get<string>(API_TOKENS_CONFIG_KEY).split(',');
  }

  validateToken (token: string): boolean {
    return this.apiTokens.includes(token);
  }
}
