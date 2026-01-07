
import { ExternalLink } from 'lucide-react';
import { useLibraryManagement } from '@/hooks/use-library-management';

const LibraryItemCard = ({ item }: { item: any }) => {
    const itemColor = item.color || '#4285F4';

    const cardContent = (
        <div className="group relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg block">
            <img
                src={item.image_url || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800'}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            {/* Color gradient overlay - only on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                style={{
                    background: `linear-gradient(to top, ${itemColor} 0%, transparent 60%)`
                }}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                    <p className="text-sm font-semibold uppercase tracking-wider flex items-center">
                        {item.type}
                        {item.url && <ExternalLink className="w-4 h-4 ml-2" />}
                    </p>
                    <h3 className="text-2xl font-bold mt-1 font-headline">{item.title}</h3>
                    <p className="text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-h-0 group-hover:max-h-20">
                        {item.description}
                    </p>
                </div>
            </div>
        </div>
    );


    if (item.url) {
        return (
            <a href={item.url} target="_blank" rel="noopener noreferrer">
                {cardContent}
            </a>
        );
    }

    return cardContent;
};

const LibrarySection = () => {
    const { items, loadingItems } = useLibraryManagement();

    return (
        <section id="library" className="py-20 bg-background/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl font-headline">
                        Digital Library
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
                        Curated resources and roadmaps to kickstart your developer journey.
                    </p>
                </div>
                {loadingItems ? (
                    <p className="text-center text-muted-foreground">Loading library items...</p>
                ) : items.length === 0 ? (
                    <p className="text-center text-muted-foreground">No library items available yet. Check back soon!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <LibraryItemCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default LibrarySection;