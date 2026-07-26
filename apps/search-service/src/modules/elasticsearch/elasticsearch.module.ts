import { Module } from '@nestjs/common';
import { ElasticsearchService } from './elasticsearch.service';
import { Client } from '@elastic/elasticsearch';

@Module({
  providers: [
    {
      provide: 'ELASTICSEARCH_CLIENT',
      useFactory: () => {
        return new Client({
          node: 'http://localhost:9200',
        });
      },
    },
    ElasticsearchService,
  ],
  exports: [ElasticsearchService],
})
export class ElasticsearchModule {}
