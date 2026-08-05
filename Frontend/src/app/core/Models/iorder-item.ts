import { IProduct } from "./product.model";

export interface IOrderItem {
    _id: string;
    Order_Item_ID: number; 
    Order_ID: number;
    Product_Card_ID: number;
    Order_Item_Quantity: number;
    Order_Item_Discount: number;
    Order_Item_Discount_Rate: number;
    Gross_Sales: number;
    Sales_per_Customer: number;
    benefitPerOrder: number;
}
