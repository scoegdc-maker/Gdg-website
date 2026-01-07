import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader, Trash2, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { deleteImage } from '@/lib/upload-image';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { LibraryItem } from '@/data/mock-data';

interface ManageLibraryItemsProps {
    items: LibraryItem[];
    loading: boolean;
    refetchItems: () => void;
}

export default function ManageLibraryItems({ items, loading, refetchItems }: ManageLibraryItemsProps) {
    const { toast } = useToast();

    const handleDelete = async (itemId: string, itemTitle: string, imageUrl?: string) => {
        try {
            // Delete from database
            const { error } = await supabase
                .from('library_items')
                .delete()
                .eq('id', itemId);

            if (error) throw error;

            // Delete associated image if exists
            if (imageUrl) {
                await deleteImage(imageUrl);
            }

            toast({
                title: 'Item Deleted',
                description: `The item "${itemTitle}" has been successfully deleted.`,
            });
            refetchItems();
        } catch (error: any) {
            console.error('Error deleting item:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete library item.',
                variant: 'destructive',
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Library Resources</CardTitle>
                <CardDescription>View and delete existing library items.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center h-24">
                        <Loader className="h-6 w-6 animate-spin" />
                    </div>
                ) : items.length === 0 ? (
                    <p className="text-muted-foreground text-center">No library items found.</p>
                ) : (
                    <ul className="space-y-4">
                        {items.map(item => (
                            <li key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-4">
                                    {item.resourceType === 'Image' ? (
                                        <img src={item.imageUrl} alt={item.title} width={40} height={40} className="rounded-md object-cover" />
                                    ) : (
                                        <div className="h-10 w-10 flex items-center justify-center bg-muted rounded-md">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold">{item.title}</p>
                                        <div className='flex gap-2 items-center'>
                                            <p className="text-sm text-muted-foreground">{item.category}</p>
                                            <Badge variant="outline">{item.resourceType}</Badge>
                                        </div>
                                    </div>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="icon">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the item
                                                &quot;{item.title}&quot;.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(item.id, item.title)}>
                                                Continue
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
