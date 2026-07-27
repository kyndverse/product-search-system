import { Module } from '@nestjs/common';
import { ProductSycnService } from './product-sync.service';
import { ElasticsearchModule } from '../elasticsearch/elasticsearch.module';

@Module({
  providers: [ProductSycnService],
  exports: [ProductSycnService],
  imports: [ElasticsearchModule],
})
export class ProductModule {}
