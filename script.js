// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const body = document.body;
    const themeButton = document.getElementById('themeButton');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.className = savedTheme;
    }
    
    // Theme toggle handler
    themeButton.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light-mode');
        }
    });

    // Background music setup
    const bgMusic = new Audio('./audio/bg_music_haal_kaisa_hai-1.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0;
    bgMusic.preload = 'auto';
    
    const cardFlipSound = new Audio('https://cdn.freesound.org/previews/442/442903_9359753-lq.mp3');
    cardFlipSound.volume = 0.6;
    cardFlipSound.preload = 'auto';

    // Global flag to track if music has been started
    let musicStarted = false;

    // Fade audio function
    function fadeAudio(audio, start, end, duration) {
        const interval = 50;
        const steps = duration / interval;
        const stepChange = (end - start) / steps;
        let currentStep = 0;

        const fadeInterval = setInterval(() => {
            currentStep++;
            audio.volume = start + (stepChange * currentStep);
            
            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                audio.volume = end;
                if (end === 0 && audio.paused === false) {
                    audio.pause();
                }
            }
        }, interval);
    }

    // Music toggle functionality with fade
    const musicButton = document.getElementById('musicButton');
    musicButton.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.volume = 0;
            bgMusic.play().catch(e => console.log('Audio play failed:', e));
            fadeAudio(bgMusic, 0, 0.4, 1000);
            musicButton.classList.add('playing');
            musicStarted = true
