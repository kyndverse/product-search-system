import { Module } from '@nestjs/common';
import { ProductSycnService } from './product-sync.service';
import { ElasticsearchModule } from '../elasticsearch/elasticsearch.module';
import { ProductSearchService } from './product-search.service';
import { ProductController } from './product.controller';
import { ProductSearchQueryBuilder } from './builders/product-search-query.builder';
import { ProductAggregationBuilder } from './builders/product-aggregation.builder';
import { ProductSearchMapper } from './mapper/product-search.mapper';

@Module({
  controllers: [ProductController],
  providers: [
    ProductSycnService,
    ProductSearchService,
    ProductSearchMapper,
    ProductSearchQueryBuilder,
    ProductAggregationBuilder,
  ],
  exports: [ProductSycnService],
  imports: [ElasticsearchModule],
})
export class ProductModule {}
