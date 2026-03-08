/* =========================================
   JUNK REMOVAL SITE - MAIN JAVASCRIPT
   כהן פינויים וירושות
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    LanguageSwitcher.init();
    MobileMenu.init();
    ContactForm.init();
    FileUpload.init();
    SmoothScroll.init();
    
    // Check for success redirect from Formsubmit
    if (window.location.search.includes('success=true')) {
        // Show success message
        const form = document.getElementById('contact-form');
        if (form) {
            const successMessage = LanguageSwitcher.translate('contact.form.success');
            FormUtils.showSuccess(form, successMessage);
            // Remove query param from URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
});

/* -----------------------------------------
   Language Switcher Module
   ----------------------------------------- */
const LanguageSwitcher = {
    currentLang: 'he',
    options: null, // NodeList of the two pill buttons

    init() {
        this.options = document.querySelectorAll('.language-switcher__option');

        if (!this.options.length) return;

        // Priority: URL param → localStorage → default Hebrew
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang === 'ru') {
            this.currentLang = 'ru';
        } else {
            this.currentLang = localStorage.getItem('preferredLanguage') || 'he';
        }

        // Apply on load
        this.applyLanguage(this.currentLang);

        // Bind each pill button
        this.options.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                if (lang && lang !== this.currentLang) {
                    this.currentLang = lang;
                    localStorage.setItem('preferredLanguage', lang);
                    this.applyLanguage(lang);
                }
            });
        });
    },

    applyLanguage(lang) {
        this.currentLang = lang;

        // Update <html> attributes for direction and language
        const html = document.documentElement;
        html.setAttribute('lang', lang);
        html.setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr');

        // Update active/inactive state on both pill buttons
        this.options.forEach(btn => {
            const isActive = btn.getAttribute('data-lang') === lang;
            btn.classList.toggle('language-switcher__option--active', isActive);
            btn.setAttribute('aria-pressed', isActive.toString());
        });

        // Translate all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translate(key);
            if (translation) {
                element.textContent = translation;
            }
        });

        // Translate attributes (aria-label, placeholder, etc.)
        document.querySelectorAll('[data-i18n-attr]').forEach(element => {
            const attrMap = element.getAttribute('data-i18n-attr');
            attrMap.split(',').forEach(pair => {
                const [attr, key] = pair.split(':').map(s => s.trim());
                const translation = this.translate(key);
                if (translation) {
                    element.setAttribute(attr, translation);
                }
            });
        });

        // Update page <title> and meta description
        const title = this.translate('meta.title');
        const description = this.translate('meta.description');
        if (title) document.title = title;
        if (description) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute('content', description);
        }

        // Update URL parameter so the page is shareable / indexable
        const url = new URL(window.location.href);
        if (lang === 'ru') {
            url.searchParams.set('lang', 'ru');
        } else {
            url.searchParams.delete('lang');
        }
        window.history.replaceState({}, '', url.toString());

        // Update accessibility widget texts
        this.updateAccessibilityWidget(lang);
    },

    updateAccessibilityWidget(lang) {
        const widget = document.querySelector('.accessibility-widget');
        if (!widget) return;

        const texts = {
            he: {
                region: 'אפשרויות נגישות',
                toggleBtn: 'פתח תפריט נגישות',
                title: 'נגישות',
                closeBtn: 'סגור תפריט נגישות',
                decreaseFont: 'הקטן גופן',
                sizeLabel: 'גודל טקסט',
                increaseFont: 'הגדל גופן',
                highContrast: 'ניגודיות גבוהה',
                grayscale: 'גווני אפור',
                highlightLinks: 'הדגשת קישורים',
                readableFont: 'גופן קריא',
                stopAnimations: 'עצירת אנימציות',
                reset: 'איפוס הגדרות'
            },
            ru: {
                region: 'Параметры доступности',
                toggleBtn: 'Открыть меню доступности',
                title: 'Доступность',
                closeBtn: 'Закрыть меню доступности',
                decreaseFont: 'Уменьшить шрифт',
                sizeLabel: 'Размер текста',
                increaseFont: 'Увеличить шрифт',
                highContrast: 'Высокий контраст',
                grayscale: 'Оттенки серого',
                highlightLinks: 'Выделить ссылки',
                readableFont: 'Читаемый шрифт',
                stopAnimations: 'Остановить анимации',
                reset: 'Сбросить настройки'
            }
        };

        const t = texts[lang] || texts.he;

        widget.setAttribute('aria-label', t.region);

        const toggleBtn = widget.querySelector('.accessibility-toggle');
        if (toggleBtn) toggleBtn.setAttribute('aria-label', t.toggleBtn);

        const titleEl = widget.querySelector('.accessibility-panel__title');
        if (titleEl) titleEl.textContent = t.title;

        const closeBtn = widget.querySelector('.accessibility-panel__close');
        if (closeBtn) closeBtn.setAttribute('aria-label', t.closeBtn);

        const decreaseBtn = widget.querySelector('[data-action="decrease-font"]');
        if (decreaseBtn) decreaseBtn.setAttribute('aria-label', t.decreaseFont);

        const sizeLabel = widget.querySelector('.accessibility-size-label');
        if (sizeLabel) sizeLabel.textContent = t.sizeLabel;

        const increaseBtn = widget.querySelector('[data-action="increase-font"]');
        if (increaseBtn) increaseBtn.setAttribute('aria-label', t.increaseFont);

        ['highContrast', 'grayscale', 'highlightLinks', 'readableFont', 'stopAnimations'].forEach(opt => {
            const btn = widget.querySelector(`[data-option="${opt}"]`);
            if (btn) {
                const labelEl = btn.querySelector('.accessibility-option__label');
                if (labelEl) labelEl.textContent = t[opt];
            }
        });

        const resetBtn = widget.querySelector('.accessibility-reset');
        if (resetBtn) resetBtn.textContent = t.reset;
    },

    translate(key) {
        if (typeof translations === 'undefined' || !translations[this.currentLang]) return null;
        return translations[this.currentLang][key] || null;
    }
};

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

        // Show loading state
        this.setLoading(true);

        try {
            const formData = new FormData(this.form);
            
            // Debug: log form data
            console.log('Submitting form with data:');
            for (let [key, value] of formData.entries()) {
                console.log(`  ${key}:`, value);
            }
            
            // Submit directly to Forminit endpoint
            const response = await fetch(`https://forminit.com/f/${this.FORM_ID}`, {
                method: 'POST',
                body: formData
            });

            console.log('Response status:', response.status);
            
            if (!response.ok && response.status !== 302) {
                const text = await response.text();
                console.error('Response text:', text);
                
                // Try to extract error message
                const errorMatch = text.match(/Error[^<]*<\/p>/i);
                if (errorMatch) {
                    throw new Error(errorMatch[0].replace('</p>', '').trim());
                }
                throw new Error('שגיאה בשליחת הטופס');
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
