import { Controller, Get, Query } from '@nestjs/common';
import { ProductSearchService } from './product-search.service';
import { SearchProductDto } from './dto/search-product.dto';

@Controller('api/products')
export class ProductController {
  constructor(private ProductSearchService: ProductSearchService) {}

  @Get('search')
  async search(@Query() query: SearchProductDto) {
    return this.ProductSearchService.search(query);
  }
}
