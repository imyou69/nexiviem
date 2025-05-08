"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";

const HeroSection = () => {
    const imageRef = useRef(null);

    useEffect(() => {
        const imageElement = imageRef.current;

        const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const scrollThreshold = 100;

        if(scrollPosition > scrollThreshold) {
            imageElement.classList.add("scrolled");

        } else {
            imageElement.classList.remove("scrolled");
        }
    };

    window.addEventListener("scroll",handleScroll);
        return () => window.removeEventListener("scroll",handleScroll);
    }, []);



return <section className="w-full pt-36 md:pt-48 pb-10">
    <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto">
            <h1 className=" text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title">
                Your AI Career Coach For
                <br />
                Professional Success
            </h1>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                Advance Your Career With Personalized Guidance, Interview Preparation, And 
                AI-Powered Tools For Job Success.
            </p>
        </div>

        <div className="flex justify-center space-x-4">
            <a href="/dasboard">
            <Button size="lg" className="px-8">
                Get Started
            </Button>
            </a>
            <a href="https://www.youtube.com/roadsidecoder">
            <Button size="lg" className="px-8" variant="outline">
                Get Started
            </Button>
            </a>
        </div>

        <div className="hero-image-wrapper mt-5 md:mt-0">
            <div ref={imageRef} className="hero-image">
                < Image
                src={"/banner (1).jpeg"}
                width={1280}
                height={720}
                alt="Banner Nextview"
                className="rounded-lg shadow-2xl border mx-auto"
                priority
                />
            </div>
        </div>
    </div>
  </section>;
};
export default HeroSection;