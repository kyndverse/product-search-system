import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { CategoryModule } from '../category/category.module';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [KafkaController],
  imports: [CategoryModule, ProductModule],
})
export class KafkaModule {}
