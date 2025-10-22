// Father's Comfort Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initializeNavigation();
    initializeTestimonialCarousel();
    initializeThemeToggle();
    initializeBeforeAfter();
    initializeChat();
    initializeScrollEffects();
    
    // Auto-rotate testimonials
    setInterval(rotateTestimonials, 5000);
});

// HouseCall Pro Integration
function openBookingModal() {
    try {
        // Check if HCP script is loaded and ready
        if (typeof window.HCP !== 'undefined' && window.HCP.modal) {
            window.HCP.modal.open({
                token: '7e9db90da7914f2eb050897850a0d1db',
                organization: 'Fathers-Comfort-Handy-Man--HVAC'
            });
        } else {
            // Fallback: trigger the hidden button that HCP binds to
            const hiddenTrigger = document.getElementById('hcpHiddenTrigger');
            if (hiddenTrigger) {
                hiddenTrigger.click();
            } else {
                // Final fallback: direct phone call
                window.location.href = 'tel:(555)123-4822';
            }
        }
        
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'book_online_clicked', {
                'event_category': 'engagement',
                'event_label': 'HouseCall Pro Modal'
            });
        }
    } catch (error) {
        console.error('Error opening booking modal:', error);
        // Fallback to phone call
        window.location.href = 'tel:(555)123-4822';
    }
}

// Navigation Functions
function initializeNavigation() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
    
    // Active navigation highlighting
    window.addEventListener('scroll', updateActiveNavigation);
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const toggle = document.querySelector('.mobile-menu-toggle');
    const isOpen = !menu.classList.contains('hidden');
    
    if (isOpen) {
        closeMobileMenu();
    } else {
        menu.classList.remove('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        menu.focus();
        
        // Close on escape key
        document.addEventListener('keydown', handleMobileMenuKeydown);
    }
}

function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    menu.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    
    document.removeEventListener('keydown', handleMobileMenuKeydown);
}

function handleMobileMenuKeydown(e) {
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Testimonial Carousel
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');
const testimonialDots = document.querySelectorAll('.nav-dot');

function showTestimonial(index) {
    // Hide all testimonials
    testimonials.forEach(testimonial => {
        testimonial.classList.remove('active');
    });
    
    // Remove active state from dots
    testimonialDots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show selected testimonial
    if (testimonials[index]) {
        testimonials[index].classList.add('active');
        testimonialDots[index].classList.add('active');
        currentTestimonial = index;
    }
}

function rotateTestimonials() {
    const nextIndex = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(nextIndex);
}

function initializeTestimonialCarousel() {
    // Auto-rotation is handled by setInterval in main initialization
    // Add keyboard navigation
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showTestimonial(index);
            }
        });
    });
}

// Theme Toggle Functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-color-scheme', currentTheme);
    updateThemeToggleText(currentTheme);
    
    themeToggle?.addEventListener('click', toggleTheme);
    themeToggleMobile?.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-color-scheme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-color-scheme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggleText(newTheme);
}

function updateThemeToggleText(theme) {
    const toggles = document.querySelectorAll('#themeToggle, #themeToggleMobile');
    const text = theme === 'dark' ? 'Light mode' : 'Dark mode';
    
    toggles.forEach(toggle => {
        if (toggle) {
            toggle.textContent = text;
            toggle.setAttribute('aria-pressed', theme === 'dark');
        }
    });
}

// Estimate Calculator
function handleEstimate(event) {
    event.preventDefault();
    
    const serviceType = document.getElementById('calcService').value;
    const urgency = document.getElementById('calcUrgency').value;
    const homeSize = parseInt(document.getElementById('calcSize').value);
    
    // Simple estimation logic
    const baseRates = {
        hvac_repair: { min: 150, max: 500 },
        ac_service: { min: 100, max: 350 },
        heating: { min: 120, max: 400 },
        duct: { min: 200, max: 800 },
        iaq: { min: 300, max: 1200 },
        handyman: { min: 80, max: 250 }
    };
    
    const urgencyMultipliers = {
        standard: 1,
        priority: 1.2,
        emergency: 1.5
    };
    
    const sizeMultiplier = Math.max(0.8, Math.min(1.5, homeSize / 1500));
    const baseRate = baseRates[serviceType];
    const urgencyMultiplier = urgencyMultipliers[urgency];
    
    const minEstimate = Math.round(baseRate.min * sizeMultiplier * urgencyMultiplier);
    const maxEstimate = Math.round(baseRate.max * sizeMultiplier * urgencyMultiplier);
    
    const resultDiv = document.getElementById('estimateResult');
    resultDiv.innerHTML = `
        <div class="estimate-display">
            <h4>Estimated Cost Range</h4>
            <div class="estimate-range">$${minEstimate} - $${maxEstimate}</div>
            <p class="estimate-disclaimer">
                <small>This is a rough estimate. Final pricing will be provided after our professional assessment.</small>
            </p>
            <button class="btn btn--primary" onclick="openBookingModal()">Book Assessment</button>
        </div>
    `;
    
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Before/After Gallery
function initializeBeforeAfter() {
    const slider = document.getElementById('baSlider');
    const overlay = document.getElementById('baOverlay');
    
    if (slider && overlay) {
        slider.addEventListener('input', function() {
            const value = this.value;
            overlay.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
        });
        
        // Touch/mouse interaction for direct manipulation
        const container = document.querySelector('.ba-container');
        if (container) {
            container.addEventListener('mousemove', updateOverlay);
            container.addEventListener('touchmove', updateOverlay);
        }
    }
}

function updateOverlay(e) {
    e.preventDefault();
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const percentage = (x / rect.width) * 100;
    
    if (percentage >= 0 && percentage <= 100) {
        const overlay = document.getElementById('baOverlay');
        const slider = document.getElementById('baSlider');
        
        overlay.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        slider.value = percentage;
    }
}

// Contact Form Handling
function handleContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // In a real implementation, you would send the data to your server
        console.log('Contact form data:', data);
        
        // Show success message
        showNotification('Thank you! Your message has been sent. We\'ll get back to you soon.', 'success');
        
        // Reset form
        event.target.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Suggest booking
        setTimeout(() => {
            if (confirm('Would you like to book an appointment online right now?')) {
                openBookingModal();
            }
        }, 2000);
        
    }, 1000);
}

// Newsletter Signup
function handleNewsletter() {
    const email = document.getElementById('newsletterEmail').value;
    const msgElement = document.getElementById('newsletterMsg');
    
    if (!email || !email.includes('@')) {
        msgElement.textContent = 'Please enter a valid email address.';
        msgElement.className = 'form-note error';
        return;
    }
    
    msgElement.textContent = 'Subscribing...';
    msgElement.className = 'form-note';
    
    // Simulate API call
    setTimeout(() => {
        msgElement.textContent = 'Success! You\'ll receive seasonal maintenance tips.';
        msgElement.className = 'form-note success';
        document.getElementById('newsletterEmail').value = '';
    }, 1000);
}

// Live Chat Functionality
function initializeChat() {
    const chatWidget = document.getElementById('chatWidget');
    const businessHours = isBusinessHours();
    
    if (!businessHours) {
        chatWidget.style.display = 'none';
    }
}

function toggleChat() {
    const panel = document.getElementById('chatPanel');
    const toggle = document.querySelector('.chat-toggle');
    const isOpen = !panel.classList.contains('hidden');
    
    if (isOpen) {
        panel.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'Live Chat';
    } else {
        panel.classList.remove('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.textContent = 'Close Chat';
        
        // Focus the input
        document.getElementById('chatInput').focus();
    }
}

function handleChat(event) {
    event.preventDefault();
    
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.textContent = message;
    messages.appendChild(userMsg);
    
    // Clear input
    input.value = '';
    
    // Simulate bot response
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-message bot';
        botMsg.textContent = getBotResponse(message);
        messages.appendChild(botMsg);
        
        messages.scrollTop = messages.scrollHeight;
    }, 1000);
    
    messages.scrollTop = messages.scrollHeight;
}

function getBotResponse(message) {
    const responses = {
        'price': 'Our pricing varies by service. Use our estimate calculator above or book a free assessment!',
        'emergency': 'We offer 24/7 emergency service! Call (555) 123-HVAC for immediate assistance.',
        'hours': 'We\'re open Mon-Fri 7AM-7PM, Sat 8AM-5PM. Emergency service available 24/7.',
        'service': 'We provide HVAC repair, AC service, heating maintenance, ductwork, and handyman services.',
        'book': 'Great! Click any "Book Online" button to schedule through our secure booking system.',
        'default': 'Thanks for reaching out! For immediate service, call (555) 123-HVAC or book online.'
    };
    
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) return responses.price;
    if (lowerMessage.includes('emergency')) return responses.emergency;
    if (lowerMessage.includes('hour') || lowerMessage.includes('open')) return responses.hours;
    if (lowerMessage.includes('service')) return responses.service;
    if (lowerMessage.includes('book') || lowerMessage.includes('appointment')) return responses.book;
    
    return responses.default;
}

function isBusinessHours() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Business hours: Mon-Fri 7AM-7PM, Sat 8AM-5PM
    if (day >= 1 && day <= 5) { // Monday to Friday
        return hour >= 7 && hour < 19;
    } else if (day === 6) { // Saturday
        return hour >= 8 && hour < 17;
    }
    return false; // Sunday or outside hours
}

// Scroll Effects
function initializeScrollEffects() {
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
        
        // Animate service cards on scroll
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.service-card, .value-item').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            cardObserver.observe(card);
        });
    }
    
    // Back to top functionality
    window.addEventListener('scroll', () => {
        const backToTop = document.querySelector('.back-to-top');
        if (window.scrollY > 300) {
            if (backToTop) backToTop.classList.add('visible');
        } else {
            if (backToTop) backToTop.classList.remove('visible');
        }
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        backgroundColor: type === 'success' ? '#7A9471' : type === 'error' ? '#C4394B' : '#4A90B8',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '1000',
        maxWidth: '300px',
        fontSize: '14px',
        lineHeight: '1.4'
    });
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Allow manual dismissal
    notification.addEventListener('click', () => {
        notification.remove();
    });
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // Graceful degradation for critical features
    if (e.error && e.error.message.includes('HCP')) {
        console.warn('HouseCall Pro integration failed, using fallback');
    }
});

// Performance Monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
        
        // Send performance data if analytics is available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
                name: 'page_load',
                value: loadTime
            });
        }
    });
}

// Service Worker Registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Only register in production
        if (window.location.protocol === 'https:') {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        }
    });
}