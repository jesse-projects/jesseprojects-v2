// Accessible Carousel Implementation
class AccessibleCarousel {
    constructor(container) {
        this.container = container;
        this.slidesContainer = container.querySelector('.carousel-slides');
        this.indicatorsContainer = container.querySelector('.carousel-indicators');
        this.prevBtn = container.querySelector('.carousel-btn.prev');
        this.nextBtn = container.querySelector('.carousel-btn.next');
        this.playPauseBtn = container.querySelector('.carousel-play-pause');
        
        this.currentSlide = 0;
        this.previousSlide = 0;
        this.totalSlides = 0;
        this.isPlaying = true;
        this.autoplayInterval = null;
        this.autoplayDelay = 7000;
        this.slides = [];
        this.indicators = [];
        this.isPausedFromScroll = false;
        
        // Check for reduced motion preference
        this.respectsReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.loadSlides();
    }
    
    async loadSlides() {
        try {
            const response = await fetch('data/carousel-slides.json');
            const data = await response.json();
            
            // Store slides data for reference in notifySlideChange
            this.slidesData = data.slides;
            
            this.createSlides(data.slides);
            this.createIndicators(data.slides.length);
            this.updateReferences();
            this.init();
        } catch (error) {
            console.error('Failed to load carousel slides:', error);
            // Fallback to any existing slides in HTML
            this.updateReferences();
            this.init();
        }
    }
    
    createSlides(slidesData) {
        this.slidesContainer.innerHTML = '';
        
        slidesData.forEach((slide, index) => {
            const slideElement = document.createElement('article');
            slideElement.className = `carousel-slide${index === 0 ? ' active' : ''}`;
            slideElement.setAttribute('data-slide', index);
            slideElement.setAttribute('aria-current', index === 0 ? 'true' : 'false');
            
            // Check if this slide has a background image
            const hasBackgroundImage = slide.background_image;
            
            if (hasBackgroundImage) {
                slideElement.classList.add('has-background');
                slideElement.innerHTML = `
                    <div class="slide-background" style="background-image: url('${slide.background_image}')"></div>
                    <div class="slide-content-overlay">
                        <h1>${slide.title}</h1>
                        <p>${slide.description}</p>
                        ${slide.cta_text && slide.cta_link ? `<a href="${slide.cta_link}" class="cta-button">${slide.cta_text}</a>` : ''}
                    </div>
                `;
            } else {
                slideElement.innerHTML = `
                    <div class="slide-content">
                        <h1>${slide.title}</h1>
                        <p>${slide.description}</p>
                        ${slide.cta_text && slide.cta_link ? `<a href="${slide.cta_link}" class="cta-button">${slide.cta_text}</a>` : ''}
                    </div>
                    <div class="slide-image">
                        <div class="image-placeholder">${slide.image_placeholder}</div>
                    </div>
                `;
            }
            
            this.slidesContainer.appendChild(slideElement);
        });
    }
    
    createIndicators(slideCount) {
        this.indicatorsContainer.innerHTML = '';
        
        for (let i = 0; i < slideCount; i++) {
            const indicator = document.createElement('button');
            indicator.setAttribute('role', 'tab');
            indicator.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
            indicator.setAttribute('data-slide', i);
            indicator.className = i === 0 ? 'active' : '';
            
            this.indicatorsContainer.appendChild(indicator);
        }
    }
    
    updateReferences() {
        this.slides = this.container.querySelectorAll('.carousel-slide');
        this.indicators = this.container.querySelectorAll('.carousel-indicators button');
        this.totalSlides = this.slides.length;
    }

    init() {
        if (this.totalSlides === 0) return;
        
        this.setupEventListeners();
        this.updateAriaAttributes();
        
        // Notify scroll manager of initial slide
        this.notifySlideChange();
        
        // Set initial container class
        this.updateContainerClass();
        
        this.startAutoplay();
        
        // Update play/pause button initial state
        this.updatePlayPauseButton();
    }
    
    setupEventListeners() {
        // Previous/Next buttons
        this.prevBtn.addEventListener('click', () => this.goToPrevSlide());
        this.nextBtn.addEventListener('click', () => this.goToNextSlide());
        
        // Play/Pause button
        this.playPauseBtn.addEventListener('click', () => this.toggleAutoplay());
        
        // Indicator buttons
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Keyboard navigation - make container focusable
        this.container.setAttribute('tabindex', '0');
        this.container.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Touch/Swipe support
        this.setupTouchEvents();
        
        // Pause on hover/focus
        this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.container.addEventListener('mouseleave', () => this.resumeAutoplay());
        this.container.addEventListener('focusin', () => this.pauseAutoplay());
        this.container.addEventListener('focusout', () => this.resumeAutoplay());
        
        // Handle reduced motion changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.respectsReducedMotion = e.matches;
            if (this.respectsReducedMotion && this.isPlaying) {
                this.stopAutoplay();
            }
        });
        
        // Handle scroll-based pausing
        this.setupScrollListener();
    }
    
    setupScrollListener() {
        let ticking = false;
        
        const checkScrollPosition = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const viewportHeight = window.innerHeight;
            const scrollThreshold = viewportHeight * 0.25; // 25% of viewport height
            
            if (scrollTop > scrollThreshold) {
                if (!this.isPausedFromScroll) {
                    this.isPausedFromScroll = true;
                    this.pauseAutoplay();
                }
            } else {
                if (this.isPausedFromScroll) {
                    this.isPausedFromScroll = false;
                    this.resumeAutoplay();
                }
            }
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(checkScrollPosition);
                ticking = true;
            }
        }, { passive: true });
    }
    
    setupTouchEvents() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        this.container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe(startX, startY, endX, endY);
        }, { passive: true });
    }
    
    handleSwipe(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;
        
        // Only handle horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                this.goToPrevSlide();
            } else {
                this.goToNextSlide();
            }
        }
    }
    
    handleKeydown(e) {
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.goToPrevSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.goToNextSlide();
                break;
            case ' ':
                e.preventDefault();
                this.toggleAutoplay();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides - 1);
                break;
        }
    }
    
    goToSlide(index, direction = null) {
        if (index === this.currentSlide) return;
        
        this.previousSlide = this.currentSlide;
        this.currentSlide = index;
        
        this.updateSlides(direction);
        this.updateIndicators();
        this.updateAriaAttributes();
        
        // Announce slide change to screen readers
        this.announceSlideChange();
        
        // Notify scroll manager of slide change
        this.notifySlideChange();
    }
    
    goToNextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex, 'next');
    }
    
    goToPrevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex, 'prev');
    }
    
    updateSlides(direction) {
        const previousSlide = this.previousSlide;
        
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
            
            // Add transition classes for smoother animations if motion is not reduced
            if (!this.respectsReducedMotion && direction) {
                slide.classList.remove('slide-in-left', 'slide-in-right', 'slide-out-left', 'slide-out-right');
                
                // Animate incoming slide (slides in from right for next, left for prev)
                if (index === this.currentSlide) {
                    slide.classList.add(direction === 'next' ? 'slide-in-left' : 'slide-in-right');
                }
                
                // Animate outgoing slide (slides out to left for next, right for prev) 
                if (index === previousSlide) {
                    slide.classList.add(direction === 'next' ? 'slide-out-left' : 'slide-out-right');
                }
            }
        });
        
        // Update carousel container class based on current slide
        this.updateContainerClass();
        
        // Clean up animation classes after animation completes
        setTimeout(() => {
            this.slides.forEach(slide => {
                slide.classList.remove('slide-in-left', 'slide-in-right', 'slide-out-left', 'slide-out-right');
            });
        }, 800);
    }
    
    updateContainerClass() {
        const currentSlide = this.slides[this.currentSlide];
        if (currentSlide && currentSlide.classList.contains('has-background')) {
            this.container.classList.add('has-background-slide');
        } else {
            this.container.classList.remove('has-background-slide');
        }
    }
    
    updateIndicators() {
        this.indicators.forEach((indicator, index) => {
            const isActive = index === this.currentSlide;
            indicator.classList.toggle('active', isActive);
            indicator.setAttribute('aria-selected', isActive.toString());
        });
    }
    
    updateAriaAttributes() {
        this.slides.forEach((slide, index) => {
            const isActive = index === this.currentSlide;
            slide.setAttribute('aria-current', isActive.toString());
            slide.setAttribute('aria-hidden', (!isActive).toString());
        });
        
        // Update navigation button states
        this.prevBtn.setAttribute('aria-label', `Previous slide (${this.currentSlide + 1} of ${this.totalSlides})`);
        this.nextBtn.setAttribute('aria-label', `Next slide (${this.currentSlide + 1} of ${this.totalSlides})`);
    }
    
    updatePlayPauseButton() {
        const pauseIcon = this.playPauseBtn.querySelector('.pause-icon');
        const playIcon = this.playPauseBtn.querySelector('.play-icon');
        
        if (this.isPlaying) {
            this.playPauseBtn.setAttribute('aria-label', 'Pause slideshow');
            this.playPauseBtn.setAttribute('data-playing', 'true');
            pauseIcon.classList.remove('hidden');
            playIcon.classList.add('hidden');
        } else {
            this.playPauseBtn.setAttribute('aria-label', 'Play slideshow');
            this.playPauseBtn.setAttribute('data-playing', 'false');
            pauseIcon.classList.add('hidden');
            playIcon.classList.remove('hidden');
        }
    }
    
    startAutoplay() {
        // Don't auto-advance if user prefers reduced motion or scrolled down
        if (this.respectsReducedMotion || this.isPausedFromScroll) {
            if (this.respectsReducedMotion) {
                this.isPlaying = false;
                this.updatePlayPauseButton();
            }
            return;
        }
        
        if (this.isPlaying && !this.autoplayInterval) {
            this.autoplayInterval = setInterval(() => {
                this.goToNextSlide();
            }, this.autoplayDelay);
        }
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    pauseAutoplay() {
        this.stopAutoplay();
    }
    
    resumeAutoplay() {
        if (this.isPlaying) {
            this.startAutoplay();
        }
    }
    
    toggleAutoplay() {
        this.isPlaying = !this.isPlaying;
        
        if (this.isPlaying) {
            this.startAutoplay();
        } else {
            this.stopAutoplay();
        }
        
        this.updatePlayPauseButton();
    }
    
    announceSlideChange() {
        const currentSlideContent = this.slides[this.currentSlide];
        const title = currentSlideContent.querySelector('h1')?.textContent;
        const description = currentSlideContent.querySelector('p')?.textContent;
        
        // Create announcement for screen readers
        const announcement = `Slide ${this.currentSlide + 1} of ${this.totalSlides}${title ? ': ' + title : ''}`;
        
        // Use aria-live region to announce changes
        let announcer = document.getElementById('slide-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'slide-announcer';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.style.position = 'absolute';
            announcer.style.left = '-10000px';
            announcer.style.width = '1px';
            announcer.style.height = '1px';
            announcer.style.overflow = 'hidden';
            document.body.appendChild(announcer);
        }
        
        announcer.textContent = announcement;
    }
    
    notifySlideChange() {
        const currentSlide = this.slides[this.currentSlide];
        if (!currentSlide) return;
        
        // Check for both slide types - regular and background image slides
        const slideContent = currentSlide.querySelector('.slide-content') || currentSlide.querySelector('.slide-content-overlay');
        if (!slideContent) return;
        
        const title = slideContent.querySelector('h1')?.textContent || '';
        
        // Get section ID from slide data attribute or fall back to extracting from CTA
        const slideIndex = parseInt(currentSlide.getAttribute('data-slide'));
        let sectionId = null;
        
        // Try to get section ID from stored slide data
        if (this.slidesData && this.slidesData[slideIndex]) {
            sectionId = this.slidesData[slideIndex].id;
        }
        
        // Fall back to extracting from CTA link if available
        if (!sectionId) {
            const ctaButton = slideContent.querySelector('.cta-button');
            if (ctaButton) {
                const ctaLink = ctaButton.getAttribute('href');
                sectionId = ctaLink.replace('.php', '');
            }
        }
        
        // Use slide index as fallback section ID
        if (!sectionId) {
            const slideMapping = ['photography', 'workshop', 'about'];
            sectionId = slideMapping[slideIndex] || 'photography';
        }
        
        // Dispatch custom event for scroll manager
        const event = new CustomEvent('carousel:slideChanged', {
            detail: {
                id: sectionId,
                title: title,
                index: this.currentSlide
            }
        });
        
        document.dispatchEvent(event);
    }
    
    destroy() {
        this.stopAutoplay();
        // Remove event listeners and clean up
        this.container.removeEventListener('keydown', this.handleKeydown);
        // Additional cleanup as needed
    }
    
    setScrollManager(scrollManager) {
        this.scrollManager = scrollManager;
    }
    
    navigateToSection(sectionId) {
        // Map section names to slide indices (community is disabled)
        const sectionMapping = {
            'photography': 0,
            'workshop': 1, 
            'about': 2
        };
        
        const slideIndex = sectionMapping[sectionId];
        
        if (slideIndex !== undefined && slideIndex !== this.currentSlide) {
            this.goToSlide(slideIndex);
        }
    }
}

// Carousel class is initialized by main.js, not here
