export interface UserBase {
    name: string;
    user_name: string;
    email: string;
    instrument?: string | null;
    genre?: string | null;
    avatar_url?: string | null;
}

export interface UserCreate extends UserBase {
    password: string;
}

export interface UserResponse extends UserBase {
    id: number;
}