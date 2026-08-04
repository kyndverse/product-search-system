import { estypes } from '@elastic/elasticsearch';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProductDocument } from '../model/product-document.model';
import { SearchProductResponse } from '../model/search-product-response';
import { PaginatedResponse } from 'src/common/models/response';
import { CategoryFacet, PriceRangeFacet } from '../model/search-product-facet';
import { Bucket } from 'src/modules/elasticsearch/types/bucket';

@Injectable()
export class ProductSearchMapper {
  toResponse(
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
