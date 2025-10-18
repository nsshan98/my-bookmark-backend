import { Injectable } from '@nestjs/common';
import { request } from 'undici';
import metascraper from 'metascraper';
import metascraperUrl from 'metascraper-url';
import metascraperTitle from 'metascraper-title';
import metascraperDescription from 'metascraper-description';
import metascraperImage from 'metascraper-image';
import metascraperLogo from 'metascraper-logo';
import puppeteer from 'puppeteer';

@Injectable()
export class UrlService {
  private scraper = metascraper([
    metascraperUrl(),
    metascraperTitle(),
    metascraperDescription(),
    metascraperImage(),
    metascraperLogo(),
  ]);

  async fetchMetadata(url: string) {
    try {
      const { body } = await request(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        },
      });
      const html = await body.text();

      let metadata = await this.scraper({ html, url });
      if (!metadata.title && !metadata.description) {
        metadata = await this.scrapeWithPuppeteer(url);
      }

      return { success: true, data: metadata };
    } catch (error) {
      console.error('Error fetching metadata:', error.message);
      return { success: false, error: error.message };
    }
  }

  private async scrapeWithPuppeteer(url: string) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const html = await page.content();
    const metadata = await this.scraper({ html, url });
    await browser.close();
    return metadata;
  }
}
