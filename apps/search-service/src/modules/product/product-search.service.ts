import { Injectable } from '@nestjs/common';
import { ProductSearchQueryBuilder } from './builders/product-search-query.builder';
import { SearchProductDto } from './dto/search-product.dto';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { SearchIndex } from '../elasticsearch/model/search-index.model';
import { ProductDocument } from './model/product-document.model';
import { ProductAggregationBuilder } from './builders/product-aggregation.builder';
import { ProductSearchMapper } from './mapper/product-search.mapper';

@Injectable()
export class ProductSearchService {
  constructor(
    private elasticsearchService: ElasticsearchService,
    private queryBuilder: ProductSearchQueryBuilder,
    private aggregationBuilder: ProductAggregationBuilder,
    private mapper: ProductSearchMapper,
  ) {}

  async search(dto: SearchProductDto) {
    const page = dto.page;
    const limit = dto.limit;
    const from = (page - 1) * limit;

    const query = this.queryBuilder.build(dto);
    const sort = this.queryBuilder.buildSort(dto);
    const highlight = this.queryBuilder.buildHighlight(dto);

    const aggs = this.aggregationBuilder.build();

    const response = await this.elasticsearchService.search<ProductDocument>(
      SearchIndex.PRODUCTS,
      {
        sort,
        query,
        highlight,
        aggs,
        from,
        size: limit,
      },
    );

    return this.mapper.toResponse(response, page, limit);
  }
}
