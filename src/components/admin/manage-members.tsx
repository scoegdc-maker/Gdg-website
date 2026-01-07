import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { deleteImage } from '@/lib/upload-image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
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
import { cn } from '@/lib/utils';
import { type Member } from '@/lib/supabase';

interface ManageMembersProps {
    members: Member[];
    setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
    loading: boolean;
    refetchMembers: (showLoader?: boolean) => Promise<void>;
}

export default function ManageMembers({ members, setMembers, loading, refetchMembers }: ManageMembersProps) {
    const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
    const { toast } = useToast();

    const draggingItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleDelete = async (memberId: string, memberName: string, imageUrl?: string) => {
        try {
            // Delete from database
            const { error } = await supabase
                .from('members')
                .delete()
                .eq('id', memberId);

            if (error) throw error;

            // Delete associated image if exists
            if (imageUrl) {
                await deleteImage(imageUrl);
            }

            toast({
                title: 'Member Deleted',
                description: `"${memberName}" has been successfully deleted.`,
            });
            refetchMembers();
        } catch (error: any) {
            console.error('Error deleting member:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete member.',
                variant: 'destructive',
            });
        }
    };

    const handleDragStart = (index: number) => {
        draggingItem.current = index;
    };

    const handleDragEnter = (index: number) => {
        if (draggingItem.current === null) return;
        if (draggingItem.current === index) return;

        dragOverItem.current = index;
        const newMembers = [...members];
        const draggingMember = newMembers[draggingItem.current];
        newMembers.splice(draggingItem.current, 1);
        newMembers.splice(dragOverItem.current, 0, draggingMember);
        draggingItem.current = dragOverItem.current;
        dragOverItem.current = null;
        setMembers(newMembers);
    };

    const handleDragEnd = async () => {
        if (draggingItem.current === null) return;
        if (isUpdatingOrder) return;
        setIsUpdatingOrder(true);

        try {
            // Updated member order
            const updatedMembers = members.map((member, index) => ({
                ...member,
                order_index: index,
            }));

            // Optimistic update
            setMembers(updatedMembers);

            // Save to Supabase
            const updates = updatedMembers.map((member) =>
                supabase
                    .from('members')
                    .update({ order_index: member.order_index })
                    .eq('id', member.id)
            );

            await Promise.all(updates);

            toast({
                title: 'Order Updated',
                description: 'Team order has been successfully saved.',
            });

            // Refresh to ensure consistency
            refetchMembers(false);
        } catch (error) {
            console.error("Error reordering members: ", error);
            toast({
                title: 'Error',
                description: 'Failed to save the new order.',
                variant: 'destructive',
            });
            // Revert UI on failure by refetching
            refetchMembers(false);
        } finally {
            draggingItem.current = null;
            setIsUpdatingOrder(false);
        }
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Team Members</CardTitle>
                <CardDescription>Drag and drop to reorder team members.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center h-24">
                        <Loader className="h-6 w-6 animate-spin" />
                    </div>
                ) : members.length === 0 ? (
                    <p className="text-muted-foreground text-center">No members found.</p>
                ) : (
                    <ul className="space-y-2">
                        {members.map((member, index) => (
                            <li
                                key={member.id}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragEnter={() => handleDragEnter(index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => e.preventDefault()}
                                className={cn(
                                    "flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-grab active:cursor-grabbing transition-shadow",
                                    draggingItem.current === index && "shadow-xl opacity-50"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                                    <Avatar>
                                        <AvatarImage src={member.image_url} alt={member.name} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{member.name}</p>
                                        <p className="text-sm text-muted-foreground">{member.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
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
                                                    This action cannot be undone. This will permanently remove
                                                    &quot;{member.name}&quot; from the team.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(member.id, member.name)}>
                                                    Continue
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </li>
                        ))}
                        {isUpdatingOrder && (
                            <div className="flex items-center justify-center pt-4">
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                <p className="text-sm text-muted-foreground">Saving new order...</p>
                            </div>
                        )}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
