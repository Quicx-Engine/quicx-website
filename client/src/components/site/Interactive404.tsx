"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ChevronRight, Home, Book } from "lucide-react";
import { cn } from "@/lib/utils";

export function Interactive404() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState("");
  const [showError, setShowError] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const targetText = 'quicx get task "route_404"';
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle Parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate normalized mouse position (-1 to 1)
      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;
      
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle Typing Animation
  useEffect(() => {
    let currentText = "";
    let currentIndex = 0;
    
    // Initial delay before typing starts
    const startDelay = setTimeout(() => {
      const typingInterval = setInterval(() => {
        if (currentIndex < targetText.length) {
          currentText += targetText[currentIndex];
          setTypedText(currentText);
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          // Show error shortly after typing finishes
          setTimeout(() => setShowError(true), 400);
          // Show options after error
          setTimeout(() => setShowOptions(true), 1200);
        }
      }, 50); // Typing speed
      
      return () => clearInterval(typingInterval);
    }, 500);
    
    return () => clearTimeout(startDelay);
  }, [targetText]);

  return (
    <div 
      ref={containerRef}
      className="relative flex min-h-[75vh] w-full flex-col items-center justify-center overflow-hidden"
    >
      {/* Deep Background Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[600px] -translate-y-1/2 bg-[radial-gradient(ellipse_40%_40%_at_50%_50%,rgba(255,87,0,0.1),transparent_70%)]" />

      {/* Massive 404 Background (Parallax) */}
      <div 
        className="pointer-events-none absolute select-none text-center font-[family-name:var(--font-anton)] text-[30vw] leading-none text-white/[0.03] sm:text-[250px]"
        style={{
          transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        404
      </div>

      {/* Interactive Terminal Block */}
      <div 
        className="relative z-10 w-full max-w-2xl px-6"
        style={{
          transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className="overflow-hidden rounded-xl border border-quicx-line bg-[#061219]/80 shadow-2xl backdrop-blur-md">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 border-b border-quicx-line bg-white/[0.02] px-4 py-3">
            <div className="size-3 rounded-full bg-red-500/80" />
            <div className="size-3 rounded-full bg-yellow-500/80" />
            <div className="size-3 rounded-full bg-green-500/80" />
            <span className="ml-2 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-quicx-dim">
              quicx-engine — v1.0.0
            </span>
          </div>
          
          {/* Terminal Body */}
          <div className="flex min-h-[220px] flex-col p-5 font-[family-name:var(--font-jetbrains-mono)] text-[14px]">
            <div className="flex items-center text-quicx-text">
              <span className="mr-3 text-quicx-orange">user@host:~$</span>
              <span>{typedText}</span>
              {!showOptions && (
                <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-quicx-orange-bright" />
              )}
            </div>

            {showError && (
              <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <span className="text-red-400">[FATAL]</span> Task not found in the queue. 
                <br />
                <span className="text-quicx-dim">The route may have been dropped or consumed by an unknown worker.</span>
              </div>
            )}

            {showOptions && (
              <div className="mt-8 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-[12px] text-quicx-dim">Available recovery actions:</div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link 
                    href="/"
                    className="group flex flex-1 items-center justify-between rounded-md border border-quicx-line bg-white/[0.02] px-4 py-3 text-quicx-muted transition-all hover:border-quicx-orange/50 hover:bg-quicx-orange/10 hover:text-quicx-orange-bright"
                  >
                    <div className="flex items-center gap-3">
                      <Home className="size-4" />
                      <span>cd /home</span>
                    </div>
                    <ChevronRight className="size-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>

                  <Link 
                    href="/docs"
                    className="group flex flex-1 items-center justify-between rounded-md border border-quicx-line bg-white/[0.02] px-4 py-3 text-quicx-muted transition-all hover:border-quicx-orange/50 hover:bg-quicx-orange/10 hover:text-quicx-orange-bright"
                  >
                    <div className="flex items-center gap-3">
                      <Book className="size-4" />
                      <span>cd /docs</span>
                    </div>
                    <ChevronRight className="size-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
