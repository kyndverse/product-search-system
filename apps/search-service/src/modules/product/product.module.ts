import { Module } from '@nestjs/common';
import { ProductSycnService } from './product-sync.service';
import { ElasticsearchModule } from '../elasticsearch/elasticsearch.module';
import { ProductSearchService } from './product-search.service';
import { ProductController } from './product.controller';
import { ProductSearchQueryBuilder } from './builders/product-search-query.builder';
import { ProductAggregationBuilder } from './builders/product-aggregation.builder';

@Module({
  controllers: [ProductController],
  providers: [
    ProductSycnService,
    ProductSearchService,
    ProductSearchQueryBuilder,
    ProductAggregationBuilder,
  ],
  exports: [ProductSycnService],
  imports: [ElasticsearchModule],
})
export class ProductModule {}
