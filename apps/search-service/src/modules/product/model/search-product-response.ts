import { CategoryDocument } from 'src/modules/category/model/category-document.model';

export interface SearchProductResponse {
  id: string;
  name: string;
  description: string;
  slug: string;
  price: number;
  stock: number;
  category: CategoryDocument;

  highlight?: {
    name?: string[];
  };
}
