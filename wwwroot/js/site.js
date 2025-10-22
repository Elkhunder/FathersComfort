/* Combined JavaScript File - Optimized for MudBlazor */

function initializeFadeIn() {
    const fadeElements = document.querySelectorAll('.fade-in');
    console.log(`Found ${fadeElements.length} fade-in elements`);

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Element visible:', entry.target.className);
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// Header Component - Scroll Effects
// ============================================

let lastScroll = 0;

function initializeHeaderScroll() {
    // Keep retrying until the element is found
    let attempts = 0;
    const maxAttempts = 10;

    const tryInitialize = () => {
        const appBar = document.querySelector('header.mud-appbar') || document.querySelector('header');

        if (appBar) {
            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;

                if (currentScroll > 50) {
                    appBar.classList.add('header-scrolled');
                } else {
                    appBar.classList.remove('header-scrolled');
                }
            });

            console.log('Header scroll effect initialized');
            return;
        }

        // Retry if not found yet
        if (attempts < maxAttempts) {
            attempts++;
            console.log(`Waiting for Header AppBar (attempt ${attempts}/${maxAttempts})...`);
            setTimeout(tryInitialize, 50);
        } else {
            console.warn('Header AppBar not found after maximum attempts');
        }
    };

    tryInitialize();
}



// Smooth scrolling for navigation links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// Hero Component - Animations
// ============================================

function initializeHero() {
    // Add a small delay to make the hero animation more visible
    setTimeout(() => {
        const heroContent = document.querySelector('.hero .fade-in');
        if (heroContent) {
            heroContent.classList.add('visible');
        }
    }, 300);

    // Phone number click tracking (for analytics)
    document.querySelectorAll('a[href^="tel:"]').forEach(phoneLink => {
        phoneLink.addEventListener('click', () => {
            console.log('Phone call initiated:', phoneLink.href);
        });
    });
}

// ============================================
// Initialize All Components
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeHeaderScroll();
    initializeSmoothScroll();
    initializeHero();
    initializeFadeIn();
});
