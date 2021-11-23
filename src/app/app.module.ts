import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductsInfoComponent } from './pages/products-info/products-info.component';
import { SaleComponent } from './pages/sale/sale.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { AdminComponent } from './admin/admin.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminSaleComponent } from './admin/admin-sale/admin-sale.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';

import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

import { environment } from 'src/environments/environment';
import { getAuth, provideAuth } from '@angular/fire/auth';

import { ProfileDetailsComponent } from './pages/profile-details/profile-details.component';
import { SigninComponent } from './pages/signin/signin.component';
import { BlogComponent } from './pages/blog/blog.component';
import { AdminBlogComponent } from './admin/admin-blog/admin-blog.component';
import { BlogInfoComponent } from './pages/blog-info/blog-info.component';
import { SearchProductPipe } from './shared/pipes/search-product.pipe';
import { SearchOrderPipe } from './shared/pipes/search-order.pipe';

import {NgPipesModule} from 'ngx-pipes';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ProductsComponent,
    ProductsInfoComponent,
    SaleComponent,
    ProfileComponent,
    CheckoutComponent,
    AdminComponent,
    AdminCategoryComponent,
    AdminProductsComponent,
    AdminSaleComponent,
    AdminOrdersComponent,
    ProfileDetailsComponent,
    SigninComponent,
    BlogComponent,
    AdminBlogComponent,
    BlogInfoComponent,
    SearchProductPipe,
    SearchOrderPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth()),
    NgPipesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
