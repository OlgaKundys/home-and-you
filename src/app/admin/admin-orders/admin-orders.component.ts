import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IOrderResponse } from 'src/app/shared/interfaces/order.interface';
import { CheckoutService } from 'src/app/shared/services/checkout.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {

  @ViewChild ('close') close!: ElementRef;

  public adminOrders: Array<IOrderResponse> = [];
  public currentOrderID!: any;
  public editStatus = false;
  public orderForm!: FormGroup;
  public searchTerm: string = '';

  constructor(
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initOrderForm();
    this.loadOrders();
  }

  initOrderForm(): void {
    this.orderForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null, Validators.required],
      address: [null, Validators.required],
      zipCode: [null, Validators.required],
      city: [null, Validators.required],
      orderStatus: [null, Validators.required],
      cart: [null],
      totalPrice: [null],
    })
  }

  loadOrders(): void {
    this.checkoutService.getAllOrdersFB().subscribe(data => {
      this.adminOrders = data as IOrderResponse[];
    }, error => {
      this.toastr.error('Load orders error!');
    })
  }

  editOrder(): void {
    if(this.editStatus) {
      this.checkoutService.updateOrderFB(this.orderForm.value, this.currentOrderID).then(() => {
        this.close.nativeElement.click();
        this.editStatus = false;
        this.initOrderForm();
        this.loadOrders();
        this.toastr.success('Order updated successfully!');
      }).catch(error => {
        this.toastr.error(error.message);
      });
    }
  }

  editOrderStatus(order: IOrderResponse): void {
    this.orderForm.patchValue({
      cart: order.cart,
      totalPrice: order.totalPrice,
      firstName: order.firstName,
      lastName: order.lastName,
      email: order.email,
      phone: order.phone,
      address: order.address,
      zipCode: order.zipCode,
      city: order.city,
      orderStatus: order.orderStatus,
    });
    this.currentOrderID = order.id
    this.editStatus = true;
  }

}
