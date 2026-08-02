export interface SearchProductFacet {
  categories: CategoryFacet[];
  priceRanges: PriceRangeFacet[];
}

export interface CategoryFacet {
  slug: string;
  count: number;
}

export interface PriceRangeFacet {
  key: string;
  count: number;
}
