import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const categoryCreatedCount = await this.prismaService.category.count({
      where: {
        OR: [
          { name: createCategoryDto.name },
          { slug: createCategoryDto.slug },
        ],
      },
    });

    if (categoryCreatedCount !== 0) {
      throw new ConflictException('Name or slug unvailable');
    }

    const category = await this.prismaService.category.create({
      data: createCategoryDto,
    });

    return category;
  }

  async findAll() {
    const categories = await this.prismaService.category.findMany();
    return categories;
  }

  async findOne(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const isCategoryExist = await this.prismaService.category.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!isCategoryExist) {
      throw new NotFoundException('Category not found');
    }

    const category = await this.prismaService.category.update({
      where: { id },
      data: updateCategoryDto,
    });

    return category;
  }

  async remove(id: string) {
    const isCategoryExist = await this.prismaService.category.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!isCategoryExist) {
      throw new NotFoundException('Category not found');
    }
    await this.prismaService.category.delete({
      where: { id },
    });
  }
}
