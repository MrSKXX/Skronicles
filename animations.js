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
    
    for (let i = 0; i < settings.particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.8 + 0.2,
            hue: Math.random() * 60 + 200
        });
    }
    
    for (let i = 0; i < 100; i++) {
        rainDrops.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: Math.random() * 5 + 3,
            length: Math.random() * 20 + 10
        });
    }
    
    for (let i = 0; i < 80; i++) {
        smokeParticles.push({
            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * 100,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -Math.random() * 2 - 1,
            size: Math.random() * 20 + 5,
            opacity: Math.random() * 0.3 + 0.1,
            life: Math.random() * 100 + 50
        });
    }
    
    for (let i = 0; i < 5; i++) {
        shadowFigures.push({
            x: Math.random() * canvas.width,
            y: canvas.height - 50,
            speed: Math.random() * 0.5 + 0.2,
            height: Math.random() * 40 + 60,
            opacity: Math.random() * 0.4 + 0.2
        });
    }
}

function getMoodColors(mood) {
    return moodColors[mood] || moodColors.dark;
}

function drawBackground() {
    const colors = getMoodColors(settings.mood);
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, colors.bg[0]);
    gradient.addColorStop(0.5, colors.bg[1]);
    gradient.addColorStop(1, colors.bg[2]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawParticles() {
    const colors = getMoodColors(settings.mood);
    
    particles.forEach(particle => {
        particle.x += particle.vx * settings.speed;
        particle.y += particle.vy * settings.speed;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        
        const hue = colors.particles[0] + Math.sin(time * 0.01 + particle.x * 0.01) * 20;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${particle.opacity})`;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${particle.opacity * 0.1})`;
        ctx.fill();
    });
}

function drawStickman() {
    const x = stickman.x;
    const y = stickman.y;
    const walkCycle = Math.sin(stickman.step * 0.3);
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(x, y - 60);
    ctx.lineTo(x, y - 20);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(x, y - 70, 10, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x, y - 50);
    ctx.lineTo(x - 15 + walkCycle * 5, y - 35);
    ctx.moveTo(x, y - 50);
    ctx.lineTo(x + 15 - walkCycle * 5, y - 35);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x - 10 + walkCycle * 10, y);
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x + 10 - walkCycle * 10, y);
    ctx.stroke();
    
    stickman.x += stickman.direction * settings.speed;
    stickman.step += settings.speed;
    
    if (stickman.x > canvas.width + 20) {
        stickman.x = -20;
    }
}

function drawGlitch() {
    const glitchLines = 20;
    for (let i = 0; i < glitchLines; i++) {
        const y = Math.random() * canvas.height;
        const height = Math.random() * 5 + 1;
        const offset = (Math.random() - 0.5) * 10;
        
        ctx.fillStyle = `rgba(255, 0, 0, ${Math.random() * 0.3})`;
        ctx.fillRect(offset, y, canvas.width, height);
        
        ctx.fillStyle = `rgba(0, 255, 0, ${Math.random() * 0.3})`;
        ctx.fillRect(-offset, y + 1, canvas.width, height);
    }
}

function drawNoir() {
    const stripCount = 8;
    const stripHeight = canvas.height / stripCount;
    
    for (let i = 0; i < stripCount; i++) {
        const y = i * stripHeight;
        const opacity = Math.sin(time * 0.01 + i * 0.5) * 0.2 + 0.3;
        
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        ctx.fillRect(0, y, canvas.width, stripHeight);
    }
}

function drawRain() {
    ctx.strokeStyle = 'rgba(173, 216, 230, 0.6)';
    ctx.lineWidth = 1;
    
    rainDrops.forEach(drop => {
        drop.y += drop.speed * settings.speed;
        
        if (drop.y > canvas.height) {
            drop.y = -drop.length;
            drop.x = Math.random() * canvas.width;
        }
        
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 2, drop.y - drop.length);
        ctx.stroke();
    });
}

function drawSmoke() {
    smokeParticles.forEach(smoke => {
        smoke.x += smoke.vx * settings.speed;
        smoke.y += smoke.vy * settings.speed;
        smoke.life -= settings.speed;
        
        if (smoke.life <= 0) {
            smoke.x = Math.random() * canvas.width;
            smoke.y = canvas.height + Math.random() * 100;
            smoke.life = Math.random() * 100 + 50;
        }
        
        const alpha = smoke.opacity * (smoke.life / 100);
        ctx.fillStyle = `rgba(169, 169, 169, ${alpha})`;
        ctx.beginPath();
        ctx.arc(smoke.x, smoke.y, smoke.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawShadowFigures() {
    shadowFigures.forEach(figure => {
        figure.x += figure.speed * settings.speed;
        
        if (figure.x > canvas.width + 50) {
            figure.x = -50;
            figure.height = Math.random() * 40 + 60;
        }
        
        ctx.fillStyle = `rgba(0, 0, 0, ${figure.opacity})`;
        ctx.fillRect(figure.x, figure.y, 20, -figure.height);
        
        ctx.beginPath();
        ctx.arc(figure.x + 10, figure.y - figure.height - 10, 8, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawCosmic() {
    const spiralCount = 3;
    const colors = getMoodColors(settings.mood);
    
    for (let s = 0; s < spiralCount; s++) {
        const centerX = canvas.width * (0.2 + s * 0.3);
        const centerY = canvas.height * 0.5;
        const radius = 100 + s * 50;
        
        for (let i = 0; i < 50; i++) {
            const angle = (time * 0.01 + i * 0.1 + s * 2) * settings.speed;
            const r = radius * (i / 50);
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            
            const hue = colors.particles[0] + i * 2;
            const opacity = (50 - i) / 50 * 0.6;
            
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${opacity})`;
            ctx.fill();
        }
    }
}

function applyCameraEffect() {
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

function drawWatermark() {
    ctx.save();
    
    // Static watermark in corner (subtle)
    ctx.font = 'bold 12px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('SKRONICLES', canvas.width - 10, canvas.height - 10);
    
    // Moving watermark with collision detection
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.lineWidth = 2;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    
    const text = 'Made by Skronicles';
    const textWidth = ctx.measureText(text).width;
    const y = canvas.height - 30;
    
    // Update watermark position with collision detection
    watermark.x += watermark.speed * watermark.direction;
    
    // Collision detection and bounce
    if (watermark.x <= 0) {
        watermark.x = 0;
        watermark.direction = 1; // Move right
    } else if (watermark.x >= canvas.width - textWidth) {
        watermark.x = canvas.width - textWidth;
        watermark.direction = -1; // Move left
    }
    
    // Add subtle floating effect
    const floatY = y + Math.sin(time * 0.02) * 3;
    
    // Add slight opacity pulse when bouncing
    const bounceEffect = Math.abs(watermark.direction) * 0.1;
    const opacity = 0.4 + bounceEffect;
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    
    // Draw with outline for readability
    ctx.strokeText(text, watermark.x, floatY);
    ctx.fillText(text, watermark.x, floatY);
    
    ctx.restore();
}

function animate() {
    ctx.save();
    applyCameraEffect();
    
    drawBackground();
    
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
    }
    
    drawWatermark();
    
    ctx.restore();
    
    time++;
    animationId = requestAnimationFrame(animate);
}