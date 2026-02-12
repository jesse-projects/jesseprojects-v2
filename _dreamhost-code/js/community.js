// Community module - handles calendar and community form
class Community {
    constructor() {
        this.calendarEl = document.getElementById('community-calendar');
        this.communityForm = document.getElementById('community-intake-form');
        this.formMessage = document.getElementById('community-form-message');
        
        this.initCalendar();
        this.initCommunityForm();
    }
    
    initCalendar() {
        if (!this.calendarEl) return;
        
        this.calendar = new FullCalendar.Calendar(this.calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,listWeek'
            },
            events: this.loadCalendarEvents.bind(this),
            eventClick: this.handleEventClick.bind(this),
            height: 'auto',
            eventDisplay: 'block',
            dayMaxEvents: 3,
            moreLinkClick: 'popover'
        });
        
        this.calendar.render();
    }
    
    async loadCalendarEvents(fetchInfo, successCallback, failureCallback) {
        try {
            const response = await fetch('data/events.json');
            const data = await response.json();
            
            const events = data.events.map(event => ({
                id: event.id,
                title: event.title,
                start: event.start_date,
                end: event.end_date,
                description: event.description,
                location: event.location,
                type: event.type,
                backgroundColor: this.getEventColor(event.type)
            }));
            
            successCallback(events);
        } catch (error) {
            console.error('Failed to load calendar events:', error);
            failureCallback(error);
        }
    }
    
    getEventColor(eventType) {
        const colors = {
            'workshop': '#3498db',
            'meetup': '#2ecc71',
            'exhibition': '#e74c3c',
            'social': '#f39c12'
        };
        return colors[eventType] || '#95a5a6';
    }
    
    handleEventClick(info) {
        const event = info.event;
        
        // Create event details modal or popup
        const eventDetails = `
            <div class="event-details">
                <h3>${event.title}</h3>
                <p><strong>Date:</strong> ${event.start.toLocaleDateString()}</p>
                ${event.extendedProps.location ? `<p><strong>Location:</strong> ${event.extendedProps.location}</p>` : ''}
                ${event.extendedProps.description ? `<p><strong>Description:</strong> ${event.extendedProps.description}</p>` : ''}
            </div>
        `;
        
        // Simple alert for now - could be enhanced with a modal
        alert(event.title + '\n' + event.start.toLocaleDateString() + 
              (event.extendedProps.location ? '\n' + event.extendedProps.location : '') +
              (event.extendedProps.description ? '\n\n' + event.extendedProps.description : ''));
    }
    
    initCommunityForm() {
        if (!this.communityForm) return;
        
        this.communityForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        
        // Real-time validation
        const inputs = this.communityForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    async handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.communityForm);
        const submitBtn = this.communityForm.querySelector('button[type="submit"]');
        
        // Validate all fields
        if (!this.validateForm()) {
            return;
        }
        
        // Show loading state
        if (window.loadingState) {
            window.loadingState.show(submitBtn);
        }
        
        try {
            const response = await fetch('api/community-signup.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccess('Welcome to our community! We\'ll be in touch soon.');
                this.communityForm.reset();
            } else {
                this.showError(result.message || 'There was an error submitting your information. Please try again.');
            }
        } catch (error) {
            console.error('Community form submission error:', error);
            this.showError('There was an error submitting your information. Please try again.');
        } finally {
            if (window.loadingState) {
                window.loadingState.hide(submitBtn);
            }
        }
    }
    
    validateForm() {
        const requiredFields = this.communityForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        
        // Clear previous errors
        this.clearFieldError(field);
        
        if (field.required && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        if (field.type === 'email' && value) {
            if (!window.formValidation?.validateEmail(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        if (field.type === 'tel' && value) {
            if (!window.formValidation?.validatePhone(value)) {
                this.showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        return true;
    }
    
    showFieldError(field, message) {
        if (window.formValidation) {
            window.formValidation.showError(field, message);
        }
    }
    
    clearFieldError(field) {
        if (window.formValidation) {
            window.formValidation.clearError(field);
        }
    }
    
    showSuccess(message) {
        if (this.formMessage) {
            this.formMessage.textContent = message;
            this.formMessage.className = 'form-message success';
            this.formMessage.style.display = 'block';
            this.formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    showError(message) {
        if (this.formMessage) {
            this.formMessage.textContent = message;
            this.formMessage.className = 'form-message error';
            this.formMessage.style.display = 'block';
            this.formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
}

// Initialize community module when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('community-content')) {
        new Community();
    }
});