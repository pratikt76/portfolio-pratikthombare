import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
    Github, Linkedin, FileText, Mail, ExternalLink,
    MapPin, ArrowUpRight, Download, Sparkles, Code2,
    Server, Database, Cloud, Brain, ChevronRight
} from 'lucide-react';
import ContactModal from './ContactModal';
import AboutModal from './AboutModal';

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

const PERSONAL = {
    name: 'Pratik',
    lastName: 'Thombare',
    title: 'Software Developer',
    company: 'Bajaj Finserv',
    location: 'Pune, India',
    email: 'pratikthombare76@gmail.com',
    tagline: 'Shipping the code that AI hallucinates about — with a little help from it.',
    bio: `Software Developer at Bajaj Finserv, crafting high-availability backend systems with Java and Spring Boot — microservices handling millions of requests, REST APIs, Kafka pipelines, and Dockerized deployments on Azure Cloud. COEP Pune grad '24.`,
};

const SKILLS_ICONS: Record<string, React.FC<{ className?: string }>> = {
    'Languages': Code2,
    'Frameworks': Server,
    'Databases': Database,
    'Cloud & DevOps': Cloud,
    'Concepts': Brain,
};

const SKILLS: Record<string, string[]> = {
    'Languages': ['Java (8/11/17)', 'SQL', 'JavaScript', 'TypeScript'],
    'Frameworks': ['Spring Boot', 'Spring MVC', 'JPA / Hibernate', 'RESTful API', 'JUnit', 'Mockito'],
    'Databases': ['MySQL', 'PostgreSQL', 'Cosmos DB', 'MongoDB'],
    'Cloud & DevOps': ['Docker', 'Kubernetes', 'Azure Cloud', 'CI/CD', 'Git', 'Maven'],
    'Concepts': ['Microservices', 'System Design', 'Perf Optimization', 'Agile/Scrum'],
};

const EXPERIENCE = [
    {
        period: 'Jul 2024 — Present', role: 'Software Developer', company: 'Bajaj Finserv',
        type: 'Full-time', location: 'Pune',
        desc: 'Building high-availability backend systems powering financial services at scale.',
        tags: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL', 'Kafka', 'Docker'],
        current: true,
    },
    {
        period: 'Jan 2024 — Jun 2024', role: 'SDE Intern', company: 'Bajaj Finserv',
        type: 'Internship', location: 'Pune',
        desc: 'Backend development and API integrations for internal tools.',
        tags: ['Java', 'Spring Boot', 'REST API', 'SQL'],
        current: false,
    },
    {
        period: '2020 — 2024', role: 'BTech — E&TC', company: 'COEP Pune',
        type: 'Education', location: 'Pune',
        desc: 'Software engineering, data structures, and system design.',
        tags: ['DSA', 'Full-Stack', 'Open Source'],
        current: false,
    },
];

const PROJECTS = [
    {
        title: 'Parkin', desc: 'Smart parking management — optimizing slot allocation and availability.',
        tags: ['Java', 'Spring Boot'], color: 'from-blue-500/20 to-cyan-500/20',
        borderColor: 'hover:border-blue-500/30',
        github: 'https://github.com/pratikt76/Parkin', demo: null,
    },
    {
        title: 'VelocityCSS', desc: 'Lightweight CSS utility framework — faster styling without bloat.',
        tags: ['CSS', 'JavaScript'], color: 'from-amber-500/20 to-yellow-500/20',
        borderColor: 'hover:border-amber-500/30',
        github: 'https://github.com/pratikt76/VelocityCSS', demo: 'https://pratikt76.github.io/VelocityCSS/',
    },
    {
        title: 'LLVis', desc: 'Interactive visualization tool for exploring linked list operations and data structure patterns.',
        tags: ['React', 'TypeScript', 'DSA'], color: 'from-violet-500/20 to-fuchsia-500/20',
        borderColor: 'hover:border-violet-500/30',
        github: null, demo: 'https://pratikthombare.in/llvis/',
    },
    {
        title: 'F1 Pitwall', desc: 'Real-time Formula 1 dashboard with live timing and telemetry visualization.',
        tags: ['React', 'Real-time', 'API'], color: 'from-red-500/20 to-orange-500/20',
        borderColor: 'hover:border-red-500/30',
        github: null, demo: 'https://pratikthombare.in/f1/',
    },
    {
        title: 'FlagMaster', desc: 'Interactive geography quiz game with smooth animations and keyboard support.',
        tags: ['React', 'REST API', 'Game'], color: 'from-emerald-500/20 to-teal-500/20',
        borderColor: 'hover:border-emerald-500/30',
        github: 'https://github.com/pratikt76/FlagMaster', demo: 'https://pratikt76.github.io/FlagMaster/',
    },
];

const SOCIAL = [
    { label: 'GitHub', url: 'https://github.com/pratikt76', icon: Github },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/pratikt76', icon: Linkedin },
    { label: 'Resume', url: 'https://drive.google.com/file/d/1VLOhNIh_EFSARD6z6wfiM8OpADZmWSq3/view?usp=sharing', icon: FileText },
];

const SPOTIFY_API = 'https://api.pratikthombare.in/api/spotify';

/* ═══════════════════════════════════════════════════════
   3D TILT CARD
   ═══════════════════════════════════════════════════════ */

function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

    const handleMouse = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleLeave = () => { x.set(0); y.set(0); };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={handleLeave}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════
   SPOTIFY MINI WIDGET
   ═══════════════════════════════════════════════════════ */

function SpotifyWidget() {
    const [tracks, setTracks] = useState<{ name: string; artist: string; art: string; url: string }[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);

    useEffect(() => {
        fetch(SPOTIFY_API)
            .then(r => r.json())
            .then(d => {
                if (d.tracks?.length) {
                    const seen = new Set<string>();
                    const unique = d.tracks
                        .filter((t: any) => { if (seen.has(t.name)) return false; seen.add(t.name); return true; })
                        .slice(0, 6)
                        .map((t: any) => ({
                            name: t.name, artist: t.artist,
                            art: t.albumImageUrl || t.albumArt || '',
                            url: t.spotifyUrl || '#'
                        }));
                    setTracks(unique);
                }
            })
            .catch(() => { });
    }, []);

    useEffect(() => {
        if (tracks.length < 2) return;
        const timer = setInterval(() => setCurrentIdx(i => (i + 1) % tracks.length), 4000);
        return () => clearInterval(timer);
    }, [tracks]);

    if (tracks.length === 0) {
        return (
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/[0.04] animate-pulse" />
                <div className="space-y-2">
                    <div className="h-3 w-24 bg-white/[0.04] rounded animate-pulse" />
                    <div className="h-2.5 w-16 bg-white/[0.04] rounded animate-pulse" />
                </div>
            </div>
        );
    }

    const track = tracks[currentIdx];

    return (
        <a href={track.url} target="_blank" rel="noopener noreferrer" className="block group">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <img
                        src={track.art}
                        alt={track.name}
                        className="w-14 h-14 rounded-xl object-cover ring-1 ring-white/[0.08] group-hover:ring-[#1DB954]/50 transition-all duration-500"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1DB954] flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-black" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                        </svg>
                    </div>
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate group-hover:text-[#1DB954] transition-colors">
                        {track.name}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">{track.artist}</p>
                </div>
            </div>
            {/* Track dots */}
            <div className="flex gap-1.5 mt-4">
                {tracks.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentIdx ? 'w-6 bg-[#1DB954]' : 'w-1.5 bg-white/[0.08]'}`} />
                ))}
            </div>
        </a>
    );
}


/* ═══════════════════════════════════════════════════════
   TIME WIDGET
   ═══════════════════════════════════════════════════════ */

function TimeWidget() {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    return (
        <div>
            <p className="text-3xl font-bold text-zinc-100 tracking-tight tabular-nums">
                {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
                {time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
            </p>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT — BENTO GRID
   ═══════════════════════════════════════════════════════ */

export default function ProfessionalPortfolio() {
    const [contactOpen, setContactOpen] = useState(false);
    const [hoveredProject, setHoveredProject] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const aboutOpen = location.pathname === '/about';

    const fadeUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-blue-500/30 overflow-x-hidden">
            {/* ── NOISE TEXTURE OVERLAY ── */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.015]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}
            />

            {/* ── GRADIENT BLOBS ── */}
            <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-blue-600/[0.03] rounded-full blur-[180px] pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/[0.03] rounded-full blur-[150px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

                {/* ╔══════════════════════════════════════════════╗
                   ║  TOP BAR                                     ║
                   ╚══════════════════════════════════════════════╝ */}
                <motion.header
                    {...fadeUp}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-between mb-8 sm:mb-12"
                >
                    <div className="flex items-center gap-3">
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href="https://cmd.pratikthombare.in"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-emerald-400 hover:bg-white/[0.06] hover:border-emerald-500/30 transition-all duration-300 text-xs font-mono font-semibold"
                            title="Terminal Portfolio"
                        >
                            &gt;_ Terminal
                        </a>
                        {SOCIAL.map(s => (
                            <a
                                key={s.label}
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
                                title={s.label}
                            >
                                <s.icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </motion.header>

                {/* ╔══════════════════════════════════════════════╗
                   ║  BENTO GRID                                  ║
                   ╚══════════════════════════════════════════════╝ */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

                    {/* ── HERO CARD (spans 2 cols) ── */}
                    <motion.div
                        {...fadeUp}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="md:col-span-2 lg:col-span-2 row-span-2"
                    >
                        <TiltCard className="h-full">
                            <div className="relative h-full p-8 sm:p-10 rounded-3xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden group">
                                {/* Inner glow */}
                                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-blue-500/[0.08] to-transparent rounded-full blur-[80px] pointer-events-none group-hover:from-blue-500/[0.12] transition-all duration-700" />

                                <div className="relative z-10 flex flex-col justify-between h-full min-h-[320px]">
                                    <div>
                                        <div className="flex items-center gap-2.5 mb-8">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-xs font-medium text-zinc-500 tracking-wide">Available for opportunities</span>
                                        </div>
                                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.9] mb-5 group/name cursor-default">
                                            <span className="text-zinc-100 inline-block transition-all duration-500 group-hover/name:text-white group-hover/name:drop-shadow-[0_0_25px_rgba(147,197,253,0.3)] group-hover/name:-translate-y-0.5">{PERSONAL.name}</span>
                                            <br />
                                            <span
                                                className="bg-clip-text text-transparent inline-block transition-all duration-700 group-hover/name:-translate-y-0.5"
                                                style={{
                                                    backgroundImage: 'linear-gradient(90deg, #60a5fa, #3b82f6, #a855f7, #60a5fa)',
                                                    backgroundSize: '200% 100%',
                                                    backgroundPosition: '0% 0%',
                                                    transition: 'background-position 0.7s ease, transform 0.5s ease, filter 0.5s ease',
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.backgroundPosition = '100% 0%'; e.currentTarget.style.filter = 'drop-shadow(0 0 30px rgba(168,85,247,0.4))'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.backgroundPosition = '0% 0%'; e.currentTarget.style.filter = 'none'; }}
                                            >
                                                {PERSONAL.lastName}
                                            </span>
                                        </h1>
                                        <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-md">
                                            {PERSONAL.tagline}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-3 mt-8">
                                        <a
                                            href={SOCIAL.find(s => s.label === 'Resume')?.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-200 transition-all active:scale-95"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            Resume
                                        </a>
                                        <button
                                            onClick={() => setContactOpen(true)}
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.1] text-zinc-300 text-sm font-semibold hover:bg-white/[0.06] transition-all active:scale-95"
                                        >
                                            <Mail className="w-3.5 h-3.5" />
                                            Say hello
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>

                    {/* ── ABOUT CARD (clickable → opens modal) ── */}
                    <motion.div
                        {...fadeUp}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <div
                            onClick={() => navigate('/about')}
                            className="h-full p-7 rounded-3xl border border-white/[0.06] bg-[#0a0a0a] hover:border-white/[0.1] transition-all duration-500 cursor-pointer group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2.5">
                                    <Sparkles className="w-4 h-4 text-blue-400" />
                                    <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-zinc-500">About</span>
                                </div>
                                <span className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors flex items-center gap-1">
                                    View more <ArrowUpRight className="w-3 h-3" />
                                </span>
                            </div>
                            <p className="text-[15px] text-zinc-300 leading-relaxed">
                                {PERSONAL.bio}
                            </p>
                        </div>
                    </motion.div>

                    {/* ── LOCATION + TIME CARD ── */}
                    <motion.div
                        {...fadeUp}
                        transition={{ duration: 0.6, delay: 0.25 }}
                    >
                        <div className="h-full p-7 rounded-3xl border border-white/[0.06] bg-[#0a0a0a] hover:border-white/[0.1] transition-all duration-500">
                            <div className="flex items-center gap-2 mb-5">
                                <MapPin className="w-4 h-4 text-orange-400" />
                                <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-zinc-500">Location</span>
                            </div>
                            <p className="text-lg font-semibold text-zinc-200 mb-1">{PERSONAL.location}</p>
                            <p className="text-xs text-zinc-500 mb-5">IST (GMT+5:30)</p>
                            <TimeWidget />
                        </div>
                    </motion.div>

                    {/* ── SPOTIFY CARD ── */}
                    <motion.div
                        {...fadeUp}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="h-full p-7 rounded-3xl border border-white/[0.06] bg-[#0a0a0a] hover:border-[#1DB954]/20 transition-all duration-500">
                            <div className="flex items-center gap-2 mb-5">
                                <svg className="w-4 h-4 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                                </svg>
                                <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-zinc-500">Now Playing</span>
                            </div>
                            <SpotifyWidget />
                        </div>
                    </motion.div>


                    {/* ── EXPERIENCE SECTION (spans 2 cols) ── */}
                    <motion.div
                        {...fadeUp}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="md:col-span-2"
                    >
                        <div className="h-full p-7 sm:p-8 rounded-3xl border border-white/[0.06] bg-[#0a0a0a] hover:border-white/[0.1] transition-all duration-500">
                            <div className="flex items-center gap-2.5 mb-6">
                                <ChevronRight className="w-4 h-4 text-emerald-400" />
                                <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-zinc-500">Experience</span>
                            </div>
                            <div className="space-y-0">
                                {EXPERIENCE.map((exp, i) => (
                                    <div key={i} className={`relative pl-6 pb-7 ${i < EXPERIENCE.length - 1 ? 'border-l border-white/[0.06]' : 'border-l border-transparent'}`}>
                                        {/* Timeline dot */}
                                        <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 ${exp.current ? 'bg-emerald-500 border-emerald-500' : 'bg-[#0a0a0a] border-zinc-600'}`} />

                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                                            <div>
                                                <h3 className="text-sm font-semibold text-zinc-200">{exp.role}</h3>
                                                <p className="text-xs text-zinc-500">{exp.company} · {exp.type}</p>
                                            </div>
                                            <span className="text-xs text-zinc-600 shrink-0">{exp.period}</span>
                                        </div>
                                        <p className="text-[13px] text-zinc-400 leading-relaxed mb-3">{exp.desc}</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {exp.tags.map(tag => (
                                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-500 font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* ── SKILLS GRID (spans 2 cols) ── */}
                    <motion.div
                        {...fadeUp}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="md:col-span-2"
                    >
                        <div className="h-full p-7 sm:p-8 rounded-3xl border border-white/[0.06] bg-[#0a0a0a] hover:border-white/[0.1] transition-all duration-500">
                            <div className="flex items-center gap-2.5 mb-6">
                                <Code2 className="w-4 h-4 text-cyan-400" />
                                <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-zinc-500">Skills</span>
                            </div>
                            <div className="space-y-5">
                                {Object.entries(SKILLS).map(([cat, skills]) => {
                                    const Icon = SKILLS_ICONS[cat] || Code2;
                                    return (
                                        <div key={cat}>
                                            <div className="flex items-center gap-2 mb-2.5">
                                                <Icon className="w-3.5 h-3.5 text-zinc-600" />
                                                <span className="text-xs font-semibold text-zinc-400">{cat}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {skills.map(skill => (
                                                    <span key={skill} className="text-[12px] px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-zinc-300 font-medium hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300 cursor-default">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* ── PROJECTS (full width) ── */}
                    <motion.div
                        {...fadeUp}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="md:col-span-2 lg:col-span-4"
                    >
                        <div className="p-7 sm:p-8 rounded-3xl border border-white/[0.06] bg-[#0a0a0a]">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2.5">
                                    <ExternalLink className="w-4 h-4 text-violet-400" />
                                    <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-zinc-500">Projects</span>
                                </div>
                                <a
                                    href="https://github.com/pratikt76"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
                                >
                                    View all <ArrowUpRight className="w-3 h-3" />
                                </a>
                            </div>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {PROJECTS.map((p, i) => (
                                    <motion.div
                                        key={p.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: i * 0.06 }}
                                        onMouseEnter={() => setHoveredProject(p.title)}
                                        onMouseLeave={() => setHoveredProject(null)}
                                        className={`group relative p-5 rounded-2xl border border-white/[0.06] bg-gradient-to-br ${p.color} ${p.borderColor} transition-all duration-500 hover:shadow-lg`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-base font-semibold text-zinc-100">{p.title}</h3>
                                            <div className="flex gap-1">
                                                {p.github && (
                                                    <a href={p.github} target="_blank" rel="noopener noreferrer"
                                                        className="p-1.5 rounded-lg text-zinc-500 hover:text-white transition-colors">
                                                        <Github className="w-3.5 h-3.5" />
                                                    </a>
                                                )}
                                                {p.demo && (
                                                    <a href={p.demo} target="_blank" rel="noopener noreferrer"
                                                        className="p-1.5 rounded-lg text-zinc-500 hover:text-white transition-colors">
                                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-[13px] text-zinc-400 leading-relaxed mb-4">{p.desc}</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {p.tags.map(tag => (
                                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-black/20 text-zinc-400 font-medium border border-white/[0.04]">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* ── CTA + FOOTER (full width) ── */}
                    <motion.div
                        {...fadeUp}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="md:col-span-2 lg:col-span-4"
                    >
                        <div className="p-8 sm:p-10 rounded-3xl border border-white/[0.06] bg-[#0a0a0a] text-center">
                            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-3 tracking-tight">
                                Let's build something great
                            </h2>
                            <p className="text-sm text-zinc-400 mb-6 max-w-md mx-auto">
                                Have a project, idea, or opportunity? I'd love to hear from you.
                            </p>
                            <button
                                onClick={() => setContactOpen(true)}
                                className="inline-flex items-center gap-2.5 px-7 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95"
                            >
                                <Mail className="w-4 h-4" />
                                Get in touch
                            </button>
                        </div>
                    </motion.div>

                </div>

                {/* ── FOOTER ── */}
                <motion.footer
                    {...fadeUp}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 py-6 px-2 text-xs text-zinc-600"
                >
                    <span>© {new Date().getFullYear()} Pratik Thombare</span>
                    <span>✦ vibe-coded with Antigravity</span>
                </motion.footer>
            </div>

            {/* Contact Modal */}
            <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
            {/* About Modal */}
            <AboutModal isOpen={aboutOpen} onClose={() => navigate('/')} />
        </div>
    );
}
