function setPreset(presetName) {
    if (presets[presetName]) {
        Object.assign(settings, presets[presetName]);
        updateUI();
        initParticles();
        
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const targetBtn = document.querySelector(`[data-preset="${presetName}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }
        
        console.log(`🎬 Applied ${presetName} preset with story mode: ${settings.storyMode}`);
    }
}

function updateUI() {
    // Update traditional controls if they exist
    const moodSelect = document.getElementById('mood');
    const animationSelect = document.getElementById('animationStyle');
    const speedInput = document.getElementById('speed');
    const particleInput = document.getElementById('particleCount');
    const cameraSelect = document.getElementById('cameraEffect');
    
    if (moodSelect) moodSelect.value = settings.mood;
    if (animationSelect) animationSelect.value = settings.animationStyle;
    if (speedInput) speedInput.value = settings.speed;
    if (particleInput) particleInput.value = settings.particleCount;
    if (cameraSelect) cameraSelect.value = settings.cameraEffect;
    
    // Update display values
    const speedValue = document.getElementById('speedValue');
    const particleValue = document.getElementById('particleCountValue');
    
    if (speedValue) speedValue.textContent = settings.speed;
    if (particleValue) particleValue.textContent = settings.particleCount;
}

function updateAnimation() {
    const animationSelect = document.getElementById('animationStyle');
    if (animationSelect) {
        settings.animationStyle = animationSelect.value;
    }
}

function updateParticleCount() {
    const particleInput = document.getElementById('particleCount') || document.getElementById('particleCountSlider');
    const particleValue = document.getElementById('particleCountValue') || document.getElementById('particleDisplay');
    
    if (particleInput) {
        settings.particleCount = parseInt(particleInput.value);
        if (particleValue) particleValue.textContent = settings.particleCount;
        initParticles();
    }
}

function updateSpeed() {
    const speedInput = document.getElementById('speed') || document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue') || document.getElementById('speedDisplay');
    
    if (speedInput) {
        settings.speed = parseFloat(speedInput.value);
        if (speedValue) speedValue.textContent = settings.speed.toFixed(1) + 'x';
    }
}

function updateMood() {
    const moodSelect = document.getElementById('mood');
    if (moodSelect) {
        settings.mood = moodSelect.value;
        console.log('🎨 Mood updated:', settings.mood);
    }
}

function updateIntensity() {
    const intensityInput = document.getElementById('intensitySlider');
    const intensityValue = document.getElementById('intensityDisplay');
    
    if (intensityInput) {
        settings.intensityMultiplier = parseFloat(intensityInput.value);
        if (intensityValue) intensityValue.textContent = settings.intensityMultiplier.toFixed(1);
        console.log('🎚️ Intensity multiplier updated:', settings.intensityMultiplier);
    }
}

function updateCamera() {
    const cameraSelect = document.getElementById('cameraEffect') || document.getElementById('cameraSelect');
    if (cameraSelect) {
        settings.cameraEffect = cameraSelect.value;
        console.log('📸 Camera effect updated:', settings.cameraEffect);
    }
}

function toggleControls() {
    const controls = document.getElementById('controls');
    const btn = document.getElementById('hideControlsBtn');
    
    if (controls && btn) {
        if (controls.classList.contains('hidden')) {
            controls.classList.remove('hidden');
            btn.textContent = 'Hide Controls';
        } else {
            controls.classList.add('hidden');
            btn.textContent = 'Show Controls';
        }
    }
}

function toggleStoryPanel() {
    const panel = document.getElementById('storyPanel');
    const btn = document.getElementById('hidePanelBtn');
    
    if (panel && btn) {
        if (panel.classList.contains('hidden')) {
            panel.classList.remove('hidden');
            btn.textContent = '≡ HIDE PANEL';
        } else {
            panel.classList.add('hidden');
            btn.textContent = '≡ SHOW PANEL';
        }
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

// ENHANCED STORY ANALYSIS FUNCTIONS
function analyzeAndGenerate() {
    const storyTextElement = document.getElementById('storyText');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    if (!storyTextElement) {
        console.error('Story text element not found');
        return;
    }
    
    const storyText = storyTextElement.value;
    
    if (!storyText.trim()) {
        alert('Please enter a story first!');
        return;
    }
    
    // Show loading overlay
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
    
    console.log('🤖 Starting AI story analysis...');
    
    // Simulate AI processing time
    setTimeout(() => {
        try {
            updateStoryAnalysis(storyText);
            settings.storyMode = true;
            settings.autoSceneChange = true;
            
            // Reinitialize particles with new story data
            initParticles();
            
            // Update UI elements
            updateStoryUI();
            
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
            
            console.log('🎬 Story analysis complete! AI is now driving the animation.');
            console.log(`📊 Generated ${storyBeats.length} story beats`);
            
        } catch (error) {
            console.error('Error during story analysis:', error);
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
            alert('Error analyzing story. Please try again.');
        }
    }, 2000);
}

function updateStoryUI() {
    try {
        const currentBeat = getCurrentStoryBeat();
        
        // Update current beat display
        const currentBeatElement = document.getElementById('currentBeat');
        if (currentBeatElement) {
            currentBeatElement.textContent = 
                currentBeat.type.charAt(0).toUpperCase() + currentBeat.type.slice(1);
        }
        
        // Update intensity display
        const beatIntensityElement = document.getElementById('beatIntensity');
        if (beatIntensityElement) {
            beatIntensityElement.textContent = 
                (currentBeat.intensity * 100).toFixed(0) + '%';
        }
        
        // Update progress bar
        const beatProgressElement = document.getElementById('beatProgress');
        if (beatProgressElement && storyBeats.length > 0) {
            const progress = (currentBeatIndex / Math.max(1, storyBeats.length - 1)) * 100;
            beatProgressElement.style.width = progress + '%';
        }
        
        // Update statistics
        const beatCountElement = document.getElementById('beatCount');
        if (beatCountElement) {
            beatCountElement.textContent = storyBeats.length;
        }
        
        const sceneCountElement = document.getElementById('sceneCount');
        if (sceneCountElement) {
            const uniqueScenes = new Set(storyBeats.map(b => b.type));
            sceneCountElement.textContent = uniqueScenes.size;
        }
        
        // Calculate and update hook rating
        const hookRatingElement = document.getElementById('hookRating');
        if (hookRatingElement && storyBeats.length > 0) {
            const avgIntensity = storyBeats.reduce((sum, beat) => sum + beat.intensity, 0) / storyBeats.length;
            const hookRating = Math.min(95, 60 + (avgIntensity * 35) + (storyBeats.length * 2));
            hookRatingElement.textContent = Math.round(hookRating) + '%';
        }
        
        // Calculate and update estimated views
        const viewEstimateElement = document.getElementById('viewEstimate');
        if (viewEstimateElement && storyBeats.length > 0) {
            const avgIntensity = storyBeats.reduce((sum, beat) => sum + beat.intensity, 0) / storyBeats.length;
            const hookRating = Math.min(95, 60 + (avgIntensity * 35) + (storyBeats.length * 2));
            const viewMultiplier = hookRating / 100;
            const baseViews = 500000;
            const estimatedViews = (baseViews * viewMultiplier * (1 + Math.random() * 0.5));
            viewEstimateElement.textContent = 
                (estimatedViews / 1000000).toFixed(1) + 'M';
        }
        
    } catch (error) {
        console.error('Error updating story UI:', error);
    }
}

function updateLiveControls() {
    if (settings.storyMode) {
        try {
            const adaptiveSettings = getAdaptiveSettings();
            const currentBeat = getCurrentStoryBeat();
            
            // Update particle display
            const particleDisplayElement = document.getElementById('particleDisplay');
            if (particleDisplayElement) {
                particleDisplayElement.textContent = adaptiveSettings.particleCount;
            }
            
            // Update speed display
            const speedDisplayElement = document.getElementById('speedDisplay');
            if (speedDisplayElement) {
                speedDisplayElement.textContent = adaptiveSettings.speed.toFixed(1) + 'x';
            }
            
            // Update intensity display
            const intensityDisplayElement = document.getElementById('intensityDisplay');
            if (intensityDisplayElement) {
                intensityDisplayElement.textContent = currentBeat.intensity.toFixed(1);
            }
            
            // Update camera display
            const cameraDisplayElement = document.getElementById('cameraDisplay');
            if (cameraDisplayElement) {
                cameraDisplayElement.textContent = 
                    adaptiveSettings.cameraShake > 0 ? 'Shaking' : 'Stable';
            }
            
            // Update story UI
            updateStoryUI();
            
        } catch (error) {
            console.error('Error updating live controls:', error);
        }
    }
}

function exportVideo() {
    const currentBeat = getCurrentStoryBeat();
    const hookRating = document.getElementById('hookRating')?.textContent || '85%';
    const estimatedViews = document.getElementById('viewEstimate')?.textContent || '1.2M';
    
    alert(`🎬 SKRONICLES PRO EXPORT\n\n` +
          `Current Story Beat: ${currentBeat.type}\n` +
          `Intensity Level: ${(currentBeat.intensity * 100).toFixed(0)}%\n` +
          `Hook Rating: ${hookRating}\n` +
          `Estimated Views: ${estimatedViews}\n\n` +
          `Ready for integration with:\n` +
          `• FFmpeg for 4K video rendering\n` +
          `• ElevenLabs for AI voice generation\n` +
          `• Automatic subtitle generation\n` +
          `• TikTok/YouTube direct upload\n\n` +
          `Perfect for viral content creation! 🚀`);
}

function setupEventListeners() {
    console.log('🎮 Setting up event listeners...');
    
    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const preset = btn.getAttribute('data-preset');
            setPreset(preset);
        });
    });
    
    // Animation style selector - SIMPLIFIED LIKE YOUR ORIGINAL
    const animationStyleSelect = document.getElementById('animationStyleSelect');
    if (animationStyleSelect) {
        animationStyleSelect.addEventListener('change', (e) => {
            console.log('🎬 Dropdown changed to:', e.target.value);
            settings.animationStyle = e.target.value;
            console.log('🎬 Settings updated:', settings.animationStyle);
            initParticles();
        });
        console.log('✅ Animation style selector connected');
    }
    
    // Enhanced live controls
    const particleSlider = document.getElementById('particleCountSlider');
    const speedSlider = document.getElementById('speedSlider');
    const intensitySlider = document.getElementById('intensitySlider');
    const cameraSelect = document.getElementById('cameraSelect');
    
    if (particleSlider) {
        particleSlider.addEventListener('input', updateParticleCount);
        console.log('✅ Particle slider connected');
    }
    
    if (speedSlider) {
        speedSlider.addEventListener('input', updateSpeed);
        console.log('✅ Speed slider connected');
    }
    
    if (intensitySlider) {
        intensitySlider.addEventListener('input', updateIntensity);
        console.log('✅ Intensity slider connected');
    }
    
    if (cameraSelect) {
        cameraSelect.addEventListener('change', updateCamera);
        console.log('✅ Camera select connected');
    }
    
    // Traditional controls (if they exist)
    const animationStyle = document.getElementById('animationStyle');
    const particleCount = document.getElementById('particleCount');
    const speed = document.getElementById('speed');
    const mood = document.getElementById('mood');
    const cameraEffect = document.getElementById('cameraEffect');
    
    if (animationStyle) animationStyle.addEventListener('change', updateAnimation);
    if (particleCount) particleCount.addEventListener('input', updateParticleCount);
    if (speed) speed.addEventListener('input', updateSpeed);
    if (mood) mood.addEventListener('change', updateMood);
    if (cameraEffect) cameraEffect.addEventListener('change', updateCamera);
    
    // Control buttons
    const hideControlsBtn = document.getElementById('hideControlsBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const exportSettingsBtn = document.getElementById('exportBtn');
    const hidePanelBtn = document.getElementById('hidePanelBtn');
    
    if (hideControlsBtn) hideControlsBtn.addEventListener('click', toggleControls);
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', enterFullscreen);
    if (exportSettingsBtn) exportSettingsBtn.addEventListener('click', exportSettings);
    if (hidePanelBtn) hidePanelBtn.addEventListener('click', toggleStoryPanel);
    
    // Story analysis button
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            analyzeAndGenerate();
        });
        console.log('✅ Analyze button connected');
    }
    
    // Export video button  
    const exportVideoBtn = document.getElementById('exportBtn');
    if (exportVideoBtn && exportVideoBtn !== exportSettingsBtn) {
        exportVideoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            exportVideo();
        });
        console.log('✅ Export video button connected');
    }
    
    // Resize listener
    window.addEventListener('resize', resizeCanvas);
    
    console.log('✅ Event listeners setup complete');
    
    // DEBUG: Log current animation style every 2 seconds
    setInterval(() => {
        console.log('🔍 Current animation style:', settings.animationStyle);
    }, 2000);
}