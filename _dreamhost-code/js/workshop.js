// Workshop module - handles workshop/project display
class Workshop {
    constructor() {
        this.workshopGrid = document.getElementById('workshop-grid');
        this.workshops = [];
        this.currentFilter = 'all';
        this.loadWorkshopItems();
    }
    
    async loadWorkshopItems() {
        try {
            const response = await fetch('api/workshops.php');
            const data = await response.json();
            
            this.workshops = data.workshops || [];
            this.createFilterButtons();
            this.displayWorkshopItems(this.workshops);
        } catch (error) {
            console.error('Failed to load workshop items:', error);
            this.showWorkshopError();
        }
    }
    
    displayWorkshopItems(workshops) {
        if (!this.workshopGrid) return;
        
        if (workshops.length === 0) {
            this.workshopGrid.innerHTML = '<div class="no-workshops">No workshop projects available at this time.</div>';
            return;
        }
        
        // Group workshops by category
        const categorizedWorkshops = this.groupByCategory(workshops);
        
        let workshopsHTML = '';
        
        // Sort categories alphabetically for consistent display
        const sortedCategories = Object.keys(categorizedWorkshops).sort();
        
        for (const category of sortedCategories) {
            const categoryWorkshops = categorizedWorkshops[category];
            workshopsHTML += `
                <div class="workshop-category-section" style="width: 100%; display: block; clear: both;">
                    <h3 class="category-title">${category}</h3>
                    <div class="workshop-category-grid">
                        ${categoryWorkshops.map(workshop => this.generateWorkshopCard(workshop)).join('')}
                    </div>
                </div>
            `;
        }
        
        this.workshopGrid.innerHTML = workshopsHTML;
    }
    
    createFilterButtons() {
        if (!this.workshops.length) return;
        
        // Get unique categories
        const categories = [...new Set(this.workshops.map(w => w.category))].sort();
        
        // Create filter container if it doesn't exist
        let filterContainer = document.getElementById('workshop-filters');
        if (!filterContainer) {
            const workshopSection = document.getElementById('workshop-content');
            if (workshopSection && workshopSection.querySelector('.container')) {
                const container = workshopSection.querySelector('.container');
                filterContainer = document.createElement('div');
                filterContainer.id = 'workshop-filters';
                filterContainer.className = 'workshop-filters';
                container.insertBefore(filterContainer, this.workshopGrid);
            }
        }
        
        if (!filterContainer) return;
        
        // Create filter buttons
        const filterHTML = `
            <div class="filter-buttons">
                <button class="filter-btn ${this.currentFilter === 'all' ? 'active' : ''}" data-filter="all">All Projects</button>
                ${categories.map(category => 
                    `<button class="filter-btn ${this.currentFilter === category ? 'active' : ''}" data-filter="${category.toLowerCase()}">${category}</button>`
                ).join('')}
            </div>
        `;
        
        filterContainer.innerHTML = filterHTML;
        
        // Add event listeners
        filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const filter = btn.getAttribute('data-filter');
                this.setFilter(filter);
            });
        });
    }
    
    setFilter(filter) {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
        });
        
        this.currentFilter = filter;
        
        // Filter and display workshops
        const filteredWorkshops = filter === 'all' 
            ? this.workshops 
            : this.workshops.filter(w => w.category.toLowerCase() === filter);
            
        this.displayWorkshopItems(filteredWorkshops);
        
        // Dispatch category change event for URL updates  
        const categoryHash = filter === 'all' ? '' : filter;
        document.dispatchEvent(new CustomEvent('category:changed', {
            detail: { 
                section: 'workshop',
                category: categoryHash
            }
        }));
        
        // Also update browser URL directly
        const currentUrl = window.location.pathname;
        const newUrl = categoryHash ? `${currentUrl}#${categoryHash}` : currentUrl;
        window.history.replaceState(null, '', newUrl);
    }
    
    groupByCategory(workshops) {
        const grouped = {};
        workshops.forEach(workshop => {
            if (!grouped[workshop.category]) {
                grouped[workshop.category] = [];
            }
            grouped[workshop.category].push(workshop);
        });
        return grouped;
    }
    
    generateWorkshopCard(workshop) {
        const metaItems = [];
        
        if (workshop.difficulty) {
            metaItems.push(`<span class="difficulty">${workshop.difficulty}</span>`);
        }
        
        if (workshop.estimated_time) {
            metaItems.push(`<span class="duration">${workshop.estimated_time}</span>`);
        }
        
        const metaHTML = metaItems.length > 0 ? 
            `<div class="workshop-meta">${metaItems.join('')}</div>` : '';
        
        const descriptionHTML = workshop.short_description ? 
            `<p class="workshop-description">${workshop.short_description}</p>` : '';
        
        // Handle NSFW content
        const isNSFW = workshop.nsfw === true || workshop.nsfw === 'true';
        const imageClasses = isNSFW ? 'workshop-image nsfw-content' : 'workshop-image';
        const cardClasses = isNSFW ? 'workshop-card nsfw-workshop' : 'workshop-card';
        const nsfwOverlay = isNSFW ? `
            <div class="nsfw-overlay">
                <div class="nsfw-warning">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span>NSFW Content</span>
                </div>
            </div>
        ` : '';
        
        return `
            <div class="${cardClasses}" data-workshop="${workshop.id}" onclick="workshop.${isNSFW ? 'handleNSFWClick' : 'openWorkshop'}('${workshop.id}')">
                <div class="${imageClasses}">
                    <img src="${workshop.hero_image}" alt="${workshop.title}" loading="lazy">
                    ${nsfwOverlay}
                    <div class="workshop-title-overlay">
                        <h4>${workshop.title}</h4>
                    </div>
                </div>
                <div class="workshop-content">
                    ${descriptionHTML}
                    ${metaHTML}
                </div>
            </div>
        `;
    }
    
    showWorkshopError() {
        if (this.workshopGrid) {
            this.workshopGrid.innerHTML = '<div class="error-message">Unable to load workshop projects. Please try again later.</div>';
        }
    }
    
    async openWorkshop(workshopId) {
        try {
            const response = await fetch(`/api/workshops.php?id=${encodeURIComponent(workshopId)}`);
            const data = await response.json();
            
            if (data.workshop) {
                this.showWorkshopModal(data.workshop);
            } else {
                console.error('Workshop not found:', workshopId);
                alert('Sorry, this workshop could not be found.');
            }
        } catch (error) {
            console.error('Error loading workshop:', error);
            alert('Error loading workshop details.');
        }
    }
    
    showWorkshopModal(workshop) {
        // Store workshop images for lightbox access
        this.currentWorkshopImages = workshop.images ? workshop.images.map(img => img.path) : [];
        
        // Create modal HTML
        const modalHTML = `
            <div class="workshop-modal-overlay" onclick="workshop.closeWorkshopModal()">
                <div class="workshop-modal" onclick="event.stopPropagation()" role="dialog" aria-labelledby="workshop-title" aria-modal="true">
                    <div class="workshop-modal-header">
                        <h2 id="workshop-title">${workshop.title}</h2>
                        <button class="modal-close" onclick="workshop.closeWorkshopModal()" aria-label="Close workshop details">×</button>
                    </div>
                    <div class="workshop-modal-content">
                        <div class="workshop-info">
                            ${workshop.short_description ? `<p class="workshop-description">${workshop.short_description}</p>` : ''}
                        </div>
                        
                        <div class="workshop-gallery">
                            ${this.generateWorkshopGallery(workshop)}
                        </div>
                        
                        <div class="workshop-details">
                            ${workshop.difficulty ? `<div class="detail-item"><strong>Difficulty:</strong> ${workshop.difficulty}</div>` : ''}
                            ${workshop.estimated_time ? `<div class="detail-item"><strong>Time:</strong> ${workshop.estimated_time}</div>` : ''}
                            ${workshop.materials ? `<div class="detail-item"><strong>Materials:</strong> ${workshop.materials.join(', ')}</div>` : ''}
                            ${workshop.tools ? `<div class="detail-item"><strong>Tools:</strong> ${workshop.tools.join(', ')}</div>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Set up lightbox triggers
        this.setupLightboxTriggers(workshop.title);
        
        // Focus management for accessibility
        const modal = document.querySelector('.workshop-modal');
        const closeButton = modal.querySelector('.modal-close');
        closeButton.focus();
        
        // Handle escape key
        this.escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeWorkshopModal();
            }
        };
        document.addEventListener('keydown', this.escapeHandler);
    }
    
    setupLightboxTriggers(title) {
        const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
        lightboxTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.openImageLightbox(index, this.currentWorkshopImages, title);
            });
        });
    }
    
    generateWorkshopGallery(workshop) {
        if (workshop.has_steps && workshop.steps) {
            // Step-by-step display
            return `
                <div class="workshop-steps">
                    <h3>Project Steps</h3>
                    ${workshop.steps.map((step, index) => `
                        <div class="workshop-step">
                            <div class="step-number">${index + 1}</div>
                            <div class="step-content">
                                ${step.image ? `<img src="workshops/${workshop.id}/${step.image}" alt="${step.title}" loading="lazy">` : ''}
                                <div class="step-text">
                                    <h4>${step.title}</h4>
                                    <p>${step.description}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            // Simple image gallery
            return `
                <div class="workshop-images">
                    <div class="image-grid">
                        ${workshop.images.map((image, index) => `
                            <div class="image-item">
                                <img src="${image.path}" alt="${workshop.title}" loading="lazy" data-index="${index}" class="lightbox-trigger">
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    closeWorkshopModal() {
        const modal = document.querySelector('.workshop-modal-overlay');
        if (modal) {
            modal.remove();
            document.body.style.overflow = ''; // Restore scrolling
            
            // Remove escape key handler
            if (this.escapeHandler) {
                document.removeEventListener('keydown', this.escapeHandler);
                this.escapeHandler = null;
            }
        }
    }
    
    openImageLightbox(currentIndex, imagePaths, alt) {
        this.lightboxImages = imagePaths;
        this.currentLightboxIndex = currentIndex;
        
        // Enhanced lightbox with navigation
        const lightboxHTML = `
            <div class="image-lightbox-overlay" onclick="workshop.closeLightbox()">
                <div class="image-lightbox" onclick="event.stopPropagation()">
                    <img id="lightbox-image" src="${imagePaths[currentIndex]}" alt="${alt}" />
                    <button class="lightbox-close" onclick="workshop.closeLightbox()" aria-label="Close image">×</button>
                    ${imagePaths.length > 1 ? `
                        <button class="lightbox-nav lightbox-prev" onclick="workshop.navigateLightbox(-1)" aria-label="Previous image">‹</button>
                        <button class="lightbox-nav lightbox-next" onclick="workshop.navigateLightbox(1)" aria-label="Next image">›</button>
                        <div class="lightbox-counter">${currentIndex + 1} / ${imagePaths.length}</div>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        document.body.style.overflow = 'hidden';
        
        // Add keyboard navigation
        this.lightboxKeyHandler = (e) => {
            switch(e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.navigateLightbox(-1);
                    break;
                case 'ArrowRight':
                    this.navigateLightbox(1);
                    break;
            }
        };
        document.addEventListener('keydown', this.lightboxKeyHandler);
    }
    
    navigateLightbox(direction) {
        if (!this.lightboxImages || this.lightboxImages.length <= 1) return;
        
        this.currentLightboxIndex += direction;
        
        // Handle wraparound
        if (this.currentLightboxIndex < 0) {
            this.currentLightboxIndex = this.lightboxImages.length - 1;
        } else if (this.currentLightboxIndex >= this.lightboxImages.length) {
            this.currentLightboxIndex = 0;
        }
        
        // Update image and counter
        const lightboxImage = document.getElementById('lightbox-image');
        const counter = document.querySelector('.lightbox-counter');
        
        if (lightboxImage) {
            lightboxImage.src = this.lightboxImages[this.currentLightboxIndex];
        }
        
        if (counter) {
            counter.textContent = `${this.currentLightboxIndex + 1} / ${this.lightboxImages.length}`;
        }
    }
    
    closeLightbox() {
        const lightbox = document.querySelector('.image-lightbox-overlay');
        if (lightbox) {
            lightbox.remove();
            document.body.style.overflow = '';
        }
        
        // Remove keyboard handler
        if (this.lightboxKeyHandler) {
            document.removeEventListener('keydown', this.lightboxKeyHandler);
            this.lightboxKeyHandler = null;
        }
        
        // Clean up lightbox state
        this.lightboxImages = null;
        this.currentLightboxIndex = 0;
    }
    
    handleNSFWClick(workshopId) {
        // Check if user has already consented to NSFW content
        const nsfwPreference = localStorage.getItem('nsfwPreference');
        
        if (nsfwPreference === 'allowed-all') {
            this.openWorkshop(workshopId);
            return;
        }
        
        // Show NSFW warning modal
        this.showNSFWWarning(workshopId);
    }
    
    showNSFWWarning(workshopId) {
        const modalHTML = `
            <div class="nsfw-modal-overlay" onclick="workshop.closeNSFWWarning()">
                <div class="nsfw-modal" onclick="event.stopPropagation()" role="dialog" aria-labelledby="nsfw-title" aria-modal="true">
                    <div class="nsfw-modal-header">
                        <h2 id="nsfw-title">Content Warning</h2>
                        <button class="modal-close" onclick="workshop.closeNSFWWarning()" aria-label="Close warning">×</button>
                    </div>
                    <div class="nsfw-modal-content">
                        <div class="nsfw-warning-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                            </svg>
                        </div>
                        <p>This project contains content that may not be suitable for work environments or all audiences. This may include crude language, suggestive imagery, or mature themes.</p>
                        <p>How would you like to proceed?</p>
                        <div class="nsfw-actions">
                            <button class="nsfw-btn secondary" onclick="workshop.closeNSFWWarning()">No Thanks</button>
                            <button class="nsfw-btn primary" onclick="workshop.allowNSFWContent('${workshopId}', 'this-project')">View This Project</button>
                            <button class="nsfw-btn primary" onclick="workshop.allowNSFWContent('${workshopId}', 'all-projects')">Allow All Projects</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const modal = document.querySelector('.nsfw-modal');
        if (modal) {
            modal.focus();
        }
    }
    
    allowNSFWContent(workshopId, scope) {
        if (scope === 'all-projects') {
            localStorage.setItem('nsfwPreference', 'allowed-all');
            // Remove blur from all NSFW workshops
            document.querySelectorAll('.nsfw-workshop .nsfw-content').forEach(img => {
                img.classList.add('nsfw-approved');
            });
        } else if (scope === 'this-project') {
            // Just remove blur from this specific project
            const workshopCard = document.querySelector(`[data-workshop="${workshopId}"]`);
            if (workshopCard) {
                const nsfwContent = workshopCard.querySelector('.nsfw-content');
                if (nsfwContent) {
                    nsfwContent.classList.add('nsfw-approved');
                }
            }
        }
        
        this.closeNSFWWarning();
        this.openWorkshop(workshopId);
    }
    
    closeNSFWWarning() {
        const modal = document.querySelector('.nsfw-modal-overlay');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    }
}

// Initialize workshop module when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('workshop-content')) {
        window.workshop = new Workshop();
    }
});