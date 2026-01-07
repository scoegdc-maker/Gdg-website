import { supabase } from './supabase';
import imageCompression from 'browser-image-compression';

interface UploadResult {
    url: string | null;
    error: string | null;
}

/**
 * Compress and optimize an image file
 * @param file - The image file to compress
 * @returns Compressed file
 */
async function compressImage(file: File): Promise<File> {
    const options = {
        maxSizeMB: 1, // Max file size in MB
        maxWidthOrHeight: 1920, // Max width or height
        useWebWorker: true,
        fileType: 'image/webp', // Convert to WebP for better compression
    };

    try {
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    } catch (error) {
        console.error('Compression error:', error);
        // If compression fails, return original file
        return file;
    }
}

/**
 * Upload an image file to Supabase Storage with automatic compression
 * @param file - The image file to upload
 * @param folder - Optional folder name (e.g., 'events', 'members')
 * @returns Object with url and error
 */
export async function uploadImage(
    file: File,
    folder: string = 'general'
): Promise<UploadResult> {
    try {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return {
                url: null,
                error: 'Invalid file type. Only JPG, PNG, and WebP images are allowed.',
            };
        }

        // Validate file size (max 5MB before compression)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            return {
                url: null,
                error: 'File size too large. Maximum size is 5MB.',
            };
        }

        // Compress the image
        const compressedFile = await compressImage(file);

        // Generate unique filename with .webp extension
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.webp`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('images')
            .upload(fileName, compressedFile, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            console.error('Upload error:', error);
            return {
                url: null,
                error: error.message || 'Failed to upload image.',
            };
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(data.path);

        return {
            url: publicUrl,
            error: null,
        };
    } catch (error: any) {
        console.error('Upload error:', error);
        return {
            url: null,
            error: error.message || 'An unexpected error occurred.',
        };
    }
}

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - The full public URL of the image
 * @returns True if successful, false otherwise
 */
export async function deleteImage(imageUrl: string): Promise<boolean> {
    try {
        if (!imageUrl) return true; // Nothing to delete

        // Extract the file path from the URL
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split('/');
        const bucketIndex = pathParts.indexOf('images');

        if (bucketIndex === -1) {
            console.error('Invalid image URL - bucket not found');
            return false;
        }

        const filePath = pathParts.slice(bucketIndex + 1).join('/');

        const { error } = await supabase.storage
            .from('images')
            .remove([filePath]);

        if (error) {
            console.error('Delete error:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Delete error:', error);
        return false;
    }
}

/**
 * Delete old image and upload new one
 * @param oldImageUrl - URL of the old image to delete
 * @param newFile - New image file to upload
 * @param folder - Folder name for the new image
 * @returns Upload result
 */
export async function replaceImage(
    oldImageUrl: string | null,
    newFile: File,
    folder: string = 'general'
): Promise<UploadResult> {
    // Upload new image first
    const uploadResult = await uploadImage(newFile, folder);

    // If upload successful and there was an old image, delete it
    if (uploadResult.url && oldImageUrl) {
        await deleteImage(oldImageUrl);
    }

    return uploadResult;
}
