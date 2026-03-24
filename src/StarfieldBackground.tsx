import { useEffect, useRef } from 'react';

interface Star {
    x: number;
    y: number;
    z: number;
    prevX: number;
    prevY: number;
    radius: number;
    opacity: number;
}

export default function StarfieldBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let stars: Star[] = [];
        const STAR_COUNT = 200;
        const SPEED = 0.15;
        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createStars = () => {
            stars = [];
            for (let i = 0; i < STAR_COUNT; i++) {
                const x = Math.random() * canvas.width - canvas.width / 2;
                const y = Math.random() * canvas.height - canvas.height / 2;
                const z = Math.random() * 1000;
                stars.push({
                    x, y, z,
                    prevX: x, prevY: y,
                    radius: Math.random() * 1.5 + 0.5,
                    opacity: Math.random() * 0.5 + 0.3,
                });
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            targetMouseX = (e.clientX - canvas.width / 2) * 0.02;
            targetMouseY = (e.clientY - canvas.height / 2) * 0.02;
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Smooth mouse follow
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            for (const star of stars) {
                star.prevX = (star.x / star.z) * 400 + cx + mouseX;
                star.prevY = (star.y / star.z) * 400 + cy + mouseY;

                star.z -= SPEED;

                if (star.z <= 0) {
                    star.x = Math.random() * canvas.width - cx;
                    star.y = Math.random() * canvas.height - cy;
                    star.z = 1000;
                    star.prevX = (star.x / star.z) * 400 + cx + mouseX;
                    star.prevY = (star.y / star.z) * 400 + cy + mouseY;
                }

                const sx = (star.x / star.z) * 400 + cx + mouseX;
                const sy = (star.y / star.z) * 400 + cy + mouseY;

                // Brightness based on depth
                const brightness = 1 - star.z / 1000;
                const alpha = star.opacity * brightness;
                const size = star.radius * brightness * 2;

                // Draw trail
                ctx.beginPath();
                ctx.moveTo(star.prevX, star.prevY);
                ctx.lineTo(sx, sy);
                ctx.strokeStyle = `rgba(180, 200, 255, ${alpha * 0.3})`;
                ctx.lineWidth = size * 0.5;
                ctx.stroke();

                // Draw star
                ctx.beginPath();
                ctx.arc(sx, sy, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 215, 255, ${alpha})`;
                ctx.fill();

                // Glow for bright stars
                if (brightness > 0.7) {
                    ctx.beginPath();
                    ctx.arc(sx, sy, size * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(150, 180, 255, ${alpha * 0.08})`;
                    ctx.fill();
                }
            }

            animationId = requestAnimationFrame(animate);
        };

        resize();
        createStars();
        animate();

        window.addEventListener('resize', () => { resize(); createStars(); });
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ opacity: 0.6 }}
        />
    );
}
