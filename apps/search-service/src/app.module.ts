import { Module } from '@nestjs/common';
import { KafkaModule } from './modules/kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './modules/category/category.module';
import { ElasticsearchModule } from './modules/elasticsearch/elasticsearch.module';
import { ProductModule } from './modules/product/product.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    KafkaModule,
    ElasticsearchModule,
    CategoryModule,
    ProductModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
