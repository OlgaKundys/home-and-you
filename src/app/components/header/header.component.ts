import { Component, OnInit } from '@angular/core';
import { IProductResponse } from 'src/app/shared/interfaces/product.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CheckoutService } from 'src/app/shared/services/checkout.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public total = 0;
  public cart: Array<IProductResponse> = [];
  public isUser = false;
  public isAdmin = false;
  public isLoggedIn = false;

  constructor(
    private checkoutService: CheckoutService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadCart();
    this.checkChangeCart();
    this.getAuthData();
    this.checkLogin();
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

  checkChangeCart(): void {
    this.checkoutService.changeCart.subscribe(() => {
      this.loadCart();
    });
  }

  getAuthData(): void {
    if(localStorage.length > 0 && localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user') as string);
      if(user && user.role === 'admin') {
        this.isAdmin = true;
        this.isUser = false;
        this.isLoggedIn = true;
      }
      else if(user && user.role === 'user') {
        this.isUser = true;
        this.isAdmin = false;
        this.isLoggedIn = true;
      }
      else {
        this.isAdmin = false;
        this.isUser = false;
      }
    }
    else {
      this.isAdmin = false;
      this.isUser = false;
    }
  }

  signOut(): void {
    this.authService.logOut();
    this.isLoggedIn = false;
  }

  checkLogin(): void {
    this.authService.currentUser$.subscribe(() => {
      this.getAuthData();
    })
  }

}
