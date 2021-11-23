import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Storage, ref, deleteObject, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { IBlogResponse } from 'src/app/shared/interfaces/blog.interface';
import { BlogService } from 'src/app/shared/services/blog.service';

@Component({
  selector: 'app-admin-blog',
  templateUrl: './admin-blog.component.html',
  styleUrls: ['./admin-blog.component.scss']
})
export class AdminBlogComponent implements OnInit {

  @ViewChild ('close') close!: ElementRef;

  public adminBlog: Array<IBlogResponse> = [];
  public currentBlog!: IBlogResponse;
  public currentBlogID!: string;

  public editStatus = false;
  public blogForm!: FormGroup;
  public imgIsUploaded = false;

  constructor(
    private blogService: BlogService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private storage: Storage
  ) { }

  ngOnInit(): void {
    this.initBlogForm();
    this.loadBlogPosts();
  }

  initBlogForm(): void {
    this.blogForm = this.fb.group({
      blogImage: [null, Validators.required],
      blogTitle: [null, Validators.required],
      publicationDate: [null, Validators.required],
      blogCategory: [null, Validators.required],
      blogDescription: [null, Validators.required],
      blogTextOne: [null, Validators.required],
      blogTextTwo: [null, Validators.required],
    });
  }

  loadBlogPosts(): void {
    this.blogService.getAllBlogsFB().subscribe(data => {
      this.adminBlog = data as IBlogResponse[];     
    }, error => {
      this.toastr.error('Load blog error!');
    });
  }

  saveBlog(): void {
    if(this.editStatus) {
      console.log(this.blogForm.value, this.currentBlogID);
      
      this.blogService.updateBlogFB(this.blogForm.value, this.currentBlogID).then(() => {
        this.close.nativeElement.click();
        this.editStatus = false;
        this.initBlogForm();
        this.loadBlogPosts();
        this.imgIsUploaded = false;
      }).catch(error => {
        this.toastr.error(error.message)
      })
    } else {
      const blogPost = { ...this.blogForm.value, count: 1 };
      this.blogService.createBlogFB(blogPost).then(() => {
        this.close.nativeElement.click();
        this.initBlogForm();
        this.loadBlogPosts();
        this.imgIsUploaded = false;
      }).catch(error => {
        this.toastr.error(error.message)
      })
    }
  }

  deleteBlog(blog: IBlogResponse): void {
    this.blogService.deleteBlogFB(blog).then(() => {
      this.loadBlogPosts();
      this.deleteImg(blog.blogImage);
      this.toastr.success('Blog post deleted successfully!');
    }).catch(error => {
      this.toastr.error('Error deleting blog post!')
    })
  }

  editBlog(blog: IBlogResponse): void {   
    this.blogForm.patchValue({
      blogImage: blog.blogImage,
      blogTitle: blog.blogTitle,
      publicationDate: blog.publicationDate,
      blogCategory: blog.blogCategory,
      blogDescription: blog.blogDescription,
      blogTextOne: blog.blogTextOne,
      blogTextTwo: blog.blogTextTwo
    });
    this.currentBlogID = blog.id;
    this.editStatus = true;
    this.imgIsUploaded = true;
  }

  upload(event: any): void {
    const file = event.target.files[0];
    this.uploadFile('images', file.name, file)
      .then(data => {
        this.blogForm.patchValue({
          blogImage: data
        });
        this.imgIsUploaded = true;
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

  deleteImg(blogImage?: string): void {
    blogImage = blogImage ? blogImage : this.controlValue('blogImage');
    this.imgIsUploaded = false;
    const task = ref(this.storage, blogImage);
    deleteObject(task).then(() => {
      this.blogForm.patchValue({
        productImage: null
      })
    })
  }

  controlValue(control: string): string {
    return this.blogForm.get(control)?.value;
  }

}
