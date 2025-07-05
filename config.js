const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let animationId;
let particles = [];
let rainDrops = [];
let smokeParticles = [];
let shadowFigures = [];
let stickman = { x: 100, y: 500, step: 0, direction: 1 };
let watermark = {
    x: 50,
    direction: 1,
    speed: 0.8
};
let time = 0;

let settings = {
    particleCount: 150,
    speed: 1,
    animationStyle: 'particles',
    mood: 'dark',
    cameraEffect: 'none'
};

const presets = {
    truecrime: { 
        mood: 'truecrime', 
        animationStyle: 'shadows', 
        speed: 0.8, 
        particleCount: 100 
    },
    horror: { 
        mood: 'horror', 
        animationStyle: 'glitch', 
        speed: 1.5, 
        particleCount: 200 
    },
    mysterious: { 
        mood: 'mysterious', 
        animationStyle: 'particles', 
        speed: 0.8, 
        particleCount: 200 
    },
    eerie: { 
        mood: 'eerie', 
        animationStyle: 'smoke', 
        speed: 1.2, 
        particleCount: 100 
    },
    dreamy: { 
        mood: 'dreamy', 
        animationStyle: 'cosmic', 
        speed: 0.6, 
        particleCount: 300 
    },
    tension: { 
        mood: 'tense', 
        animationStyle: 'noir', 
        speed: 1.5, 
        particleCount: 150 
    }
};

const moodColors = {
    dark: { 
        bg: ['#0a0a0a', '#1a1a2e', '#16213e'], 
        particles: [200, 220, 240] 
    },
    mysterious: { 
        bg: ['#1a0d2e', '#2e1a3e', '#3e2a4e'], 
        particles: [280, 300, 320] 
    },
    eerie: { 
        bg: ['#0d1a0a', '#1a2e1a', '#2e3e2a'], 
        particles: [100, 120, 140] 
    },
    dreamy: { 
        bg: ['#2e1a4e', '#4e2a6e', '#6e3a8e'], 
        particles: [300, 320, 340] 
    },
    tense: { 
        bg: ['#2e0a0a', '#4e1a1a', '#6e2a2a'], 
        particles: [0, 20, 40] 
    },
    truecrime: { 
        bg: ['#1a1a1a', '#2a2a2a', '#3a3a3a'], 
        particles: [30, 50, 70] 
    },
    horror: { 
        bg: ['#0a0a0a', '#1a0a0a', '#2a0505'], 
        particles: [0, 10, 20] 
    }
};