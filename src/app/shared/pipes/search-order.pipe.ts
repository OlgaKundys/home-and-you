import { Pipe, PipeTransform } from '@angular/core';
import { IOrderResponse } from 'src/app/shared/interfaces/order.interface';


@Pipe({
  name: 'searchOrder'
})
export class SearchOrderPipe implements PipeTransform {

  transform(value: IOrderResponse[], searchTerm: string): IOrderResponse[] {
    if (!searchTerm) {
      return value;
    }
    if (!value) {
      return [];
    }
    return value.filter(item => item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || item.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || item.email.toLowerCase().includes(searchTerm.toLowerCase()));
  }

}
