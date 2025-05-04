"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

// Desktop version - optimized for mouse interaction
const DesktopStarry: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d")!;

    console.log("Current theme:", theme);

    const prefersDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDarkMode =
      theme === "dark" || (theme === undefined && prefersDarkMode);
    const STAR_COLOR = isDarkMode ? "#FFFF00" : "#1a85ff";

    const STAR_SIZE = 3;
    const STAR_MIN_SCALE = 0.2;
    const OVERFLOW_THRESHOLD = 100;
    const STAR_COUNT = (window.innerWidth + window.innerHeight) / 8;

    let scale = 1;
    let width: number;
    let height: number;

    let stars: Array<{ x: number; y: number; z: number }> = [];
    let pointerX: number | null = null;
    let pointerY: number | null = null;
    let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.001 };

    function generate() {
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: 0,
          y: 0,
          z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE),
        });
      }
    }

    function placeStar(star: { x: number; y: number; z: number }) {
      star.x = Math.random() * width;
      star.y = Math.random() * height;
    }

    function recycleStar(star: { x: number; y: number; z: number }) {
      let direction = "z";

      let vx = Math.abs(velocity.x);
      let vy = Math.abs(velocity.y);

      if (vx > 1 || vy > 1) {
        let axis;

        if (vx > vy) {
          axis = Math.random() < vx / (vx + vy) ? "h" : "v";
        } else {
          axis = Math.random() < vy / (vx + vy) ? "v" : "h";
        }

        if (axis === "h") {
          direction = velocity.x > 0 ? "l" : "r";
        } else {
          direction = velocity.y > 0 ? "t" : "b";
        }
      }

      star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);

      if (direction === "z") {
        star.z = 0.1;
        star.x = Math.random() * width;
        star.y = Math.random() * height;
      } else if (direction === "l") {
        star.x = -OVERFLOW_THRESHOLD;
        star.y = height * Math.random();
      } else if (direction === "r") {
        star.x = width + OVERFLOW_THRESHOLD;
        star.y = height * Math.random();
      } else if (direction === "t") {
        star.x = width * Math.random();
        star.y = -OVERFLOW_THRESHOLD;
      } else if (direction === "b") {
        star.x = width * Math.random();
        star.y = height + OVERFLOW_THRESHOLD;
      }
    }

    function resize() {
      scale = window.devicePixelRatio || 1;

      width = window.innerWidth * scale;
      height = window.innerHeight * scale;

      canvas.width = width;
      canvas.height = height;

      stars.forEach(placeStar);
    }

    function step() {
      context.clearRect(0, 0, width, height);

      update();
      render();

      requestAnimationFrame(step);
    }

    function update() {
      velocity.tx *= 0.97;
      velocity.ty *= 0.97;

      velocity.x += (velocity.tx - velocity.x) * 0.9;
      velocity.y += (velocity.ty - velocity.y) * 0.9;

      stars.forEach((star) => {
        star.x += velocity.x * star.z;
        star.y += velocity.y * star.z;

        star.x += (star.x - width / 2) * velocity.z * star.z;
        star.y += (star.y - height / 2) * velocity.z * star.z;
        star.z += velocity.z;

        if (
          star.x < -OVERFLOW_THRESHOLD ||
          star.x > width + OVERFLOW_THRESHOLD ||
          star.y < -OVERFLOW_THRESHOLD ||
          star.y > height + OVERFLOW_THRESHOLD
        ) {
          recycleStar(star);
        }
      });
    }

    function render() {
      stars.forEach((star) => {
        context.beginPath();
        context.lineCap = "round";
        context.lineWidth = STAR_SIZE * star.z * scale;
        context.globalAlpha = 0.5 + 0.5 * Math.random();
        context.strokeStyle = STAR_COLOR;

        context.beginPath();
        context.moveTo(star.x, star.y);

        let tailX = velocity.x * 2;
        let tailY = velocity.y * 2;

        if (Math.abs(tailX) < 0.1) tailX = 0.5;
        if (Math.abs(tailY) < 0.1) tailY = 0.5;

        context.lineTo(star.x + tailX, star.y + tailY);
        context.stroke();
      });
    }

    function movePointer(x: number, y: number) {
      x = x * scale;
      y = y * scale;

      if (typeof pointerX === "number" && typeof pointerY === "number") {
        let ox = x - pointerX;
        let oy = y - pointerY;

        const sensitivity = 0.02;
        velocity.tx += ox * sensitivity * -1;
        velocity.ty += oy * sensitivity * -1;
      }

      pointerX = x;
      pointerY = y;
    }

    function onMouseMove(event: MouseEvent) {
      movePointer(event.clientX, event.clientY);
    }

    function onMouseLeave() {
      pointerX = null;
      pointerY = null;
    }

    generate();
    resize();
    step();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseleave", onMouseLeave);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
};

// Mobile version - optimized for touch and performance
const MobileStarry: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d")!;

    console.log("Current theme (mobile):", theme);

    const prefersDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDarkMode =
      theme === "dark" || (theme === undefined && (prefersDarkMode || true));
    const STAR_COLOR = isDarkMode ? "#FFFF00" : "#1a85ff"; // Default to yellow on mobile

    const STAR_SIZE = 3;
    const STAR_MIN_SCALE = 0.2;
    const OVERFLOW_THRESHOLD = 50;
    const STAR_COUNT = (window.innerWidth + window.innerHeight) / 10; // Fewer stars for performance

    let scale = 1;
    let width: number;
    let height: number;

    let stars: Array<{ x: number; y: number; z: number }> = [];
    let pointerX: number | null = null;
    let pointerY: number | null = null;
    let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.002 }; // Doubled from 0.001 to 0.002
    let touchInput = false;
    let lastTouchTime = 0;
    let lastTouchX = 0;
    let lastTouchY = 0;

    function generate() {
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: 0,
          y: 0,
          z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE),
        });
      }
    }

    function placeStar(star: { x: number; y: number; z: number }) {
      star.x = Math.random() * width;
      star.y = Math.random() * height;
    }

    function recycleStar(star: { x: number; y: number; z: number }) {
      let direction = "z";

      let vx = Math.abs(velocity.x);
      let vy = Math.abs(velocity.y);

      if (vx > 1 || vy > 1) {
        let axis;

        if (vx > vy) {
          axis = Math.random() < vx / (vx + vy) ? "h" : "v";
        } else {
          axis = Math.random() < vy / (vx + vy) ? "v" : "h";
        }

        if (axis === "h") {
          direction = velocity.x > 0 ? "l" : "r";
        } else {
          direction = velocity.y > 0 ? "t" : "b";
        }
      }

      star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);

      if (direction === "z") {
        star.z = 0.1;
        star.x = Math.random() * width;
        star.y = Math.random() * height;
      } else if (direction === "l") {
        star.x = -OVERFLOW_THRESHOLD;
        star.y = height * Math.random();
      } else if (direction === "r") {
        star.x = width + OVERFLOW_THRESHOLD;
        star.y = height * Math.random();
      } else if (direction === "t") {
        star.x = width * Math.random();
        star.y = -OVERFLOW_THRESHOLD;
      } else if (direction === "b") {
        star.x = width * Math.random();
        star.y = height + OVERFLOW_THRESHOLD;
      }
    }

    function resize() {
      scale = window.devicePixelRatio || 1;

      width = window.innerWidth * scale;
      height = window.innerHeight * scale;

      canvas.width = width;
      canvas.height = height;

      stars.forEach(placeStar);
    }

    function step() {
      context.clearRect(0, 0, width, height);

      update();
      render();

      requestAnimationFrame(step);
    }

    function update() {
      // Slower decay for more persistent movement
      velocity.tx *= 0.99; // Changed from 0.98 for faster movement
      velocity.ty *= 0.99; // Changed from 0.98 for faster movement

      // Faster acceleration
      velocity.x += (velocity.tx - velocity.x) * 0.95; // Changed from 0.9 for faster response
      velocity.y += (velocity.ty - velocity.y) * 0.95; // Changed from 0.9 for faster response

      stars.forEach((star) => {
        star.x += velocity.x * star.z;
        star.y += velocity.y * star.z;

        star.x += (star.x - width / 2) * velocity.z * star.z;
        star.y += (star.y - height / 2) * velocity.z * star.z;
        star.z += velocity.z;

        if (
          star.x < -OVERFLOW_THRESHOLD ||
          star.x > width + OVERFLOW_THRESHOLD ||
          star.y < -OVERFLOW_THRESHOLD ||
          star.y > height + OVERFLOW_THRESHOLD
        ) {
          recycleStar(star);
        }
      });
    }

    function render() {
      stars.forEach((star) => {
        context.beginPath();
        context.lineCap = "round";
        context.lineWidth = STAR_SIZE * star.z * scale;
        context.globalAlpha = 0.5 + 0.5 * Math.random();
        context.strokeStyle = STAR_COLOR;

        context.beginPath();
        context.moveTo(star.x, star.y);

        let tailX = velocity.x * 2;
        let tailY = velocity.y * 2;

        if (Math.abs(tailX) < 0.1) tailX = 0.5;
        if (Math.abs(tailY) < 0.1) tailY = 0.5;

        context.lineTo(star.x + tailX, star.y + tailY);
        context.stroke();
      });
    }

    function movePointer(x: number, y: number) {
      x = x * scale;
      y = y * scale;

      if (typeof pointerX === "number" && typeof pointerY === "number") {
        let ox = x - pointerX;
        let oy = y - pointerY;

        // Higher sensitivity for mobile
        const sensitivity = 0.25; // Increased from 0.15 for faster response

        // Calculate velocity based on movement speed
        const now = Date.now();
        const dt = Math.min(50, now - lastTouchTime);

        if (dt > 0) {
          const speedFactor = 2.5 / dt; // Increased from 1.5 for faster movement
          velocity.tx = ox * speedFactor;
          velocity.ty = oy * speedFactor;
        }

        lastTouchTime = now;
      }

      pointerX = x;
      pointerY = y;
    }

    function onTouchMove(event: TouchEvent) {
      const touch = event.touches[0];
      movePointer(touch.clientX, touch.clientY);
    }

    function onTouchStart(event: TouchEvent) {
      const touch = event.touches[0];
      lastTouchX = touch.clientX * scale;
      lastTouchY = touch.clientY * scale;
      lastTouchTime = Date.now();
      pointerX = lastTouchX;
      pointerY = lastTouchY;

      // Add initial velocity on touch start
      velocity.tx = (Math.random() - 0.5) * 15; // Increased from 10 for faster initial movement
      velocity.ty = (Math.random() - 0.5) * 15; // Increased from 10 for faster initial movement
    }

    function onTouchEnd() {
      pointerX = null;
      pointerY = null;
    }

    // Add automatic gentle movement for mobile
    function addRandomMovement() {
      velocity.tx += (Math.random() - 0.5) * 0.6; // Doubled from 0.3 for more noticeable movement
      velocity.ty += (Math.random() - 0.5) * 0.6; // Doubled from 0.3 for more noticeable movement

      setTimeout(addRandomMovement, 1500 + Math.random() * 2000); // Reduced timing for more frequent updates
    }

    generate();
    resize();
    step();
    addRandomMovement(); // Start gentle automatic movement

    window.addEventListener("resize", resize);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
};

// Main component that decides which version to render
const StarryBackground: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Listen for resize events
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Render the appropriate version
  return isMobile ? <MobileStarry /> : <DesktopStarry />;
};

export default StarryBackground;
