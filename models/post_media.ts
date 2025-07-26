export interface PostMedia {
    id:         string
    post_id:    string
    type:       'image' | 'video' | 'audio'
    position:   number // The index of the media in the array of medias of a post
    created_at: string
    media_path: string // The media path inside supabase.storage, NOT the public URL!
}

export interface PostMediaInsert {
    // Same as PostMedia without id (automatically set by supabase)
    post_id:    string
    type:       'image' | 'video' | 'audio'
    position:   number // The index of the media in the array of medias of a post
    created_at: string
    media_path: string // The media path inside supabase.storage, NOT the public URL!
}