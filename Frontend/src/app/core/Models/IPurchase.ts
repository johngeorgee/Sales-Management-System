export type PurchaseStatus =
    | 'Draft'
    | 'Pending'
    | 'Approved'
    | 'Received'
    | 'Cancelled';


export interface IPurchaseItem {
    productRef: {
        _id: string;
        Product_Name: string;
        Product_Price: number;
        Product_Stock: number;
    };
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
}
export interface IPurchase {
    _id: string;
    Purchase_Order_Business_Id: number;
    supplierRef: {
        _id: string;
        Supplier_Company_Name: string;
        Business_Id: number;
        Status: string;
    };
    items: IPurchaseItem[]
    totalItems: number;
    totalPrice: number;
    status: PurchaseStatus;
    deliveryTime?: string;
    createdAt: string;
    updatedAt: string;
}
