import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IProductResponse } from 'src/app/shared/interfaces/product.interface';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsComponent implements OnInit, OnDestroy {

  public allProducts: Array<IProductResponse> = [];
  public eventsSubscription!: Subscription;
  public currentCategoryName!: string;
  public searchTerm: string = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
  ) {
    this.eventsSubscription = this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        const categoryName = this.activatedRoute.snapshot.paramMap.get('category');
        this.loadCategoryProducts(categoryName as string);
      }
    })
  }

  ngOnInit(): void { }
  
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

  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
  }

}
