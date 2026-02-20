import React from 'react';

interface BlogCardProps {
    title: string;
    description: string;
    date: string;
    href: string;
    imageSrc?: string;
    tags?: string[];
}

export default function BlogCard({ title, description, date, href, imageSrc, tags }: BlogCardProps) {
    return (
        <a href={href} className="group relative block w-full h-80 overflow-hidden rounded-2xl bg-slate-100 shadow-md transition-shadow hover:shadow-xl">
            {/* Background Image / Fallback */}
            {imageSrc ? (
                <img
                    src={imageSrc}
                    alt={title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className="absolute inset-0 h-full w-full bg-[var(--color-dark)] transition-transform duration-500 group-hover:scale-105" />
            )}

            {/* Dark Overlay that appears on hover */}
            <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/40" />

            {/* Gradient Overlay bottom to top for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

            {/* Base Content (Always visible at the bottom) */}
            <div className="absolute bottom-0 left-0 p-6 w-full text-white transform transition-transform duration-500 group-hover:-translate-y-full">
                {tags && tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <span key={tag} className="bg-[var(--color-primary)] text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
                <h3 className="text-2xl font-bold leading-tight drop-shadow-md">
                    {title}
                </h3>
            </div>

            {/* Swipe-up Overlay Content (Hidden by default, slides up on Hover) */}
            <div className="absolute bottom-0 left-0 p-6 w-full h-full bg-[var(--color-primary)] text-white transform translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0 flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold mb-3 border-b border-white/30 pb-3">{title}</h3>
                    <p className="text-sm text-white/90 line-clamp-4 leading-relaxed">{description}</p>
                </div>

                <div className="flex items-center justify-between text-sm font-medium mt-4">
                    <span className="opacity-80">{date}</span>
                    <span className="flex items-center gap-1 group/btn">
                        Read Story
                        <svg className="w-4 h-4 transform transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </span>
                </div>
            </div>
        </a>
    );
}
