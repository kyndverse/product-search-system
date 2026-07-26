import { Injectable, Logger } from '@nestjs/common';
import { DebeziumEventDto } from '../kafka/model/debezium-event.model';
import { Category } from 'src/modules/category/model/category-event.model';
import { CategoryDocument } from './model/category-document.model';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { SearchIndex } from '../elasticsearch/model/search-index.model';

@Injectable()
export class CategorySyncService {
  private readonly logger = new Logger(CategorySyncService.name);

  constructor(private elasticsearchService: ElasticsearchService) {}

  handle(event: DebeziumEventDto<Category>) {
    switch (event.op) {
      case 'c':
        return this.create(event.after!);

      case 'u':
        return this.update(event.before!, event.after!);

      case 'd':
        return this.delete(event.before!);

      case 'r':
        return this.snapshot(event.after!);

      default:
        this.logger.warn('Unknown operation');
    }
  }

  private async create(category: Category) {
    const document = this.toDocument(category);

    await this.elasticsearchService.index(
      SearchIndex.CATEGORIES,
      category.id,
      document,
    );
  }

  private async update(before: Category, after: Category) {
    const document = this.toDocument(after);

    await this.elasticsearchService.index(
      SearchIndex.CATEGORIES,
      before.id,
      document,
    );
  }

  private async delete(category: Category) {
    await this.elasticsearchService.delete(SearchIndex.CATEGORIES, category.id);
  }

  private async snapshot(category: Category) {
    const document = this.toDocument(category);

    await this.elasticsearchService.index(
      SearchIndex.CATEGORIES,
      category.id,
      document,
    );
  }

  private toDocument(category: Category): CategoryDocument {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
    };
  }
}
