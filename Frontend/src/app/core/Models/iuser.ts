export interface IUser {
  _id: string;
  username: string;
  email: string;
  phoneNumber?: number;
  gender?: string;
  age?: number;
  isActive?: boolean;
  role: {
    _id: string;
    name: string;
    permissions: string[];
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  userData?: T;
  token?: string;
  user?: IUser;
  msg?: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: IUser;
}
export interface UsersResponse {
  message: string;
  data: IUser[];
}

export interface UserResponse {
  message: string;
  userData: IUser;
}

export interface DeleteResponse {
  msg: string;
  data: {
    _id: string;
    username: string;
    email: string;
  };
}