/* =========================================
   SHARED UTILITIES
   Common utility functions across all sites
   ========================================= */

/**
 * Form validation utilities
 */
const FormUtils = {
    /**
     * Validate Israeli phone number
     * Accepts formats: 050-1234567, 0501234567, +972-50-1234567
     * @param {string} phone - Phone number to validate
     * @returns {boolean} - Whether phone is valid
     */
    validateIsraeliPhone(phone) {
        const cleaned = phone.replace(/[\s\-\(\)]/g, '');
        // Israeli mobile: 05X-XXXXXXX or landline: 0X-XXXXXXX
        const mobilePattern = /^(\+972|972)?0?5[0-9]{8}$/;
        const landlinePattern = /^(\+972|972)?0?[2-9][0-9]{7,8}$/;
        return mobilePattern.test(cleaned) || landlinePattern.test(cleaned);
    },

    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {boolean} - Whether email is valid
     */
    validateEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    },

    /**
     * Show form error message
     * @param {HTMLElement} input - Input element
     * @param {string} message - Error message
     */
    showError(input, message) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;

        // Remove existing error
        this.clearError(input);

        // Add error state
        input.classList.add('form-input-error');
        input.setAttribute('aria-invalid', 'true');

        // Create error message
        const errorId = `${input.id}-error`;
        const errorElement = document.createElement('span');
        errorElement.id = errorId;
        errorElement.className = 'form-error-message';
        errorElement.setAttribute('role', 'alert');
        errorElement.textContent = message;

        // Associate with input for screen readers
        input.setAttribute('aria-describedby', errorId);

        formGroup.appendChild(errorElement);
    },

    /**
     * Clear form error message
     * @param {HTMLElement} input - Input element
     */
    clearError(input) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;

        input.classList.remove('form-input-error');
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');

        const existingError = formGroup.querySelector('.form-error-message');
        if (existingError) {
            existingError.remove();
        }
    },

    /**
     * Show form success message
     * @param {HTMLFormElement} form - Form element
     * @param {string} message - Success message
     */
    showSuccess(form, message) {
        const existingMessage = form.querySelector('.form-success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const successElement = document.createElement('div');
        successElement.className = 'form-success-message';
        successElement.setAttribute('role', 'status');
        successElement.setAttribute('aria-live', 'polite');
        successElement.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>${message}</span>
        `;
        form.insertBefore(successElement, form.firstChild);

        // Scroll to message
        successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },

    /**
     * Show form error message (general)
     * @param {HTMLFormElement} form - Form element
     * @param {string} message - Error message
     */
    showFormError(form, message) {
        const existingMessage = form.querySelector('.form-error-alert');
        if (existingMessage) {
            existingMessage.remove();
        }

        const errorElement = document.createElement('div');
        errorElement.className = 'form-error-alert';
        errorElement.setAttribute('role', 'alert');
        errorElement.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>${message}</span>
        `;
        form.insertBefore(errorElement, form.firstChild);

        // Scroll to message
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

/**
 * File upload utilities
 */
const FileUtils = {
    /**
     * Validate file type
     * @param {File} file - File to validate
     * @param {string[]} allowedTypes - Allowed MIME types
     * @returns {boolean} - Whether file type is valid
     */
    validateFileType(file, allowedTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif']) {
        return allowedTypes.includes(file.type);
    },

    /**
     * Validate file size
     * @param {File} file - File to validate
     * @param {number} maxSizeMB - Maximum size in MB
     * @returns {boolean} - Whether file size is valid
     */
    validateFileSize(file, maxSizeMB = 5) {
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        return file.size <= maxSizeBytes;
    },

    /**
     * Format file size for display
     * @param {number} bytes - Size in bytes
     * @returns {string} - Formatted size string
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    /**
     * Create thumbnail preview for image
     * @param {File} file - Image file
     * @returns {Promise<string>} - Data URL of thumbnail
     */
    createThumbnail(file) {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                reject(new Error('Not an image file'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }
};

/**
 * DOM utilities
 */
const DOMUtils = {
    /**
     * Smooth scroll to element
     * @param {string|HTMLElement} target - Element or selector
     * @param {number} offset - Offset from top in pixels
     */
    scrollTo(target, offset = 80) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return;

        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },

    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} - Debounced function
     */
    debounce(func, wait = 250) {
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

    /**
     * Throttle function
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in ms
     * @returns {Function} - Throttled function
     */
    throttle(func, limit = 250) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} - Whether element is visible
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

/**
 * Storage utilities (with fallback)
 */
const StorageUtils = {
    /**
     * Get item from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} - Stored value or default
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('localStorage not available:', e);
            return defaultValue;
        }
    },

    /**
     * Set item in localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('localStorage not available:', e);
        }
    },

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('localStorage not available:', e);
        }
    }
};

// Make utilities available globally
window.FormUtils = FormUtils;
window.FileUtils = FileUtils;
window.DOMUtils = DOMUtils;
window.StorageUtils = StorageUtils;
