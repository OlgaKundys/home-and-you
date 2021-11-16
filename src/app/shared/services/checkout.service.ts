import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, DocumentData, DocumentReference, DocumentSnapshot, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IOrderRequest, IOrderResponse } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  public changeCart = new Subject<boolean>();

  private url = environment.BACKEND_URL;
  private api = { orders: `${this.url}/orders` }

  constructor(
    private http: HttpClient,
    private firestore: Firestore
  ) { }

    // on Firebase:

    getAllOrdersFB(): Observable<DocumentData[]> {
      return collectionData(collection(this.firestore, "orders"), { idField: 'id' })
    }

    createOrderFB(order: IOrderRequest): Promise<DocumentReference<DocumentData>> {
      return addDoc(collection(this.firestore, "orders"), order);
    }

    updateOrderFB(order: IOrderResponse, id: string): Promise<void> {
      return setDoc(doc(this.firestore, "orders", id), order);
    }

    getOneOrderFB(id: string): Promise<DocumentSnapshot<DocumentData>> {
      return getDoc(doc(this.firestore, "orders", id))
    }

    deleteOrderFB(id: string): Promise<void> {
      return deleteDoc(doc(this.firestore, "orders", id));
    }

    // on db.json:

    // getAllOrders(): Observable<IOrderResponse[]> {
    //   return this.http.get<IOrderResponse[]>(this.api.orders);
    // }

    // create(order: IOrderResponse): Observable<void> {
    //   return this.http.post<void>(this.api.orders, order);
    // }

    // update(order: IOrderResponse, id: string): Observable<void> {
    //   return this.http.patch<void>(`${this.api.orders}/${id}`, order);
    // }

    // delete(id: string): Observable<void> {
    //   return this.http.delete<void>(`${this.api.orders}/${id}`);
    // }

}