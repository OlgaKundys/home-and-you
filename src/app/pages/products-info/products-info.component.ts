import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { IProductResponse } from 'src/app/shared/interfaces/product.interface';
import { CheckoutService } from 'src/app/shared/services/checkout.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { addDoc, collection, collectionData, deleteDoc, doc, DocumentData, DocumentReference, Firestore, getDocs, query, QuerySnapshot, setDoc, where } from "@angular/fire/firestore";

@Component({
  selector: 'app-products-info',
  templateUrl: './products-info.component.html',
  styleUrls: ['./products-info.component.scss']
})
export class ProductsInfoComponent implements OnInit {

  public allProducts: Array<IProductResponse> = [];
  public currentProductInfo!: IProductResponse;
  public eventsSubscription!: Subscription;
  public currentCategoryName!: string;

  constructor(
    public locationBack: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private firestore: Firestore
  ) { }

  ngOnInit(): void {
    this.loadCurrentProduct();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
    });
  }

  // on Firebase:

  loadCategoryProducts(category: string): void {   
    this.productService.getCategoryFB(category).then(data => {
      this.allProducts = [];
      data.forEach((doc) => {
        const prod = { id: doc.id, ...doc.data() };
        this.allProducts.push(prod as IProductResponse);
      });
      this.currentCategoryName = this.allProducts[0].category.categoryName;
    }).catch(error => {
      this.toastr.error('Load products error');
    })
  }

  loadCurrentProduct(): void {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    this.productService.getOneProductFB(id as string).
      then(data => {
        this.currentProductInfo = {id: data.id, ...data.data() as any}
      })
  }
  
  changeCount(product: IProductResponse, status: boolean): void {
    if(status) {
      ++product.count;
    }
    else if(!status && product.count > 1) {
      --product.count;
    }
  }

  addToCart(product: IProductResponse): void {
    let cart: Array<IProductResponse> = [];
    if(localStorage.length > 0 && localStorage.getItem('cart')) {
      cart = JSON.parse(localStorage.getItem('cart') as string);
      if(cart.some(p => p.id === product.id)) {
        const index = cart.findIndex(p => p.id === product.id);
        cart[index].count += product.count;
      }
      else {
        cart.push(product);
      }
    }
    else {
      cart.push(product);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    product.count = 1;
    this.checkoutService.changeCart.next(true);
    this.toastr.success('Product added to cart');
  }

  // on db.json:

  // loadCurrentProduct(): void {
  //   let id = this.activatedRoute.snapshot.paramMap.get('id');
  //   this.productService.getOneProduct(id as string).subscribe(data => {
  //     this.currentProductInfo = data;
  //   });
  // }

  // loadProducts(): void {
    // this.productService.getAllProducts().subscribe(data => {
    //   this.allProducts = data;
    // }, error => {
    //   console.log('load products error', error);
    // });
  // }

}
