export interface Review {
    id: string;
    authorId: string; // ID of the user who wrote the review
    reviewedId: string; // Id of the person being reviewed
    content: string; // The text content of the review
    rating: number; // Rating given in the review (1-5 stars)
    createdAt?: string; // Timestamp of when the review was created
    updatedAt?: string; // Timestamp of when the review was last updated
    authorName?: string; // Optional name of the author for display purposes
}