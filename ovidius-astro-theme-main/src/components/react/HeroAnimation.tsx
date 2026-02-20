import React, { useEffect, useRef, useState } from 'react';
import '@fontsource/bungee';
import '@fontsource/cinzel';
import '@fontsource/creepster';
import '@fontsource/sedgwick-ave-display';
import '@fontsource/press-start-2p';
import '@fontsource/righteous';
import '@fontsource/dancing-script';
import '@fontsource/rock-salt';

const COLORS = ['#353535', '#3C6E71', '#d9d9d9', '#284B63']; // Removed white (#FFFFFF) from particles so they are visible on white background
const BG_COLOR = '#ffffff'; // White background as requested

// Array of distinct font families
const FONT_FAMILIES = [
    'inherit',                      // Default sans-serif
    '"Bungee", cursive',            // Chunky Block
    '"Cinzel", serif',              // Elegant Classic
    '"Creepster", cursive',         // Horror/Gothic Punk
    '"Sedgwick Ave Display", cursive', // Graffiti/Street
    '"Press Start 2P", cursive',    // Retro Arcade
    '"Righteous", cursive',         // Cyberpunk Tech
    '"Dancing Script", cursive',    // Handwriting
    '"Rock Salt", cursive'          // Marker Outline
];

class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    radius: number;
    canvasWidth: number;
    canvasHeight: number;

    constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.radius = Math.random() * 2 + 1.5;
    }

    update(mouseX: number, mouseY: number) {
        // Basic movement
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > this.canvasWidth) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvasHeight) this.vy *= -1;

        // Mouse interaction (Repulsion)
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
            const force = (150 - dist) / 150;
            this.x -= (dx / dist) * force * 2;
            this.y -= (dy / dist) * force * 2;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

export default function HeroAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });

    // State to track current font
    const [fontIndex, setFontIndex] = useState(0);

    const handleTextClick = () => {
        setFontIndex((prev) => (prev + 1) % FONT_FAMILIES.length);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        let particles: Particle[] = [];
        let animationFrameId: number;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const numParticles = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 8000), 200);
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle(canvas.width, canvas.height));
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        const animate = () => {
            ctx.fillStyle = BG_COLOR;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const { x: mouseX, y: mouseY } = mouseRef.current;

            // Connecting particles
            for (let i = 0; i < particles.length; i++) {
                // Connect to mouse
                const dMouseX = particles[i].x - mouseX;
                const dMouseY = particles[i].y - mouseY;
                const dMouseDist = Math.sqrt(dMouseX * dMouseX + dMouseY * dMouseY);

                if (dMouseDist < 150) {
                    ctx.beginPath();
                    // Use the particle's color for the line to the mouse
                    ctx.strokeStyle = particles[i].color;
                    ctx.globalAlpha = 1 - dMouseDist / 150;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }

                // Connect to other particles
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(40, 75, 99, ${1 - dist / 100})`; // Indigo Dye connecting lines
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(p => {
                p.update(mouseX, mouseY);
                p.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resizeCanvas);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none select-none">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover pointer-events-auto"
                style={{ display: 'block' }}
            />
            {/* Clickable dark glassmorphism container */}
            <div
                className="relative z-20 px-10 py-6 bg-[var(--color-dark)]/90 backdrop-blur-md border border-[var(--color-teal)]/30 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-[var(--color-dark)] cursor-pointer pointer-events-auto group text-center"
                onClick={handleTextClick}
                title="Click me to change font styles!"
            >
                <h2 className="text-white text-3xl sm:text-5xl font-extrabold tracking-tight transition-all duration-300">
                    Welcome to my <br className="sm:hidden" />
                    <span
                        className="text-[var(--color-primary)] inline-block mt-2 sm:mt-0 transition-all duration-300"
                        style={{ fontFamily: FONT_FAMILIES[fontIndex] }}
                    >
                        Experience Bank
                    </span>
                </h2>
                <div className="absolute -bottom-6 w-full left-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="text-xs text-slate-500 font-bold tracking-widest uppercase bg-white/90 px-3 py-1 rounded-full shadow-sm">
                        Click to Shuffle Fonts
                    </span>
                </div>
            </div>
        </div>
    );
}
