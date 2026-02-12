// Scroll-based content management
class ScrollManager {
    constructor() {
        this.carousel = null;
        this.sectionHeader = document.getElementById('section-header');
        this.sectionTitle = document.getElementById('current-section-title');
        this.contentSections = document.getElementById('content-sections');
        this.dynamicSections = document.querySelectorAll('.dynamic-section');
        this.heroSection = document.querySelector('.hero-section');
        
        this.currentSection = 'photography'; // Default to first slide
        this.hasScrolledPastCarousel = false;
        this.scrollThreshold = 0;
        
        this.init();
    }
    
    init() {
        this.calculateScrollThreshold();
        this.setupScrollListener();
        this.setupCarouselListener();
        
        // Don't show a section here - let the Router handle initial navigation
        // based on URL hash. This prevents overriding hash-based routes like /#workshop
    }
    
    navigateToSection(section, hash = '', skipScroll = false) {
        // Set the current section
        this.currentSection = section;
        this.showSection(section);
        
        // Skip scroll on initial page load
        if (skipScroll) {
            return;
        }
        
        // If there's a hash, scroll to that specific element
        if (hash) {
            setTimeout(() => {
                const element = document.getElementById(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Dispatch custom event for URL updates
                    document.dispatchEvent(new CustomEvent('scroll:sectionChanged', {
                        detail: { section, hash }
                    }));
                }
            }, 100);
        } else {
            // Scroll to the content sections area
            setTimeout(() => {
                if (this.contentSections) {
                    this.contentSections.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Dispatch custom event for URL updates
                    document.dispatchEvent(new CustomEvent('scroll:sectionChanged', {
                        detail: { section, hash: '' }
                    }));
                }
            }, 100);
        }
        
        // Update carousel to match section
        if (this.carousel && this.carousel.navigateToSection) {
            this.carousel.navigateToSection(section);
        }
        
        // Update section title
        this.updateSectionTitle(this.getSectionTitle(section));
    }
    
    calculateScrollThreshold() {
        if (this.heroSection) {
            this.scrollThreshold = this.heroSection.offsetHeight * 0.8;
        }
    }
    
    setupScrollListener() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    setupCarouselListener() {
        // Listen for carousel slide changes
        document.addEventListener('carousel:slideChanged', (e) => {
            const slideData = e.detail;
            this.currentSection = slideData.id;
            
            // Only switch content if user hasn't scrolled past carousel
            if (!this.hasScrolledPastCarousel) {
                this.showSection(this.currentSection);
            }
            
            // Update section title in header
            this.updateSectionTitle(slideData.title);
        });
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        const wasScrolledPast = this.hasScrolledPastCarousel;
        
        this.hasScrolledPastCarousel = scrollY > this.scrollThreshold;
        
        // Stop carousel autoplay when scrolling past
        if (this.hasScrolledPastCarousel && !wasScrolledPast) {
            this.pauseCarousel();
            this.showSectionHeader();
        }
        
        // Resume carousel when scrolling back up
        if (!this.hasScrolledPastCarousel && wasScrolledPast) {
            this.resumeCarousel();
            this.hideSectionHeader();
        }
    }
    
    showSection(sectionId) {
        // Hide all sections
        this.dynamicSections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('visible');
        });
        
        // Show current section
        const targetSection = document.getElementById(`${sectionId}-content`);
        if (targetSection) {
            targetSection.style.display = 'block';
            // Trigger fade in
            setTimeout(() => {
                targetSection.classList.add('visible');
            }, 50);
        }
        
        this.currentSection = sectionId;
    }
    
    updateSectionTitle(title) {
        if (this.sectionTitle) {
            this.sectionTitle.textContent = title;
        }
    }
    
    getSectionTitle(section) {
        const titles = {
            'photography': 'Photography',
            'workshop': 'Workshop', 
            'community': 'Community',
            'about': 'About'
        };
        return titles[section] || 'JesseProjects';
    }
    
    // Add method to detect subsections for hash fragments
    detectCurrentSubsection() {
        if (!this.hasScrolledPastCarousel) return '';
        
        const sections = document.querySelectorAll('.content-section [id], .dynamic-section [id]');
        const scrollY = window.scrollY + window.innerHeight / 3;
        
        let currentHash = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 3) {
                currentHash = section.id;
            }
        });
        
        return currentHash;
    }
    
    showSectionHeader() {
        if (this.sectionHeader) {
            this.sectionHeader.style.display = 'block';
            this.sectionHeader.classList.add('visible');
        }
    }
    
    hideSectionHeader() {
        if (this.sectionHeader) {
            this.sectionHeader.classList.remove('visible');
            // Hide after transition
            setTimeout(() => {
                if (!this.hasScrolledPastCarousel) {
                    this.sectionHeader.style.display = 'none';
                }
            }, 300);
        }
    }
    
    pauseCarousel() {
        if (this.carousel && this.carousel.isPlaying) {
            this.carousel.stopAutoplay();
        }
    }
    
    resumeCarousel() {
        if (this.carousel && !this.carousel.isPlaying) {
            this.carousel.startAutoplay();
        }
    }
    
    setCarousel(carousel) {
        this.carousel = carousel;
    }
}

// Export for use in main.js
window.ScrollManager = ScrollManager;