import { estypes } from '@elastic/elasticsearch';
import { Injectable } from '@nestjs/common';

type AggregationMap = Record<string, estypes.AggregationsAggregationContainer>;

@Injectable()
export class ProductAggregationBuilder {
  build(): AggregationMap {
    return {
      ...this.buildCategory(),
      ...this.buildPrice(),
    };
  }

  private buildCategory(): AggregationMap {
    return {
      categories: {
        terms: {
          field: 'category.slug',
          size: 20,
        },
      },
    };
  }

  private buildPrice(): AggregationMap {
    return {
      price_ranges: {
        range: {
          field: 'price',
          ranges: [
            {
              key: 'under_1m',
              to: 1_000_000,
            },
            {
              key: '1m_5m',
              from: 1_000_000,
              to: 5_000_000,
            },
            {
              key: '5m_10m',
              from: 5_000_000,
              to: 10_000_000,
            },
            {
              key: 'over_10m',
              from: 10_000_000,
            },
          ],
        },
      },
    };
  }
}
