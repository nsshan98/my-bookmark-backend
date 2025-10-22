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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Roles(Role.SUPPA_DUPPA_ADMIN, Role.USER)
  @Post('create')
  async createCategory(
    @Body() dto: CreateCategoryDto,
    @AuthenticatedUser() user: User,
  ) {
    return this.categoryService.createCategory(dto, user);
  }

  @Roles(Role.SUPPA_DUPPA_ADMIN, Role.USER)
  @Patch('update/:id')
  async updateCategory(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCategoryDto,
    @AuthenticatedUser() user: User,
  ) {
    const existingCategory = await this.categoryService.findOneWithId(id);
    if (!existingCategory) throw new NotFoundException('Category not found');

    if (existingCategory?.user.id !== user.id)
      throw new ForbiddenException(
        'You are not allowed to update this category',
      );

    const updatedCategory = await this.categoryService.updateCategory(id, dto);

    // console.log(updatedEmployee);

    return {
      message: 'Category Updated Successfully',
      data: updatedCategory,
    };
  }

  @Roles(Role.SUPPA_DUPPA_ADMIN, Role.USER)
  @Delete('delete/:id')
  async deleteCategory(
    @Param('id', new ParseUUIDPipe()) id: string,
    @AuthenticatedUser() user: User,
  ) {
    const getCategory = await this.categoryService.findOneWithId(id);
    if (user.id !== getCategory?.user.id) {
      throw new ForbiddenException(
        'You are not allowed to update this category',
      );
    }
    await this.categoryService.deleteCategory(id);
    return { message: 'Category Deleted Successfully' };
  }

  @Roles(Role.SUPPA_DUPPA_ADMIN, Role.USER)
  @Get('all-categories')
  async getAllCategories(@AuthenticatedUser() user: User) {
    const allCategories = await this.categoryService.getAllCategories(user);
    return {
      message: 'All Categories Fetched Successfully',
      data: allCategories,
    };
  }
}
