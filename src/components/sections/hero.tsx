"use client";

import React from 'react';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import AnimatedText from '../animated-text';

const HeroSection = () => {
    return (
      <section id="home" className="relative py-32 md:py-48">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-7xl font-headline">
                <span className="block">Together, we </span>
                <AnimatedText />
            </h1>
            <p className="mt-6 max-w-md mx-auto text-lg text-muted-foreground sm:text-xl md:mt-8 md:max-w-3xl">
                Welcome to the official hub for Google Developer Group on Campus SCOE.
                Discover events, resources, and our vibrant tech community.
            </p>
            <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" asChild className="group">
                    <a href="#events">
                        Explore Events
                        <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                    <a href="https://gdg.community.dev/gdg-on-campus-sinhgad-college-of-engineering-pune-india/" target="_blank" rel="noopener noreferrer">
                        Join Community
                    </a>
                </Button>
            </div>
        </div>
      </section>
    );
};

export default HeroSection;
