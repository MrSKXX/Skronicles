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
    y: 0,
    direction: 1,
    speed: 1.2,
    bounceCount: 0,
    glowIntensity: 0.4
};
let time = 0;

// Story Intelligence Variables
let currentStoryText = '';
let storyBeats = [];
let currentBeatIndex = 0;
let beatTimer = 0;
let sceneTransitionTimer = 0;
let cameraShakeIntensity = 0;
let lightningFlash = 0;
let fogDensity = 0.3;

let settings = {
    particleCount: 150,
    speed: 1,
    animationStyle: 'particles',
    mood: 'dark',
    cameraEffect: 'none',
    storyMode: false,
    autoSceneChange: true,
    intensityMultiplier: 1.0
};

// Enhanced presets with story intelligence
const presets = {
    truecrime: { 
        mood: 'truecrime', 
        animationStyle: 'investigation', 
        speed: 0.8, 
        particleCount: 120,
        storyMode: true,
        autoSceneChange: true
    },
    horror: { 
        mood: 'horror', 
        animationStyle: 'supernatural', 
        speed: 1.2, 
        particleCount: 200,
        storyMode: true,
        autoSceneChange: true
    },
    mysterious: { 
        mood: 'mysterious', 
        animationStyle: 'enigma', 
        speed: 0.9, 
        particleCount: 180,
        storyMode: true,
        autoSceneChange: true
    },
    eerie: { 
        mood: 'eerie', 
        animationStyle: 'haunted', 
        speed: 1.1, 
        particleCount: 150,
        storyMode: true,
        autoSceneChange: true
    },
    dreamy: { 
        mood: 'dreamy', 
        animationStyle: 'ethereal', 
        speed: 0.6, 
        particleCount: 250,
        storyMode: true,
        autoSceneChange: true
    },
    tension: { 
        mood: 'tense', 
        animationStyle: 'thriller', 
        speed: 1.4, 
        particleCount: 180,
        storyMode: true,
        autoSceneChange: true
    }
};

// Enhanced mood colors with fog and accent colors
const moodColors = {
    dark: { 
        bg: ['#0a0a0a', '#1a1a2e', '#16213e'], 
        particles: [200, 220, 240],
        accent: '#4a9eff',
        fog: '#2a2a4a'
    },
    mysterious: { 
        bg: ['#1a0d2e', '#2e1a3e', '#3e2a4e'], 
        particles: [280, 300, 320],
        accent: '#8a4fff',
        fog: '#4a2a6a'
    },
    eerie: { 
        bg: ['#0d1a0a', '#1a2e1a', '#2e3e2a'], 
        particles: [100, 120, 140],
        accent: '#4aff6a',
        fog: '#2a4a3a'
    },
    dreamy: { 
        bg: ['#2e1a4e', '#4e2a6e', '#6e3a8e'], 
        particles: [300, 320, 340],
        accent: '#ff8aff',
        fog: '#6a4a8a'
    },
    tense: { 
        bg: ['#2e0a0a', '#4e1a1a', '#6e2a2a'], 
        particles: [0, 20, 40],
        accent: '#ff4a4a',
        fog: '#6a2a2a'
    },
    truecrime: { 
        bg: ['#1a1a1a', '#2a2a2a', '#3a3a3a'], 
        particles: [30, 50, 70],
        accent: '#ffa54a',
        fog: '#4a4a4a'
    },
    horror: { 
        bg: ['#0a0a0a', '#1a0a0a', '#2a0505'], 
        particles: [0, 10, 20],
        accent: '#ff2a2a',
        fog: '#4a1a1a'
    }
};

// Story keyword detection for AI analysis
const storyKeywords = {
    setup: ['began', 'started', 'once', 'lived', 'worked', 'normal', 'ordinary', 'typical', 'everyday'],
    tension: ['suddenly', 'strange', 'weird', 'noticed', 'heard', 'saw', 'felt', 'something', 'wrong'],
    climax: ['screamed', 'ran', 'attacked', 'died', 'killed', 'blood', 'terror', 'horror', 'panic'],
    mystery: ['mystery', 'unknown', 'disappeared', 'vanished', 'question', 'wonder', 'puzzle', 'secret'],
    reveal: ['discovered', 'found', 'revealed', 'truth', 'answer', 'hidden', 'exposed', 'realized'],
    ending: ['never', 'still', 'remains', 'today', 'haunts', 'remember', 'legend', 'forever']
};

// Scene configuration for different story beats
const sceneConfigs = {
    setup: {
        duration: 8000,
        particleIntensity: 0.3,
        cameraMovement: 'gentle_drift',
        effects: ['soft_particles', 'calm_atmosphere'],
        colors: { intensity: 0.4, saturation: 0.6 }
    },
    tension: {
        duration: 6000,
        particleIntensity: 0.6,
        cameraMovement: 'subtle_shake',
        effects: ['building_particles', 'tension_lines'],
        colors: { intensity: 0.7, saturation: 0.8 }
    },
    climax: {
        duration: 4000,
        particleIntensity: 1.0,
        cameraMovement: 'intense_shake',
        effects: ['chaos_particles', 'lightning_flash', 'screen_distortion'],
        colors: { intensity: 1.0, saturation: 1.0 }
    },
    mystery: {
        duration: 7000,
        particleIntensity: 0.5,
        cameraMovement: 'slow_zoom',
        effects: ['swirling_fog', 'question_particles'],
        colors: { intensity: 0.6, saturation: 0.7 }
    },
    reveal: {
        duration: 5000,
        particleIntensity: 0.8,
        cameraMovement: 'dramatic_zoom',
        effects: ['burst_particles', 'revelation_light'],
        colors: { intensity: 0.9, saturation: 0.9 }
    },
    ending: {
        duration: 10000,
        particleIntensity: 0.2,
        cameraMovement: 'fade_out',
        effects: ['gentle_descent', 'peaceful_glow'],
        colors: { intensity: 0.3, saturation: 0.5 }
    }
};

// Story Analysis Functions
function analyzeStoryBeats(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const beats = [];
    
    sentences.forEach((sentence, index) => {
        const words = sentence.toLowerCase().split(' ');
        let beatType = 'setup';
        let intensity = 0.3;
        
        // Analyze keywords to determine beat type and intensity
        for (const [type, keywords] of Object.entries(storyKeywords)) {
            const matches = keywords.filter(keyword => 
                words.some(word => word.includes(keyword))
            ).length;
            
            if (matches > 0) {
                beatType = type;
                intensity = Math.min(0.2 + (matches * 0.2), 1.0);
                break;
            }
        }
        
        // Increase intensity toward the end of the story
        const position = index / sentences.length;
        if (position > 0.7) intensity = Math.max(intensity, 0.6);
        if (position > 0.8) intensity = Math.max(intensity, 0.8);
        
        beats.push({
            type: beatType,
            intensity: intensity,
            text: sentence.trim(),
            duration: sceneConfigs[beatType]?.duration || 6000,
            timestamp: index * 3000
        });
    });
    
    // Ensure we always have at least one beat
    if (beats.length === 0) {
        beats.push({
            type: 'setup',
            intensity: 0.3,
            text: text,
            duration: 8000,
            timestamp: 0
        });
    }
    
    return beats;
}

function updateStoryAnalysis(text) {
    currentStoryText = text;
    storyBeats = analyzeStoryBeats(text);
    currentBeatIndex = 0;
    beatTimer = 0;
    
    console.log('🎬 Story Analysis Complete:');
    console.log(`- Found ${storyBeats.length} story beats`);
    console.log('- Beat types:', storyBeats.map(b => b.type).join(', '));
    console.log('- Intensity range:', 
        Math.min(...storyBeats.map(b => b.intensity)).toFixed(1),
        'to',
        Math.max(...storyBeats.map(b => b.intensity)).toFixed(1)
    );
}

function getCurrentStoryBeat() {
    if (!settings.storyMode || storyBeats.length === 0) {
        return { type: 'setup', intensity: 0.3 };
    }
    
    if (settings.autoSceneChange) {
        beatTimer += 16; // 60fps = ~16ms per frame
        
        if (currentBeatIndex < storyBeats.length - 1) {
            const currentBeat = storyBeats[currentBeatIndex];
            if (beatTimer >= currentBeat.duration) {
                currentBeatIndex++;
                beatTimer = 0;
                sceneTransitionTimer = 60; // 1 second transition
                
                console.log(`🎬 Scene transition to: ${storyBeats[currentBeatIndex].type}`);
            }
        }
    }
    
    return storyBeats[currentBeatIndex] || storyBeats[0];
}

function getAdaptiveSettings() {
    const currentBeat = getCurrentStoryBeat();
    const config = sceneConfigs[currentBeat.type];
    
    const adaptiveIntensity = currentBeat.intensity * settings.intensityMultiplier;
    
    return {
        particleCount: Math.floor(settings.particleCount * (0.5 + adaptiveIntensity)),
        speed: settings.speed * (0.5 + adaptiveIntensity),
        cameraShake: adaptiveIntensity > 0.7 ? (adaptiveIntensity - 0.7) * 10 : 0,
        lightningChance: currentBeat.type === 'climax' ? 0.05 : 0,
        fogDensity: currentBeat.type === 'mystery' ? 0.6 : 0.3,
        particleSize: 1 + (adaptiveIntensity * 2),
        colorIntensity: config?.colors?.intensity || 0.5
    };
}