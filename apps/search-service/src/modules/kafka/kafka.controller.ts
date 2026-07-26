import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { DebeziumEventDto } from './model/debezium-event.model';
import { Category } from 'src/modules/category/model/category-event.model';
import { CategorySyncService } from '../category/category-sync.service';

@Controller()
export class KafkaController {
  constructor(private readonly categorySyncService: CategorySyncService) {}

  @EventPattern('product.public.categories')
  async handleCategory(@Payload() event: DebeziumEventDto<Category>) {
    await this.categorySyncService.handle(event);
  }

  // @EventPattern('product.public.products')
  // handleProduct(@Payload() message: KafkaMessage) {
  //   this.kafkaService.consume('product.public.products', message);
  // }
}
