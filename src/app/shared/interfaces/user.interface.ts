import { IOrderResponse } from "./order.interface";

export interface IUserRequest {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    orders: Array<IOrderResponse>;
    zipCode: string;
}

export interface IUserResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    orders: Array<IOrderResponse>;
    zipCode: string;
}