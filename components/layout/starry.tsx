'use client';

import React from 'react';

export default function StarryBackground() {
  return (
    <div className="fixed inset-0 z-[-1] bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(2px 2px at 40px 60px, #ccc 50%, rgba(0,0,0,0)), radial-gradient(2px 2px at 20px 50px, white 50%, rgba(0,0,0,0)), radial-gradient(2px 2px at 30px 100px, #ddd 50%, rgba(0,0,0,0)), radial-gradient(2px 2px at 40px 60px, white 50%, rgba(0,0,0,0)), radial-gradient(2px 2px at 110px 90px, #ccc 50%, rgba(0,0,0,0))',
        backgroundSize: '550px 550px, 350px 350px, 250px 250px, 150px 150px',
        animation: 'starsAnimation 120s linear infinite',
      }} />
    </div>
  );
}