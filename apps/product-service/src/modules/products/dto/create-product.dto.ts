import { Type } from 'class-transformer';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(2, {
    message: 'Name must be at least 2 characters',
  })
  name!: string;

  @IsString()
  @MinLength(6, {
    message: 'Description must be at least 6 characters',
  })
  description!: string;

  @IsString()
  @MinLength(2, {
    message: 'Slug must be at least 2 characters',
  })
  slug!: string;

  @Type(() => Number)
  @IsNumber()
  price!: number;

  @Type(() => Number)
  @IsNumber()
  stock!: number;

  @IsString()
  categoryId!: string;
}
