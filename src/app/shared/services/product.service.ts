import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProductRequest, IProductResponse } from '../interfaces/product.interface';
import { addDoc, collection, collectionData, deleteDoc, doc, DocumentData, DocumentReference, Firestore, getDocs, query, QuerySnapshot, setDoc, where } from "@angular/fire/firestore";
import { DocumentSnapshot, getDoc, updateDoc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  private url = environment.BACKEND_URL;
  private api = { products: `${this.url}/products` }

  constructor(
    private http: HttpClient,
    private firestore: Firestore
  ) { }

    getAllProductsFB(): Observable<DocumentData[]> {
      return collectionData(collection(this.firestore, "products"), { idField: 'id' })
    }

    getOneProductFB(id: string): Promise<DocumentSnapshot<DocumentData>> {
      return getDoc(doc(this.firestore, "products", id))
    }

    getCategoryFB(categoryName: string): Promise<QuerySnapshot<DocumentData>> {     
      const cat = query(collection(this.firestore, "products"), where("category.categoryName", "==", categoryName));  
      return getDocs(cat);
    }

    createProductFB(product: IProductRequest): Promise<DocumentReference<DocumentData>> {
      return addDoc(collection(this.firestore, "products"), product);
    }

    updateProductFB(product: IProductResponse, id: string): Promise<void> {
      return setDoc(doc(this.firestore, "products", id), product);
    }

    deleteProductFB(product: IProductResponse): Promise<void> {
      return deleteDoc(doc(this.firestore, "products", product.id));
    }
  
}
