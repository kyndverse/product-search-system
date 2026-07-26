import { Module } from '@nestjs/common';
import { KafkaModule } from './modules/kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './modules/category/category.module';
import { ElasticsearchModule } from './modules/elasticsearch/elasticsearch.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    KafkaModule,
    ElasticsearchModule,
    CategoryModule,
  ],
})
export class AppModule {}
