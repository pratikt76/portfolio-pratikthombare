import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI_SEQUENCE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a',
];

interface Particle {
    id: number;
    x: number;
    y: number;
    emoji: string;
    size: number;
    rotation: number;
    velocityX: number;
    velocityY: number;
    delay: number;
}

export default function KonamiEasterEgg() {
    const [triggered, setTriggered] = useState(false);
    const [inputSequence, setInputSequence] = useState<string[]>([]);
    const [particles, setParticles] = useState<Particle[]>([]);

    const emojis = ['🚀', '⭐', '🔥', '✨', '💎', '🎮', '🎯', '⚡', '🌟', '💫', '🎉', '🏆', '👾', '🕹️', '💻'];

    const generateParticles = useCallback(() => {
        const newParticles: Particle[] = [];
        for (let i = 0; i < 60; i++) {
            newParticles.push({
                id: i,
                x: Math.random() * 100,
                y: -10 - Math.random() * 20,
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
                size: 20 + Math.random() * 30,
                rotation: Math.random() * 360,
                velocityX: (Math.random() - 0.5) * 40,
                velocityY: 60 + Math.random() * 40,
                delay: Math.random() * 1.5,
            });
        }
        return newParticles;
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (triggered) return;

            setInputSequence(prev => {
                const next = [...prev, e.key].slice(-KONAMI_SEQUENCE.length);

                // Check if sequence matches
                if (
                    next.length === KONAMI_SEQUENCE.length &&
                    next.every((key, i) => key === KONAMI_SEQUENCE[i])
                ) {
                    setTriggered(true);
                    setParticles(generateParticles());

                    // Reset after animation
                    setTimeout(() => {
                        setTriggered(false);
                        setInputSequence([]);
                        setParticles([]);
                    }, 5000);
                }

                return next;
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [triggered, generateParticles]);

    return (
        <AnimatePresence>
            {triggered && (
                <>
                    {/* Flash overlay */}
                    <motion.div
                        className="fixed inset-0 z-[300] pointer-events-none"
                        initial={{ backgroundColor: 'rgba(96, 165, 250, 0.3)' }}
                        animate={{ backgroundColor: 'rgba(96, 165, 250, 0)' }}
                        transition={{ duration: 0.6 }}
                    />

                    {/* Center message */}
                    <motion.div
                        className="fixed inset-0 z-[301] flex items-center justify-center pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="text-center"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        >
                            <motion.div
                                className="text-6xl sm:text-8xl mb-4"
                                animate={{ rotate: [0, -10, 10, -10, 0] }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                🎮
                            </motion.div>
                            <motion.h2
                                className="text-3xl sm:text-5xl font-black tracking-tight bg-clip-text text-transparent"
                                style={{
                                    backgroundImage: 'linear-gradient(90deg, #60a5fa, #a855f7, #ec4899, #f97316, #60a5fa)',
                                    backgroundSize: '200% 100%',
                                }}
                                animate={{
                                    backgroundPosition: ['0% 0%', '200% 0%'],
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            >
                                KONAMI CODE!
                            </motion.h2>
                            <motion.p
                                className="text-sm text-zinc-400 mt-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                ↑ ↑ ↓ ↓ ← → ← → B A — You found the secret!
                            </motion.p>
                        </motion.div>
                    </motion.div>

                    {/* Falling emoji particles */}
                    <div className="fixed inset-0 z-[302] pointer-events-none overflow-hidden">
                        {particles.map(p => (
                            <motion.div
                                key={p.id}
                                className="absolute"
                                style={{
                                    left: `${p.x}%`,
                                    fontSize: `${p.size}px`,
                                }}
                                initial={{
                                    y: '-10vh',
                                    rotate: 0,
                                    opacity: 1,
                                }}
                                animate={{
                                    y: '110vh',
                                    rotate: p.rotation + 360,
                                    x: p.velocityX,
                                    opacity: [1, 1, 1, 0],
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 2,
                                    delay: p.delay,
                                    ease: 'easeIn',
                                }}
                            >
                                {p.emoji}
                            </motion.div>
                        ))}
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
