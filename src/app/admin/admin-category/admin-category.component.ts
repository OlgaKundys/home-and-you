import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICategoryResponse } from 'src/app/shared/interfaces/category.interface';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {

  @ViewChild ('close') close!: ElementRef;

  public adminCategories: Array<ICategoryResponse> = [];
  public currentCategory!: ICategoryResponse;
  public currentCategoryID!: string;
  public editStatus = false;
  public categoryForm!: FormGroup;
  public isUploaded = false;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.initCategoryForm();
    this.loadCategories();
  }

  initCategoryForm(): void {
    this.categoryForm = this.fb.group({
      categoryName: [null, Validators.required],
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategoriesFB().subscribe(data => {
      this.adminCategories = data as ICategoryResponse[];
    }, error => {
      console.log('load category error', error);
    });
  }

  saveCategory(): void {
    if(this.editStatus) {
      this.categoryService.updateCategoryFB(this.categoryForm.value, this.currentCategoryID).then(() => {
        this.close.nativeElement.click();
        this.editStatus = false;
        this.initCategoryForm();
        this.loadCategories();
        this.isUploaded = false;
        this.toastr.success('Category updated successfully!');
      }).catch(error => {
        this.toastr.error(error.message);
      });
    } else {
      this.categoryService.createCategoryFB(this.categoryForm.value).then(() => {
        this.close.nativeElement.click();
        this.initCategoryForm();
        this.loadCategories();
        this.isUploaded = false;
        this.toastr.success('Category created successfully!');
      }).catch(error => {
        this.toastr.error(error.message);
      });
    }
  }

  deleteCategory(category: ICategoryResponse): void {
    this.categoryService.deleteCategoryFB(category.id).then(() => {
      this.loadCategories();
      this.toastr.success('Category deleted successfully!');
    }).catch(error => {
      this.toastr.error(error.message);
    });
  }

  editCategory(category: ICategoryResponse): void {
    this.categoryForm.patchValue({
      categoryName: category.categoryName,
    });
    this.currentCategoryID = category.id;
    this.editStatus = true;
    this.isUploaded = true;
  }

}