export interface LoginResponse {
    access: string;
    refresh: string;
}

export interface User {
    id: number;
    username: string;
} 