import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddEventForm from '@/components/admin/add-event-form';
import AddMemberForm from '@/components/admin/add-member-form';
import AddLibraryItemForm from '@/components/admin/add-library-item-form';
import ManageEvents from '@/components/admin/manage-events';
import ManageMembers from '@/components/admin/manage-members';
import { Separator } from '@/components/ui/separator';
import AddAdvisorForm from '@/components/admin/add-advisor-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ManageLibraryItems from '@/components/admin/manage-library-items';
import { useMemberManagement } from '@/hooks/use-member-management';
import { useLibraryManagement } from '@/hooks/use-library-management';
import { useEventManagement } from '@/hooks/use-event-management';
import { useAuth } from '@/hooks/use-auth';

export default function AdminPage() {
    const navigate = useNavigate();
    const { isAdmin, loading: authLoading } = useAuth();
    const { members, loadingMembers, fetchMembers, setMembers } = useMemberManagement();
    const { items, loadingItems, fetchItems } = useLibraryManagement();
    const { events, loadingEvents, fetchEvents } = useEventManagement();

    // Redirect non-admin users
    useEffect(() => {
        if (!authLoading && !isAdmin) {
            navigate('/');
        }
    }, [isAdmin, authLoading, navigate]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-muted/40">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Button variant="outline" className="mb-4" onClick={() => navigate('/')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                        Admin Dashboard
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Manage your community's events, members, and resources.
                    </p>
                </div>

                <Tabs defaultValue="events" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="events">Events</TabsTrigger>
                        <TabsTrigger value="members">Members</TabsTrigger>
                        <TabsTrigger value="library">Library</TabsTrigger>
                        <TabsTrigger value="advisor">Advisor</TabsTrigger>
                    </TabsList>
                    <TabsContent value="events">
                        <AddEventForm onEventAdded={fetchEvents} />
                        <Separator className="my-8" />
                        <ManageEvents
                            events={events}
                            loading={loadingEvents}
                            refetchEvents={fetchEvents}
                        />
                    </TabsContent>
                    <TabsContent value="members">
                        <AddMemberForm onMemberAdded={fetchMembers} />
                        <Separator className="my-8" />
                        <ManageMembers
                            members={members}
                            setMembers={setMembers}
                            loading={loadingMembers}
                            refetchMembers={fetchMembers}
                        />
                    </TabsContent>
                    <TabsContent value="library">
                        <AddLibraryItemForm onItemAdded={fetchItems} />
                        <Separator className="my-8" />
                        <ManageLibraryItems
                            items={items}
                            loading={loadingItems}
                            refetchItems={fetchItems}
                        />
                    </TabsContent>
                    <TabsContent value="advisor">
                        <AddAdvisorForm />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
