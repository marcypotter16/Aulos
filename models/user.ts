import { Review } from './review';
// This file defines the User interface for the application, including user details, preferences, and music-related information.

export default interface User {
    id: string; // Unique identifier for the user
    name: string; // Name of the user
    username: string; // Unique username for the user
    email: string; // Email address of the user
    password: string; // Password of the user (hashed in production)
    createdAt: number; // Timestamp of when the user was created
    updatedAt?: number; // Timestamp of when the user was last updated
    profilePicture?: string; // Optional URL to the user's profile picture
    bio?: string; // Optional short biography of the user
    isActive?: boolean; // Indicates if the user account is active
    isAdmin?: boolean; // Indicates if the user has admin privileges
    lastLogin?: Date; // Timestamp of the user's last login
    preferences?: {
        theme?: string; // User's preferred theme (e.g., 'light', 'dark')
        language?: string; // User's preferred language (e.g., 'en', 'it')
        notifications?: boolean; // Whether the user wants to receive notifications
    };
    savedPosts?: string[]; // Array of post IDs that the user has saved
    followers?: string[]; // Array of user IDs that follow this user
    following?: string[]; // Array of user IDs that this user follows
    posts?: string[]; // Array of post IDs created by the user
    socialLinks?: {
        twitter?: string; // Optional Twitter profile link
        facebook?: string; // Optional Facebook profile link
        instagram?: string; // Optional Instagram profile link
        linkedin?: string; // Optional LinkedIn profile link
        website?: string; // Optional personal or business website link
    };

    // Music stuff
    favoriteGenres?: string[]; // Array of user's favorite music genres
    playedInstruments?: string[]; // Array of instruments the user plays

    // TODO
    reviews?: Review[];
    rating?: number; // Average rating given by the user

}