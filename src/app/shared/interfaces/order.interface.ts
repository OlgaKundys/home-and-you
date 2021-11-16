import { IProductResponse } from "./product.interface";

export interface IOrderRequest {
    cart: Array<IProductResponse>;
    totalPrice: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    zipCode: string;
    city: string;
    payment: string;
    orderStatus: string;
}

export interface IOrderResponse {
    id: string;
    cart: Array<IProductResponse>;
    totalPrice: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    zipCode: string;
    city: string;
    payment: string;
    orderStatus: string;
}