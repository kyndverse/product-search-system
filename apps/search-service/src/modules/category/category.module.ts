import { Module } from '@nestjs/common';
import { CategorySyncService } from './category-sync.service';
import { ElasticsearchModule } from '../elasticsearch/elasticsearch.module';

@Module({
  providers: [CategorySyncService],
  exports: [CategorySyncService],
  imports: [ElasticsearchModule],
})
export class CategoryModule {}
