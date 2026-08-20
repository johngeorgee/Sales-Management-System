export interface ApiResponse<T> {
    message: string;
    count: number;
    data: T;
}
