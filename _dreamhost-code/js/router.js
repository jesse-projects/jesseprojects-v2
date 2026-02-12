/**
 * URL Router for Single Page App
 * Handles URL routing, history management, and deep linking
 */
class Router {
    constructor(scrollManager) {
        this.scrollManager = scrollManager;
        this.routes = {
            '': 'photography',          // Default to photography
            'photography': 'photography',
            'workshop': 'workshop', 
            'community': 'community',
            'about': 'about'
        };
        this.currentRoute = '';
        this.currentHash = '';
        this.isUpdatingFromScroll = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.handleInitialLoad();
    }
    
    setupEventListeners() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state) {
                this.handleRouteChange(e.state.section, e.state.hash, false);
            } else {
                this.handleInitialLoad();
            }
        });
        
        // Listen for carousel changes to update URL
        document.addEventListener('carousel:slideChanged', (e) => {
            if (!this.isUpdatingFromScroll) {
                const slideData = e.detail;
                this.updateURL(slideData.id, '', true);
            }
        });
        
        // Listen for scroll changes to update hash
        document.addEventListener('scroll:sectionChanged', (e) => {
            this.isUpdatingFromScroll = true;
            const section = e.detail.section;
            const hash = e.detail.hash || '';
            this.updateURL(section, hash, true);
            setTimeout(() => this.isUpdatingFromScroll = false, 100);
        });
        
        // Listen for category changes to update hash
        document.addEventListener('category:changed', (e) => {
            const section = e.detail.section;
            const category = e.detail.category;
            this.updateURL(section, category, true);
        });
        
        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="/"], a[href^="#"], a[href^="./"]');
            if (link) {
                e.preventDefault();
                const href = link.getAttribute('href');
                this.navigateFromLink(href);
                
                // Also navigate carousel to match section
                if (href.startsWith('./')) {
                    const section = href.substring(2).split('#')[0];
                    this.syncCarouselWithSection(section);
                }
            }
        });
    }
    
    navigateFromLink(href) {
        let section = '';
        let hash = '';
        
        if (href.startsWith('./')) {
            section = href.substring(2);
        } else if (href.startsWith('#')) {
            hash = href.substring(1);
            section = this.currentRoute || 'photography';
        } else if (href.startsWith('/')) {
            const path = href.substring(1);
            const [sectionPart, hashPart] = path.split('#');
            section = sectionPart || 'photography';
            hash = hashPart || '';
        }
        
        this.navigateTo(section, hash);
    }
    
    navigateTo(section, hash = '') {
        if (this.routes[section]) {
            this.handleRouteChange(section, hash, true);
        }
    }
    
    handleRouteChange(section, hash, addToHistory, isInitialLoad = false) {
        this.currentRoute = section;
        this.currentHash = hash;
        
        // Update URL without triggering navigation
        if (addToHistory) {
            this.updateURL(section, hash, addToHistory);
        }
        
        // Navigate to section - skip scroll on initial page load
        this.scrollManager.navigateToSection(section, hash, isInitialLoad);
    }
    
    updateURL(section, hash = '', addToHistory = false) {
        const url = section ? `#${section}` : '#';
        const fullUrl = hash ? `${url}/${hash}` : url;
        
        const state = { section, hash };
        
        if (addToHistory) {
            window.history.pushState(state, '', fullUrl);
        } else {
            window.history.replaceState(state, '', fullUrl);
        }
        
        this.currentRoute = section;
        this.currentHash = hash;
    }
    
    handleInitialLoad() {
        let section = 'photography'; // default
        let hash = '';
        
        // Check for hash-based routing (URL fragments)
        if (window.location.hash) {
            const hashPart = window.location.hash.substring(1); // Remove #
            const [sectionPart, subHash] = hashPart.split('/');
            section = sectionPart || 'photography';
            hash = subHash || '';
        }
        
        // Handle route - pass true as third param to indicate initial load (don't scroll)
        this.handleRouteChange(section, hash, false, true);
    }
    
    getCurrentSection() {
        return this.currentRoute;
    }
    
    syncCarouselWithSection(section) {
        // Find carousel and sync it to the section
        if (window.carousel && typeof window.carousel.navigateToSection === 'function') {
            window.carousel.navigateToSection(section);
        } else if (this.scrollManager && this.scrollManager.carousel) {
            this.scrollManager.carousel.navigateToSection(section);
        }
    }
    
    getCurrentHash() {
        return this.currentHash;
    }
}

// Export for use in other modules
window.Router = Router;