export default interface Post {
    id: string
    user_id: string // id dell' utente che ha creato il post
    content: string
    caption: string | undefined
    created_at: string
    updated_at: string | undefined
    visibility: string | undefined
    likes_count?: number
    comments_count?: number
}