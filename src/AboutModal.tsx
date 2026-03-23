import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Mail, Phone, Github, Linkedin, FileText, ExternalLink, ArrowUpRight } from 'lucide-react';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const INFO = {
    name: 'Pratik Thombare',
    title: 'Software Developer',
    company: 'Bajaj Finserv',
    location: 'Pune, India',
    email: 'pratikthombare76@gmail.com',
    phone: '+91 7058406157',
    bio: `Software Developer at Bajaj Finserv, crafting high-availability backend systems with Java and Spring Boot — microservices handling millions of requests, REST APIs, Kafka pipelines, and Dockerized deployments on Azure Cloud. COEP Pune grad '24.`,
    photo: '/pratik-photo.jpg',
};

const LINKS = [
    { label: 'GitHub', url: 'https://github.com/pratikt76', icon: Github, color: 'group-hover:text-white' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/pratikt76', icon: Linkedin, color: 'group-hover:text-[#0A66C2]' },
    { label: 'Resume', url: 'https://drive.google.com/file/d/1VLOhNIh_EFSARD6z6wfiM8OpADZmWSq3/view?usp=sharing', icon: FileText, color: 'group-hover:text-emerald-400' },
    { label: 'Portfolio', url: 'https://pratikthombare.in', icon: ExternalLink, color: 'group-hover:text-blue-400' },
];

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
    // Lock body scroll
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal — responsive layout */}
                    <motion.div
                        className="relative w-full max-w-3xl max-h-[90vh] bg-[#0a0a0a] border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Glow accent */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent z-10" />

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-black/40 backdrop-blur-sm text-zinc-300 hover:text-white hover:bg-white/[0.1] transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="overflow-y-auto max-h-[90vh] flex flex-col md:flex-row">
                            {/* MOBILE — Photo Banner (visible only on small screens) */}
                            <div className="md:hidden relative w-full h-48 shrink-0">
                                <img
                                    src={INFO.photo}
                                    alt={INFO.name}
                                    className="absolute inset-0 w-full h-full object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
                            </div>

                            {/* Info Section */}
                            <div className="flex-1 min-w-0">
                                <div className="px-6 md:px-7 pt-5 md:pt-16 pb-7 space-y-5">
                                    {/* Name & Title */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-medium text-emerald-400 tracking-wide">Available for opportunities</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-white tracking-tight">{INFO.name}</h2>
                                        <p className="text-sm text-zinc-400 mt-0.5">{INFO.title} · {INFO.company}</p>
                                    </div>

                                    {/* Bio */}
                                    <p className="text-[13px] text-zinc-300 leading-relaxed">{INFO.bio}</p>

                                    {/* Contact Info */}
                                    <div className="space-y-2.5">
                                        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-500">Contact</span>
                                        <div className="space-y-2">
                                            <a
                                                href={`mailto:${INFO.email}`}
                                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all group"
                                            >
                                                <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                                                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] text-zinc-500">Email</p>
                                                    <p className="text-[13px] text-zinc-200 truncate">{INFO.email}</p>
                                                </div>
                                                <ArrowUpRight className="w-3 h-3 text-zinc-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                            </a>
                                            <a
                                                href={`tel:${INFO.phone}`}
                                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all group"
                                            >
                                                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                                                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] text-zinc-500">Phone</p>
                                                    <p className="text-[13px] text-zinc-200">{INFO.phone}</p>
                                                </div>
                                                <ArrowUpRight className="w-3 h-3 text-zinc-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                            </a>
                                            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                                <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                                                    <MapPin className="w-3.5 h-3.5 text-orange-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-zinc-500">Location</p>
                                                    <p className="text-[13px] text-zinc-200">{INFO.location}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Links */}
                                    <div className="space-y-2.5">
                                        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-500">Links</span>
                                        <div className="grid grid-cols-2 gap-2">
                                            {LINKS.map(link => (
                                                <a
                                                    key={link.label}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all"
                                                >
                                                    <link.icon className={`w-3.5 h-3.5 text-zinc-500 ${link.color} transition-colors`} />
                                                    <span className="text-[13px] text-zinc-300 font-medium">{link.label}</span>
                                                    <ArrowUpRight className="w-3 h-3 text-zinc-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* DESKTOP — Photo Side Panel (hidden on mobile) */}
                            <div className="hidden md:block w-[280px] shrink-0 relative">
                                <img
                                    src={INFO.photo}
                                    alt={INFO.name}
                                    className="absolute inset-0 w-full h-full object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/40 to-transparent" />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
