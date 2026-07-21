import { IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(2, {
    message: 'Name must be at least 2 characters',
  })
  name!: string;

  @IsString()
  @MinLength(2, {
    message: 'Slug must be at least 2 characters',
  })
  slug!: string;
}
