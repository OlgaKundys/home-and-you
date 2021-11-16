import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IBlogResponse } from 'src/app/shared/interfaces/blog.interface';
import { BlogService } from 'src/app/shared/services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  public allBlogs: Array<IBlogResponse> = [];
  public eventsSubscription!: Subscription;
  public currentBlog!: string;

  constructor(
    private blogService: BlogService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadBlog();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
    });
  }

  loadBlog(): void {
    this.blogService.getAllBlogsFB().subscribe(data => {
      this.allBlogs = data as IBlogResponse[];     
    }, error => {
      this.toastr.error('Load blog error!');
    });
  }

}
