import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { addDoc, collection, collectionData, deleteDoc, doc, DocumentData, DocumentReference, Firestore, getDocs, query, QuerySnapshot, setDoc, where } from "@angular/fire/firestore";
import { DocumentSnapshot, getDoc, updateDoc } from '@firebase/firestore';
import { IBlogRequest, IBlogResponse } from '../interfaces/blog.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(
    private firestore: Firestore
  ) { }

  // on Firebase:

  getAllBlogsFB(): Observable<DocumentData[]> {
    return collectionData(collection(this.firestore, "blog"), { idField: 'id' })
  }

  getOneBlogFB(id: string): Promise<DocumentSnapshot<DocumentData>> {
    return getDoc(doc(this.firestore, "blog", id))
  }

  createBlogFB(blog: IBlogRequest): Promise<DocumentReference<DocumentData>> {
    return addDoc(collection(this.firestore, "blog"), blog);
  }

  updateBlogFB(blog: IBlogResponse, id: string): Promise<void> {
    return setDoc(doc(this.firestore, "blog", id), blog);
  }

  deleteBlogFB(blog: IBlogResponse): Promise<void> {
    return deleteDoc(doc(this.firestore, "blog", blog.id));
  }

}
