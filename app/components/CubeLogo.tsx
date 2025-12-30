"use client"
import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

interface CubeTransform {
    top: number;
    left: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    z: number;
}

interface CubeState {
    initial: CubeTransform;
    final: CubeTransform;
}

type CubesDataMap = Record<string, CubeState>;

const CubeLogo: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const cubesContainerRef = useRef<HTMLDivElement>(null);
    const header1Ref = useRef<HTMLDivElement>(null);
    const header2Ref = useRef<HTMLDivElement>(null);
    const cubeRefs = useRef<(HTMLDivElement | null)[]>([]);

    
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const interpolate = (start: number, end: number, progress: number): number =>
        start + (end - start) * progress;

    
    const cubeSize = isMobile ? 50 : 150;
    const halfSize = cubeSize / 2;

    const faceStyle = `absolute [transform-style:preserve-3d] [backface-visibility:visible] border border-[#ffe9d9]/20 overflow-hidden`;

    useLayoutEffect(() => {
        const lenis = new Lenis();
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time: number) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);

        const stickyHeight = window.innerHeight * 4;

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: `+=${stickyHeight}px`,
                scrub: 1,
                pin: true,
                onUpdate: (self) => {
                    const progress = self.progress;

                    
                    const initialProgress = Math.min(progress * 20, 1);
                    const logoOpacityProgress = progress >= 0.02 ? Math.min((progress - 0.02) * 100, 1) : 0;
                    if (logoRef.current) {
                        logoRef.current.style.filter = `blur(${interpolate(0, 20, initialProgress)}px)`;
                        logoRef.current.style.opacity = (1 - logoOpacityProgress).toString();
                    }

                    
                    const cubesOpacityProgress = progress > 0.01 ? Math.min((progress - 0.01) * 100, 1) : 0;
                    if (cubesContainerRef.current) {
                        cubesContainerRef.current.style.opacity = cubesOpacityProgress.toString();
                    }

                    const header1Progress = Math.min(progress * 2.5, 1);
                    if (header1Ref.current) {
                        header1Ref.current.style.transform = `translate(-50%, -50%) scale(${interpolate(1, 1.2, header1Progress)})`;
                        header1Ref.current.style.filter = `blur(${interpolate(0, 20, header1Progress)}px)`;
                        header1Ref.current.style.opacity = (1 - header1Progress).toString();
                    }

                    const header2StartProgress = (progress - 0.4) * 10;
                    const header2Progress = Math.max(0, Math.min(header2StartProgress, 1));
                    if (header2Ref.current) {
                        header2Ref.current.style.transform = `translate(-50%, -50%) scale(${interpolate(0.75, 1, header2Progress)})`;
                        header2Ref.current.style.filter = `blur(${interpolate(10, 0, header2Progress)}px)`;
                        header2Ref.current.style.opacity = header2Progress.toString();
                    }

                    const firstPhaseProgress = Math.min(progress * 2, 1);
                    const secondPhaseProgress = progress >= 0.5 ? (progress - 0.5) * 2 : 0;

                    Object.entries(cubesData).forEach(([key, data], index) => {
                        const cubeEl = cubeRefs.current[index];
                        if (!cubeEl) return;

                        const { initial, final } = data;

                        const startTop = isMobile ? 20 : initial.top;
                        const startLeft = isMobile ? 50 : initial.left;
                        const startZ = isMobile ? -500 : initial.z; 

                        
                        const targetLeft = isMobile
                            ? (final.left > 50 ? final.left - 10 : final.left + 10)
                            : final.left;

                        const currentTop = interpolate(startTop, final.top, firstPhaseProgress);
                        const currentLeft = interpolate(startLeft, targetLeft, firstPhaseProgress);
                        const currentZ = interpolate(startZ, final.z, firstPhaseProgress);

                        
                        const currentScale = isMobile ? interpolate(0.1, 1, firstPhaseProgress) : 1;

                        const currentRotateX = interpolate(initial.rotateX, final.rotateX, firstPhaseProgress);
                        const currentRotateY = interpolate(initial.rotateY, final.rotateY, firstPhaseProgress);
                        const currentRotateZ = interpolate(initial.rotateZ, final.rotateZ, firstPhaseProgress);

                        let additionalRotation = 0;
                        if (key === "cube-2") additionalRotation = interpolate(0, 180, secondPhaseProgress);
                        if (key === "cube-4") additionalRotation = interpolate(0, -180, secondPhaseProgress);

                        cubeEl.style.top = `${currentTop}%`;
                        cubeEl.style.left = `${currentLeft}%`;
                        cubeEl.style.transform = `
                            translate3d(-50%, -50%, ${currentZ}px) 
                            scale(${currentScale}) 
                            rotateX(${currentRotateX}deg) 
                            rotateY(${currentRotateY + additionalRotation}deg) 
                            rotateZ(${currentRotateZ}deg)
                        `;
                    });
                }
            });
        });

        return () => { ctx.revert(); lenis.destroy(); };
    }, [isMobile]);

    return (
        <section ref={sectionRef} className="relative w-screen h-screen overflow-hidden bg-[#331707] text-[#ffe9d9]">

            
            <div ref={logoRef} className="absolute top-[20%] md:top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3 md:gap-6 z-[2]">
                <div className="flex flex-col justify-end">
                    <div className="w-[20px] h-[20px] md:w-[35px] md:h-[35px] bg-[#ffe9d9] rotate-[42deg] origin-bottom-right"></div>
                    <div className="w-[20px] h-[20px] md:w-[35px] md:h-[35px] bg-[#ffe9d9]"></div>
                </div>
                <div className="flex flex-col justify-end gap-[15px] md:gap-[26px]">
                    <div className="w-[20px] h-[20px] md:w-[35px] md:h-[35px] bg-[#ffe9d9]"></div>
                    <div className="w-[20px] h-[20px] md:w-[35px] md:h-[35px] bg-[#ffe9d9]"></div>
                </div>
                <div className="flex flex-col justify-end">
                    <div className="w-[20px] h-[20px] md:w-[35px] md:h-[35px] bg-[#ffe9d9] -rotate-[42deg] origin-bottom-left"></div>
                    <div className="w-[20px] h-[20px] md:w-[35px] md:h-[35px] bg-[#ffe9d9]"></div>
                </div>
            </div>

            
            <div ref={cubesContainerRef} className="absolute inset-0 opacity-0 [transform-style:preserve-3d] [perspective:10000px]">
                {Object.keys(cubesData).map((key, index) => (
                    <div
                        key={key}
                        ref={(el) => { cubeRefs.current[index] = el; }}
                        style={{ width: `${cubeSize}px`, height: `${cubeSize}px` }}
                        className="absolute [transform-style:preserve-3d]"
                    >
                        {[
                            `translateZ(${halfSize}px)`,
                            `translateZ(-${halfSize}px) rotateY(180deg)`,
                            `translateX(${halfSize}px) rotateY(90deg)`,
                            `translateX(-${halfSize}px) rotateY(-90deg)`,
                            `translateY(-${halfSize}px) rotateX(90deg)`,
                            `translateY(${halfSize}px) rotateX(-90deg)`
                        ].map((transform, i) => (
                            <div key={i}
                                className={faceStyle}
                                style={{ transform, width: `${cubeSize}px`, height: `${cubeSize}px` }}>
                                <img
                                    src={`/assets/img${(index * 6) + i + 1}.jpg`}
                                    alt="Cube face"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            
            <div ref={header1Ref} className="absolute top-[60%] md:top-1/2 left-1/2 w-screen text-center flex justify-center font-serif">
                <h1 className='text-center font-[400] text-[32px] md:text-[61px] w-[90%] md:w-3/4 leading-tight'>
                    The First Media Company crafted For the Digital First generation
                </h1>
            </div>

            
            <div ref={header2Ref} className="absolute top-1/2 left-1/2 w-screen text-center opacity-0 blur-lg flex justify-center flex-col items-center font-sans">
                <h2 className="mb-2 text-xl md:text-2xl font-[700] w-[80%] md:w-1/3">Where innovation meets precision.</h2>
                <p className="text-xs md:text-sm font-[100] w-1/4 md:w-1/3">
                    Symphonia unites visionary thinkers, creative architects, and analytical
                    experts, collaborating seamlessly to transform challenges into
                    opportunities.
                </p>
            </div>
        </section >
    );
};

const cubesData: CubesDataMap = {
    "cube-1": { initial: { top: -55, left: 37.5, rotateX: 360, rotateY: -360, rotateZ: -48, z: -30000 }, final: { top: 50, left: 15, rotateX: 0, rotateY: 3, rotateZ: 0, z: 0 } },
    "cube-2": { initial: { top: -35, left: 32.5, rotateX: -360, rotateY: 360, rotateZ: 90, z: -30000 }, final: { top: 75, left: 25, rotateX: 1, rotateY: 2, rotateZ: 0, z: 0 } },
    "cube-3": { initial: { top: -65, left: 50, rotateX: -360, rotateY: -360, rotateZ: -180, z: -30000 }, final: { top: 25, left: 25, rotateX: -1, rotateY: 2, rotateZ: 0, z: 0 } },
    "cube-4": { initial: { top: -35, left: 50, rotateX: -360, rotateY: -360, rotateZ: -180, z: -30000 }, final: { top: 75, left: 75, rotateX: 1, rotateY: -2, rotateZ: 0, z: 0 } },
    "cube-5": { initial: { top: -55, left: 62.5, rotateX: 360, rotateY: 360, rotateZ: -135, z: -30000 }, final: { top: 25, left: 75, rotateX: -1, rotateY: -2, rotateZ: 0, z: 0 } },
    "cube-6": { initial: { top: -35, left: 67.5, rotateX: -180, rotateY: -360, rotateZ: -180, z: -30000 }, final: { top: 50, left: 85, rotateX: 0, rotateY: -3, rotateZ: 0, z: 0 } },
};

export default CubeLogo;
