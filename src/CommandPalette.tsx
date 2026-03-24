import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Github, Linkedin, FileText, Mail, MapPin,
    ExternalLink, Code2, User, Briefcase, X, ArrowUp,
    CornerDownLeft, Command
} from 'lucide-react';

interface CommandItem {
    id: string;
    label: string;
    description?: string;
    icon: React.FC<{ className?: string }>;
    action: () => void;
    category: string;
    keywords?: string[];
}

interface CommandPaletteProps {
    onContact: () => void;
    onAbout: () => void;
}

export default function CommandPalette({ onContact, onAbout }: CommandPaletteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const commands: CommandItem[] = useMemo(() => [
        // Navigation
        { id: 'about', label: 'About Me', description: 'View my profile and bio', icon: User, action: () => { onAbout(); setIsOpen(false); }, category: 'Navigation', keywords: ['profile', 'bio', 'info'] },
        { id: 'contact', label: 'Contact Me', description: 'Send me a message', icon: Mail, action: () => { onContact(); setIsOpen(false); }, category: 'Navigation', keywords: ['email', 'message', 'hello'] },
        { id: 'experience', label: 'Experience', description: 'Jump to work history', icon: Briefcase, action: () => { scrollTo('experience'); setIsOpen(false); }, category: 'Navigation', keywords: ['work', 'job', 'career'] },
        { id: 'skills', label: 'Skills', description: 'Jump to tech stack', icon: Code2, action: () => { scrollTo('skills'); setIsOpen(false); }, category: 'Navigation', keywords: ['tech', 'stack', 'tools'] },
        { id: 'projects', label: 'Projects', description: 'Jump to my work', icon: ExternalLink, action: () => { scrollTo('projects'); setIsOpen(false); }, category: 'Navigation', keywords: ['portfolio', 'work', 'apps'] },

        // Links
        { id: 'github', label: 'GitHub', description: 'github.com/pratikt76', icon: Github, action: () => { window.open('https://github.com/pratikt76', '_blank'); setIsOpen(false); }, category: 'Links', keywords: ['code', 'repo'] },
        { id: 'linkedin', label: 'LinkedIn', description: 'linkedin.com/in/pratikt76', icon: Linkedin, action: () => { window.open('https://linkedin.com/in/pratikt76', '_blank'); setIsOpen(false); }, category: 'Links', keywords: ['connect', 'network'] },
        { id: 'resume', label: 'Download Resume', description: 'View my resume on Google Drive', icon: FileText, action: () => { window.open('https://drive.google.com/file/d/1VLOhNIh_EFSARD6z6wfiM8OpADZmWSq3/view?usp=sharing', '_blank'); setIsOpen(false); }, category: 'Links', keywords: ['cv', 'download', 'pdf'] },
        { id: 'terminal', label: 'Terminal Portfolio', description: 'cmd.pratikthombare.in', icon: Command, action: () => { window.open('https://cmd.pratikthombare.in', '_blank'); setIsOpen(false); }, category: 'Links', keywords: ['cli', 'terminal', 'command'] },

        // Actions
        { id: 'top', label: 'Scroll to Top', description: 'Go back to the top', icon: ArrowUp, action: () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsOpen(false); }, category: 'Actions', keywords: ['top', 'beginning'] },
        { id: 'location', label: 'Pune, India', description: 'My current location', icon: MapPin, action: () => { setIsOpen(false); }, category: 'Info', keywords: ['where', 'location', 'city'] },
    ], [onContact, onAbout]);

    const scrollTo = (id: string) => {
        // Find elements by section label text
        const labels = document.querySelectorAll('span');
        for (const label of labels) {
            if (label.textContent?.toLowerCase().includes(id.toLowerCase())) {
                label.closest('[class*="rounded-3xl"]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }
        }
    };

    const filtered = useMemo(() => {
        if (!query.trim()) return commands;
        const q = query.toLowerCase();
        return commands.filter(cmd =>
            cmd.label.toLowerCase().includes(q) ||
            cmd.description?.toLowerCase().includes(q) ||
            cmd.keywords?.some(k => k.includes(q)) ||
            cmd.category.toLowerCase().includes(q)
        );
    }, [query, commands]);

    // Group by category
    const grouped = useMemo(() => {
        const groups: Record<string, CommandItem[]> = {};
        for (const item of filtered) {
            if (!groups[item.category]) groups[item.category] = [];
            groups[item.category].push(item);
        }
        return groups;
    }, [filtered]);

    // Flatten for index-based selection
    const flatItems = useMemo(() => filtered, [filtered]);

    // Open/close with Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
                setQuery('');
                setSelectedIndex(0);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Keyboard navigation
    const handleInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => Math.min(i + 1, flatItems.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            flatItems[selectedIndex]?.action();
        }
    };

    // Reset index on query change
    useEffect(() => { setSelectedIndex(0); }, [query]);

    // Scroll selected into view
    useEffect(() => {
        const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
        el?.scrollIntoView({ block: 'nearest' });
    }, [selectedIndex]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Palette */}
                    <motion.div
                        className="relative w-full max-w-lg mx-4 bg-[#0c0c0c] border border-white/[0.1] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Top glow */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

                        {/* Search input */}
                        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
                            <Search className="w-4 h-4 text-zinc-500 shrink-0" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onKeyDown={handleInputKeyDown}
                                placeholder="Type a command or search..."
                                className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none"
                                autoComplete="off"
                                spellCheck={false}
                            />
                            <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-[10px] text-zinc-500 font-mono">
                                ESC
                            </kbd>
                        </div>

                        {/* Results */}
                        <div ref={listRef} className="max-h-[320px] overflow-y-auto py-2">
                            {flatItems.length === 0 ? (
                                <div className="px-4 py-8 text-center text-sm text-zinc-600">
                                    No results found for "{query}"
                                </div>
                            ) : (
                                Object.entries(grouped).map(([category, items]) => (
                                    <div key={category}>
                                        <div className="px-4 pt-2 pb-1">
                                            <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-zinc-600">{category}</span>
                                        </div>
                                        {items.map(item => {
                                            const globalIdx = flatItems.indexOf(item);
                                            return (
                                                <button
                                                    key={item.id}
                                                    data-index={globalIdx}
                                                    onClick={item.action}
                                                    onMouseEnter={() => setSelectedIndex(globalIdx)}
                                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100 ${
                                                        globalIdx === selectedIndex
                                                            ? 'bg-white/[0.06] text-white'
                                                            : 'text-zinc-400 hover:bg-white/[0.03]'
                                                    }`}
                                                >
                                                    <item.icon className={`w-4 h-4 shrink-0 ${globalIdx === selectedIndex ? 'text-blue-400' : 'text-zinc-600'}`} />
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-sm font-medium">{item.label}</span>
                                                        {item.description && (
                                                            <span className="text-xs text-zinc-600 ml-2">{item.description}</span>
                                                        )}
                                                    </div>
                                                    {globalIdx === selectedIndex && (
                                                        <CornerDownLeft className="w-3 h-3 text-zinc-500 shrink-0" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer hints */}
                        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-white/[0.06] text-[10px] text-zinc-600">
                            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] font-mono">↑↓</kbd> Navigate</span>
                            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] font-mono">↵</kbd> Select</span>
                            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] font-mono">Esc</kbd> Close</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
