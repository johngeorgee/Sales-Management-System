import { ICustomer } from "./icustomer";
import { IShipping } from "./ishipping";

export interface IOrder {
    _id: string;
    Order_Id: number;
    Customer_Id: number;
    Shipping_ID: number;
    order_date: number;
    shipping_date: number;
    Order_Status: string;
    Order_City: string;
    Order_State: string;
    Order_Country: string;
    Order_Region: string;
    Market: string;
    Type: string;
    
    customerRef: ICustomer;
    shippingRef: IShipping;

    itemCount?: number;
    totalAmout?: number;
}
export enum OrderStatus {
    closed = 'Closed',
    pending = 'Pending Payment',
    processing = 'Processing',
    complete = 'Complete'
}
export enum orderType {
    Debit = 'DEBIT',
    Transfer = 'TRANSFER',
    Cash = 'CASH',
    Pending = 'PENDING PAYMENT'
}
