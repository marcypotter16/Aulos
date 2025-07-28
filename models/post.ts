import { PostMedia } from "./post_media";

export default interface Post {
    id: string;
    user_id: string;
    content: string;
    caption: string;
    created_at: string;
    updated_at: string;
    visibility: string;
    likes_count: number;
    comments_count: number;

    // Optional fields retrieved via joins or for UI convenience
    userName?: string;
    userProfilePicture?: string;
    post_media?: PostMedia[];
    showActions?: boolean;
}

