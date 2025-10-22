// Father's Comfort Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('nav__menu--active');
            navToggle.classList.toggle('nav__toggle--active');
        });
    }

    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('.nav__link, a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal links
            if (href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (navMenu && navMenu.classList.contains('nav__menu--active')) {
                        navMenu.classList.remove('nav__menu--active');
                        navToggle.classList.remove('nav__toggle--active');
                    }
                }
            }
        });
    });

    // Header Background on Scroll
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            
            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
            }
            
            // Validate form
            if (validateForm(formObject)) {
                // Show success message
                showFormMessage('Thank you! Your message has been sent. We\'ll contact you soon.', 'success');
                
                // Reset form
                contactForm.reset();
                
                // In a real application, you would send the data to a server
                console.log('Form data:', formObject);
            }
        });
    }

    // Form Validation
    function validateForm(data) {
        const errors = [];
        
        // Check required fields
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Please enter a valid name');
        }
        
        if (!data.email || !isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.phone || data.phone.trim().length < 10) {
            errors.push('Please enter a valid phone number');
        }
        
        if (!data.message || data.message.trim().length < 10) {
            errors.push('Please enter a message with at least 10 characters');
        }
        
        // Show errors if any
        if (errors.length > 0) {
            showFormMessage(errors.join('<br>'), 'error');
            return false;
        }
        
        return true;
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show form message
    function showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message--${type}`;
        messageDiv.innerHTML = message;
        
        // Insert message before form
        contactForm.parentNode.insertBefore(messageDiv, contactForm);
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remove message after 5 seconds for success, 8 seconds for error
        const timeout = type === 'success' ? 5000 : 8000;
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, timeout);
    }

    // Service Cards Hover Effects
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Scroll Animation for Elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .value-item, .contact-card, .emergency-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{3})/, '($1) $2');
            }
            
            e.target.value = value;
        });
    }

    // Emergency service tracking
    const emergencyButtons = document.querySelectorAll('a[href="tel:5551234567"]');
    emergencyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Track emergency service calls
            console.log('Emergency service call initiated');
            
            // You could send analytics data here
            if (typeof gtag !== 'undefined') {
                gtag('event', 'emergency_call', {
                    'event_category': 'contact',
                    'event_label': 'emergency_service'
                });
            }
        });
    });

    // Form field focus effects
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.addEventListener('focus', function() {
            this.parentNode.classList.add('form-group--focused');
        });
        
        control.addEventListener('blur', function() {
            this.parentNode.classList.remove('form-group--focused');
            
            // Add validation styling
            if (this.value.trim() && this.checkValidity()) {
                this.classList.add('form-control--valid');
                this.classList.remove('form-control--invalid');
            } else if (this.value.trim() && !this.checkValidity()) {
                this.classList.add('form-control--invalid');
                this.classList.remove('form-control--valid');
            }
        });
    });

    // Lazy loading for placeholder image
    const aboutPlaceholder = document.querySelector('.about__placeholder');
    if (aboutPlaceholder) {
        // Add a subtle animation
        aboutPlaceholder.style.backgroundImage = 'linear-gradient(135deg, var(--fc-primary), var(--fc-success))';
        
        // You could replace this with actual image loading logic
        setTimeout(() => {
            aboutPlaceholder.style.opacity = '1';
        }, 500);
    }

    // Header scroll behavior
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // CTA Button tracking
    const ctaButtons = document.querySelectorAll('.btn--primary, .btn--secondary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            console.log(`CTA clicked: ${buttonText}`);
            
            // You could send analytics data here
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    'event_category': 'engagement',
                    'event_label': buttonText.toLowerCase().replace(/\s+/g, '_')
                });
            }
        });
    });
});

// Utility function for smooth scrolling
function scrollToElement(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    if (element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = element.offsetTop - headerHeight - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Add CSS for mobile menu toggle and animations
const additionalStyles = `
    .nav__menu--active {
        display: flex !important;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: var(--fc-surface);
        flex-direction: column;
        padding: 1rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        border-top: 1px solid var(--fc-divider);
    }

    .nav__toggle--active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }

    .nav__toggle--active span:nth-child(2) {
        opacity: 0;
    }

    .nav__toggle--active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }

    .header--scrolled {
        background-color: rgba(253, 251, 249, 0.95);
        backdrop-filter: blur(10px);
    }

    .form-message {
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        font-weight: 500;
    }

    .form-message--success {
        background-color: rgba(120, 167, 117, 0.1);
        color: var(--fc-success);
        border: 1px solid var(--fc-success);
    }

    .form-message--error {
        background-color: rgba(192, 89, 75, 0.1);
        color: var(--fc-error);
        border: 1px solid var(--fc-error);
    }

    .form-group--focused .form-label {
        color: var(--fc-primary);
    }

    .form-control--valid {
        border-color: var(--fc-success);
    }

    .form-control--invalid {
        border-color: var(--fc-error);
    }

    .fade-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .header {
        transition: transform 0.3s ease, background-color 0.3s ease;
    }

    @media (max-width: 768px) {
        .nav__menu {
            display: none;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);