import { Card, CardContent } from '../ui/card';
import { Button, buttonVariants } from '../ui/button';
import { ArrowRight, Calendar, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEventManagement } from '@/hooks/use-event-management';
import { isBefore, startOfDay, parseISO } from 'date-fns';
import { Badge } from '../ui/badge';

const EventCard = ({ event }: { event: any }) => {
    // Check if event is in the past
    // The date from DB is probably just a string "YYYY-MM-DD"
    // startOfDay ensures today's events aren't marked as past based on time
    const isPastEvent = event.date ? isBefore(parseISO(event.date), startOfDay(new Date())) : false;

    return (
        <Card
            className={cn(
                "group rounded-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-2 w-full h-full flex flex-col",
                isPastEvent ? "border-muted opacity-80 hover:opacity-100 grayscale-[0.2]" : "border-transparent"
            )}
        >
            <div className="relative">
                <img
                    src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
                    alt={event.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute inset-0 top-auto p-4 flex justify-between items-end">
                    <h3 className="text-xl font-bold text-white font-headline">{event.title}</h3>
                    {isPastEvent && (
                        <Badge variant="secondary" className="mb-1 bg-black/50 text-white hover:bg-black/50 border-white/20">
                            Past Event
                        </Badge>
                    )}
                </div>
            </div>
            <CardContent className="p-4 bg-card flex flex-col flex-grow">
                <div className="space-y-2 text-sm text-muted-foreground flex-grow">
                    <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {event.date}</div>
                    <div className="flex items-center"><Clock className="w-4 h-4 mr-2" /> {event.time || 'TBA'}</div>
                    <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {event.location}</div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <Button variant="link" className="px-0 group/button" asChild>
                        <a href={event.registrationLink || '#'} target="_blank" rel="noopener noreferrer">
                            Learn more <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/button:translate-x-1" />
                        </a>
                    </Button>
                    {isPastEvent ? (
                        <Button variant="outline" disabled className="opacity-50 cursor-not-allowed">
                            Event Ended
                        </Button>
                    ) : (
                        <a href={event.registrationLink || '#'} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants())}>
                            RSVP
                        </a>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default function EventsSection() {
    const { events, loadingEvents } = useEventManagement();

    return (
        <section id="events" className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl font-headline">
                        Events
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
                        Join our community for workshops, talks, and study jams.
                    </p>
                </div>
                {loadingEvents ? (
                    <p className="text-center text-muted-foreground">Loading events...</p>
                ) : events.length === 0 ? (
                    <p className="text-center text-muted-foreground">No events found. Check back soon!</p>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
