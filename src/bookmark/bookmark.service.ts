import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Bookmark } from 'src/entities/bookmark.entity';
import { CreateBookmarkDto } from './dto/createBookmark.dto';
import { UpdateBookmarkDto } from './dto/updateBookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
  ) {}

  async findOneWithId(id: string) {
    return await this.bookmarkRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }
  async createBookmark(dto: CreateBookmarkDto, user: User) {
    const bookmark = this.bookmarkRepository.create({
      ...dto,
      user,
    });

    const saved = await this.bookmarkRepository.save(bookmark);
    // console.log('saved employee:', saved);

    return {
      id: saved.id,
      url: saved.url,
      title: saved.title,
    };
  }

  async updateBookmark(id: string, dto: UpdateBookmarkDto) {
    const bookmark = await this.bookmarkRepository.findOne({
      where: { id },
      // relations: ['user'],
    });

    if (!bookmark) throw new NotFoundException('Bookmark not found');

    const { ...rest } = dto;

    Object.assign(bookmark, rest);

    return await this.bookmarkRepository.save(bookmark);
  }

  async deleteBookmark(id: string) {
    return await this.bookmarkRepository.delete({ id });
  }

  async getAllBookmarks() {
    const bookmarks = await this.bookmarkRepository.find({
      select: ['id', 'url', 'title'],
      order: { created_at: 'DESC' },
    });

    const result = bookmarks.map((bm) => {
      return {
        id: bm.id,
        url: bm.url,
        title: bm.title,
      };
    });
    return result;
  }
}
