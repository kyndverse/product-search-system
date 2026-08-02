import { SearchProductFacet } from 'src/modules/product/model/search-product-facet';

export class PaginatedResponse<T> {
  constructor(
    public data: T[],
    public meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    },
    public facet: SearchProductFacet,
  ) {}
}
