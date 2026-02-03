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

    init() {
        this.form = document.getElementById('contact-form');
        if (!this.form) return;

        this.submitBtn = this.form.querySelector('.contact-form__submit');
        this.submitText = this.form.querySelector('.contact-form__submit-text');
        this.submitLoading = this.form.querySelector('.contact-form__submit-loading');

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

        // Sync email to replyto field
        const emailInput = this.form.querySelector('#email');
        const replytoInput = this.form.querySelector('#replyto');
        if (emailInput && replytoInput) {
            emailInput.addEventListener('input', () => {
                replytoInput.value = emailInput.value;
            });
        }
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

        // Show loading state
        this.setLoading(true);

        try {
            const formData = new FormData(this.form);
            
            // Web3Forms requires files to be sent without the 'Accept: application/json' header
            // when files are included, so let the browser set the correct Content-Type
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Success
                FormUtils.showSuccess(this.form, 'הבקשה נשלחה בהצלחה! ניצור איתך קשר בהקדם');
                this.form.reset();
                FileUpload.clearPreviews();
            } else {
                throw new Error(result.message || 'Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            FormUtils.showFormError(this.form, 'אירעה שגיאה בשליחת הטופס. אנא נסו שנית.');
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
    maxSizeMB: 5,

    init() {
        this.input = document.getElementById('photos');
        this.preview = document.getElementById('photos-preview');
        
        if (!this.input || !this.preview) return;

        this.bindEvents();
    },

    bindEvents() {
        this.input.addEventListener('change', (e) => this.handleFile(e.target.files[0]));

        // Drag and drop
        const label = this.input.closest('.file-upload').querySelector('.file-upload__label');
        if (label) {
            label.addEventListener('dragover', (e) => {
                e.preventDefault();
                label.classList.add('dragover');
            });

            label.addEventListener('dragleave', () => {
                label.classList.remove('dragover');
            });

            label.addEventListener('drop', (e) => {
                e.preventDefault();
                label.classList.remove('dragover');
                if (e.dataTransfer.files[0]) {
                    this.handleFile(e.dataTransfer.files[0]);
                    // Update the input element
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(e.dataTransfer.files[0]);
                    this.input.files = dataTransfer.files;
                }
            });
        }
    },

    handleFile(file) {
        if (!file) {
            this.clearPreviews();
            return;
        }
        
        // Validate file type
        if (!FileUtils.validateFileType(file)) {
            alert(`סוג קובץ לא נתמך: ${file.name}`);
            this.input.value = '';
            return;
        }

        // Validate file size
        if (!FileUtils.validateFileSize(file, this.maxSizeMB)) {
            alert(`הקובץ ${file.name} גדול מדי. גודל מקסימלי: ${this.maxSizeMB}MB`);
            this.input.value = '';
            return;
        }

        this.createPreview(file);
    },

    async createPreview(file) {
        try {
            const dataUrl = await FileUtils.createThumbnail(file);
            
            this.preview.innerHTML = `
                <div class="file-preview">
                    <img src="${dataUrl}" alt="${file.name}">
                    <button type="button" class="file-preview__remove" aria-label="הסר תמונה">×</button>
                </div>
            `;

            this.preview.querySelector('.file-preview__remove').addEventListener('click', () => {
                this.clearPreviews();
            });
        } catch (error) {
            console.error('Error creating preview:', error);
        }
    },

    clearPreviews() {
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
