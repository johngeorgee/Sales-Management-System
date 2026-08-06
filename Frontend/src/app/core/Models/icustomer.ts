// core/Models/icustomer.ts
export enum customerSegment {
    Consumer = 'Consumer',
    Corporate = 'Corporate',
    HomeOffice = 'Home Office'
  }
  
  export interface ICustomer {
    _id?: string;
    Customer_Id: number;
    Customer_FullName: string;
    Customer_Segment: customerSegment | string;
    location?: {
      Customer_ID: number;
      Customer_City: string;
      Customer_State: string;
      Customer_Country: string;
      Customer_Street: string;
      Customer_Zipcode: string;
      Latitude: number;
      Longitude: number;
    };
  }