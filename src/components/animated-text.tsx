"use client";

import React, { useState, useEffect, useMemo } from 'react';

const AnimatedText: React.FC = () => {
    const words = useMemo(() => ["Innovate.", "Learn.", "Grow."], []);
    const [wordIndex, setWordIndex] = useState(0);
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentWord = words[wordIndex];
        const typingSpeed = isDeleting ? 75 : 150;

        const handleTyping = () => {
            if (isDeleting) {
                if (text.length > 0) {
                    setText(text.substring(0, text.length - 1));
                } else {
                    setIsDeleting(false);
                    setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
                }
            } else {
                if (text.length < currentWord.length) {
                    setText(currentWord.substring(0, text.length + 1));
                } else {
                    setTimeout(() => setIsDeleting(true), 1000);
                }
            }
        };

        const typingTimeout = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(typingTimeout);
    }, [text, isDeleting, wordIndex, words]);

    return (
        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 animate-gradient-x">
            {text}
            <span className="animate-ping">|</span>
        </span>
    );
};

export default AnimatedText;
