import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { addDoc, collection, collectionData, deleteDoc, doc, DocumentData, DocumentReference, Firestore, getDocs, query, QuerySnapshot, setDoc, where } from "@angular/fire/firestore";
import { IBlogResponse } from 'src/app/shared/interfaces/blog.interface';
import { BlogService } from 'src/app/shared/services/blog.service';

@Component({
  selector: 'app-blog-info',
  templateUrl: './blog-info.component.html',
  styleUrls: ['./blog-info.component.scss']
})
export class BlogInfoComponent implements OnInit {

  public allBlogs: Array<IBlogResponse> = [];
  public currentBlogInfo!: IBlogResponse;
  public eventsSubscription!: Subscription;

  constructor(
    public locationBack: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private firestore: Firestore,
    private blogService: BlogService,
  ) { }

  ngOnInit(): void {
    this.loadCurrentBlog();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
    });
  }

  loadCurrentBlog(): void {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    this.blogService.getOneBlogFB(id as string).
      then(data => {
        this.currentBlogInfo = {id: data.id, ...data.data() as any}
      })
  }

}
