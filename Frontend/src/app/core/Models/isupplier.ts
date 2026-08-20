export interface ISupplier {
  _id: string;
  Supplier_Company_Name: string;
  Business_Id: number;
  Contact_Info: {
    Contact_Person: string;
    Email: string;
    Phone_Number: string;
  };
  Address: {
    Street?: string;
    City?: string;
    State?: string;
    Country?: string;
    ZipCode?: string;
  };
  Payment_Terms: 'Cash' | 'Net 15' | 'Net 30' | 'Net 60';
  Notes?: string;
  Status: 'Active' | 'Inactive';
  productsCount: number;
  createdAt: string;
  updatedAt: string;
}
export interface ISupplierProduct {
  _id: string;
  Product_Card_Id: number;
  Product_Category_Id: number;
  Product_Name: string;
  Product_Price: number;
  Product_Status: string;
  Product_Image?: string;

  categoryRef?: {
    _id: string;
    Category_Name: string;
  };

  supplierRef: string;

  updatedAt?: string;
}
export interface ISupplierResponse {
  success: boolean;
  count: number;
  data: ISupplier[]
}
export interface ISupplierDetailsResponse {
  success: boolean;
  data: ISupplier;
  products: ISupplierProduct[]
}