import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Bookmark } from 'src/entities/bookmark.entity';
import { CreateBookmarkDto } from './dto/createBookmark.dto';
import { UpdateBookmarkDto } from './dto/updateBookmark.dto';
import { Category } from 'src/entities/category.entity';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findOneWithId(id: string) {
    return await this.bookmarkRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async createBookmark(dto: CreateBookmarkDto, user: User) {
    const { category_ids } = dto;
    const existingBookmark = await this.bookmarkRepository.findOne({
      where: { url: dto.url, user: { id: user.id } },
    });
    const categories = await this.categoryRepository.findBy({
      id: In(category_ids || []),
    });

    console.log(categories);
    if (existingBookmark) {
      throw new BadRequestException('Bookmark already exists');
    }

    const bookmark = this.bookmarkRepository.create({
      ...dto,
      categories,
      user,
    });

    const saved = await this.bookmarkRepository.save(bookmark);
    // console.log('saved bookmark:', saved);

    return {
      id: saved.id,
      url: saved.url,
      title: saved.title,
      description: saved.description,
      image: saved.image,
      logo: saved.logo,
      categories: saved.categories.map((cat) => ({
        id: cat.id,
        category_name: cat.category_name,
      })),
      created_at: saved.created_at,
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

  async getAllBookmarks(user: User) {
    const bookmarks = await this.bookmarkRepository.find({
      select: [
        'id',
        'url',
        'title',
        'logo',
        'image',
        'description',
        'created_at',
        'user',
      ],
      relations: ['user'],
      where: { user: { id: user.id } },
      order: { created_at: 'DESC' },
    });

    const result = bookmarks.map((bm) => {
      return {
        id: bm.id,
        url: bm.url,
        title: bm.title,
        description: bm.description,
        image: bm.image,
        logo: bm.logo,
        created_at: bm.created_at,
      };
    });
    return result;
  }
}
