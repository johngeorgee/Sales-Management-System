import { IProduct } from "./product.model";

export interface IInventory extends IProduct {
    stockStatus?: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

    