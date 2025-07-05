function setPreset(presetName) {
    if (presets[presetName]) {
        Object.assign(settings, presets[presetName]);
        updateUI();
        initParticles();
        
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`[data-preset="${presetName}"]`).classList.add('active');
    }
}

function updateUI() {
    document.getElementById('mood').value = settings.mood;
    document.getElementById('animationStyle').value = settings.animationStyle;
    document.getElementById('speed').value = settings.speed;
    document.getElementById('particleCount').value = settings.particleCount;
    document.getElementById('speedValue').textContent = settings.speed;
    document.getElementById('particleCountValue').textContent = settings.particleCount;
    document.getElementById('cameraEffect').value = settings.cameraEffect;
}

function updateAnimation() {
    settings.animationStyle = document.getElementById('animationStyle').value;
}

function updateParticleCount() {
    settings.particleCount = parseInt(document.getElementById('particleCount').value);
    document.getElementById('particleCountValue').textContent = settings.particleCount;
    initParticles();
}

function updateSpeed() {
    settings.speed = parseFloat(document.getElementById('speed').value);
    document.getElementById('speedValue').textContent = settings.speed;
}

function updateMood() {
    settings.mood = document.getElementById('mood').value;
}

function updateCamera() {
    settings.cameraEffect = document.getElementById('cameraEffect').value;
}

function toggleControls() {
    const controls = document.getElementById('controls');
    const btn = document.getElementById('hideControlsBtn');
    
    if (controls.classList.contains('hidden')) {
        controls.classList.remove('hidden');
        btn.textContent = 'Hide Controls';
    } else {
        controls.classList.add('hidden');
        btn.textContent = 'Show Controls';
    }
}

function enterFullscreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
    }
}

function exportSettings() {
    const settingsJson = JSON.stringify(settings, null, 2);
    const blob = new Blob([settingsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skronicles_settings.json';
    a.click();
    URL.revokeObjectURL(url);
}

function setupEventListeners() {
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = btn.getAttribute('data-preset');
            setPreset(preset);
        });
    });
    
    document.getElementById('animationStyle').addEventListener('change', updateAnimation);
    document.getElementById('particleCount').addEventListener('input', updateParticleCount);
    document.getElementById('speed').addEventListener('input', updateSpeed);
    document.getElementById('mood').addEventListener('change', updateMood);
    document.getElementById('cameraEffect').addEventListener('change', updateCamera);
    
    document.getElementById('hideControlsBtn').addEventListener('click', toggleControls);
    document.getElementById('fullscreenBtn').addEventListener('click', enterFullscreen);
    document.getElementById('exportBtn').addEventListener('click', exportSettings);
    
    window.addEventListener('resize', resizeCanvas);
}