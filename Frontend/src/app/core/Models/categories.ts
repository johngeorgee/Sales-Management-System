import { IDepartments } from "./departments";

export interface ICategories {
    _id: string;
    Category_Id: number;
    Category_Name: string;
    Department_Id: Number;
    departmentRef: IDepartments;
}
