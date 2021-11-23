import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICategoryRequest, ICategoryResponse } from '../interfaces/category.interface';
import { addDoc, collection, collectionData, deleteDoc, doc, DocumentData, DocumentReference, DocumentSnapshot, Firestore, getDoc, setDoc } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private url = environment.BACKEND_URL;
  private api = { category: `${this.url}/category` }

  constructor(
    private http: HttpClient,
    private firestore: Firestore
  ) { }

    getAllCategoriesFB(): Observable<DocumentData[]> {
      return collectionData(collection(this.firestore, "categories"), { idField: 'id' })
    }

    getOneCategoryFB(id: string): Promise<DocumentSnapshot<DocumentData>> {
      return getDoc(doc(this.firestore, "categories", id))
    }

    createCategoryFB(category: ICategoryRequest): Promise<DocumentReference<DocumentData>> {
      return addDoc(collection(this.firestore, "categories"), category);
    }

    updateCategoryFB(category: ICategoryResponse, id: string): Promise<void> {
      return setDoc(doc(this.firestore, "categories", id), category);
    }

    deleteCategoryFB(id: string): Promise<void> {
      return deleteDoc(doc(this.firestore, "categories", id));
    }

}