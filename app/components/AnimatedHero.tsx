// components/AnimatedHero.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedHero() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const cubesRef = useRef<HTMLDivElement[]>([]);
    const header1Ref = useRef<HTMLHeadingElement>(null);
    const header2Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize Lenis for smooth scroll
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, Math.max(0, t)),
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Create GSAP timeline with ScrollTrigger
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=4800",
                scrub: true,
                pin: true,
                anticipatePin: 1,
            },
        });

        // Initial state
        tl.set(cubesRef.current, { opacity: 0, scale: 0.1 });
        tl.set(header2Ref.current, { opacity: 0, y: 50 });
        tl.set(logoRef.current, { opacity: 1, scale: 1, filter: "blur(0px)" });

        // Logo explosion
        tl.to(
            logoRef.current,
            {
                scale: 0,
                opacity: 0,
                filter: "blur(20px)",
                duration: 0.5,
            },
            0
        );

        // Animate cubes flying out
        cubesRef.current.forEach((cube, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const distance = 300;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            tl.fromTo(
                cube,
                {
                    opacity: 0,
                    scale: 0.1,
                    x: 0,
                    y: 0,
                    z: -5000,
                },
                {
                    opacity: 1,
                    scale: 1,
                    x,
                    y,
                    z: -2000,
                    rotationX: () => gsap.utils.random(-360, 360),
                    rotationY: () => gsap.utils.random(-360, 360),
                    rotationZ: () => gsap.utils.random(-180, 180),
                    duration: 1,
                    ease: "power2.out",
                },
                0.2
            );
        });

        // Text transitions
        tl.to(
            header1Ref.current,
            {
                opacity: 0,
                filter: "blur(10px)",
                scale: 0.75,
                duration: 0.5,
            },
            0.8
        );

        tl.fromTo(
            header2Ref.current,
            {
                opacity: 0,
                y: 50,
                filter: "blur(10px)",
                scale: 0.8,
            },
            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                scale: 1,
                duration: 0.8,
            },
            1
        );

        // Cubes settle
        cubesRef.current.forEach((cube, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const distance = 250;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            tl.to(
                cube,
                {
                    x,
                    y,
                    z: -1500,
                    rotationX: () => gsap.utils.random(-10, 10),
                    rotationY: () => gsap.utils.random(-10, 10),
                    rotationZ: () => gsap.utils.random(-5, 5),
                    duration: 0.8,
                    ease: "back.out(1.7)",
                },
                1.5
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    const assignCubeRef = (el: HTMLDivElement) => {
        if (el && !cubesRef.current.includes(el)) {
            cubesRef.current.push(el);
        }
    };

    return (
        <div className="pin-spacer">
            <section className="sticky" ref={sectionRef}>
                {/* Logo with precise semicircular arrangement */}
                <div className="logo" ref={logoRef}>
                    {/* <div className="logo-grid"> */}
                    <div className="block block-1"></div>
                    <div className="block block-2"></div>
                    {/* <div className="block block-3"></div> */}
                    {/* <div className="block block-4"></div> */}
                    {/* <div className="block block-5"></div> */}
                    {/* <div className="block block-6"></div> */}
                </div>
                {/* </div> */}

                {/* Cubes */}
                <div className="cubes">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className={`cube cube-${i + 1}`}
                            ref={assignCubeRef}
                        >
                            <div className="front"><img src={`/assets/img${i * 6 + 1}.jpg`} alt="" /></div>
                            <div className="back"><img src={`/assets/img${i * 6 + 2}.jpg`} alt="" /></div>
                            <div className="right"><img src={`/assets/img${i * 6 + 3}.jpg`} alt="" /></div>
                            <div className="left"><img src={`/assets/img${i * 6 + 4}.jpg`} alt="" /></div>
                            <div className="top"><img src={`/assets/img${i * 6 + 5}.jpg`} alt="" /></div>
                            <div className="bottom"><img src={`/assets/img${i * 6 + 6}.jpg`} alt="" /></div>
                        </div>
                    ))}
                </div>

                {/* Headers */}
                {/* <div className="header-1">
                    <h1 ref={header1Ref}>
                        The first media company crafted for the digital first generation.
                    </h1>
                </div>
                <div className="header-2" ref={header2Ref}>
                    <h2>Where innovation meets precision.</h2>
                    <p>
                        Symphonia unites visionary thinkers, creative architects, and analytical experts, collaborating seamlessly to transform challenges into opportunities. Together, we deliver tailored solutions that drive impact and inspire growth.
                    </p>
                </div> */}
            </section>
        </div>
    );
}