// Contact form functionality for sticker.php
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formResponse = document.getElementById('form-response');
    
    if (!contactForm) return;

    // Initialize form
    initializeContactForm();

    function initializeContactForm() {
        contactForm.addEventListener('submit', handleContactFormSubmit);

        // Add real-time validation
        const requiredFields = contactForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => clearFieldError(field));
        });

        // Email validation
        const emailField = document.getElementById('contact-email');
        if (emailField) {
            emailField.addEventListener('blur', () => validateEmailField(emailField));
        }

        // Phone validation
        const phoneField = document.getElementById('contact-phone');
        if (phoneField) {
            phoneField.addEventListener('blur', () => validatePhoneField(phoneField));
        }

        // Date validation
        const dateField = document.getElementById('contact-event-date');
        if (dateField) {
            // Set minimum date to today
            dateField.min = new Date().toISOString().split('T')[0];
            dateField.addEventListener('change', () => validateDateField(dateField));
        }

        // Message length validation
        const messageField = document.getElementById('contact-message');
        if (messageField) {
            messageField.addEventListener('input', () => validateMessageField(messageField));
        }
    }

    async function handleContactFormSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const isValid = validateContactForm();
        if (!isValid) {
            showFormResponse('Please correct the errors below.', 'error');
            return;
        }

        const submitButton = contactForm.querySelector('button[type="submit"]');
        window.loadingState.show(submitButton);

        try {
            // Prepare form data
            const formData = {
                name: document.getElementById('contact-name').value.trim(),
                email: document.getElementById('contact-email').value.trim(),
                phone: document.getElementById('contact-phone').value.trim(),
                service: document.getElementById('contact-service').value,
                event_date: document.getElementById('contact-event-date').value,
                location: document.getElementById('contact-location').value.trim(),
                budget: document.getElementById('contact-budget').value,
                message: document.getElementById('contact-message').value.trim(),
                newsletter: document.getElementById('contact-newsletter').checked ? 'yes' : 'no',
                form_type: 'contact'
            };

            const response = await fetch('api/contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                showFormResponse(result.message, 'success');
                contactForm.reset();
                
                // Reset date field minimum
                const dateField = document.getElementById('contact-event-date');
                if (dateField) {
                    dateField.min = new Date().toISOString().split('T')[0];
                }
                
                // Track successful submission
                trackContactSubmission(formData);
                
                // Scroll to top of form
                contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                if (result.errors) {
                    displayFormErrors(result.errors);
                    showFormResponse('Please correct the errors below.', 'error');
                } else {
                    showFormResponse(result.error || 'Failed to send message. Please try again.', 'error');
                }
            }

        } catch (error) {
            console.error('Contact form submission error:', error);
            showFormResponse('Network error. Please check your connection and try again.', 'error');
        } finally {
            window.loadingState.hide(submitButton);
        }
    }

    function validateContactForm() {
        let isValid = true;

        // Clear previous errors
        clearAllFormErrors();

        // Validate required fields
        const nameField = document.getElementById('contact-name');
        const emailField = document.getElementById('contact-email');
        const messageField = document.getElementById('contact-message');

        if (!validateField(nameField)) isValid = false;
        if (!validateEmailField(emailField)) isValid = false;
        if (!validateMessageField(messageField)) isValid = false;

        // Validate optional fields if filled
        const phoneField = document.getElementById('contact-phone');
        if (phoneField && phoneField.value.trim()) {
            if (!validatePhoneField(phoneField)) isValid = false;
        }

        const dateField = document.getElementById('contact-event-date');
        if (dateField && dateField.value) {
            if (!validateDateField(dateField)) isValid = false;
        }

        return isValid;
    }

    function validateField(field) {
        if (!field) return true;

        const value = field.value.trim();
        
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'This field is required');
            return false;
        }

        if (field.id === 'contact-name' && value && value.length < 2) {
            showFieldError(field, 'Name must be at least 2 characters');
            return false;
        }

        clearFieldError(field);
        return true;
    }

    function validateEmailField(field) {
        if (!field) return true;

        if (!validateField(field)) return false;

        const email = field.value.trim();
        if (email && !window.formValidation.validateEmail(email)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }

        return true;
    }

    function validatePhoneField(field) {
        if (!field) return true;

        const phone = field.value.trim();
        if (phone && !window.formValidation.validatePhone(phone)) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }

        clearFieldError(field);
        return true;
    }

    function validateDateField(field) {
        if (!field) return true;

        const selectedDate = new Date(field.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day

        if (selectedDate < today) {
            showFieldError(field, 'Please select a future date');
            return false;
        }

        clearFieldError(field);
        return true;
    }

    function validateMessageField(field) {
        if (!field) return true;

        if (!validateField(field)) return false;

        const message = field.value.trim();
        if (message && message.length < 10) {
            showFieldError(field, 'Message must be at least 10 characters');
            return false;
        }

        if (message && message.length > 2000) {
            showFieldError(field, 'Message must be less than 2000 characters');
            return false;
        }

        return true;
    }

    function showFieldError(field, message) {
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            errorElement.setAttribute('aria-live', 'assertive');
        }

        field.setAttribute('aria-invalid', 'true');
        field.classList.add('error');
        
        // Focus the field if it's not already focused
        if (document.activeElement !== field) {
            field.focus();
        }
    }

    function clearFieldError(field) {
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
            errorElement.removeAttribute('aria-live');
        }

        field.setAttribute('aria-invalid', 'false');
        field.classList.remove('error');
    }

    function clearAllFormErrors() {
        const errorElements = contactForm.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.classList.remove('show');
            element.textContent = '';
            element.removeAttribute('aria-live');
        });

        const errorFields = contactForm.querySelectorAll('.error');
        errorFields.forEach(field => {
            field.classList.remove('error');
            field.setAttribute('aria-invalid', 'false');
        });
    }

    function displayFormErrors(errors) {
        Object.keys(errors).forEach(fieldName => {
            const field = document.getElementById(`contact-${fieldName}`) || 
                         document.querySelector(`[name="${fieldName}"]`);
            if (field) {
                showFieldError(field, errors[fieldName]);
            }
        });
    }

    function showFormResponse(message, type) {
        if (formResponse) {
            formResponse.textContent = message;
            formResponse.className = `form-response ${type}`;
            formResponse.style.display = 'block';
            formResponse.setAttribute('aria-live', 'assertive');
            
            // Scroll message into view
            formResponse.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });

            // Auto-hide success messages after 10 seconds
            if (type === 'success') {
                setTimeout(() => {
                    formResponse.style.display = 'none';
                }, 10000);
            }
        }
    }

    function trackContactSubmission(formData) {
        // Optional analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'contact_form_submit', {
                event_category: 'engagement',
                event_label: formData.service || 'general_inquiry'
            });
        }

        console.log('Contact form submitted:', formData.email);
    }

    // Add character counter for message field
    function addMessageCounter() {
        const messageField = document.getElementById('contact-message');
        if (!messageField) return;

        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.setAttribute('aria-live', 'polite');
        
        const updateCounter = () => {
            const length = messageField.value.length;
            const maxLength = 2000;
            counter.textContent = `${length}/${maxLength} characters`;
            
            if (length > maxLength * 0.9) {
                counter.classList.add('warning');
            } else {
                counter.classList.remove('warning');
            }
        };

        messageField.addEventListener('input', updateCounter);
        messageField.parentNode.appendChild(counter);
        updateCounter();
    }

    // Initialize character counter
    addMessageCounter();

    console.log('Contact form module initialized');
});
