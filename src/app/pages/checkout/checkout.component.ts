import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IProductResponse } from 'src/app/shared/interfaces/product.interface';
import { IUserResponse } from 'src/app/shared/interfaces/user.interface';
import { CheckoutService } from 'src/app/shared/services/checkout.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  public cart: Array<IProductResponse> = [];
  public total = 0;
  public orderForm!: FormGroup;
  public loggedUser!: IUserResponse;

  constructor(
    private checkoutService: CheckoutService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initOrderForm();
    this.loadCart();
    this.checkChangeCart();
    this.getUserInfo();
  }

  getUserInfo(): void {
    if(localStorage.length > 0 && localStorage.getItem('user')) {
      this.loggedUser = JSON.parse(localStorage.getItem('user') as string);
      this.orderForm.patchValue({
        firstName: this.loggedUser.firstName,
        lastName: this.loggedUser.lastName,
        email: this.loggedUser.email,
        phone: this.loggedUser.phone,
        address: this.loggedUser.address,
        zipCode: this.loggedUser.zipCode,
        city: this.loggedUser.city,
        orderStatus: 'In progress'
      })
    }
  }

  initOrderForm(): void {
    this.orderForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null, Validators.required],
      address: [null, Validators.required],
      zipCode: [null, Validators.required],
      city: [null, Validators.required],
      orderStatus: ['In progress']
    })
  }

  loadCart(): void {
    if(localStorage.length > 0 && localStorage.getItem('cart')) {
      this.cart = JSON.parse(localStorage.getItem('cart') as string);
    }
    else {
      this.cart = [];
    }
    this.setTotalPrice();
  }

  setTotalPrice(): void {
    if(this.cart.length === 0) {
      this.total = 0;
    }
    else {
      this.total = this.cart.reduce((total, product) => total + product.price * product.count, 0);
    }
  }

  changeCount(product: IProductResponse, status: boolean): void {
    if(status) {
      ++product.count;
    }
    else if(!status && product.count > 1) {
      --product.count;
    }
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.checkoutService.changeCart.next(true);
  }

  checkChangeCart(): void {
    this.checkoutService.changeCart.subscribe(() => {
      this.loadCart();
    });
  }

  removeProduct(product: IProductResponse): void {
    const index = this.cart.findIndex(prod => prod.id === product.id);
    this.cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.checkoutService.changeCart.next(true);
  };

  // on Firebase:

  confirmOrder(): void {
    const order = {
      ...this.orderForm.value,
      cart: this.cart,
      totalPrice: this.total,
      status: 'In progress'
    }
    this.checkoutService.createOrderFB(order)
    .then(() => {
      localStorage.removeItem('cart');
      this.checkoutService.changeCart.next(false);
      this.loadCart();
      this.toastr.success('We received your order!');
    })
    .catch(error => {
      this.toastr.error('Create order error!');
    })
  };

  // on db.json:

  // confirmOrder(): void {
  //   this.checkoutService.create(order).subscribe(() => {
  //     localStorage.removeItem('cart');
  //     this.checkoutService.changeCart.next(false);
  //     this.loadCart();
  //     this.toastr.success('We received your order!');
  //   }, error => {
  //     this.toastr.error('Create order error!');
  //   })
  // };

}
