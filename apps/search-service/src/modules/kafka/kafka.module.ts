import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { CategoryModule } from '../category/category.module';

@Module({
  controllers: [KafkaController],
  imports: [CategoryModule],
})
export class KafkaModule {}
