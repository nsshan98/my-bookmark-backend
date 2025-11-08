import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setCacheKey(key: string, value: string): Promise<void> {
    await this.cacheManager.set(key, value);
  }
  async getCacheKey(key: string): Promise<string | undefined> {
    return await this.cacheManager.get(key);
  }
  getUptime() {
    return {
      message: '🎉 Yay! I’m alive and kicking 🚀',
      status: 'UP 🟢',
    };
  }
}
