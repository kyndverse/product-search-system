import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/database/prisma.service';
import { FindProductQueryDto } from './dto/find-query-product.dto';
import { PaginatedResponse } from 'src/common/models/response';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const isCategoryExist = await this.prismaService.category.findUnique({
      where: { id: createProductDto.categoryId },
      select: { id: true },
    });

    if (!isCategoryExist) {
      throw new BadRequestException('Category id is not valid');
    }

    const product = await this.prismaService.product.create({
      data: createProductDto,
    });

    return product;
  }

  async findAll(query: FindProductQueryDto) {
    const { page, limit, search, category, sortBy, order } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    const [products, total] = await this.prismaService.$transaction([
      this.prismaService.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: order,
        },
        include: {
          category: { omit: { createdAt: true, updatedAt: true } },
        },
        omit: { categoryId: true },
      }),
      this.prismaService.product.count({
        where,
      }),
    ]);

    return new PaginatedResponse(products, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  }

  async findOne(id: string) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const isProductExist = await this.prismaService.product.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!isProductExist) throw new NotFoundException('Product not found');

    const product = await this.prismaService.product.update({
      where: { id },
      data: updateProductDto,
    });

    return product;
  }

  async remove(id: string) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!product) throw new NotFoundException('Product not found');

    await this.prismaService.product.delete({ where: { id } });
  }
}
