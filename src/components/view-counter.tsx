import { useEffect, useState, useRef } from 'react';
import { Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ViewCounter = () => {
  const [views, setViews] = useState<number | null>(null);
  const fetched = useRef(false);

  useEffect(() => {
    const initViewCount = async () => {
      // Prevent double firing in React StrictMode
      if (fetched.current) return;
      fetched.current = true;

      // Check if this session already incremented the view
      const hasIncremented = sessionStorage.getItem('hasIncrementedView');

      try {
        if (!hasIncremented) {
          // Increment the count globally via RPC
          const { data, error } = await supabase.rpc('increment_view_count');
          
          if (error) {
            console.error('Error incrementing view count:', error);
            await fetchCurrentCount();
          } else if (data !== null) {
            setViews(data);
            sessionStorage.setItem('hasIncrementedView', 'true');
          }
        } else {
          // Just fetch the current global count without incrementing
          await fetchCurrentCount();
        }
      } catch (err) {
        console.error('Failed to init view count:', err);
      }
    };

    const fetchCurrentCount = async () => {
      const { data, error } = await supabase
        .from('site_analytics')
        .select('view_count')
        .eq('id', 1)
        .single();
        
      if (data && !error) {
        setViews(data.view_count);
      }
    };

    initViewCount();
  }, []);

  return (
    <div className="mt-4 flex justify-center items-center gap-2 text-sm text-muted-foreground/80">
      <Eye className="w-4 h-4" />
      {views !== null ? (
        <p>{views.toLocaleString()} views</p>
      ) : (
        <p>Loading views...</p>
      )}
    </div>
  );
};

export default ViewCounter;
