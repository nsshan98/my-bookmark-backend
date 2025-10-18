import { Controller, Post, Body } from '@nestjs/common';
import { UrlService } from './url.service';
import { Public } from 'src/auth/decorators/public.decorators';

@Public()
@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  async getUrlMetadata(@Body('url') url: string) {
    return this.urlService.fetchMetadata(url);
  }
}
