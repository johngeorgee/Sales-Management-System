export interface ApiResponse<T> {
    message: string;
    count: Number;
    data: T;
}
