import { Pipe, PipeTransform } from '@angular/core';
import { IProductResponse } from 'src/app/shared/interfaces/product.interface';

@Pipe({
  name: 'searchProduct'
})
export class SearchProductPipe implements PipeTransform {

  transform(value: IProductResponse[], searchTerm: string): IProductResponse[] {
    if (!searchTerm) {
      return value;
    }
    if (!value) {
      return [];
    }
    return value.filter(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) || item.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) || item.color.toLowerCase().includes(searchTerm.toLowerCase()));
  }

}
