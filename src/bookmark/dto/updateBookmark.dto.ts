import { PartialType } from '@nestjs/mapped-types';
import { CreateBookmarkDto } from './createBookmark.dto';

export class UpdateBookmarkDto extends PartialType(CreateBookmarkDto) {}
