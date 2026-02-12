// Photography module - handles gallery display with modal lightbox
class Photography {
    constructor() {
        this.photographyGrid = document.getElementById('photography-grid');
        this.categories = [];
        this.currentCategory = null;
        this.currentImageIndex = 0;
        this.createModal();
        this.loadPhotographyCategories();
    }
    
    async loadPhotographyCategories() {
        try {
            const response = await fetch('api/photography.php');
            const data = await response.json();
            
            this.categories = data.categories || [];
            this.displayCategories(this.categories);
        } catch (error) {
            console.error('Failed to load photography categories:', error);
            this.showCategoriesError();
        }
    }
    
    displayCategories(categories) {
        if (!this.photographyGrid) return;
        
        const categoriesHTML = categories.map(category => `
            <div class="category-card" data-category="${category.id}">
                <div class="category-image">
                    <img src="${category.featured_image}" alt="${category.name}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="category-content">
                    <h3>${category.name}</h3>
                    <p>${category.description}</p>
                    <span class="photo-count">${category.photo_count} photos</span>
                </div>
            </div>
        `).join('');
        
        this.photographyGrid.innerHTML = categoriesHTML;
        
        this.photographyGrid.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const categoryId = card.dataset.category;
                this.openCategory(categoryId);
            });
        });
    }
    
    showCategoriesError() {
        if (this.photographyGrid) {
            this.photographyGrid.innerHTML = '<div class="error-message">Unable to load photography categories.</div>';
        }
    }
    
    createModal() {
        if (document.getElementById('photography-modal')) return;
        
        const modal = document.createElement('div');
        modal.id = 'photography-modal';
        modal.className = 'photo-modal';
        modal.innerHTML = `
            <div class="photo-modal-overlay"></div>
            <div class="photo-modal-content">
                <button class="photo-modal-close" aria-label="Close gallery">&times;</button>
                <div class="photo-modal-header">
                    <h2 class="photo-modal-title"></h2>
                </div>
                <div class="photo-modal-gallery">
                    <button class="photo-nav photo-nav-prev" aria-label="Previous image">&lt;</button>
                    <div class="photo-modal-image-container">
                        <img class="photo-modal-image" src="" alt="">
                        <div class="photo-modal-counter"></div>
                    </div>
                    <button class="photo-nav photo-nav-next" aria-label="Next image">&gt;</button>
                </div>
                <div class="photo-modal-thumbnails"></div>
            </div>
        `;
        document.body.appendChild(modal);
        
        this.addModalStyles();
        this.bindModalEvents();
    }
    
    addModalStyles() {
        if (document.getElementById('photo-modal-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'photo-modal-styles';
        styles.textContent = `
            .photo-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
            }
            .photo-modal.active {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .photo-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
            }
            .photo-modal-content {
                position: relative;
                width: 95%;
                max-width: 1400px;
                max-height: 95vh;
                display: flex;
                flex-direction: column;
                z-index: 1;
            }
            .photo-modal-close {
                position: absolute;
                top: -40px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 32px;
                cursor: pointer;
                padding: 5px 15px;
                z-index: 10;
            }
            .photo-modal-close:hover {
                color: #ccc;
            }
            .photo-modal-header {
                text-align: center;
                padding: 10px 0;
            }
            .photo-modal-title {
                color: white;
                font-size: 1.5rem;
                margin: 0;
            }
            .photo-modal-gallery {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 20px;
                flex: 1;
                min-height: 0;
            }
            .photo-nav {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: white;
                font-size: 24px;
                padding: 20px 15px;
                cursor: pointer;
                border-radius: 4px;
                transition: background 0.2s;
            }
            .photo-nav:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            .photo-modal-image-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                max-height: 70vh;
                position: relative;
            }
            .photo-modal-image {
                max-width: 100%;
                max-height: 65vh;
                object-fit: contain;
                border-radius: 4px;
            }
            .photo-modal-counter {
                color: rgba(255, 255, 255, 0.7);
                font-size: 14px;
                margin-top: 10px;
            }
            .photo-modal-thumbnails {
                display: flex;
                gap: 8px;
                padding: 15px 0;
                overflow-x: auto;
                justify-content: center;
                flex-wrap: wrap;
                max-height: 120px;
            }
            .photo-thumbnail {
                width: 60px;
                height: 60px;
                object-fit: cover;
                border-radius: 4px;
                cursor: pointer;
                opacity: 0.5;
                transition: opacity 0.2s, transform 0.2s;
                border: 2px solid transparent;
            }
            .photo-thumbnail:hover {
                opacity: 0.8;
            }
            .photo-thumbnail.active {
                opacity: 1;
                border-color: white;
            }
            @media (max-width: 768px) {
                .photo-nav {
                    padding: 10px 8px;
                    font-size: 18px;
                }
                .photo-modal-thumbnails {
                    max-height: 80px;
                }
                .photo-thumbnail {
                    width: 45px;
                    height: 45px;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    bindModalEvents() {
        const modal = document.getElementById('photography-modal');
        const overlay = modal.querySelector('.photo-modal-overlay');
        const closeBtn = modal.querySelector('.photo-modal-close');
        const prevBtn = modal.querySelector('.photo-nav-prev');
        const nextBtn = modal.querySelector('.photo-nav-next');
        
        overlay.addEventListener('click', () => this.closeModal());
        closeBtn.addEventListener('click', () => this.closeModal());
        prevBtn.addEventListener('click', () => this.prevImage());
        nextBtn.addEventListener('click', () => this.nextImage());
        
        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;
            
            if (e.key === 'Escape') this.closeModal();
            if (e.key === 'ArrowLeft') this.prevImage();
            if (e.key === 'ArrowRight') this.nextImage();
        });
    }
    
    openCategory(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        if (!category || !category.images || category.images.length === 0) return;
        
        this.currentCategory = category;
        this.currentImageIndex = 0;
        
        const modal = document.getElementById('photography-modal');
        modal.querySelector('.photo-modal-title').textContent = category.name;
        
        const thumbnailsContainer = modal.querySelector('.photo-modal-thumbnails');
        thumbnailsContainer.innerHTML = category.images.map((img, index) => `
            <img class="photo-thumbnail ${index === 0 ? 'active' : ''}" 
                 src="${img.path}" 
                 alt="${img.name}"
                 data-index="${index}">
        `).join('');
        
        thumbnailsContainer.querySelectorAll('.photo-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', () => {
                const index = parseInt(thumb.dataset.index);
                this.showImage(index);
            });
        });
        
        this.showImage(0);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    showImage(index) {
        if (!this.currentCategory) return;
        
        const images = this.currentCategory.images;
        if (index < 0 || index >= images.length) return;
        
        this.currentImageIndex = index;
        const image = images[index];
        
        const modal = document.getElementById('photography-modal');
        const mainImage = modal.querySelector('.photo-modal-image');
        const counter = modal.querySelector('.photo-modal-counter');
        
        mainImage.src = image.path;
        mainImage.alt = image.name;
        counter.textContent = `${index + 1} of ${images.length}`;
        
        modal.querySelectorAll('.photo-thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }
    
    prevImage() {
        if (!this.currentCategory) return;
        const newIndex = this.currentImageIndex > 0 
            ? this.currentImageIndex - 1 
            : this.currentCategory.images.length - 1;
        this.showImage(newIndex);
    }
    
    nextImage() {
        if (!this.currentCategory) return;
        const newIndex = this.currentImageIndex < this.currentCategory.images.length - 1 
            ? this.currentImageIndex + 1 
            : 0;
        this.showImage(newIndex);
    }
    
    closeModal() {
        const modal = document.getElementById('photography-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        this.currentCategory = null;
    }
}

// Initialize photography module when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('photography-content')) {
        new Photography();
    }
});
