import { Injectable } from '@nestjs/common';
import { estypes } from '@elastic/elasticsearch';
import { SearchProductDto } from '../dto/search-product.dto';

@Injectable()
export class ProductSearchQueryBuilder {
  build(dto: SearchProductDto): estypes.QueryDslQueryContainer {
    if (!dto.q) {
      return {
        match_all: {},
      };
    }

    return {
      multi_match: {
        query: dto.q,
        fields: ['name^3', 'description', 'category.name'],
      },
    };
  }
}
