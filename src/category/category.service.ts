import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Category } from 'src/entities/category.entity';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findOneWithId(id: string) {
    return await this.categoryRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async createCategory(dto: CreateCategoryDto, user: User) {
    const existingCategory = await this.categoryRepository.findOne({
      where: { category_name: dto.category_name, user: { id: user.id } },
    });
    if (existingCategory) {
      throw new BadRequestException('Category already exists');
    }

    const category = this.categoryRepository.create({
      ...dto,
      user,
    });

    const savedCategory = await this.categoryRepository.save(category);
    // console.log('saved category:', saved);

    return {
      id: savedCategory.id,
      category_name: savedCategory.category_name,
    };
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      // relations: ['user'],
    });

    if (!category) throw new NotFoundException('Category not found');

    const { ...rest } = dto;

    Object.assign(category, rest);

    return await this.categoryRepository.save(category);
  }

  async deleteCategory(id: string) {
    return await this.categoryRepository.delete({ id });
  }

  async getAllCategories(user: User) {
    const categories = await this.categoryRepository.find({
      select: ['id', 'category_name'],
      where: { user: { id: user.id } },
      order: { created_at: 'DESC' },
    });

    const result = categories.map((cat) => {
      return {
        id: cat.id,
        category_name: cat.category_name,
        created_at: cat.created_at,
      };
    });
    return result;
  }
}
