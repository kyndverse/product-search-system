import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProductSearchQueryBuilder } from './builders/product-search-query.builder';
import { SearchProductDto } from './dto/search-product.dto';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { SearchIndex } from '../elasticsearch/model/search-index.model';
import { PaginatedResponse } from 'src/common/models/response';
import { estypes } from '@elastic/elasticsearch';
import { ProductDocument } from './model/product-document.model';
import { SearchProductResponse } from './model/search-product-response';
import { ProductAggregationBuilder } from './builders/product-aggregation.builder';
import { CategoryFacet, PriceRangeFacet } from './model/search-product-facet';
import { Bucket } from '../elasticsearch/types/bucket';

@Injectable()
export class ProductSearchService {
  constructor(
    private elasticsearchService: ElasticsearchService,
    private queryBuilder: ProductSearchQueryBuilder,
    private aggregationBuilder: ProductAggregationBuilder,
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

    return new PaginatedResponse<SearchProductResponse>(
      data,
      {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      this.mapFacets(response),
    );
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

  private mapCategories(
    response: estypes.SearchResponse<ProductDocument>,
  ): CategoryFacet[] {
    const aggregation = response.aggregations?.categories;

    if (!aggregation || !('buckets' in aggregation)) {
      return [];
    }

    const categoryBuckets = aggregation.buckets as Bucket[];

    return categoryBuckets.map((bucket) => ({
      slug: String(bucket.key),
      count: bucket.doc_count,
    }));
  }

  private mapPriceRanges(
    response: estypes.SearchResponse<ProductDocument>,
  ): PriceRangeFacet[] {
    const aggregation = response.aggregations?.price_ranges;

    if (!aggregation || !('buckets' in aggregation)) {
      return [];
    }

    const priceRangeBuckets = aggregation.buckets as Bucket[];

    return priceRangeBuckets.map((bucket) => ({
      key: String(bucket.key),
      count: bucket.doc_count,
    }));
  }

  private mapFacets(response: estypes.SearchResponse<ProductDocument>) {
    return {
      categories: this.mapCategories(response),
      priceRanges: this.mapPriceRanges(response),
    };
  }
}
