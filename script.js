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
    const bgMusic = new Audio('audio/bgmx.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.4; // Set initial background volume

    const cardFlipSound = new Audio('https://cdn.freesound.org/previews/442/442903_9359753-lq.mp3');
    cardFlipSound.volume = 0.6; // Slightly reduce flip sound volume
    cardFlipSound.preload = 'auto';

    // Priority autoplay routine
    function autoplayMusic() {
        if (bgMusic.paused) {
            bgMusic.play().catch(() => {
                // Browsers block unmuted autoplay without interaction; 
                // this listener instantly triggers music on the user's first click or tap anywhere
                const playOnInteraction = () => {
                    bgMusic.play().catch(e => console.log('Autoplay error:', e));
                    document.removeEventListener('click', playOnInteraction);
                    document.removeEventListener('touchstart', playOnInteraction);
                };
                document.addEventListener('click', playOnInteraction);
                document.addEventListener('touchstart', playOnInteraction);
            });
        }
    }

    // Trigger immediate autoplay attempt on load
    autoplayMusic();

    // Card interaction handlers
    document.querySelectorAll('.card').forEach(card => {
        // Click/touch sound effect
        card.addEventListener('click', () => {
            if (cardFlipSound.paused) { // Only play if not already playing
                cardFlipSound.currentTime = 0;
                cardFlipSound.play().catch(e => console.log('Audio play failed:', e));
            }
        });

        // Touch interaction for mobile
        let touchStart = null;
        
        card.addEventListener('touchstart', (e) => {
            touchStart = e.touches[0].clientX;
        });
        
        card.addEventListener('touchmove', (e) => {
            if (!touchStart) return;
            
            const touchEnd = e.touches[0].clientX;
            const diff = touchStart - touchEnd;
            
            if (Math.abs(diff) > 50) { // Swipe threshold
                card.querySelector('.card-inner').style.transform = 
                    diff > 0 ? 'rotateY(180deg)' : 'rotateY(0deg)';
            }
            
            touchStart = null;
        });
    });

    // Create floating flowers
    function createFloatingFlowers() {
        const container = document.querySelector('.floating-flowers');
        const flowerCount = 6;
        
        for (let i = 0; i < flowerCount; i++) {
            const flower = document.createElement('div');
            flower.className = 'float-flower';
            container.appendChild(flower);
        }
    }

    // Create particle effect
    function createParticleEffect() {
        const particles = document.querySelector('.particles');
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random positions and timing
            const startX = Math.random() * 100 + 'vw';
            const endX = Math.random() * 100 + 'vw';
            
            particle.style.setProperty('--delay', `${Math.random() * 5}s`);
            particle.style.setProperty('--size', `${Math.random() * 10 + 5}px`);
            particle.style.setProperty('--start-x', startX);
            particle.style.setProperty('--end-x', endX);
            
            particles.appendChild(particle);
        }
    }
    
    // Initialize effects
    createFloatingFlowers();
    createParticleEffect();
});
