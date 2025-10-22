// Father's Comfort Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initSmoothScrolling();
    initFormHandling();
    initHouseCallProIntegration();
    initAccessibility();
});

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', function() {
            const isOpen = !mobileNav.classList.contains('hidden');
            
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close mobile menu when clicking on a link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileNav.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                closeMobileMenu();
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeMobileMenu();
            }
        });
    }

    function openMobileMenu() {
        mobileNav.classList.remove('hidden');
        mobileMenuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate hamburger menu
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    }

    function closeMobileMenu() {
        mobileNav.classList.add('hidden');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset hamburger menu
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }
}

// Smooth Scrolling for Navigation
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just a hash
            if (href === '#' || href === '#top') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form Handling
function initFormHandling() {
    const estimateForm = document.querySelector('.estimate-form');
    
    if (estimateForm) {
        estimateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Validate form
            if (validateForm(data)) {
                handleFormSubmission(data);
            }
        });
    }
}

function validateForm(data) {
    const requiredFields = ['name', 'email', 'phone', 'service'];
    const errors = [];
    
    // Check required fields
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
    });
    
    // Validate email
    if (data.email && !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Validate phone
    if (data.phone && !isValidPhone(data.phone)) {
        errors.push('Please enter a valid phone number');
    }
    
    if (errors.length > 0) {
        showFormErrors(errors);
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
}

function showFormErrors(errors) {
    // Remove existing error messages
    const existingErrors = document.querySelectorAll('.form-error');
    existingErrors.forEach(error => error.remove());
    
    // Show new errors
    const form = document.querySelector('.estimate-form');
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-error';
    errorContainer.style.cssText = `
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #dc2626;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 16px;
        font-size: 14px;
    `;
    
    errorContainer.innerHTML = `
        <strong>Please correct the following errors:</strong>
        <ul style="margin: 8px 0 0 20px; padding: 0;">
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;
    
    form.insertBefore(errorContainer, form.firstChild);
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function handleFormSubmission(data) {
    const submitButton = document.querySelector('.estimate-form button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        showSuccessMessage();
        
        // Reset form
        document.querySelector('.estimate-form').reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Remove any error messages
        const existingErrors = document.querySelectorAll('.form-error');
        existingErrors.forEach(error => error.remove());
    }, 1500);
}

function showSuccessMessage() {
    const form = document.querySelector('.estimate-form');
    const successContainer = document.createElement('div');
    successContainer.className = 'form-success';
    successContainer.style.cssText = `
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.3);
        color: #059669;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 16px;
        text-align: center;
        font-weight: 500;
    `;
    
    successContainer.innerHTML = `
        ✓ Thank you! Your message has been sent. We'll contact you within 24 hours.
    `;
    
    form.insertBefore(successContainer, form.firstChild);
    successContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successContainer.remove();
    }, 5000);
}

// HouseCall Pro Integration
function initHouseCallProIntegration() {
    const bookingButtons = document.querySelectorAll('.book-online-btn');
    
    bookingButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const token = this.getAttribute('data-hcp-token');
            const organization = this.getAttribute('data-hcp-organization');
            
            if (token && organization) {
                openHouseCallProModal(token, organization);
            } else {
                console.error('HouseCall Pro configuration missing');
                // Fallback to phone call
                window.location.href = 'tel:(555) 123-HVAC';
            }
        });
    });
}

function openHouseCallProModal(token, organization) {
    try {
        // Check if HouseCall Pro script is loaded
        if (typeof window.HouseCallPro !== 'undefined') {
            window.HouseCallPro.open({
                token: token,
                organization: organization
            });
        } else {
            // Fallback: Try to load the script dynamically and then open
            loadHouseCallProScript().then(() => {
                if (typeof window.HouseCallPro !== 'undefined') {
                    window.HouseCallPro.open({
                        token: token,
                        organization: organization
                    });
                } else {
                    throw new Error('HouseCall Pro script failed to load');
                }
            }).catch(() => {
                // Ultimate fallback to phone
                window.location.href = 'tel:(555) 123-HVAC';
            });
        }
    } catch (error) {
        console.error('Error opening HouseCall Pro modal:', error);
        // Fallback to phone call
        window.location.href = 'tel:(555) 123-HVAC';
    }
}

function loadHouseCallProScript() {
    return new Promise((resolve, reject) => {
        if (document.querySelector('script[src*="housecallpro.com/script.js"]')) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://online-booking.housecallpro.com/script.js';
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Accessibility Enhancements
function initAccessibility() {
    // Add keyboard navigation for custom elements
    const interactiveElements = document.querySelectorAll('.service-card, .testimonial-card');
    
    interactiveElements.forEach(element => {
        element.setAttribute('tabindex', '0');
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const button = this.querySelector('.btn');
                if (button) {
                    e.preventDefault();
                    button.click();
                }
            }
        });
    });
    
    // Improve focus management for mobile menu
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // Add skip to main content link
    addSkipToMainLink();
}

function addSkipToMainLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary);
        color: white;
        padding: 8px;
        border-radius: 4px;
        text-decoration: none;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimizations
window.addEventListener('load', function() {
    // Lazy load images that are not immediately visible
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // Don't let JavaScript errors break the user experience
    // Log to analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            'description': e.error.message,
            'fatal': false
        });
    }
});

// Analytics helper (for future Google Analytics integration)
function trackEvent(eventName, eventData = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    } else {
        console.log('Analytics event:', eventName, eventData);
    }
}

// Export functions for potential testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        isValidPhone,
        validateForm
    };
}