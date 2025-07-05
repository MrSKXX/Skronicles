document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 Skronicles Pro - AI Storytelling Engine');
    console.log('⚡ Initializing enhanced animation system...');
    
    // Initialize core systems
    setupEventListeners();
    resizeCanvas();
    animate();
    
    // Auto-analyze sample story after a brief delay
    setTimeout(() => {
        const storyTextElement = document.getElementById('storyText');
        if (storyTextElement && storyTextElement.value.trim()) {
            console.log('🤖 Auto-analyzing sample story...');
            
            // Analyze the pre-filled story
            updateStoryAnalysis(storyTextElement.value);
            settings.storyMode = true;
            settings.autoSceneChange = true;
            
            // Update UI with analysis results
            updateStoryUI();
            
            console.log('✅ Sample story analysis complete');
        }
    }, 1500);
    
    // Set up live control updates
    setInterval(() => {
        updateLiveControls();
    }, 1000);
    
    // Set up watermark bounce logging
    const originalBounceCount = watermark.bounceCount;
    setInterval(() => {
        if (watermark.bounceCount > originalBounceCount) {
            console.log(`💥 Skronicles watermark has bounced ${watermark.bounceCount} times!`);
        }
    }, 5000);
    
    // Performance monitoring
    let frameCount = 0;
    let lastTime = performance.now();
    
    function calculateFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            // Update FPS display if element exists
            const fpsDisplay = document.getElementById('fpsDisplay');
            if (fpsDisplay) {
                fpsDisplay.textContent = fps + ' FPS';
            }
            
            // Log performance warnings
            if (fps < 30) {
                console.warn(`⚠️ Low FPS detected: ${fps}fps`);
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(calculateFPS);
    }
    
    // Start FPS monitoring
    calculateFPS();
    
    // Success message
    console.log('🎯 Skronicles Pro loaded successfully!');
    console.log('💡 Features unlocked:');
    console.log('  • AI Story Analysis');
    console.log('  • Dynamic Scene Transitions');  
    console.log('  • Enhanced Watermark with Collision');
    console.log('  • Cinematic Camera Effects');
    console.log('  • Professional Performance Metrics');
    console.log('🚀 Ready for viral content creation!');
    
    // Display version info
    const versionInfo = {
        version: '2.0 Pro',
        features: ['AI Story Intelligence', 'Cinematic Effects', 'Professional Export'],
        hookRating: '85-95%',
        targetPlatforms: ['TikTok', 'YouTube Shorts', 'Instagram Reels']
    };
    
    console.table(versionInfo);
});