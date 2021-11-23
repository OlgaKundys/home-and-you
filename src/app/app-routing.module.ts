import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
import { AuthGuard } from './shared/guards/auth.guard';
import { ProfileDetailsComponent } from './pages/profile-details/profile-details.component';
import { ProfileGuard } from './shared/guards/profile.guard';
import { SigninComponent } from './pages/signin/signin.component';
import { BlogComponent } from './pages/blog/blog.component';
import { AdminBlogComponent } from './admin/admin-blog/admin-blog.component';
import { BlogInfoComponent } from './pages/blog-info/blog-info.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products/:category', component: ProductsComponent },
  { path: 'products/:category/:id', component: ProductsInfoComponent },
  { path: 'products-info/:id', component: ProductsInfoComponent },
  { path: 'sale', component: SaleComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog-info/:id', component: BlogInfoComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'profile-details', component: ProfileDetailsComponent, canActivate: [ProfileGuard] },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], children: [
    { path: '', pathMatch: 'full', redirectTo: 'admin-category' },
    { path: 'admin-category', component: AdminCategoryComponent },
    { path: 'admin-products', component: AdminProductsComponent },
    { path: 'admin-sale', component: AdminSaleComponent },
    { path: 'admin-orders', component: AdminOrdersComponent },
    { path: 'admin-blog', component: AdminBlogComponent }
  ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
