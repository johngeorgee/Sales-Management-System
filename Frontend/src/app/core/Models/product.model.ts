import { ICategories } from "./categories";

export interface IProduct{
    _id: string;
    Product_Card_Id: Number;
    Product_Name: String;
    Product_Price: Number;
    Product_Status: String;
    Product_Image: String;
    Product_Category_Id: Number;
    categoryRef: ICategories;
}