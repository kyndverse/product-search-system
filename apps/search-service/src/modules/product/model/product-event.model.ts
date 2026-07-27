export interface Product {
  id: string;
  name: string;
  description: string;
  slug: string;
  price: string;
  stock: number;
  category_id: number;

  created_at: number;
  updated_at: number;
}
