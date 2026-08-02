// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const body = document.body;
    const themeButton = document.getElementById('themeButton');
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.className = savedTheme;
    }
    
    if (themeButton) {
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
    }

    // Audio Autoplay Routine
    const bgMusic = new Audio('audio/bgmx.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.5;

    const cardFlipSound = new Audio('https://cdn.freesound.org/previews/442/442903_9359753-lq.mp3');
    cardFlipSound.volume = 0.6;

    function playAudio() {
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                removeAudioListeners();
            }).catch(err => console.log('Autoplay pending user interaction:', err));
        }
    }

    function removeAudioListeners() {
        document.removeEventListener('click', playAudio);
        document.removeEventListener('touchstart', playAudio);
    }

    playAudio();
    document.addEventListener('click', playAudio);
    document.addEventListener('touchstart', playAudio);

    // Card Interaction & Spreading Leaves Effect
    const cards = document.querySelectorAll('.card');

    function createSpreadingLeaves(x, y) {
        const leafIcons = ['🍃', '🌸', '🌿', '✨', '🍂'];
        const particleCount = 18;

        for (let i = 0; i < particleCount; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'leaf-particle';
            leaf.innerText = leafIcons[Math.floor(Math.random() * leafIcons.length)];
            
            leaf.style.left = `${x}px`;
            leaf.style.top = `${y}px`;

            // Random spread directions
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 180 + 60;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            const rotation = (Math.random() - 0.5) * 720;

            leaf.style.setProperty('--dx', `${dx}px`);
            leaf.style.setProperty('--dy', `${dy}px`);
            leaf.style.setProperty('--rot', `${rotation}deg`);

            document.body.appendChild(leaf);

            // Remove after 2 seconds
            setTimeout(() => {
                leaf.remove();
            }, 2000);
        }
    }

    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            playAudio();
            card.classList.toggle('flipped');

            // Play flip sound
            if (cardFlipSound.paused) {
                cardFlipSound.currentTime = 0;
                cardFlipSound.play().catch(() => {});
            }

            // Trigger leaf burst from card center
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            createSpreadingLeaves(centerX, centerY);
        });
    });

    // Shake Feature: Open all cards at once
    let lastX = null, lastY = null, lastZ = null;
    const shakeThreshold = 18; // Sensitivity threshold for shake

    function openAllCards() {
        cards.forEach((card, index) => {
            setTimeout(() => {
                if (!card.classList.contains('flipped')) {
                    card.classList.add('flipped');
                    const rect = card.getBoundingClientRect();
                    createSpreadingLeaves(rect.left + rect.width / 2, rect.top + rect.height / 2);
                }
            }, index * 200);
        });

        if (cardFlipSound.paused) {
            cardFlipSound.currentTime = 0;
            cardFlipSound.play().catch(() => {});
        }
    }

    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', (e) => {
            const current = e.accelerationIncludingGravity;
            if (!current) return;

            if (lastX !== null) {
                const deltaX = Math.abs(current.x - lastX);
                const deltaY = Math.abs(current.y - lastY);
                const deltaZ = Math.abs(current.z - lastZ);

                if (deltaX + deltaY + deltaZ > shakeThreshold) {
                    openAllCards();
                }
            }

            lastX = current.x;
            lastY = current.y;
            lastZ = current.z;
        });
    }

    // Keyboard Shortcut (Press 'S' to simulate Shake on Desktop)
    document.addEventListener('keydown', (e) => {
        if (e.key === 's' || e.key === 'S') {
            openAllCards();
        }
    });

    // Particle Visual Effects
    function createFloatingFlowers() {
        const container = document.querySelector('.floating-flowers');
        if (!container) return;
        for (let i = 0; i < 6; i++) {
            const flower = document.createElement('div');
            flower.className = 'float-flower';
            container.appendChild(flower);
        }
    }

    function createParticleEffect() {
        const particles = document.querySelector('.particles');
        if (!particles) return;
        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.setProperty('--delay', `${Math.random() * 5}s`);
            particle.style.setProperty('--size', `${Math.random() * 8 + 4}px`);
            particle.style.setProperty('--start-x', `${Math.random() * 100}vw`);
            particle.style.setProperty('--end-x', `${Math.random() * 100}vw`);
            particles.appendChild(particle);
        }
    }

    createFloatingFlowers();
    createParticleEffect();
});
