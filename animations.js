function resizeCanvas() {
    const aspectRatio = 9 / 16;
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    
    if (maxWidth / maxHeight > aspectRatio) {
        canvas.height = maxHeight;
        canvas.width = maxHeight * aspectRatio;
    } else {
        canvas.width = maxWidth;
        canvas.height = maxWidth / aspectRatio;
    }
    
    canvas.style.position = 'absolute';
    canvas.style.left = '50%';
    canvas.style.top = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';
    
    initParticles();
}

function initParticles() {
    particles = [];
    rainDrops = [];
    smokeParticles = [];
    shadowFigures = [];
    
    const adaptiveSettings = getAdaptiveSettings();
    
    // Enhanced particles with trails and life cycles
    for (let i = 0; i < adaptiveSettings.particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * adaptiveSettings.particleSize + 1,
            opacity: Math.random() * 0.8 + 0.2,
            hue: Math.random() * 60 + 200,
            life: Math.random() * 200 + 100,
            maxLife: Math.random() * 200 + 100,
            trail: []
        });
    }
    
    // Enhanced rain drops - always initialize regardless of animation style
    for (let i = 0; i < 100; i++) {
        rainDrops.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: Math.random() * 5 + 3,
            length: Math.random() * 20 + 10,
            opacity: Math.random() * 0.8 + 0.2
        });
    }
    
    // Enhanced smoke particles with rotation
    for (let i = 0; i < 80; i++) {
        smokeParticles.push({
            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * 100,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -Math.random() * 2 - 1,
            size: Math.random() * 20 + 5,
            opacity: Math.random() * 0.3 + 0.1,
            life: Math.random() * 100 + 50,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1
        });
    }
    
    // Enhanced shadow figures with actions
    for (let i = 0; i < 8; i++) {
        shadowFigures.push({
            x: Math.random() * canvas.width,
            y: canvas.height - 50,
            speed: Math.random() * 0.5 + 0.2,
            height: Math.random() * 40 + 60,
            opacity: Math.random() * 0.4 + 0.2,
            action: Math.random() > 0.5 ? 'walking' : 'standing',
            animationFrame: 0
        });
    }
    
    console.log('🎬 Particles initialized for animation style:', settings.animationStyle);
    console.log('  Particles:', particles.length);
    console.log('  Rain drops:', rainDrops.length);
    console.log('  Smoke particles:', smokeParticles.length);
    console.log('  Shadow figures:', shadowFigures.length);
}

function getMoodColors(mood) {
    return moodColors[mood] || moodColors.dark;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {r: 255, g: 255, b: 255};
}

function drawBackground() {
    const colors = getMoodColors(settings.mood);
    const currentBeat = getCurrentStoryBeat();
    const adaptiveSettings = getAdaptiveSettings();
    
    // Create dynamic gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, colors.bg[0]);
    gradient.addColorStop(0.5, colors.bg[1]);
    gradient.addColorStop(1, colors.bg[2]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Lightning flash effect for climax scenes
    if (lightningFlash > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${lightningFlash})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        lightningFlash -= 0.05;
    }
    
    // Random lightning during climax
    if (Math.random() < adaptiveSettings.lightningChance) {
        lightningFlash = 0.8;
    }
    
    // Scene transition fade
    if (sceneTransitionTimer > 0) {
        const fadeIntensity = sceneTransitionTimer / 60;
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeIntensity * 0.5})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        sceneTransitionTimer--;
    }
    
    // Atmospheric fog for mystery scenes
    if (currentBeat.type === 'mystery' || currentBeat.type === 'eerie') {
        drawFog(adaptiveSettings.fogDensity);
    }
}

function drawFog(density) {
    const colors = getMoodColors(settings.mood);
    
    for (let i = 0; i < 3; i++) {
        const y = canvas.height * 0.7 + i * 30;
        const waveOffset = Math.sin(time * 0.01 + i) * 50;
        
        ctx.fillStyle = `rgba(${hexToRgb(colors.fog).r}, ${hexToRgb(colors.fog).g}, ${hexToRgb(colors.fog).b}, ${density * 0.3})`;
        
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x < canvas.width; x += 20) {
            const waveY = y + Math.sin((x + waveOffset) * 0.01) * 20;
            ctx.lineTo(x, waveY);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
    }
}

function drawParticles() {
    const colors = getMoodColors(settings.mood);
    const currentBeat = getCurrentStoryBeat();
    const adaptiveSettings = getAdaptiveSettings();
    
    particles.forEach((particle, index) => {
        // Update particle position and life
        particle.x += particle.vx * adaptiveSettings.speed;
        particle.y += particle.vy * adaptiveSettings.speed;
        particle.life -= 1;
        
        // Respawn particle when life ends
        if (particle.life <= 0) {
            particle.x = Math.random() * canvas.width;
            particle.y = Math.random() * canvas.height;
            particle.life = particle.maxLife;
            particle.trail = [];
        }
        
        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        
        // Add to trail
        particle.trail.push({x: particle.x, y: particle.y});
        if (particle.trail.length > 5) particle.trail.shift();
        
        // Calculate dynamic properties
        const hue = colors.particles[0] + Math.sin(time * 0.01 + particle.x * 0.01) * 20;
        const lifeRatio = particle.life / particle.maxLife;
        const finalOpacity = particle.opacity * lifeRatio * adaptiveSettings.colorIntensity;
        
        // Enhanced glow effect for climax scenes
        if (currentBeat.type === 'climax') {
            ctx.shadowColor = `hsla(${hue}, 70%, 60%, 0.8)`;
            ctx.shadowBlur = 15;
        }
        
        // Draw particle trail
        particle.trail.forEach((point, trailIndex) => {
            const trailOpacity = finalOpacity * (trailIndex / particle.trail.length) * 0.3;
            ctx.beginPath();
            ctx.arc(point.x, point.y, particle.size * (trailIndex / particle.trail.length), 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${trailOpacity})`;
            ctx.fill();
        });
        
        // Draw main particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${finalOpacity})`;
        ctx.fill();
        
        // Additional glow ring for high intensity
        if (currentBeat.intensity > 0.7) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${finalOpacity * 0.1})`;
            ctx.fill();
        }
        
        ctx.shadowBlur = 0;
    });
}

function drawStickman() {
    const x = stickman.x;
    const y = stickman.y;
    const walkCycle = Math.sin(stickman.step * 0.3);
    const currentBeat = getCurrentStoryBeat();
    
    // Dynamic opacity based on story intensity
    const stickmanOpacity = currentBeat.intensity > 0.6 ? 0.9 : 0.6;
    
    ctx.strokeStyle = `rgba(255, 255, 255, ${stickmanOpacity})`;
    ctx.lineWidth = currentBeat.type === 'climax' ? 4 : 3;
    ctx.lineCap = 'round';
    
    // Glow effect during climax
    if (currentBeat.type === 'climax') {
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.shadowBlur = 10;
    }
    
    // Draw body
    ctx.beginPath();
    ctx.moveTo(x, y - 60);
    ctx.lineTo(x, y - 20);
    ctx.stroke();
    
    // Draw head
    ctx.beginPath();
    ctx.arc(x, y - 70, 10, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw arms with dynamic movement
    const armMovement = currentBeat.type === 'tension' ? walkCycle * 8 : walkCycle * 5;
    ctx.beginPath();
    ctx.moveTo(x, y - 50);
    ctx.lineTo(x - 15 + armMovement, y - 35);
    ctx.moveTo(x, y - 50);
    ctx.lineTo(x + 15 - armMovement, y - 35);
    ctx.stroke();
    
    // Draw legs with dynamic movement
    const legMovement = currentBeat.type === 'climax' ? walkCycle * 15 : walkCycle * 10;
    ctx.beginPath();
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x - 10 + legMovement, y);
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x + 10 - legMovement, y);
    ctx.stroke();
    
    // Update position with story-based speed
    const speedMultiplier = currentBeat.intensity > 0.7 ? 2 : 1;
    stickman.x += stickman.direction * settings.speed * speedMultiplier;
    stickman.step += settings.speed * speedMultiplier;
    
    if (stickman.x > canvas.width + 20) {
        stickman.x = -20;
    }
    
    ctx.shadowBlur = 0;
}

function drawGlitch() {
    const currentBeat = getCurrentStoryBeat();
    const glitchIntensity = currentBeat.type === 'horror' ? currentBeat.intensity : currentBeat.intensity * 0.5;
    
    const glitchLines = Math.floor(20 * glitchIntensity);
    
    for (let i = 0; i < glitchLines; i++) {
        const y = Math.random() * canvas.height;
        const height = Math.random() * 5 + 1;
        const offset = (Math.random() - 0.5) * 20 * glitchIntensity;
        
        ctx.fillStyle = `rgba(255, 0, 0, ${Math.random() * 0.4 * glitchIntensity})`;
        ctx.fillRect(offset, y, canvas.width, height);
        
        ctx.fillStyle = `rgba(0, 255, 0, ${Math.random() * 0.4 * glitchIntensity})`;
        ctx.fillRect(-offset, y + 1, canvas.width, height);
        
        ctx.fillStyle = `rgba(0, 0, 255, ${Math.random() * 0.4 * glitchIntensity})`;
        ctx.fillRect(offset * 0.5, y + 2, canvas.width, height);
    }
}

function drawNoir() {
    const currentBeat = getCurrentStoryBeat();
    const stripCount = 12;
    const stripHeight = canvas.height / stripCount;
    
    for (let i = 0; i < stripCount; i++) {
        const y = i * stripHeight;
        const baseOpacity = 0.3;
        const pulseOpacity = Math.sin(time * 0.01 + i * 0.5) * 0.2;
        const beatOpacity = currentBeat.intensity * 0.3;
        
        const finalOpacity = baseOpacity + pulseOpacity + beatOpacity;
        
        ctx.fillStyle = `rgba(0, 0, 0, ${Math.max(0, Math.min(0.8, finalOpacity))})`;
        ctx.fillRect(0, y, canvas.width, stripHeight);
        
        // Add tension lines
        if (i % 3 === 0 && currentBeat.type === 'tension') {
            ctx.fillStyle = `rgba(255, 255, 255, ${currentBeat.intensity * 0.1})`;
            ctx.fillRect(0, y, canvas.width, 2);
        }
    }
}

function drawRain() {
    const currentBeat = getCurrentStoryBeat();
    const rainIntensity = currentBeat.type === 'tension' ? currentBeat.intensity : 0.5;
    
    ctx.strokeStyle = `rgba(173, 216, 230, ${0.6 * rainIntensity})`;
    ctx.lineWidth = 1;
    
    rainDrops.forEach(drop => {
        drop.speed = (3 + Math.random() * 5) * rainIntensity;
        drop.y += drop.speed * settings.speed;
        
        if (drop.y > canvas.height) {
            drop.y = -drop.length;
            drop.x = Math.random() * canvas.width;
        }
        
        const windEffect = Math.sin(time * 0.02) * 2 * rainIntensity;
        
        ctx.globalAlpha = drop.opacity * rainIntensity;
        ctx.beginPath();
        ctx.moveTo(drop.x + windEffect, drop.y);
        ctx.lineTo(drop.x - 2 + windEffect, drop.y - drop.length);
        ctx.stroke();
        
        // Splash effects
        if (Math.random() < 0.01 * rainIntensity) {
            ctx.fillStyle = `rgba(173, 216, 230, ${0.3 * rainIntensity})`;
            ctx.beginPath();
            ctx.arc(drop.x, canvas.height - 5, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    
    ctx.globalAlpha = 1;
}

function drawGlitch() {
    const currentBeat = getCurrentStoryBeat();
    const glitchIntensity = currentBeat.type === 'horror' ? currentBeat.intensity : currentBeat.intensity * 0.5;
    
    const glitchLines = Math.floor(20 * glitchIntensity);
    
    for (let i = 0; i < glitchLines; i++) {
        const y = Math.random() * canvas.height;
        const height = Math.random() * 5 + 1;
        const offset = (Math.random() - 0.5) * 20 * glitchIntensity;
        
        ctx.fillStyle = `rgba(255, 0, 0, ${Math.random() * 0.4 * glitchIntensity})`;
        ctx.fillRect(offset, y, canvas.width, height);
        
        ctx.fillStyle = `rgba(0, 255, 0, ${Math.random() * 0.4 * glitchIntensity})`;
        ctx.fillRect(-offset, y + 1, canvas.width, height);
        
        ctx.fillStyle = `rgba(0, 0, 255, ${Math.random() * 0.4 * glitchIntensity})`;
        ctx.fillRect(offset * 0.5, y + 2, canvas.width, height);
    }
    
    // Random digital corruption effect
    if (Math.random() < 0.1 * glitchIntensity) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const shiftAmount = Math.floor(Math.random() * 10 - 5);
        
        for (let y = 0; y < canvas.height; y += 4) {
            const rowStart = y * canvas.width * 4;
            const rowEnd = (y + 1) * canvas.width * 4;
            
            if (Math.random() < 0.3) {
                for (let i = rowStart; i < rowEnd; i += 4) {
                    imageData.data[i] = Math.min(255, imageData.data[i] + shiftAmount);
                }
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
}

function drawNoir() {
    const currentBeat = getCurrentStoryBeat();
    const stripCount = 12;
    const stripHeight = canvas.height / stripCount;
    
    for (let i = 0; i < stripCount; i++) {
        const y = i * stripHeight;
        const baseOpacity = 0.3;
        const pulseOpacity = Math.sin(time * 0.01 + i * 0.5) * 0.2;
        const beatOpacity = currentBeat.intensity * 0.3;
        
        const finalOpacity = baseOpacity + pulseOpacity + beatOpacity;
        
        ctx.fillStyle = `rgba(0, 0, 0, ${Math.max(0, Math.min(0.8, finalOpacity))})`;
        ctx.fillRect(0, y, canvas.width, stripHeight);
        
        // Add tension lines
        if (i % 3 === 0 && currentBeat.type === 'tension') {
            ctx.fillStyle = `rgba(255, 255, 255, ${currentBeat.intensity * 0.1})`;
            ctx.fillRect(0, y, canvas.width, 2);
        }
    }
}

function drawSmoke() {
    const currentBeat = getCurrentStoryBeat();
    
    smokeParticles.forEach(smoke => {
        smoke.x += smoke.vx * settings.speed;
        smoke.y += smoke.vy * settings.speed;
        smoke.life -= settings.speed;
        smoke.rotation += smoke.rotationSpeed;
        
        if (smoke.life <= 0) {
            smoke.x = Math.random() * canvas.width;
            smoke.y = canvas.height + Math.random() * 100;
            smoke.life = Math.random() * 100 + 50;
        }
        
        const lifeRatio = smoke.life / 100;
        const alpha = smoke.opacity * lifeRatio * (currentBeat.intensity * 0.5 + 0.5);
        
        ctx.save();
        ctx.translate(smoke.x, smoke.y);
        ctx.rotate(smoke.rotation);
        ctx.globalAlpha = alpha;
        
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, smoke.size);
        if (currentBeat.type === 'horror') {
            gradient.addColorStop(0, 'rgba(100, 0, 0, 0.6)');
            gradient.addColorStop(1, 'rgba(169, 169, 169, 0)');
        } else {
            gradient.addColorStop(0, 'rgba(169, 169, 169, 0.6)');
            gradient.addColorStop(1, 'rgba(169, 169, 169, 0)');
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, smoke.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    });
}

function drawShadowFigures() {
    const currentBeat = getCurrentStoryBeat();
    
    shadowFigures.forEach(figure => {
        figure.animationFrame += settings.speed;
        
        const speedMultiplier = currentBeat.type === 'climax' ? 2 : 1;
        figure.x += figure.speed * settings.speed * speedMultiplier;
        
        if (figure.x > canvas.width + 50) {
            figure.x = -50;
            figure.height = Math.random() * 40 + 60;
            figure.action = Math.random() > 0.7 ? 'running' : 'walking';
        }
        
        const opacityVariation = currentBeat.type === 'eerie' ? 
            Math.sin(time * 0.05) * 0.2 : 0;
        const finalOpacity = figure.opacity + opacityVariation;
        
        ctx.fillStyle = `rgba(0, 0, 0, ${finalOpacity})`;
        
        if (figure.action === 'running') {
            const runCycle = Math.sin(figure.animationFrame * 0.3) * 15;
            ctx.fillRect(figure.x - 5, figure.y, 15, -figure.height);
            
            ctx.fillRect(figure.x - 8 + runCycle, figure.y - figure.height * 0.3, 4, figure.height * 0.3);
            ctx.fillRect(figure.x + 4 - runCycle, figure.y - figure.height * 0.3, 4, figure.height * 0.3);
        } else {
            const walkCycle = Math.sin(figure.animationFrame * 0.1) * 5;
            ctx.fillRect(figure.x, figure.y, 20, -figure.height);
            
            ctx.fillRect(figure.x - 5 + walkCycle, figure.y - figure.height * 0.3, 4, figure.height * 0.3);
            ctx.fillRect(figure.x + 15 - walkCycle, figure.y - figure.height * 0.3, 4, figure.height * 0.3);
        }
        
        ctx.beginPath();
        ctx.arc(figure.x + 10, figure.y - figure.height - 10, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Red eyes for horror scenes
        if (currentBeat.type === 'horror' && Math.random() < 0.02) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
            ctx.beginPath();
            ctx.arc(figure.x + 7, figure.y - figure.height - 8, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(figure.x + 13, figure.y - figure.height - 8, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

function drawCosmic() {
    const spiralCount = 3;
    const colors = getMoodColors(settings.mood);
    const currentBeat = getCurrentStoryBeat();
    
    for (let s = 0; s < spiralCount; s++) {
        const centerX = canvas.width * (0.2 + s * 0.3);
        const centerY = canvas.height * (0.3 + Math.sin(time * 0.01 + s) * 0.2);
        const radius = (100 + s * 50) * (0.5 + currentBeat.intensity * 0.5);
        
        for (let i = 0; i < 60; i++) {
            const angle = (time * 0.01 + i * 0.1 + s * 2) * settings.speed;
            const r = radius * (i / 60);
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            
            const hue = colors.particles[0] + i * 3 + time * 0.5;
            const opacity = ((60 - i) / 60) * 0.8 * currentBeat.intensity;
            const size = 2 + currentBeat.intensity * 2;
            
            ctx.shadowColor = `hsla(${hue}, 70%, 60%, 0.8)`;
            ctx.shadowBlur = 8;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${opacity})`;
            ctx.fill();
            
            // Revelation burst effect
            if (currentBeat.type === 'reveal' && i % 10 === 0) {
                ctx.beginPath();
                ctx.arc(x, y, size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${hue}, 70%, 80%, ${opacity * 0.2})`;
                ctx.fill();
            }
        }
    }
    
    ctx.shadowBlur = 0;
}

function applyCameraEffect() {
    const currentBeat = getCurrentStoryBeat();
    const adaptiveSettings = getAdaptiveSettings();
    
    // Story-driven camera shake
    if (adaptiveSettings.cameraShake > 0) {
        const shakeX = (Math.random() - 0.5) * adaptiveSettings.cameraShake;
        const shakeY = (Math.random() - 0.5) * adaptiveSettings.cameraShake;
        ctx.translate(shakeX, shakeY);
    }
    
    // Dynamic zoom for climax and reveal
    if (currentBeat.type === 'reveal' || currentBeat.type === 'climax') {
        const zoom = 1 + Math.sin(time * 0.02) * 0.05 * currentBeat.intensity;
        ctx.scale(zoom, zoom);
        ctx.translate(-canvas.width * (zoom - 1) / 2, -canvas.height * (zoom - 1) / 2);
    }
    
    // Drift effect for mystery
    if (currentBeat.type === 'mystery') {
        const driftX = Math.sin(time * 0.003) * 8;
        const driftY = Math.cos(time * 0.002) * 5;
        ctx.translate(driftX, driftY);
    }
    
    // Manual camera effects
    if (settings.cameraEffect === 'shake') {
        const shakeX = (Math.random() - 0.5) * 2;
        const shakeY = (Math.random() - 0.5) * 2;
        ctx.translate(shakeX, shakeY);
    } else if (settings.cameraEffect === 'zoom') {
        const zoom = 1 + Math.sin(time * 0.005) * 0.02;
        ctx.scale(zoom, zoom);
        ctx.translate(-canvas.width * (zoom - 1) / 2, -canvas.height * (zoom - 1) / 2);
    } else if (settings.cameraEffect === 'drift') {
        const driftX = Math.sin(time * 0.003) * 5;
        const driftY = Math.cos(time * 0.002) * 3;
        ctx.translate(driftX, driftY);
    }
}

// ENHANCED WATERMARK WITH ADVANCED COLLISION AND SKRONICLES BRANDING
function drawWatermark() {
    ctx.save();
    
    // Static corner watermark (subtle)
    ctx.font = 'bold 12px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('SKRONICLES PRO', canvas.width - 10, canvas.height - 10);
    
    // ENHANCED MOVING WATERMARK WITH COLLISION DETECTION
    const text = 'Made by Skronicles';
    const currentBeat = getCurrentStoryBeat();
    
    // Dynamic styling based on story beat
    ctx.font = `bold ${14 + currentBeat.intensity * 4}px Arial`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = 16 + currentBeat.intensity * 4;
    
    // Calculate watermark position
    watermark.y = canvas.height - 40 - textHeight;
    
    // Enhanced collision detection and movement
    watermark.x += watermark.speed * watermark.direction;
    
    // Collision with walls
    if (watermark.x <= 0) {
        watermark.x = 0;
        watermark.direction = 1;
        watermark.bounceCount++;
        watermark.glowIntensity = 0.8; // Glow on bounce
        console.log('💥 Skronicles watermark bounce #' + watermark.bounceCount);
    } else if (watermark.x >= canvas.width - textWidth) {
        watermark.x = canvas.width - textWidth;
        watermark.direction = -1;
        watermark.bounceCount++;
        watermark.glowIntensity = 0.8; // Glow on bounce
        console.log('💥 Skronicles watermark bounce #' + watermark.bounceCount);
    }
    
    // Reduce glow over time
    if (watermark.glowIntensity > 0.4) {
        watermark.glowIntensity -= 0.02;
    }
    
    // Dynamic effects
    const floatY = watermark.y + Math.sin(time * 0.02) * 3;
    const beatPulse = currentBeat.intensity * 0.3;
    const bounceGlow = watermark.glowIntensity;
    const finalOpacity = 0.4 + beatPulse + (bounceGlow * 0.4);
    
    // Enhanced visual effects
    const gradient = ctx.createLinearGradient(watermark.x, floatY - textHeight, watermark.x + textWidth, floatY);
    gradient.addColorStop(0, `rgba(0, 255, 255, ${finalOpacity})`);
    gradient.addColorStop(0.5, `rgba(255, 0, 255, ${finalOpacity})`);
    gradient.addColorStop(1, `rgba(0, 255, 255, ${finalOpacity})`);
    
    // Glow effect on bounce
    if (watermark.glowIntensity > 0.6) {
        ctx.shadowColor = 'rgba(0, 255, 255, 0.8)';
        ctx.shadowBlur = 15;
    }
    
    // Background stroke for readability
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.lineWidth = 3;
    ctx.strokeText(text, watermark.x, floatY);
    
    // Main text with gradient
    ctx.fillStyle = gradient;
    ctx.fillText(text, watermark.x, floatY);
    
    // Reset shadow
    ctx.shadowBlur = 0;
    
    // Speed variation based on story intensity
    watermark.speed = 1.2 + (currentBeat.intensity * 0.8);
    
    ctx.restore();
}

function animate() {
    ctx.save();
    applyCameraEffect();
    
    drawBackground();
    
    // SIMPLE DIRECT ANIMATION SWITCHING - Just like your original!
    switch (settings.animationStyle) {
        case 'particles':
            drawParticles();
            break;
        case 'stickman':
            drawParticles();
            drawStickman();
            break;
        case 'shadows':
            drawParticles();
            drawShadowFigures();
            break;
        case 'glitch':
            drawParticles();
            drawGlitch();
            break;
        case 'noir':
            drawParticles();
            drawNoir();
            break;
        case 'cosmic':
            drawCosmic();
            break;
        case 'rain':
            drawParticles();
            drawRain();
            break;
        case 'smoke':
            drawSmoke();
            break;
        // Handle preset animation styles by converting them to basic ones
        case 'investigation':
        case 'enigma':
            drawParticles();
            drawShadowFigures();
            break;
        case 'supernatural':
        case 'haunted':
            drawParticles();
            drawShadowFigures();
            break;
        case 'ethereal':
            drawCosmic();
            break;
        case 'thriller':
            drawParticles();
            drawNoir();
            break;
        default:
            drawParticles();
            break;
    }
    
    drawWatermark();
    
    ctx.restore();
    
    time++;
    animationId = requestAnimationFrame(animate);
}