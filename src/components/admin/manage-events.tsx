import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader, Trash2 } from 'lucide-react';
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
import { Event } from '@/data/mock-data';

interface ManageEventsProps {
    events: Event[];
    loading: boolean;
    refetchEvents: () => void;
}

export default function ManageEvents({ events, loading, refetchEvents }: ManageEventsProps) {
    const { toast } = useToast();

    const handleDelete = async (eventId: string, eventTitle: string, imageUrl?: string) => {
        try {
            // Delete from database
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', eventId);

            if (error) throw error;

            // Delete associated image if exists
            if (imageUrl) {
                await deleteImage(imageUrl);
            }

            toast({
                title: 'Event Deleted',
                description: `The event "${eventTitle}" has been successfully deleted.`,
            });
            refetchEvents();
        } catch (error: any) {
            console.error('Error deleting event:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete event.',
                variant: 'destructive',
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Events</CardTitle>
                <CardDescription>View and delete existing events.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center h-24">
                        <Loader className="h-6 w-6 animate-spin" />
                    </div>
                ) : events.length === 0 ? (
                    <p className="text-muted-foreground text-center">No events found.</p>
                ) : (
                    <ul className="space-y-4">
                        {events.map(event => (
                            <li key={event.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <img src={event.imageUrl} alt={event.title} width={40} height={40} className="rounded-md object-cover" />
                                    <div>
                                        <p className="font-semibold">{event.title}</p>
                                        <p className="text-sm text-muted-foreground">{event.date}</p>
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
                                                This action cannot be undone. This will permanently delete the event
                                                &quot;{event.title}&quot;.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(event.id, event.title, event.imageUrl || undefined)}>
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
