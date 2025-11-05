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
// GTM/GA4 Integration (diagnostic + race-safe)
// ============================================
function initializeSchedulerTracking() {
    if (window.__hcpTrackingInit) return;
    window.__hcpTrackingInit = true;

    window.__hcpDebug = true; // toggle to false in prod
    window.dataLayer = window.dataLayer || [];
    window.__hcpSchedulerOpenedAt = 0;
    window.__hcpSchedulerCompletedAt = 0;
    window.__hcpSchedulerClosedAt = 0;

    function dbg() { if (window.__hcpDebug) console.debug.apply(console, arguments); }

    function isHcpOrigin(origin) {
        try {
            const host = new URL(origin).hostname;
            const ok = host.endsWith('housecallpro.com');
            dbg('[HCP] origin', origin, 'host', host, 'allowed', ok);
            return ok;
        } catch {
            dbg('[HCP] origin parse error:', origin);
            return false;
        }
    }

    // 1) lead_open on CTA clicks (delegated)
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.cta-button, [data-orgname][data-token]');
        if (!btn) return;
        const location = btn.id || btn.className || 'unknown';
        dataLayer.push({ event: 'hcp_button_interaction', location });
        dbg('[GTM/GA4] event:', {event: 'hcp_button_interaction', location: location });
    });

    // 2) Widget messages (cancel/complete)
    window.addEventListener('message', function (e) {
        dbg('[HCP] message event:', { origin: e.origin, typeof: typeof e.data, data: e.data, message_event: e });
        if (!isHcpOrigin(e.origin)) return;
        
        // lead_open
        if (e && e.data && e.data === 'hcp:iframe-loaded') {
            window.__hcpSchedulerOpenedAt = Date.now();
            dataLayer.push({ event: 'hcp_scheduler_open', vendor: 'housecallpro', method: 'scheduler_modal', opened_at: window.__hcpSchedulerOpenedAt});
            dbg('[GTM/GA4] event:', {event: 'hcp_scheduler_open', vendor: 'housecallpro', method: 'scheduler_modal', opened_at: window.__hcpSchedulerOpenedAt });
            
            return;
        }

        // Completion first
        if (e && e.data && e.data === 'hcp:redirect') {
            dataLayer.push({ event: 'hcp_scheduler_complete', vendor: 'housecallpro', method: 'scheduler_confirmed', redirect_url: e.data.url });
            dbg('[GTM/GA4] event:', {event: 'hcp_scheduler_complete', vendor: 'housecallpro', method: 'scheduler_confirmed', redirect_url: e.data.url });
            window.__hcpSchedulerCompletedAt = Date.now();

            // Intercept immediate redirect so GA can dispatch
            if (typeof e.stopImmediatePropagation === 'function') {
                e.stopImmediatePropagation();
                dbg('[HCP] stopImmediatePropagation() applied to message');
            }
            setTimeout(() => {
                dbg('[HCP] navigating to', e.data.url);
                window.location.href = e.data.url;
            }, 250);
            return;
        }

        // Close (cancel) only if not immediately after completion
        if (e && e.data && e.data === 'hcp:close') {
            window.__hcpSchedulerClosedAt = Date.now();
            const justCompleted = window.__hcpSchedulerCompletedAt && (window.__hcpSchedulerClosedAt - window.__hcpSchedulerCompletedAt < 2000);
            dbg('[HCP] close received; justCompleted?', justCompleted);
            if (justCompleted) return;
            dataLayer.push({ event: 'hcp_scheduler_closed', vendor: 'housecallpro', method: 'scheduler_modal', closed_at: window.__hcpSchedulerClosedAt });
            dbg('[GTM/GA4] event:', {event: 'hcp_scheduler_closed', vendor: 'housecallpro', method: 'scheduler_modal', closed_at: window.__hcpSchedulerClosedAt });
        }
    }, false);
}


// ============================================
// Initialize All Components
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeHeaderScroll();
    initializeSmoothScroll();
    initializeHero();
    initializeFadeIn();
    initializeSchedulerTracking();
});
