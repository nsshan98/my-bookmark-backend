import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from 'src/entities/bookmark.entity';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { Category } from 'src/entities/category.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark, Category, User])],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
