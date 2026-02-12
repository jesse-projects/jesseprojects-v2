// Main JavaScript - Navigation and global functionality
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navToggle = document.querySelector('.nav-toggle');
    const navOverlay = document.querySelector('.nav-overlay');
    const navClose = document.querySelector('.nav-close');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Open navigation
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navOverlay.classList.add('active');
            navToggle.setAttribute('aria-expanded', 'true');
            
            // Focus management
            const firstNavLink = navOverlay.querySelector('.nav-menu a');
            if (firstNavLink) {
                firstNavLink.focus();
            }
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        });
    }

    // Close navigation
    function closeNavigation() {
        navOverlay.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        
        // Return focus to toggle button
        navToggle.focus();
    }

    if (navClose) {
        navClose.addEventListener('click', closeNavigation);
    }

    // Close navigation when clicking overlay
    navOverlay.addEventListener('click', function(e) {
        if (e.target === navOverlay) {
            closeNavigation();
        }
    });

    // Close navigation when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            closeNavigation();
            
            // Handle smooth scrolling for anchor links
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ 
                        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' 
                    });
                }
            }
        });
    });

    // Keyboard navigation for overlay
    navOverlay.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeNavigation();
        }
        
        // Trap focus within navigation
        if (e.key === 'Tab') {
            const focusableElements = navOverlay.querySelectorAll('button, a');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });

    // Smooth scrolling for all anchor links
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            const href = e.target.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href;
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
                    });
                }
            }
        }
    });

    // Intersection Observer for section visibility
    const sections = document.querySelectorAll('.content-section, .hero-section');
    const navLinksArray = Array.from(navLinks);
    
    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    
                    // Update active nav link
                    navLinksArray.forEach(link => {
                        const href = link.getAttribute('href');
                        link.classList.toggle('active', href === `#${sectionId}`);
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-50px 0px'
        });

        sections.forEach(section => {
            if (section.id) {
                sectionObserver.observe(section);
            }
        });
    }

    // Form validation utilities
    window.formValidation = {
        validateEmail: function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        
        validatePhone: function(phone) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
            return cleanPhone.length >= 10 && phoneRegex.test(cleanPhone);
        },
        
        showError: function(input, message) {
            const errorElement = document.getElementById(input.id + '-error') || 
                               input.parentNode.querySelector('.error-message');
            
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.classList.add('show');
                errorElement.setAttribute('aria-live', 'assertive');
            }
            
            input.setAttribute('aria-invalid', 'true');
            input.classList.add('error');
        },
        
        clearError: function(input) {
            const errorElement = document.getElementById(input.id + '-error') || 
                               input.parentNode.querySelector('.error-message');
            
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('show');
                errorElement.removeAttribute('aria-live');
            }
            
            input.setAttribute('aria-invalid', 'false');
            input.classList.remove('error');
        },
        
        showFormMessage: function(container, message, type) {
            const messageElement = container.querySelector('.form-message') ||
                                 document.getElementById('form-response');
            
            if (messageElement) {
                messageElement.textContent = message;
                messageElement.className = `form-message ${type}`;
                messageElement.style.display = 'block';
                messageElement.setAttribute('aria-live', 'assertive');
                
                // Scroll message into view
                messageElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }
        }
    };

    // Loading state management
    window.loadingState = {
        show: function(button) {
            if (!button) return;
            
            const btnText = button.querySelector('.btn-text');
            const btnLoading = button.querySelector('.btn-loading');
            
            if (btnText) btnText.classList.add('hidden');
            if (btnLoading) btnLoading.classList.remove('hidden');
            
            button.disabled = true;
            button.setAttribute('aria-busy', 'true');
        },
        
        hide: function(button) {
            if (!button) return;
            
            const btnText = button.querySelector('.btn-text');
            const btnLoading = button.querySelector('.btn-loading');
            
            if (btnText) btnText.classList.remove('hidden');
            if (btnLoading) btnLoading.classList.add('hidden');
            
            button.disabled = false;
            button.setAttribute('aria-busy', 'false');
        }
    };

    // Utility functions
    window.utils = {
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        throttle: function(func, limit) {
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
        },
        
        formatDate: function(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        
        sanitizeHTML: function(str) {
            const temp = document.createElement('div');
            temp.textContent = str;
            return temp.innerHTML;
        }
    };

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                
                console.log(`Page load time: ${pageLoadTime}ms`);
                
                // Send to analytics if available
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'timing_complete', {
                        name: 'load',
                        value: pageLoadTime
                    });
                }
            }, 0);
        });
    }

    // Service worker registration for offline functionality
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('SW registered: ', registration);
                })
                .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    // Initialize carousel and scroll manager
    const carouselContainer = document.querySelector('.carousel-container');
    let carousel = null;
    let scrollManager = null;
    let router = null;
    
    if (carouselContainer) {
        carousel = new AccessibleCarousel(carouselContainer);
        window.carousel = carousel; // Make carousel globally accessible to router
        
        // Initialize scroll manager after carousel is ready
        setTimeout(() => {
            if (window.ScrollManager) {
                scrollManager = new ScrollManager();
                scrollManager.setCarousel(carousel);
                window.scrollManager = scrollManager; // Make globally accessible
                
                // Initialize router with scroll manager
                if (window.Router) {
                    router = new Router(scrollManager);
                    window.router = router; // Make globally accessible
                }
            }
        }, 100);
    }

    // Initialize all modules
    console.log('JesseProjects website initialized');
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // Report to error tracking service if available
    if (typeof Sentry !== 'undefined') {
        Sentry.captureException(e.error);
    }
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    
    if (typeof Sentry !== 'undefined') {
        Sentry.captureException(e.reason);
    }
});
