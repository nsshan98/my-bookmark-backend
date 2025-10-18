import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import metascraper from 'metascraper';
import metascraperUrl from 'metascraper-url';
import metascraperTitle from 'metascraper-title';
import metascraperDescription from 'metascraper-description';
import metascraperImage from 'metascraper-image';
import metascraperLogo from 'metascraper-logo';

@Injectable()
export class UrlService {
  private readonly scraper = metascraper([
    metascraperUrl(),
    metascraperTitle(),
    metascraperDescription(),
    metascraperImage(),
    metascraperLogo(),
  ]);

  async fetchMetadata(targetUrl: string) {
    try {
      if (!targetUrl || !targetUrl.startsWith('http'))
        throw new BadRequestException('Invalid URL');

      const { data: html } = await axios.get(targetUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (NestJS MetaScraper)' },
        // timeout: 10000,
      });

      const metadata = await this.scraper({ html, url: targetUrl });
      return metadata;
    } catch (err) {
      throw new BadRequestException(`Failed to fetch metadata: ${err.message}`);
    }
  }
}
