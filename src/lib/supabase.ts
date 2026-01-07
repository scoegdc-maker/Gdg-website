import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time?: string;
    location: string;
    image_url?: string;
    registration_link?: string;
    category?: string;
    color?: string;
    ai_hint?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Member {
    id: string;
    name: string;
    role: string;
    bio?: string;
    image_url?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    order_index?: number;
    created_at?: string;
    updated_at?: string;
}

export interface LibraryItem {
    id: string;
    title: string;
    description: string;
    type: 'android' | 'cloud' | 'ml' | 'web' | 'design' | 'other';
    url: string;
    image_url?: string;
    color?: string;
    tags?: string[];
    created_at?: string;
    updated_at?: string;
}

export interface Advisor {
    id: string;
    name: string;
    title: string;
    bio?: string;
    image_url?: string;
    email?: string;
    linkedin?: string;
    quote?: string;
    created_at?: string;
    updated_at?: string;
}

export interface AdminUser {
    id: string;
    email: string;
    created_at?: string;
}
