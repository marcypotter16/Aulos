export default interface Post {
    id: string;
    userId?: string;
    type?: 'text' | 'image' | 'video' | 'audio';
    uri?: string;
    createdAt?: string;
    name?: string; // name e image andranno tolti perché si possono prendere dal profilo dell' utente avendo l' id
    avatar?: string;
    image?: string;
    text?: string;
    showActions?: boolean;
}