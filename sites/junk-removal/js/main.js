/* =========================================
   JUNK REMOVAL SITE - MAIN JAVASCRIPT
   כהן פינויים וירושות
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    MobileMenu.init();
    ContactForm.init();
    FileUpload.init();
    SmoothScroll.init();
    
    // Check for success redirect from Formsubmit
    if (window.location.search.includes('success=true')) {
        // Show success message
        const form = document.getElementById('contact-form');
        if (form) {
            FormUtils.showSuccess(form, 'הבקשה נשלחה בהצלחה! ניצור איתך קשר בהקדם');
            // Remove query param from URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
});

/* -----------------------------------------
   Mobile Menu Module
   ----------------------------------------- */
const MobileMenu = {
    toggle: null,
    menu: null,
    isOpen: false,

    init() {
        this.toggle = document.querySelector('.header__menu-toggle');
        this.menu = document.getElementById('mobile-menu');
        
        if (!this.toggle || !this.menu) return;

        this.bindEvents();
    },

    bindEvents() {
        this.toggle.addEventListener('click', () => this.toggleMenu());

        // Close menu when clicking a link
        this.menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
                this.closeMenu();
            }
        });
    },

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    },

    openMenu() {
        this.isOpen = true;
        this.menu.classList.add('is-open');
        this.menu.setAttribute('aria-hidden', 'false');
        this.toggle.setAttribute('aria-expanded', 'true');
    },

    closeMenu() {
        this.isOpen = false;
        this.menu.classList.remove('is-open');
        this.menu.setAttribute('aria-hidden', 'true');
        this.toggle.setAttribute('aria-expanded', 'false');
    }
};

/* -----------------------------------------
   Contact Form Module
   ----------------------------------------- */
const ContactForm = {
    form: null,
    submitBtn: null,
    submitText: null,
    submitLoading: null,
    forminit: null,
    FORM_ID: '4gveukzhs12',

    init() {
        this.form = document.getElementById('contact-form');
        if (!this.form) return;

        this.submitBtn = this.form.querySelector('.contact-form__submit');
        this.submitText = this.form.querySelector('.contact-form__submit-text');
        this.submitLoading = this.form.querySelector('.contact-form__submit-loading');
        
        // Initialize Forminit SDK
        if (typeof Forminit !== 'undefined') {
            this.forminit = new Forminit();
        }

        this.bindEvents();
    },

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        this.form.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('form-input-error')) {
                    this.validateField(input);
                }
            });
        });
    },

    async handleSubmit(e) {
        e.preventDefault();
        
        // Clear previous messages
        const existingSuccess = this.form.querySelector('.form-success-message');
        const existingError = this.form.querySelector('.form-error-alert');
        if (existingSuccess) existingSuccess.remove();
        if (existingError) existingError.remove();

        // Validate all fields
        if (!this.validateForm()) {
            return;
        }

        // Check if Forminit SDK is loaded
        if (!this.forminit) {
            // Try to initialize again if SDK is now available
            if (typeof Forminit !== 'undefined') {
                this.forminit = new Forminit();
            } else {
                console.error('Forminit SDK not loaded');
                FormUtils.showFormError(this.form, 'שגיאה טכנית. אנא רענן את הדף ונסה שנית.');
                return;
            }
        }

        // Show loading state
        this.setLoading(true);

        try {
            const formData = new FormData(this.form);
            
            // Debug: log form data
            console.log('Submitting form with data:');
            for (let [key, value] of formData.entries()) {
                console.log(`  ${key}:`, value);
            }
            
            const { data, error } = await this.forminit.submit(this.FORM_ID, formData);

            if (error) {
                throw new Error(error.message || 'שגיאה בשליחת הטופס');
            }

            // Success
            FormUtils.showSuccess(this.form, 'הבקשה נשלחה בהצלחה! ניצור איתך קשר בהקדם');
            this.form.reset();
            FileUpload.clearPreviews();
        } catch (error) {
            console.error('Form submission error:', error);
            FormUtils.showFormError(this.form, error.message || 'אירעה שגיאה בשליחת הטופס. אנא נסו שנית.');
        } finally {
            this.setLoading(false);
        }
    },

    validateForm() {
        let isValid = true;
        const requiredFields = this.form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Focus first error field
        if (!isValid) {
            const firstError = this.form.querySelector('.form-input-error');
            if (firstError) {
                firstError.focus();
            }
        }

        return isValid;
    },

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required check
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'שדה זה הוא חובה';
        }

        // Phone validation
        if (isValid && field.type === 'tel' && value) {
            if (!FormUtils.validateIsraeliPhone(value)) {
                isValid = false;
                errorMessage = 'מספר טלפון לא תקין';
            }
        }

        // Email validation
        if (isValid && field.type === 'email' && value) {
            if (!FormUtils.validateEmail(value)) {
                isValid = false;
                errorMessage = 'כתובת אימייל לא תקינה';
            }
        }

        // Checkbox validation
        if (field.type === 'checkbox' && field.required && !field.checked) {
            isValid = false;
            errorMessage = 'יש לאשר את תנאי השימוש';
        }

        // Show or clear error
        if (!isValid) {
            FormUtils.showError(field, errorMessage);
        } else {
            FormUtils.clearError(field);
        }

        return isValid;
    },

    setLoading(loading) {
        this.submitBtn.disabled = loading;
        this.submitText.classList.toggle('hidden', loading);
        this.submitLoading.classList.toggle('hidden', !loading);
        this.submitLoading.setAttribute('aria-hidden', (!loading).toString());
    }
};

/* -----------------------------------------
   File Upload Module
   ----------------------------------------- */
const FileUpload = {
    input: null,
    preview: null,
    uploadArea: null,
    label: null,
    files: [],
    maxFiles: 5,
    maxSizeMB: 5,

    init() {
        this.input = document.getElementById('photos');
        this.preview = document.getElementById('photos-preview');
        this.uploadArea = document.getElementById('file-upload-area');
        
        if (!this.input || !this.preview || !this.uploadArea) return;
        
        this.label = this.uploadArea.querySelector('.file-upload__label');
        this.bindEvents();
    },

    bindEvents() {
        this.input.addEventListener('change', (e) => this.handleFiles(e.target.files));

        // Drag and drop on the entire upload area
        this.uploadArea.addEventListener('dragenter', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showDragFeedback(true);
        });

        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showDragFeedback(true);
        });

        this.uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Only hide feedback if leaving the upload area completely
            if (!this.uploadArea.contains(e.relatedTarget)) {
                this.showDragFeedback(false);
            }
        });

        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showDragFeedback(false);
            
            if (e.dataTransfer.files.length > 0) {
                this.handleFiles(e.dataTransfer.files);
            }
        });

        // Also add visual feedback to label
        if (this.label) {
            this.label.addEventListener('dragenter', (e) => {
                e.preventDefault();
                this.showDragFeedback(true);
            });
        }
    },

    showDragFeedback(show) {
        if (show) {
            this.uploadArea.classList.add('file-upload--dragging');
            if (this.label) {
                this.label.classList.add('dragover');
            }
        } else {
            this.uploadArea.classList.remove('file-upload--dragging');
            if (this.label) {
                this.label.classList.remove('dragover');
            }
        }
    },

    handleFiles(fileList) {
        const newFiles = Array.from(fileList);
        
        newFiles.forEach(file => {
            // Check max files
            if (this.files.length >= this.maxFiles) {
                alert(`ניתן להעלות עד ${this.maxFiles} קבצים`);
                return;
            }

            // Validate file type
            if (!FileUtils.validateFileType(file)) {
                alert(`סוג קובץ לא נתמך: ${file.name}`);
                return;
            }

            // Validate file size
            if (!FileUtils.validateFileSize(file, this.maxSizeMB)) {
                alert(`הקובץ ${file.name} גדול מדי. גודל מקסימלי: ${this.maxSizeMB}MB`);
                return;
            }

            this.files.push(file);
        });

        this.updatePreviews();
        this.updateInputFiles();
    },

    updatePreviews() {
        this.preview.innerHTML = '';
        
        this.files.forEach((file, index) => {
            this.createPreview(file, index);
        });
    },

    async createPreview(file, index) {
        try {
            const dataUrl = await FileUtils.createThumbnail(file);
            
            const previewEl = document.createElement('div');
            previewEl.className = 'file-preview';
            previewEl.innerHTML = `
                <img src="${dataUrl}" alt="${file.name}">
                <button type="button" class="file-preview__remove" data-index="${index}" aria-label="הסר תמונה">×</button>
                <span class="file-preview__name">${file.name.substring(0, 15)}${file.name.length > 15 ? '...' : ''}</span>
            `;

            previewEl.querySelector('.file-preview__remove').addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.index);
                this.removeFile(idx);
            });

            this.preview.appendChild(previewEl);
        } catch (error) {
            console.error('Error creating preview:', error);
        }
    },

    removeFile(index) {
        this.files.splice(index, 1);
        this.updatePreviews();
        this.updateInputFiles();
    },

    updateInputFiles() {
        const dataTransfer = new DataTransfer();
        this.files.forEach(file => dataTransfer.items.add(file));
        this.input.files = dataTransfer.files;
    },

    clearPreviews() {
        this.files = [];
        this.preview.innerHTML = '';
        this.input.value = '';
    }
};

/* -----------------------------------------
   Smooth Scroll Module
   ----------------------------------------- */
const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    // Get header height for offset
                    const header = document.querySelector('.header');
                    const offset = header ? header.offsetHeight + 20 : 80;
                    
                    DOMUtils.scrollTo(target, offset);

                    // Update URL without scrolling
                    history.pushState(null, '', href);
                }
            });
        });
    }
};
