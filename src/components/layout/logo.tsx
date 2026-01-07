import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const Logo = () => {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Display a placeholder to prevent layout shift while theme is loading
    if (!mounted) {
        return <div style={{ width: '240px', height: '64px' }} />;
    }

    const logoSrc = (resolvedTheme === 'dark' || theme === 'dark') ? '/logo-light.png' : '/logo-dark.png';

    return (
        <img
            src={logoSrc}
            alt="GDG on Campus SCOE"
            width={240}
            height={64}
            style={{ height: 'auto' }}
        />
    );
};

export default Logo;
