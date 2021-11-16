import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Storage, ref, deleteObject, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { IProductResponse } from 'src/app/shared/interfaces/product.interface';
import { ProductService } from 'src/app/shared/services/product.service';
import { ICategoryResponse } from 'src/app/shared/interfaces/category.interface';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit {

  @ViewChild ('close') close!: ElementRef;

  public adminCategories: Array<ICategoryResponse> = [];
  public currentCategory!: ICategoryResponse;
  public currentCategoryID!: string;

  public adminProducts: Array<IProductResponse> = [];
  public currentProduct!: IProductResponse;
  public currentProductID!: string;

  public editStatus = false;
  public productForm!: FormGroup;
  public isUploaded = false;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private storage: Storage
  ) { }

  ngOnInit(): void {
    this.initProductForm();
    this.loadCategories();
    this.loadProducts();
  }

  initProductForm(): void {
    this.productForm = this.fb.group({
      category: [null, Validators.required],
      subcategory: [null, Validators.required],
      productName: [null, Validators.required],
      productImage: [null, Validators.required],
      price: [null, Validators.required],
      sale: [null, Validators.required],
      brand: [null, Validators.required],
      color: [null, Validators.required],
      material: [null, Validators.required],
      length: [null, Validators.required],
      width: [null, Validators.required],
      height: [null, Validators.required],
      count: [null, Validators.required],
    });
  }

  // on Firebase:

  loadCategories(): void {
    this.categoryService.getAllCategoriesFB().subscribe(data => {
      this.adminCategories = data as ICategoryResponse[];
    }, error => {
      this.toastr.error(error.message);
    });
  }

  loadProducts(): void {
    this.productService.getAllProductsFB().subscribe(data => {
      this.adminProducts = data as IProductResponse[];     
    }, error => {
      this.toastr.error(error.message);
    });
  }

  saveProduct(): void {
    if(this.editStatus) {
      console.log(this.productForm.value, this.currentProductID);

      this.productService.updateProductFB(this.productForm.value, this.currentProductID).then(() => {
        this.close.nativeElement.click();
        this.editStatus = false;
        this.initProductForm();
        this.loadProducts();
        this.isUploaded = false;
      }).catch(error => {
        this.toastr.error(error.message)
      })
    } else {
      const product = { ...this.productForm.value, count: 1 };
      this.productService.createProductFB(product).then(() => {
        this.close.nativeElement.click();
        this.initProductForm();
        this.loadProducts();
        this.isUploaded = false;
      }).catch(error => {
        this.toastr.error(error.message)
      })
    }
  }

  deleteProduct(product: IProductResponse): void {
    this.productService.deleteProductFB(product).then(() => {
      this.loadProducts();
      this.deleteImage(product.productImage);
      this.toastr.success('Product deleted successfully!');
    }).catch(error => {
      this.toastr.error(error.message)
    })
  }

  editProduct(product: IProductResponse): void {   
    this.productForm.patchValue({
      category: product.category.id,
      subcategory: product.subcategory,
      productName: product.productName,
      productImage: product.productImage,
      price: product.price,
      sale: product.sale,
      brand: product.brand,
      color: product.color,
      material: product.material,
      length: product.length,
      width: product.width,
      height: product.height,
      count: product.count
    });
    this.currentProductID = product.id;
    this.editStatus = true;
    this.isUploaded = true;
  }

  // images on Firebase:

  upload(event: any): void {
    const file = event.target.files[0];
    this.uploadFile('images', file.name, file)
      .then(data => {
        this.productForm.patchValue({
          productImage: data
        });
        this.isUploaded = true;
      })
      .catch(error => {
        console.log(error);
      })
  }

  async uploadFile(folder: string, name: string, file: File | null): Promise<string> {
    const ext = file!.name.split('.').pop();
    const path = `${folder}/${name}.${ext}`; {
      if (file) {
        try {
          const storageRef = ref(this.storage, path);
          const task = uploadBytes(storageRef, file);
          await task;
          return await getDownloadURL(storageRef);
        } catch (error: any) {
          return error.message
        }
      } else {
        return '';
      }
    }
  }

  deleteImage(productImage?: string): void {
    productImage = productImage ? productImage : this.controlValue('productImage');
    this.isUploaded = false;
    const task = ref(this.storage, productImage);
    deleteObject(task).then(() => {
      this.productForm.patchValue({
        productImage: null
      })
    })
  }

  controlValue(control: string): string {
    return this.productForm.get(control)?.value;
  }

    // on db.json:

  // loadCategories(): void {
  //   this.categoryService.getAllCategories().subscribe(data => {
  //     this.adminCategories = data;
  //   }, error => {
  //     console.log('load category error', error);
  //   });
  // }

  // loadProducts(): void {
  //   this.productService.getAllProducts().subscribe(data => {
  //     this.adminProducts = data;     
  //   }, error => {
  //     console.log('load products error', error);
  //   });
  // }

  // saveProduct(): void {
  //   if(this.editStatus) {
  //     this.productService.update(this.productForm.value, this.currentProductID).subscribe(() => {
  //       this.close.nativeElement.click();
  //       this.editStatus = false;
  //       this.initProductForm();
  //       this.loadProducts();
  //       this.isUploaded = false;
  //     }, error => {
  //       console.log('update product error', error);
  //     });
  //   } else {
  //     this.productService.create(this.productForm.value).subscribe(() => {
  //       this.close.nativeElement.click();
  //       this.initProductForm();
  //       this.loadProducts();
  //       this.isUploaded = false;
  //     }, error => {
  //       console.log('create product error', error);
  //     });
  //   }
  // }

  // deleteProduct(product: IProductResponse): void {
  //   this.productService.delete(product.id).subscribe(() => {
  //     this.loadProducts();
  //     this.deleteImage(product.productImage);
  //     this.toastr.success('Product deleted successfully!');
  //   }, error => {
  //     this.toastr.error('Delete product error!');
  //     console.log('delete product error', error);
  //   });
  // }

}