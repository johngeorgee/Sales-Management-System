import { ICustomerLocation } from './icustomer-location';

export interface ICustomer {
  _id?: string;

  Customer_Id: number;

  Customer_FullName: string;

  Customer_Segment: customerSegment;

  location: ICustomerLocation;
}

export enum customerSegment {
  Consumer = 'Consumer',

  Corporate = 'Corporate',

  HomeOffice = 'Home Office',
}
