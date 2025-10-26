import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/auth/enum/role.enum';
import { AuthenticatedUser } from 'src/auth/decorators/authenticated-user.decorators';
import { User } from 'src/entities/user.entity';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/createBookmark.dto';
import { UpdateBookmarkDto } from './dto/updateBookmark.dto';

@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Roles(Role.SUPPA_DUPPA_ADMIN, Role.USER)
  @Post('create')
  async createBookmark(
    @Body() dto: CreateBookmarkDto,
    @AuthenticatedUser() user: User,
  ) {
    return this.bookmarkService.createBookmark(dto, user);
  }

  @Roles(Role.SUPPA_DUPPA_ADMIN, Role.USER)
  @Patch('update/:id')
  async updateBookmark(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateBookmarkDto,
    @AuthenticatedUser() user: User,
  ) {
    const existingBookmark = await this.bookmarkService.findOneWithId(id);
    if (!existingBookmark) throw new NotFoundException('Bookmark not found');

    if (existingBookmark?.user.id !== user.id)
      throw new ForbiddenException(
        'You are not allowed to update this bookmark',
      );

    const updatedBookmark = await this.bookmarkService.updateBookmark(id, dto);

    // console.log(updatedEmployee);

    return {
      message: 'Bookmark Updated Successfully',
      data: updatedBookmark,
    };
  }

  @Roles(Role.SUPPA_DUPPA_ADMIN, Role.USER)
  @Delete('delete/:id')
  async deleteBookmark(
    @Param('id', new ParseUUIDPipe()) id: string,
    @AuthenticatedUser() user: User,
  ) {
    const getBookmark = await this.bookmarkService.findOneWithId(id);
    if (user.id !== getBookmark?.user.id) {
      throw new ForbiddenException(
        'You are not allowed to update this bookmark',
      );
    }
    await this.bookmarkService.deleteBookmark(id);
    return { message: 'Bookmark Deleted Successfully' };
  }

  @Roles(Role.SUPPA_DUPPA_ADMIN, Role.USER)
  @Get('all-bookmarks')
  async getAllBookmarks(@AuthenticatedUser() user: User) {
    const allBookmarks = await this.bookmarkService.getAllBookmarks(user);
    return {
      message: 'All Bookmarks Fetched Successfully',
      data: allBookmarks,
    };
  }

  @Roles(Role.SUPPA_DUPPA_ADMIN, Role.USER)
  @Get('bookmarks-with-category')
  async getBookmarksWithCategory(@AuthenticatedUser() user: User) {
    const allBookmarks =
      await this.bookmarkService.getAllBookmarkByCategory(user);
    console.log(allBookmarks);
    return {
      message: 'All Bookmarks with Category Fetched Successfully',
      data: allBookmarks,
    };
  }
}
