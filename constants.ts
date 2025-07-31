export interface ColorScheme {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    text_dim: string
}

export const darkThemeColors: ColorScheme = {
    primary: '#8B5CF6',
    secondary: '#94a3b8',
    accent: '#EC4899',
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    text_dim: '#666666'
}

export const lightThemeColors: ColorScheme = {
    primary: '#8B5CF6',
    secondary: '#94a3b8',
    accent: '#EC4899',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    text: '#111827',
    text_dim: '#123456',
}

export const API_URL = process.env.API_URL || 'http://127.0.0.1:8000'
export const N_FEED_PAGINATION_ELEMENTS: number = 10
export const DEFAULT_SIGNED_URL_EXPIRATION: number = 600 // in seconds