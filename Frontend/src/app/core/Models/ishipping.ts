export enum deliveryStatus {
  advance = 'Advance Shipping',
  late = 'Late Delivery',
  on_time = 'Shipping On Time',
  cancelled = 'Shipping Cancelled'
}

export enum shippingMode {
  standard = 'Standard Class',
  firstClass = 'First Class',
  secondClass = 'Second Class',
  sameDay = 'Same Day'
}

export enum deliveryRisk {
  noRisk = 'No Risk',
  highRisk = 'High Risk'
}

export interface IShipping {
  _id: string;
  Delivery_Status: deliveryStatus | string;
  Shipping_ID: number;
  Shipping_Mode: shippingMode | string;
  Days_for_shipping_scheduled: number;
  Days_for_shipping_real: number;
  Late_delivery_risk: deliveryRisk | string;
  orderId: number;
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