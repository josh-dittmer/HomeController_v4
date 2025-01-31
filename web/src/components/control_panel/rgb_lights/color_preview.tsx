'use client';

import { createRef, useEffect, useState } from "react";

export default function ColorPreview({ r, g, b }: { r: number, b: number, g: number }) {
    const [windowWidth, setWindowWidth] = useState<number>();

    const ref = createRef<HTMLCanvasElement>();

    useEffect(() => {
        setWindowWidth(window.innerWidth);

        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas || !windowWidth) {
            return;
        }

        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }

        context.canvas.width = canvas.getBoundingClientRect().width;
        context.canvas.height = canvas.getBoundingClientRect().height;

        const RECT_WIDTH = 10;
        const NUM_RECTS = canvas.width / RECT_WIDTH;

        for (let i = 0; i < NUM_RECTS; i += 2) {
            context.fillStyle = `rgb(${r} ${g} ${b})`;
            context.fillRect(i * RECT_WIDTH, 0, RECT_WIDTH, context.canvas.height);
        }
    }, [ref, r, g, b, windowWidth])

    return (
        <div style={{ boxShadow: `0 0 50px 3px rgb(${r}, ${g}, ${b})` }}>
            <canvas className="w-full h-1" ref={ref} />
        </div>
    );
}