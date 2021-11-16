import { ICategoryResponse } from "./category.interface";

export interface IProductRequest {
    category: ICategoryResponse;
    productName: string;
    productImage: string;
    price: string;
    sale: string;
    count: number;
}

export interface IProductResponse {
    id: string;
    category: ICategoryResponse;
    productName: string;
    productImage: string;
    price: any;
    sale: string;
    count: any;
    brand: string;
    color: string;
    material: string;
    length: string;
    width: string;
    height: string;
    subcategory: string;
}