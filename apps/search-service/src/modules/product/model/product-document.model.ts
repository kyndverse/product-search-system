import { CategoryDocument } from 'src/modules/category/model/category-document.model';

export interface ProductDocument {
  id: string;
  name: string;
  description: string;
  slug: string;
  price: number;
  stock: number;

  category: CategoryDocument;
}
