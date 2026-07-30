import { Injectable } from '@nestjs/common';
import { estypes } from '@elastic/elasticsearch';
import { SearchProductDto } from '../dto/search-product.dto';

@Injectable()
export class ProductSearchQueryBuilder {
  build(dto: SearchProductDto): estypes.QueryDslQueryContainer {
    const must = this.buildMustQueries(dto);
    const filter = this.buildFilterQueries(dto);

    if (must.length === 0 && filter.length === 0) {
      return {
        match_all: {},
      };
    }

    return {
      bool: {
        must,
        filter,
      },
    };
  }

  private buildMustQueries(
    dto: SearchProductDto,
  ): estypes.QueryDslQueryContainer[] {
    const must: estypes.QueryDslQueryContainer[] = [];

    if (dto.q) {
      must.push({
        multi_match: {
          query: dto.q,
          fields: ['name^3', 'description', 'category.name'],
          fuzziness: 'AUTO',
          prefix_length: 2,
          operator: 'and',
        },
      });
    }

    return must;
  }

  private buildFilterQueries(
    dto: SearchProductDto,
  ): estypes.QueryDslQueryContainer[] {
    const filters: estypes.QueryDslQueryContainer[] = [];

    this.pushIfExists(filters, this.buildCategoryFilter(dto));
    this.pushIfExists(filters, this.buildPriceFilter(dto));
    this.pushIfExists(filters, this.buildStockFilter(dto));

    return filters;
  }

  buildSort(dto: SearchProductDto): estypes.SortCombinations[] | undefined {
    switch (dto.sort) {
      case 'price':
        return this.buildPriceSort(dto);

      case 'newest':
        return this.buildNewestSort();

      case 'relevance':
      default:
        return undefined;
    }
  }

  private buildCategoryFilter(
    dto: SearchProductDto,
  ): estypes.QueryDslQueryContainer | null {
    if (!dto.category) return null;

    return {
      term: {
        'category.slug': dto.category,
      },
    };
  }

  private buildPriceFilter(
    dto: SearchProductDto,
  ): estypes.QueryDslQueryContainer | null {
    if (dto.minPrice === undefined && dto.maxPrice === undefined) {
      return null;
    }

    const priceRange: estypes.QueryDslRangeQuery = {};

    if (dto.minPrice !== undefined) {
      priceRange.gte = dto.minPrice;
    }

    if (dto.maxPrice !== undefined) {
      priceRange.lte = dto.maxPrice;
    }

    return {
      range: {
        price: priceRange,
      },
    };
  }

  private buildStockFilter(
    dto: SearchProductDto,
  ): estypes.QueryDslQueryContainer | null {
    if (!dto.inStock) {
      return null;
    }

    return {
      range: {
        stock: {
          gt: 0,
        },
      },
    };
  }

  private buildPriceSort(dto: SearchProductDto): estypes.SortCombinations[] {
    return [
      {
        price: {
          order: dto.order ?? 'asc',
        },
      },
    ];
  }

  private buildNewestSort(): estypes.SortCombinations[] {
    return [
      {
        createdAt: {
          order: 'desc',
        },
      },
    ];
  }

  // Helper
  private pushIfExists<T>(array: T[], item: T | null) {
    if (item) {
      array.push(item);
    }
  }
}
