import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const dot = dotRef.current;
        const glow = glowRef.current;
        if (!dot || !glow) return;

        let mouseX = 0;
        let mouseY = 0;
        let dotX = 0;
        let dotY = 0;
        let glowX = 0;
        let glowY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive =
                target.closest('a') ||
                target.closest('button') ||
                target.closest('[role="button"]') ||
                target.closest('input') ||
                target.closest('textarea') ||
                target.closest('[data-cursor-hover]') ||
                window.getComputedStyle(target).cursor === 'pointer';
            setIsHovering(!!isInteractive);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);
        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        let animId: number;
        const animate = () => {
            // Dot follows tightly
            dotX += (mouseX - dotX) * 0.35;
            dotY += (mouseY - dotY) * 0.35;
            dot.style.transform = `translate(${dotX}px, ${dotY}px)`;

            // Glow follows with more lag
            glowX += (mouseX - glowX) * 0.15;
            glowY += (mouseY - glowY) * 0.15;
            glow.style.transform = `translate(${glowX}px, ${glowY}px)`;

            animId = requestAnimationFrame(animate);
        };

        animate();

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.documentElement.addEventListener('mouseleave', handleMouseLeave);
        document.documentElement.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            cancelAnimationFrame(animId);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
            document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [isVisible]);

    // Hide on touch devices
    if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

    return (
        <>
            {/* Inner dot */}
            <div
                ref={dotRef}
                className="custom-cursor-dot"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: isHovering ? '40px' : '8px',
                    height: isHovering ? '40px' : '8px',
                    marginLeft: isHovering ? '-20px' : '-4px',
                    marginTop: isHovering ? '-20px' : '-4px',
                    borderRadius: '50%',
                    background: isHovering
                        ? 'rgba(96, 165, 250, 0.1)'
                        : 'rgba(200, 215, 255, 0.9)',
                    border: isHovering ? '1.5px solid rgba(96, 165, 250, 0.5)' : 'none',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    transition: 'width 0.3s ease, height 0.3s ease, margin 0.3s ease, background 0.3s ease, border 0.3s ease, opacity 0.3s ease',
                    opacity: isVisible ? 1 : 0,
                    willChange: 'transform',
                    mixBlendMode: isHovering ? 'normal' : 'normal',
                    transform: isClicking ? 'scale(0.8)' : undefined,
                }}
            />
            {/* Outer glow */}
            <div
                ref={glowRef}
                className="custom-cursor-glow"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: isHovering ? '60px' : '35px',
                    height: isHovering ? '60px' : '35px',
                    marginLeft: isHovering ? '-30px' : '-17.5px',
                    marginTop: isHovering ? '-30px' : '-17.5px',
                    borderRadius: '50%',
                    background: isHovering
                        ? 'radial-gradient(circle, rgba(96,165,250,0.15) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(150,180,255,0.08) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 9998,
                    transition: 'width 0.4s ease, height 0.4s ease, margin 0.4s ease, background 0.4s ease, opacity 0.3s ease',
                    opacity: isVisible ? 1 : 0,
                    willChange: 'transform',
                }}
            />
        </>
    );
}
