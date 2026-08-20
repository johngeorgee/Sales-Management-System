import { ICategories } from "./categories";
import { ISupplier } from "./isupplier";

export interface IProduct {
    _id: string;
    Product_Card_Id: number;
    Product_Name: string;
    Product_Price: number;
    Product_Status: string;
    Product_Image: string;
    Product_Category_Id: number;
    Product_Stock: number;
    Product_Reorder_Level: number;
    categoryRef: ICategories;
    supplierRef: ISupplier;
    createdAt: string;
    updatedAt: string;
}