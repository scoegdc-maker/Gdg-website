import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Quote } from 'lucide-react';
import { supabase, type Advisor } from '@/lib/supabase';

const AdvisorSection = () => {
    const [advisor, setAdvisor] = useState<Advisor | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdvisor = async () => {
            try {
                const { data, error } = await supabase
                    .from('advisors')
                    .select('*')
                    .limit(1)
                    .single();

                if (error) throw error;
                setAdvisor(data);
            } catch (error) {
                console.error('Error fetching advisor:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdvisor();
    }, []);

    if (loading || !advisor) {
        return null;
    }

    return (
        <section id="advisor" className="py-20 bg-muted/40">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-base font-semibold tracking-wider text-primary uppercase font-headline">
                        A Note from our Faculty Advisor
                    </h2>
                </div>
                <div className="max-w-2xl mx-auto text-center">
                    <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-primary/20 shadow-md">
                        <AvatarImage src={advisor.image_url} alt={advisor.name} className="object-cover" />
                        <AvatarFallback>{advisor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {advisor.quote && (
                        <div className="relative">
                            <Quote className="w-8 h-8 text-primary/20 absolute -top-4 -left-4" />
                            <blockquote className="text-xl font-medium text-foreground/90 italic mb-4 relative z-10">
                                &ldquo;{advisor.quote}&rdquo;
                            </blockquote>
                            <Quote className="w-8 h-8 text-primary/20 absolute -bottom-4 -right-4 transform scale-x-[-1] scale-y-[-1]" />
                        </div>
                    )}
                    <footer className="mt-6">
                        <p className="font-bold text-xl text-foreground font-headline">
                            {advisor.name}
                        </p>
                        <p className="text-muted-foreground">
                            {advisor.title}
                        </p>
                    </footer>
                </div>
            </div>
        </section>
    );
};

export default AdvisorSection;
