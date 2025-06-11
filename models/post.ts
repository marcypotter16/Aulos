export default interface Post {
    id: string;
    userId?: string; // id dell' utente che ha creato il post
    type?: 'text' | 'image' | 'video' | 'audio';
    uri?: string;
    createdAt?: string;
    userName?: string; // name e image forse andranno tolti perché si possono prendere dal profilo dell' utente avendo l' id
    userProfilePicture?: string;
    image?: string; // URL dell' immagine del post
    text?: string;
    showActions?: boolean; // se mostrare le azioni come like, commento, condivisione

    tags?: string[]; // ad esempio "#jazz", "#rock", "#pop"
    likes?: number; // numero di like
    comments?: number; // numero di commenti
    shares?: number; // numero di condivisioni
    isLiked?: boolean; // se l' utente ha messo like al post
    isShared?: boolean; // se l' utente ha condiviso il post
    isCommented?: boolean; // se l' utente ha commentato il post
    isSaved?: boolean; // se l' utente ha salvato il post
}