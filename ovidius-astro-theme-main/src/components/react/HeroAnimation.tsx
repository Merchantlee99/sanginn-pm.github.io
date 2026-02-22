import React, { useEffect, useRef, useState } from 'react';

const UI_PALETTE = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'];
const BG_COLOR = '#ffffff';

class PixelParticle {
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    baseVx: number;
    baseVy: number;
    vx: number;
    vy: number;
    color: string;
    size: number;

    constructor(canvasWidth: number, canvasHeight: number, targetOffsetX: number, targetOffsetY: number, color: string, size: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.targetX = canvasWidth / 2 + targetOffsetX;
        this.targetY = canvasHeight / 2 + targetOffsetY;
        this.baseVx = (Math.random() - 0.5) * 2;
        this.baseVy = (Math.random() - 0.5) * 2;
        this.vx = this.baseVx;
        this.vy = this.baseVy;
        this.color = color;
        this.size = size;
    }

    updateTarget(canvasWidth: number, canvasHeight: number, targetOffsetX: number, targetOffsetY: number) {
        this.targetX = canvasWidth / 2 + targetOffsetX;
        this.targetY = canvasHeight / 2 + targetOffsetY;
    }

    update(mouseX: number, mouseY: number, isAssembled: boolean, canvasWidth: number, canvasHeight: number) {
        if (isAssembled) {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            this.vx = this.vx * 0.75 + dx * 0.08;
            this.vy = this.vy * 0.75 + dy * 0.08;
            this.x += this.vx;
            this.y += this.vy;
        } else {
            const dxMouse = this.x - mouseX;
            const dyMouse = this.y - mouseY;
            const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

            if (distMouse < 200 && distMouse > 0) {
                const force = (200 - distMouse) / 200;
                this.vx += (dxMouse / distMouse) * force * 4;
                this.vy += (dyMouse / distMouse) * force * 4;
            }

            this.vx = this.vx * 0.95 + this.baseVx * 0.05;
            this.vy = this.vy * 0.95 + this.baseVy * 0.05;

            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > 8) {
                this.vx = (this.vx / speed) * 8;
                this.vy = (this.vy / speed) * 8;
            }

            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) { this.x = 0; this.vx *= -1; this.baseVx *= -1; }
            else if (this.x > canvasWidth) { this.x = canvasWidth; this.vx *= -1; this.baseVx *= -1; }
            if (this.y < 0) { this.y = 0; this.vy *= -1; this.baseVy *= -1; }
            else if (this.y > canvasHeight) { this.y = canvasHeight; this.vy *= -1; this.baseVy *= -1; }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
}

const generateUITargets = () => {
    const points: { offsetX: number, offsetY: number, color: string, size: number }[] = [];
    const spacing = 14;
    const w = 840;
    const h = 500;

    const addRect = (rx: number, ry: number, rw: number, rh: number, colorHex: string, sz: number) => {
        for (let x = rx; x < rx + rw; x += spacing) {
            for (let y = ry; y < ry + rh; y += spacing) {
                points.push({
                    offsetX: x - w / 2,
                    offsetY: y - h / 2,
                    color: colorHex,
                    size: sz
                });
            }
        }
    };

    const P = UI_PALETTE;

    // Header Bar
    addRect(0, 0, w, 40, P[0], 6);
    // Window controls
    addRect(16, 12, 12, 12, P[4], 8);
    addRect(36, 12, 12, 12, P[2], 8);
    addRect(56, 12, 12, 12, P[1], 8);
    // Sidebar
    addRect(0, 50, 200, h - 50, P[1], 5);
    // Sidebar lines
    for (let i = 0; i < 8; i++) {
        addRect(20, 80 + i * 35, 120, 10, P[2], 5);
    }
    // Main Content Blocks
    addRect(220, 50, w - 220, 120, P[3], 6);
    addRect(220, 190, 290, 140, P[4], 5);
    addRect(530, 190, 290, 140, P[0], 5);
    addRect(220, 350, w - 220, 150, P[2], 5);

    return points;
};

const styles = `
@keyframes svgTextDrawOut {
  0% { stroke-dashoffset: 0; fill: currentColor; stroke: transparent; stroke-width: 0px; transform: scale(1); }
  20% { stroke: currentColor; stroke-width: 1.5px; }
  40% { fill: transparent; }
  100% { stroke-dashoffset: 1000; fill: transparent; stroke: currentColor; stroke-width: 1.5px; opacity: 0; transform: scale(0.9); }
}

@keyframes svgTextDrawIn {
  0% { stroke-dashoffset: 1000; fill: transparent; stroke: currentColor; stroke-width: 1.5px; opacity: 0; transform: translateX(-20px); }
  50% { opacity: 1; stroke-dashoffset: 0; }
  80% { fill: transparent; stroke-width: 1.5px; transform: translateX(0); }
  100% { fill: currentColor; stroke: transparent; stroke-width: 0px; opacity: 1; transform: translateX(0); }
}

@keyframes svgIconDrawIn {
  0% { stroke-dashoffset: 100; fill: transparent; stroke: currentColor; stroke-width: 1.5px; opacity: 0; transform: translateY(10px); }
  40% { opacity: 1; transform: translateY(0); }
  80% { fill: transparent; }
  100% { stroke-dashoffset: 0; fill: transparent; stroke: currentColor; stroke-width: 1.5px; opacity: 1; transform: translateY(0); }
}

@keyframes svgIconDrawOut {
  0% { stroke-dashoffset: 0; fill: transparent; stroke: currentColor; stroke-width: 1.5px; opacity: 1; transform: translateX(0); }
  20% { opacity: 1; transform: translateX(-15px); }
  100% { stroke-dashoffset: -100; fill: transparent; stroke: currentColor; stroke-width: 1px; opacity: 0; transform: translateX(200px); }
}

.svg-morph-text {
  stroke-dasharray: 1000;
  stroke-linejoin: round;
  stroke-linecap: round;
  transform-origin: center;
}

.svg-morph-icon {
  stroke-dasharray: 100;
  stroke-linejoin: round;
  stroke-linecap: round;
  transform-origin: center;
}

/* Apply animations to the child elements based on the parent's phase class */
.text-draw-out .svg-morph-text { animation: svgTextDrawOut 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
.text-draw-in .svg-morph-text { animation: svgTextDrawIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
.icon-draw-in .svg-morph-icon { animation: svgIconDrawIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
.icon-draw-out .svg-morph-icon { animation: svgIconDrawOut 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
`;

const TextIcon = ({ phaseClass, text }: { phaseClass: string, text: string }) => (
    <svg width="100%" height="100%" viewBox="0 0 420 60" className={`overflow-visible flex items-center justify-center ${phaseClass}`}>
        <text
            x="50%"
            y="56%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="svg-morph-text font-extrabold tracking-tight"
            style={{ fontSize: '48px', fontFamily: 'inherit' }}
        >
            {text}
        </text>
    </svg>
);

const RocketIcon = ({ phaseClass }: { phaseClass: string }) => (
    <svg width="100%" height="100%" viewBox="0 0 420 60" className={`overflow-visible flex items-center justify-center ${phaseClass}`}>
        <g className="svg-morph-icon" fill="none" style={{ color: '#E9C46A' }} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path pathLength="100" d="M 130,28 C 180,8 260,15 320,30 C 260,45 180,52 130,32 C 120,30 120,30 130,28 Z" />
            <path pathLength="100" d="M 270,19 C 265,25 265,35 270,41" />
            <circle pathLength="100" cx="230" cy="30" r="6" />
            <circle pathLength="100" cx="230" cy="30" r="3" />
            <circle pathLength="100" cx="190" cy="30" r="5" />
            <path pathLength="100" d="M 150,22 C 150,10 130,5 110,5 C 125,12 135,18 135,26" />
            <path pathLength="100" d="M 150,38 C 150,50 130,55 110,55 C 125,48 135,42 135,34" />
            <path pathLength="100" d="M 130,30 L 95,30" />
            <path pathLength="100" d="M 128,28 L 95,27" />
            <path pathLength="100" d="M 128,32 L 95,33" />

            {/* Fire */}
            <g style={{ color: '#E76F51' }}>
                <path pathLength="100" d="M 130,25 C 125,25 125,35 130,35" />
                <path pathLength="100" d="M 125,26 C 100,20 80,28 75,30 C 90,31 100,29 115,30 C 95,33 80,36 75,37 C 90,38 100,34 125,34" />
                <path pathLength="100" d="M 115,28 C 95,26 85,30 85,30 C 95,31 105,30 115,32" />
            </g>

            {/* Smoke Trails */}
            <g style={{ color: '#ffffff' }}>
                <path pathLength="100" d="M 75,30 C 65,30 55,35 40,32" strokeWidth="0.5" />
                <path pathLength="100" d="M 75,37 C 65,39 60,45 45,41" strokeWidth="0.4" />
                <path pathLength="100" d="M 60,33 C 50,28 40,35 25,31" strokeWidth="0.3" />
            </g>

            <path pathLength="100" d="M 145,30 L 260,30" strokeWidth="0.5" />
        </g>
    </svg>
);

const PlaneIcon = ({ phaseClass }: { phaseClass: string }) => (
    <svg width="100%" height="100%" viewBox="0 0 420 60" className={`overflow-visible flex items-center justify-center ${phaseClass}`}>
        <g className="svg-morph-icon" fill="none" style={{ color: '#E76F51' }} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path pathLength="100" d="M 100,28 C 150,20 280,20 330,25 C 345,27 350,30 345,33 C 320,38 150,42 90,35 C 80,33 80,30 100,28 Z" />
            <path pathLength="100" d="M 110,25 L 85,8 C 80,5 95,5 105,10 L 125,23" />
            <path pathLength="100" d="M 95,30 L 70,35 L 90,37" />
            <path pathLength="100" d="M 180,37 L 130,55 C 125,58 140,58 150,55 L 220,39" />
            <path pathLength="100" d="M 170,42 C 165,40 165,48 170,46 L 195,43 C 200,42 200,38 195,39 Z" />
            <path pathLength="100" d="M 315,24 C 325,25 330,27 340,29 L 335,28 C 325,26 315,26 315,24 Z" />
            <circle pathLength="100" cx="140" cy="30" r="1.5" />
            <circle pathLength="100" cx="155" cy="29.5" r="1.5" />
            <circle pathLength="100" cx="170" cy="29" r="1.5" />
            <circle pathLength="100" cx="185" cy="28.5" r="1.5" />
            <circle pathLength="100" cx="200" cy="28" r="1.5" />
            <circle pathLength="100" cx="215" cy="27.5" r="1.5" />
            <circle pathLength="100" cx="230" cy="27" r="1.5" />
            <circle pathLength="100" cx="245" cy="26.5" r="1.5" />
            <circle pathLength="100" cx="260" cy="26" r="1.5" />
            <circle pathLength="100" cx="275" cy="25.5" r="1.5" />
            <circle pathLength="100" cx="290" cy="25" r="1.5" />

            {/* Plane Smoke Trail */}
            <g style={{ color: '#ffffff' }}>
                <path pathLength="100" d="M 85,34 C 75,34 65,36 55,35" strokeWidth="0.5" />
                <path pathLength="100" d="M 75,35 C 65,34 60,36 45,34" strokeWidth="0.4" />
            </g>

            <path pathLength="100" d="M 130,38 L 270,36" strokeWidth="0.5" />
        </g>
    </svg>
);

const TrainIcon = ({ phaseClass }: { phaseClass: string }) => (
    <svg width="100%" height="100%" viewBox="0 0 420 60" className={`overflow-visible flex items-center justify-center ${phaseClass}`}>
        <g className="svg-morph-icon" fill="none" style={{ color: '#F4A261' }} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path pathLength="100" d="M 100,42 L 310,42 L 310,38 L 100,38 Z" />
            <path pathLength="100" d="M 100,38 L 100,12 L 150,12 L 150,38" />
            <path pathLength="100" d="M 95,12 L 155,12 L 155,10 L 95,10 Z" />
            <path pathLength="100" d="M 115,16 L 135,16 C 138,16 140,18 140,21 L 140,30 L 110,30 L 110,21 C 110,18 112,16 115,16 Z" />
            <path pathLength="100" d="M 150,35 C 150,22 150,20 160,20 L 280,20 L 280,38" />
            <path pathLength="100" d="M 280,20 C 295,20 295,38 280,38" />
            <path pathLength="100" d="M 265,20 L 260,8 L 275,8 L 270,20" />
            <path pathLength="100" d="M 255,8 L 280,8 L 280,6 L 255,6 Z" />
            <path pathLength="100" d="M 267,4 C 275,-5 290,-5 295,10 C 310,5 320,15 315,25" />
            <path pathLength="100" d="M 275,0 C 285,-10 305,-5 305,5" />
            <path pathLength="100" d="M 180,20 C 180,12 195,12 195,20" />
            <path pathLength="100" d="M 215,20 C 215,14 225,14 225,20" />
            <circle pathLength="100" cx="130" cy="42" r="8" />
            <circle pathLength="100" cx="130" cy="42" r="3" />
            <circle pathLength="100" cx="160" cy="42" r="8" />
            <circle pathLength="100" cx="160" cy="42" r="3" />
            <circle pathLength="100" cx="190" cy="42" r="8" />
            <circle pathLength="100" cx="190" cy="42" r="3" />
            <circle pathLength="100" cx="240" cy="45" r="5" />
            <circle pathLength="100" cx="240" cy="45" r="2" />
            <circle pathLength="100" cx="265" cy="45" r="5" />
            <circle pathLength="100" cx="265" cy="45" r="2" />
            <circle pathLength="100" cx="290" cy="45" r="5" />
            <circle pathLength="100" cx="290" cy="45" r="2" />

            {/* Train Funnel Smoke */}
            <g style={{ color: '#ffffff' }}>
                <circle cx="265" cy="0" r="1.5" />
                <circle cx="258" cy="-4" r="2" />
                <circle cx="245" cy="-7" r="2.5" />
                <circle cx="225" cy="-10" r="3" />
            </g>

            <path pathLength="100" d="M 130,44 L 290,44" />
            <path pathLength="100" d="M 190,44 L 220,38 L 240,44" />
            <path pathLength="100" d="M 310,42 L 325,48 L 300,48 Z" />
            <path pathLength="100" d="M 170,20 L 170,38 M 205,20 L 205,38 M 240,20 L 240,38" strokeWidth="0.8" />
        </g>
    </svg>
);

export default function HeroAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const isAssembledRef = useRef(false);

    const [animationPhase, setAnimationPhase] = useState<'idle' | 'text-out' | 'icon-in' | 'icon-out' | 'text-in'>('idle');
    const [currentIcon, setCurrentIcon] = useState<'rocket' | 'plane' | 'train' | null>(null);

    const handleTextClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (animationPhase !== 'idle') return;

        const icons = ['rocket', 'plane', 'train'] as const;
        setCurrentIcon(icons[Math.floor(Math.random() * icons.length)]);

        // Phase 1: Text lines calculate and draw away
        setAnimationPhase('text-out');

        // Phase 2: Icon lines calculate and draw themselves on screen
        setTimeout(() => setAnimationPhase('icon-in'), 600);

        // Phase 3: Icon lines un-draw
        setTimeout(() => setAnimationPhase('icon-out'), 1600);

        // Phase 4: Text fluidly morphs in
        setTimeout(() => {
            setAnimationPhase('text-in');
        }, 2200);

        // Phase 5: Back to Idle
        setTimeout(() => {
            setAnimationPhase('idle');
            setCurrentIcon(null);
        }, 3000);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        let particles: PixelParticle[] = [];
        let animationFrameId: number;

        const targets = generateUITargets();

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            if (particles.length === 0) {
                particles = targets.map(t => new PixelParticle(canvas.width, canvas.height, t.offsetX, t.offsetY, t.color, t.size));
            } else {
                particles.forEach((p, i) => {
                    if (targets[i]) {
                        p.updateTarget(canvas.width, canvas.height, targets[i].offsetX, targets[i].offsetY);
                    }
                });
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

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const rect = canvas.getBoundingClientRect();
                mouseRef.current = {
                    x: e.touches[0].clientX - rect.left,
                    y: e.touches[0].clientY - rect.top
                };
            }
        };

        const handleTouchEnd = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        const animate = () => {
            ctx.fillStyle = BG_COLOR;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const { x: mouseX, y: mouseY } = mouseRef.current;
            const assembled = isAssembledRef.current;

            for (let i = 0; i < particles.length; i++) {
                particles[i].update(mouseX, mouseY, assembled, canvas.width, canvas.height);
                particles[i].draw(ctx);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resizeCanvas);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        // Touch events for mobile support
        canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
        canvas.addEventListener('touchend', handleTouchEnd);
        canvas.addEventListener('touchcancel', handleTouchEnd);

        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);

            canvas.removeEventListener('touchmove', handleTouchMove);
            canvas.removeEventListener('touchend', handleTouchEnd);
            canvas.removeEventListener('touchcancel', handleTouchEnd);

            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const isAnimating = animationPhase !== 'idle';

    const handleCanvasClick = () => {
        isAssembledRef.current = !isAssembledRef.current;
    };

    return (
        <div
            className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-auto select-none"
            onClick={handleCanvasClick}
        >
            <style>{styles}</style>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ display: 'block' }}
            />

            {/* Background hint text */}
            <div className="absolute bottom-8 right-8 text-xs text-slate-400/80 font-medium tracking-widest uppercase pointer-events-none transition-opacity">
                Click background to organize the chaos
            </div>

            <div
                className={`relative z-20 px-4 py-3 sm:px-10 sm:py-5 bg-[var(--color-dark)]/90 backdrop-blur-md rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer pointer-events-auto group text-center border ${isAnimating
                    ? 'scale-[1.10] shadow-[0_20px_60px_-15px_rgba(60,110,113,0.6)] border-[var(--color-teal)]/80'
                    : 'scale-100 shadow-2xl border-[var(--color-teal)]/30 hover:scale-105 hover:bg-[var(--color-dark)]'
                    }`}
                onClick={handleTextClick}
                title="Click me for a surprise!"
            >
                <h2 className="text-white text-[1.15rem] leading-tight sm:text-4xl lg:text-5xl font-extrabold tracking-tight transition-all duration-300 flex flex-row flex-wrap justify-center items-center gap-x-2 sm:gap-x-4">
                    <span>Welcome to my</span>
                    <span
                        className="text-[var(--color-primary)] relative inline-flex justify-center items-center h-[28px] sm:h-[48px] lg:h-[60px] w-[170px] sm:w-[320px] lg:w-[420px]"
                    >
                        {animationPhase === 'idle' && (
                            <span>Experience Bank</span>
                        )}
                        {animationPhase === 'text-out' && (
                            <span className="absolute inset-0 flex items-center justify-center">
                                <TextIcon phaseClass="text-draw-out" text="Experience Bank" />
                            </span>
                        )}
                        {animationPhase === 'icon-in' && (
                            <span className="absolute inset-0 flex items-center justify-center">
                                {currentIcon === 'rocket' && <RocketIcon phaseClass="icon-draw-in" />}
                                {currentIcon === 'plane' && <PlaneIcon phaseClass="icon-draw-in" />}
                                {currentIcon === 'train' && <TrainIcon phaseClass="icon-draw-in" />}
                            </span>
                        )}
                        {animationPhase === 'icon-out' && (
                            <span className="absolute inset-0 flex items-center justify-center">
                                {currentIcon === 'rocket' && <RocketIcon phaseClass="icon-draw-out" />}
                                {currentIcon === 'plane' && <PlaneIcon phaseClass="icon-draw-out" />}
                                {currentIcon === 'train' && <TrainIcon phaseClass="icon-draw-out" />}
                            </span>
                        )}
                        {animationPhase === 'text-in' && (
                            <span className="absolute inset-0 flex items-center justify-center">
                                <TextIcon phaseClass="text-draw-in" text="Experience Bank" />
                            </span>
                        )}
                    </span>
                </h2>
                <div className="absolute -bottom-6 w-full left-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="text-xs text-slate-500 font-bold tracking-widest uppercase bg-white/90 px-3 py-1 rounded-full shadow-sm">
                        Click Here
                    </span>
                </div>
            </div>
        </div>
    );
}
