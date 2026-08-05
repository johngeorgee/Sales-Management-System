export enum deliveryStatus{
 advance = 'Advance Shipping',
 late = 'Late Delivery',
 on_time = 'Shipping On Time',
 cancelled = 'Shipping Cancelled'
}
export enum shippingMode{
standard = 'Standard Class',
firstClass = 'First Class',
secondClass = 'Second Class',
sameDay = 'Same Day',
cancelled = 'Shipping Cancelled'
}
export enum deliveryRisk{
noRisk = 'No Risk',
highRIsk = 'High Risk'
}
export interface ShippingResponse {
    message: string;
    data: IShipping[];
    pagination: {
      currentPage: number;
      limit: number;
      totalShippings: number;
      totalPages: number;
    };
  }
export interface IShipping {
    _id: string;
    Delivery_Status : deliveryStatus;
    Shipping_ID: number;
    Shipping_Mode: shippingMode;
    Days_for_shipping_scheduled: number;
    Days_for_shipping_real : number;
    Late_delivery_risk: deliveryRisk;
    orderId: number;

}
