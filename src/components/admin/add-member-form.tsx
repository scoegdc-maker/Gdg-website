import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader, Upload, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/upload-image';

const formSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    role: z.string().min(2, { message: 'Role must be at least 2 characters.' }),
    bio: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    imageFile: z.instanceof(File).optional(),
});

interface AddMemberFormProps {
    onMemberAdded: () => void;
}

export default function AddMemberForm({ onMemberAdded }: AddMemberFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            role: '',
            bio: '',
            github: '',
            linkedin: '',
            twitter: '',
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
                const { url, error } = await uploadImage(selectedFile, 'members');
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

            const { error } = await supabase.from('members').insert([
                {
                    name: values.name,
                    role: values.role,
                    bio: values.bio || null,
                    image_url: imageUrl,
                    github: values.github || null,
                    linkedin: values.linkedin || null,
                    twitter: values.twitter || null,
                    order_index: 999,
                },
            ]);

            if (error) throw error;

            toast({
                title: 'Member Added',
                description: `${values.name} has been successfully added.`,
            });

            form.reset();
            clearImage();
            onMemberAdded();
        } catch (error: any) {
            console.error('Error adding member:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to add member. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Member</CardTitle>
                <CardDescription>Add a new team member to your community.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Lead, Co-Lead, etc." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <FormLabel>Profile Image (Optional)</FormLabel>
                            {imagePreview ? (
                                <div className="relative w-32 h-32 mx-auto">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-32 h-32 object-cover rounded-full border-4 border-primary/20"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                                        onClick={clearImage}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                                    <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                                    <label htmlFor="member-image-upload" className="cursor-pointer">
                                        <span className="text-sm text-muted-foreground">
                                            Click to upload profile image
                                        </span>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            JPG, PNG or WebP (max 2MB)
                                        </p>
                                        <input
                                            id="member-image-upload"
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="github"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>GitHub (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="linkedin"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>LinkedIn (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="twitter"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Twitter (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                                    Adding Member...
                                </>
                            ) : (
                                'Add Member'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
