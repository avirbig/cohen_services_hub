/* =========================================
   ACCESSIBILITY WIDGET
   Israeli accessibility law compliance
   WCAG 2.1 AA Standards
   ========================================= */

/**
 * Accessibility Widget Controller
 * Manages accessibility features and user preferences
 */
class AccessibilityWidget {
    constructor() {
        this.storageKey = 'accessibility-preferences';
        this.panel = null;
        this.toggleBtn = null;
        this.isOpen = false;

        // Default settings
        this.settings = {
            fontSize: 1,
            highContrast: false,
            grayscale: false,
            highlightLinks: false,
            readableFont: false,
            stopAnimations: false
        };

        this.init();
    }

    /**
     * Initialize the widget
     */
    init() {
        // Load saved preferences
        this.loadPreferences();

        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    /**
     * Setup the widget DOM and events
     */
    setup() {
        this.createWidget();
        this.applySettings();
        this.bindEvents();
    }

    /**
     * Create widget HTML
     */
    createWidget() {
        // Create widget container
        const widget = document.createElement('div');
        widget.className = 'accessibility-widget';
        widget.setAttribute('role', 'region');
        widget.setAttribute('aria-label', 'אפשרויות נגישות');

        widget.innerHTML = `
            <!-- Toggle Button -->
            <button class="accessibility-toggle" 
                    aria-expanded="false" 
                    aria-controls="accessibility-panel"
                    aria-label="פתח תפריט נגישות">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9H15V22H13V16H11V22H9V9H3V7H21V9Z"/>
                </svg>
            </button>

            <!-- Panel -->
            <div class="accessibility-panel" id="accessibility-panel" role="dialog" aria-modal="true" aria-labelledby="accessibility-title">
                <div class="accessibility-panel__header">
                    <h2 class="accessibility-panel__title" id="accessibility-title">נגישות</h2>
                    <button class="accessibility-panel__close" aria-label="סגור תפריט נגישות">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="accessibility-panel__content">
                    <!-- Font Size -->
                    <div class="accessibility-size-controls">
                        <button class="accessibility-size-btn" data-action="decrease-font" aria-label="הקטן גופן">א-</button>
                        <span class="accessibility-size-label">גודל טקסט</span>
                        <button class="accessibility-size-btn" data-action="increase-font" aria-label="הגדל גופן">א+</button>
                    </div>

                    <!-- Options -->
                    <button class="accessibility-option" data-option="highContrast" aria-pressed="false">
                        <span class="accessibility-option__label">ניגודיות גבוהה</span>
                        <span class="accessibility-option__icon">◐</span>
                    </button>

                    <button class="accessibility-option" data-option="grayscale" aria-pressed="false">
                        <span class="accessibility-option__label">גווני אפור</span>
                        <span class="accessibility-option__icon">◑</span>
                    </button>

                    <button class="accessibility-option" data-option="highlightLinks" aria-pressed="false">
                        <span class="accessibility-option__label">הדגשת קישורים</span>
                        <span class="accessibility-option__icon">🔗</span>
                    </button>

                    <button class="accessibility-option" data-option="readableFont" aria-pressed="false">
                        <span class="accessibility-option__label">גופן קריא</span>
                        <span class="accessibility-option__icon">Aa</span>
                    </button>

                    <button class="accessibility-option" data-option="stopAnimations" aria-pressed="false">
                        <span class="accessibility-option__label">עצירת אנימציות</span>
                        <span class="accessibility-option__icon">⏸</span>
                    </button>

                    <!-- Reset -->
                    <button class="accessibility-reset" data-action="reset">
                        איפוס הגדרות
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(widget);

        // Store references
        this.widget = widget;
        this.toggleBtn = widget.querySelector('.accessibility-toggle');
        this.panel = widget.querySelector('.accessibility-panel');
        this.closeBtn = widget.querySelector('.accessibility-panel__close');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Toggle button
        this.toggleBtn.addEventListener('click', () => this.toggle());

        // Close button
        this.closeBtn.addEventListener('click', () => this.close());

        // Option buttons
        this.panel.querySelectorAll('.accessibility-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const option = btn.dataset.option;
                this.toggleOption(option);
            });
        });

        // Font size buttons
        this.panel.querySelectorAll('.accessibility-size-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                if (action === 'increase-font') {
                    this.changeFontSize(1);
                } else if (action === 'decrease-font') {
                    this.changeFontSize(-1);
                }
            });
        });

        // Reset button
        this.panel.querySelector('.accessibility-reset').addEventListener('click', () => {
            this.reset();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.widget.contains(e.target)) {
                this.close();
            }
        });
    }

    /**
     * Toggle panel open/close
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Open panel
     */
    open() {
        this.isOpen = true;
        this.panel.classList.add('is-open');
        this.toggleBtn.setAttribute('aria-expanded', 'true');

        // Focus first interactive element
        const firstOption = this.panel.querySelector('.accessibility-size-btn');
        if (firstOption) {
            firstOption.focus();
        }
    }

    /**
     * Close panel
     */
    close() {
        this.isOpen = false;
        this.panel.classList.remove('is-open');
        this.toggleBtn.setAttribute('aria-expanded', 'false');
        this.toggleBtn.focus();
    }

    /**
     * Toggle an accessibility option
     * @param {string} option - Option name
     */
    toggleOption(option) {
        this.settings[option] = !this.settings[option];
        this.applySettings();
        this.savePreferences();
        this.updateOptionButtons();
    }

    /**
     * Change font size
     * @param {number} direction - 1 to increase, -1 to decrease
     */
    changeFontSize(direction) {
        const newSize = this.settings.fontSize + direction;
        if (newSize >= 1 && newSize <= 5) {
            this.settings.fontSize = newSize;
            this.applySettings();
            this.savePreferences();
        }
    }

    /**
     * Apply current settings to page
     */
    applySettings() {
        const body = document.body;

        // Remove all font size classes
        for (let i = 1; i <= 5; i++) {
            body.classList.remove(`a11y-font-size-${i}`);
        }
        body.classList.add(`a11y-font-size-${this.settings.fontSize}`);

        // Toggle option classes
        body.classList.toggle('a11y-high-contrast', this.settings.highContrast);
        body.classList.toggle('a11y-grayscale', this.settings.grayscale);
        body.classList.toggle('a11y-highlight-links', this.settings.highlightLinks);
        body.classList.toggle('a11y-readable-font', this.settings.readableFont);
        body.classList.toggle('a11y-stop-animations', this.settings.stopAnimations);

        this.updateOptionButtons();
    }

    /**
     * Update option button states
     */
    updateOptionButtons() {
        this.panel.querySelectorAll('.accessibility-option').forEach(btn => {
            const option = btn.dataset.option;
            const isActive = this.settings[option];
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-pressed', isActive.toString());
        });
    }

    /**
     * Reset all settings
     */
    reset() {
        this.settings = {
            fontSize: 1,
            highContrast: false,
            grayscale: false,
            highlightLinks: false,
            readableFont: false,
            stopAnimations: false
        };
        this.applySettings();
        this.savePreferences();

        // Announce reset to screen readers
        this.announce('הגדרות הנגישות אופסו');
    }

    /**
     * Save preferences to localStorage
     */
    savePreferences() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
        } catch (e) {
            console.warn('Could not save accessibility preferences:', e);
        }
    }

    /**
     * Load preferences from localStorage
     */
    loadPreferences() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('Could not load accessibility preferences:', e);
        }
    }

    /**
     * Announce message to screen readers
     * @param {string} message - Message to announce
     */
    announce(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);

        setTimeout(() => announcement.remove(), 1000);
    }
}

// Initialize widget when script loads
window.accessibilityWidget = new AccessibilityWidget();
