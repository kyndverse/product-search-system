import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { DebeziumEventDto } from '../kafka/model/debezium-event.model';
import { Product } from './model/product-event.model';
import { SearchIndex } from '../elasticsearch/model/search-index.model';
import { ProductDocument } from './model/product-document.model';

@Injectable()
export class ProductSycnService {
  private readonly logger = new Logger(ProductSycnService.name);

  constructor(private elasticsearchService: ElasticsearchService) {}

  handle(event: DebeziumEventDto<Product>) {
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

  private async create(product: Product) {
    const document = this.toDocument(product);

    await this.elasticsearchService.index(
      SearchIndex.PRODUCTS,
      product.id,
      document,
    );
  }

  private async update(before: Product, after: Product) {
    const document = this.toDocument(after);

    await this.elasticsearchService.index(
      SearchIndex.PRODUCTS,
      before.id,
      document,
    );
  }

  private async delete(product: Product) {
    await this.elasticsearchService.delete(SearchIndex.PRODUCTS, product.id);
  }

  private async snapshot(product: Product) {
    const document = this.toDocument(product);

    await this.elasticsearchService.index(
      SearchIndex.PRODUCTS,
      product.id,
      document,
    );
  }

  private toDocument(product: Product): ProductDocument {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
    };
  }
}
