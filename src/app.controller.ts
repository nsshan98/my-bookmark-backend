import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Post('/cache')
  async setCacheKey(@Query('key') key: string, @Query('value') value: string) {
    await this.appService.setCacheKey(key, value);
    return {
      success: true,
      status: 201,
      message: `Cache key "${key}" and value "${value}" set successfully.`,
    };
  }

  @Public()
  @Get('/cache/get/:key')
  async getCacheKey(@Param('key') key: string) {
    const data = await this.appService.getCacheKey(key);
    return {
      success: true,
      status: 200,
      data,
    };
  }

  @Public()
  @Get('/alive')
  getUptime() {
    return this.appService.getUptime();
  }
}
