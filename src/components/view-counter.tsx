import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

const ViewCounter = () => {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // Mock view counter - use localStorage to simulate persistence
    const storedViews = localStorage.getItem('siteViews');
    const currentViews = storedViews ? parseInt(storedViews, 10) : 0;
    const newViews = currentViews + 1;

    localStorage.setItem('siteViews', newViews.toString());
    setViews(newViews);
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
