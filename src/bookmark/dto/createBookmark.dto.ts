import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateBookmarkDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  category_ids?: string[];
}
