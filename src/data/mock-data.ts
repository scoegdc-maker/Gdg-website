// Mock data for the frontend-only application

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    imageUrl?: string;
    image_url?: string; // For Supabase compatibility
    registrationLink?: string;
    category?: string;
}

export interface Member {
    id: string;
    name: string;
    role: string;
    bio?: string;
    imageUrl?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
}

export interface LibraryItem {
    id: string;
    title: string;
    description: string;
    type: 'android' | 'cloud' | 'ml' | 'web' | 'design' | 'other';
    url: string;
    imageUrl?: string;
    image_url?: string; // For Supabase compatibility
    tags?: string[];
}

export interface Advisor {
    id: string;
    name: string;
    title: string;
    bio: string;
    imageUrl?: string;
    email?: string;
    linkedin?: string;
}

// Mock Events
export const mockEvents: Event[] = [
    {
        id: '1',
        title: 'Introduction to Cloud Computing',
        description: 'Learn the basics of cloud computing with Google Cloud Platform. Perfect for beginners!',
        date: '2026-01-15',
        location: 'SCOE Campus, Room 301',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        category: 'Workshop',
    },
    {
        id: '2',
        title: 'Android Development Bootcamp',
        description: 'Build your first Android app using Kotlin and Jetpack Compose.',
        date: '2026-01-22',
        location: 'SCOE Campus, Lab 2',
        imageUrl: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800',
        category: 'Bootcamp',
    },
    {
        id: '3',
        title: 'Web Development with Firebase',
        description: 'Create a full-stack web application using Firebase and React.',
        date: '2026-02-05',
        location: 'Online',
        imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        category: 'Workshop',
    },
];

// Mock Members
export const mockMembers: Member[] = [
    {
        id: '1',
        name: 'Priya Sharma',
        role: 'Lead',
        bio: 'Passionate about cloud technologies and community building.',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        github: 'priyasharma',
        linkedin: 'priya-sharma',
    },
    {
        id: '2',
        name: 'Rahul Verma',
        role: 'Co-Lead',
        bio: 'Android enthusiast and open-source contributor.',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        github: 'rahulverma',
        linkedin: 'rahul-verma',
    },
    {
        id: '3',
        name: 'Ananya Patel',
        role: 'Technical Lead',
        bio: 'Full-stack developer with expertise in web technologies.',
        imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        github: 'ananyapatel',
        linkedin: 'ananya-patel',
    },
    {
        id: '4',
        name: 'Arjun Reddy',
        role: 'Design Lead',
        bio: 'UI/UX designer passionate about creating beautiful experiences.',
        imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        linkedin: 'arjun-reddy',
    },
];

// Mock Library Items
export const mockLibraryItems: LibraryItem[] = [
    {
        id: '1',
        title: 'Getting Started with Google Cloud',
        description: 'Official documentation for Google Cloud Platform beginners.',
        type: 'cloud',
        url: 'https://cloud.google.com/docs',
        tags: ['cloud', 'gcp', 'beginner'],
    },
    {
        id: '2',
        title: 'Kotlin for Android Development',
        description: 'Comprehensive video course on Android development with Kotlin.',
        type: 'android',
        url: 'https://developer.android.com/courses',
        tags: ['android', 'kotlin', 'mobile'],
    },
    {
        id: '3',
        title: 'Firebase Documentation',
        description: 'Complete guide to Firebase services and integration.',
        type: 'web',
        url: 'https://firebase.google.com/docs',
        tags: ['firebase', 'backend', 'web'],
    },
    {
        id: '4',
        title: 'Material Design Guidelines',
        description: 'Google\'s design system for creating beautiful interfaces.',
        type: 'design',
        url: 'https://material.io/design',
        tags: ['design', 'ui', 'ux'],
    },
];

// Mock Advisor
export const mockAdvisor: Advisor = {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    title: 'Faculty Advisor & Professor',
    bio: 'Dr. Kumar is a professor in the Computer Science department with over 15 years of experience in software engineering and cloud computing. He is passionate about mentoring students and fostering innovation.',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    email: 'rajesh.kumar@scoe.edu',
    linkedin: 'dr-rajesh-kumar',
};
