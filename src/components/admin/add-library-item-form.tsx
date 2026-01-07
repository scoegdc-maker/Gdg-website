import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader, Upload, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/upload-image';

const formSchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
    type: z.enum(['android', 'cloud', 'ml', 'web', 'design', 'other']),
    url: z.string().url({ message: 'Please enter a valid URL.' }),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { message: 'Please enter a valid hex color code.' }).optional(),
    tags: z.string().optional(),
    imageFile: z.instanceof(File).optional(),
});

interface AddLibraryItemFormProps {
    onItemAdded: () => void;
}

export default function AddLibraryItemForm({ onItemAdded }: AddLibraryItemFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>('#4285F4');
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            type: 'android',
            url: '',
            color: '#4285F4',
            tags: '',
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
                toast({
                    title: 'Invalid File',
                    description: 'Please select a JPG, PNG, or WebP image.',
                    variant: 'destructive',
                });
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                toast({
                    title: 'File Too Large',
                    description: 'Image must be less than 2MB.',
                    variant: 'destructive',
                });
                return;
            }

            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setSelectedFile(null);
        setImagePreview(null);
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            let imageUrl: string | null = null;

            if (selectedFile) {
                const { url, error } = await uploadImage(selectedFile, 'library');
                if (error) {
                    toast({
                        title: 'Upload Failed',
                        description: error,
                        variant: 'destructive',
                    });
                    setIsSubmitting(false);
                    return;
                }
                imageUrl = url;
            }

            const tagsArray = values.tags
                ? values.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
                : [];

            const { error } = await supabase.from('library_items').insert([
                {
                    title: values.title,
                    description: values.description,
                    type: values.type,
                    url: values.url,
                    color: values.color || '#4285F4',
                    image_url: imageUrl,
                    tags: tagsArray.length > 0 ? tagsArray : null,
                },
            ]);

            if (error) throw error;

            toast({
                title: 'Library Item Added',
                description: `"${values.title}" has been successfully added.`,
            });

            form.reset();
            clearImage();
            setSelectedColor('#4285F4');
            onItemAdded();
        } catch (error: any) {
            console.error('Error adding library item:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to add library item. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Library Item</CardTitle>
                <CardDescription>Add a new resource to your library.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Getting Started with Google Cloud" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the resource..."
                                            className="resize-none"
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="android">Android</SelectItem>
                                                <SelectItem value="cloud">Cloud</SelectItem>
                                                <SelectItem value="ml">ML/AI</SelectItem>
                                                <SelectItem value="web">Web</SelectItem>
                                                <SelectItem value="design">Design</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Glow Color</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="color"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        setSelectedColor(e.target.value);
                                                    }}
                                                    className="w-16 h-10 cursor-pointer"
                                                />
                                                <Input
                                                    type="text"
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        setSelectedColor(e.target.value);
                                                    }}
                                                    placeholder="#4285F4"
                                                    className="flex-1"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Color Preview */}
                        <div
                            className="p-4 rounded-lg border-2 transition-all duration-300"
                            style={{
                                borderColor: selectedColor,
                                boxShadow: `0 0 20px ${selectedColor}40`,
                            }}
                        >
                            <p className="text-sm text-muted-foreground text-center">
                                Preview: This is how the glow effect will look
                            </p>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <FormLabel>Resource Image (Optional)</FormLabel>
                            {imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={clearImage}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                                    <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                                    <label htmlFor="library-image-upload" className="cursor-pointer">
                                        <span className="text-sm text-muted-foreground">
                                            Click to upload resource image
                                        </span>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            JPG, PNG or WebP (max 2MB)
                                        </p>
                                        <input
                                            id="library-image-upload"
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            )}
                        </div>

                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags (Optional, comma-separated)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="cloud, gcp, beginner" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                                    Adding Item...
                                </>
                            ) : (
                                'Add Library Item'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
