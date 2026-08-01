import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProductSearchQueryBuilder } from './builders/product-search-query.builder';
import { SearchProductDto } from './dto/search-product.dto';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { SearchIndex } from '../elasticsearch/model/search-index.model';
import { PaginatedResponse } from 'src/common/models/response';
import { estypes } from '@elastic/elasticsearch';
import { ProductDocument } from './model/product-document.model';
import { SearchProductResponse } from './model/search-product-response';

@Injectable()
export class ProductSearchService {
  constructor(
    private queryBuilder: ProductSearchQueryBuilder,
    private elasticsearchService: ElasticsearchService,
  ) {}

  async search(dto: SearchProductDto) {
    const page = dto.page;
    const limit = dto.limit;

    const from = (page - 1) * limit;

    const query = this.queryBuilder.build(dto);
    const sort = this.queryBuilder.buildSort(dto);
    const highlight = this.queryBuilder.buildHighlight(dto);

    const response = await this.elasticsearchService.search<ProductDocument>(
      SearchIndex.PRODUCTS,
      {
        sort,
        query,
        highlight,
        from,
        size: limit,
      },
    );

    return this.toResponse(response, page, limit);
  }

  private toResponse(
    response: estypes.SearchResponse<ProductDocument>,
    page: number,
    limit: number,
  ) {
    const total =
      typeof response.hits.total === 'number'
        ? response.hits.total
        : (response.hits.total?.value ?? 0);

    const data = response.hits.hits.map((hit) => this.mapProduct(hit));

    return new PaginatedResponse<SearchProductResponse>(data, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  }

  private mapProduct(
    hit: estypes.SearchHit<ProductDocument>,
  ): SearchProductResponse {
    if (!hit._source) {
      throw new InternalServerErrorException('Invalid Elasticsearch response.');
    }

    return {
      ...hit._source,
      highlight: hit.highlight,
    };
  }
}
