# Cohen Services Hub - Project Instructions

Use this prompt with Claude or another AI agent to build the project.

---

## 🚀 Build Prompt

Create a multi-website project called "cohen_services_hub" with the following specifications:

## Project Overview
A simple static website hub hosting multiple sites, starting with a junk removal business landing page. Built with plain HTML, CSS, and JavaScript for easy AI-assisted maintenance. Deployed on GitHub Pages (free).

**Live URL will be:** https://avirbig.github.io/cohen_services_hub/sites/junk-removal/

## Technical Requirements
- **Stack**: Pure HTML5, CSS3, vanilla JavaScript (no frameworks, no build tools)
- **Deployment**: GitHub Pages compatible (static files only)
- **Form handling**: Formspree integration for contact form (including file uploads)
- **Primary Language**: Hebrew (RTL layout)
- **Future languages**: Russian (structure ready but not implemented)
- **Design**: Clean, professional, vintage/pastel aesthetic, mobile-responsive
- **Accessibility**: Full compliance with Israeli accessibility law (תקנות נגישות לשירות 2013) based on WCAG 2.1 AA standards

## Business Information
- **Business Name**: כהן פינויים וירושות חיפה והצפון
- **Service**: Home, apartment, and garage junk/estate removal (פינוי דירות, בתים, מוסכים, ירושות)
- **Service Area**: Haifa and Northern Israel (חיפה והצפון)
- **Target Audience**: Hebrew speakers, primarily 35+ age group
- **Contact Method**: Phone and contact form only (no WhatsApp at this stage)

## Project Structure
```
cohen_services_hub/
├── README.md                    # Project documentation (English)
├── shared/
│   ├── css/
│   │   ├── base.css            # Reset, RTL, CSS variables, typography
│   │   └── accessibility.css    # Accessibility features & styles
│   ├── js/
│   │   ├── utils.js            # Common utilities
│   │   └── accessibility.js     # Accessibility widget functionality
│   └── assets/
│       └── icons/              # Shared icons (accessibility, social, etc.)
├── sites/
│   ├── junk-removal/
│   │   ├── index.html
│   │   ├── terms.html          # Terms & conditions page (placeholder)
│   │   ├── accessibility-statement.html  # הצהרת נגישות (required by law)
│   │   ├── css/
│   │   │   └── styles.css
│   │   ├── js/
│   │   │   └── main.js
│   │   └── assets/
│   │       └── images/
│   └── portfolio/              # Future site (placeholder only)
│       └── index.html          # "Coming soon" page
└── .github/
    └── workflows/
        └── deploy.yml          # GitHub Pages deployment
```

## Color Scheme (Vintage Pastel)
Use CSS custom properties for easy theming:
- **Primary**: Dusty sage green (#9CAF88 or similar)
- **Secondary**: Warm cream/beige (#F5F0E6)
- **Accent**: Muted terracotta/coral (#D4A574)
- **Text**: Warm dark brown (#3D3229)
- **Background**: Off-white with warm tint (#FAF8F5)
- **Success**: Soft green
- **Error**: Muted red (not harsh)

Create a cohesive vintage/retro feel - think clean, trustworthy, warm, not clinical or cold.

## Junk Removal Landing Page Sections

### 1. Header (sticky on scroll)
- Business logo/name: כהן פינויים וירושות
- Tagline: חיפה והצפון
- Click-to-call phone button (placeholder number: 050-0000000)
- Accessibility widget button (נגישות)

### 2. Hero Section
- Large headline: פינוי דירות ומשרדים | מהיר, אמין, ובמחיר הוגן
- Subheadline describing service briefly
- Primary CTA button: "קבל הצעת מחיר חינם" (scrolls to contact form)
- Optional: Background image placeholder (soft, not distracting)

### 3. Services Section (מה אנחנו מפנים)
Icon grid with services:
- פינוי דירות (apartment clearance)
- פינוי ירושות (estate clearance)
- פינוי משרדים (office clearance)
- פינוי מוסכים ומחסנים (garage/storage)
- פינוי רהיטים ומכשירי חשמל (furniture/appliances)
- פינוי פסולת בניין (construction waste)

### 4. How It Works (איך זה עובד)
Simple 3-step visual process:
1. יצירת קשר - Contact us (phone/form)
2. הערכה חינם - Free assessment/quote
3. פינוי מהיר - Fast removal

### 5. Why Choose Us (למה כהן פינויים)
4 benefit cards:
- מהיר ואמין - Fast & reliable
- מחירים הוגנים - Fair pricing
- שירות אדיב - Friendly service
- פינוי אקולוגי - Eco-friendly disposal/recycling

### 6. Contact Form Section (צור קשר / בקש הצעת מחיר)
**This is the most important section**

Form fields:
- שם מלא (Full name) - required
- טלפון (Phone) - required, Israeli format validation
- אימייל (Email) - optional
- עיר/ישוב (City/Location) - dropdown or text, required
- כתובת (Address) - optional
- תיאור הפינוי (Description) - textarea, required
  - Placeholder: "ספרו לנו מה צריך לפנות - כמות, סוג הפריטים, קומה, גישה למקום וכו'"
- העלאת תמונות (Photo upload) - multiple files allowed, optional
  - Accept: jpg, png, heic
  - Max 5 files, max 5MB each
  - Show thumbnails of selected files
- זמן מועדף ליצירת קשר (Preferred contact time) - dropdown:
  - בכל שעה
  - בוקר (08:00-12:00)
  - צהריים (12:00-16:00)  
  - ערב (16:00-20:00)

**Terms checkbox (required):**
☑️ קראתי ואני מסכים/ה ל[תנאי השימוש](terms.html) ול[מדיניות הפרטיות](terms.html#privacy)

Submit button: שלח בקשה

**Form states:**
- Loading state with spinner
- Success message: "הבקשה נשלחה בהצלחה! ניצור איתך קשר בהקדם"
- Error message: "אירעה שגיאה, נסה שנית או התקשר אלינו"

### 7. Footer
- Business name and brief description
- Phone number (clickable) - placeholder: 050-0000000
- Service areas list
- הצהרת נגישות link
- תנאי שימוש link
- Copyright: © 2026 כהן פינויים וירושות. כל הזכויות שמורות.

## Accessibility Requirements (נגישות - Israel Standard)

### Accessibility Widget (floating button)
Position: Bottom left (for RTL)
Features toggle:
- הגדלת טקסט / הקטנת טקסט (text size)
- ניגודיות גבוהה (high contrast mode)
- גווני אפור (grayscale)
- הדגשת קישורים (highlight links)
- גופן קריא (readable font)
- עצירת אנימציות (stop animations - for future use)
- איפוס (reset all)

### Technical Accessibility:
- Semantic HTML5 (proper heading hierarchy h1→h2→h3)
- ARIA labels on all interactive elements
- Alt text placeholders for all images
- Focus indicators (visible, styled nicely)
- Keyboard navigation support (tab order)
- Skip to main content link
- Form labels properly associated
- Error messages announced to screen readers
- Color contrast minimum 4.5:1
- Touch targets minimum 44x44px
- lang="he" attribute with dir="rtl"

### Accessibility Statement Page (הצהרת נגישות)
Required by Israeli law. Include:
- Commitment to accessibility
- Standard compliance level (WCAG 2.1 AA)
- Accessibility features available
- Known limitations (if any)
- Contact for accessibility issues
- Last updated date
- Placeholder for accessibility consultant info

## Terms & Conditions Page (תנאי שימוש)
Create placeholder page with sections:
- תנאי שימוש כלליים (general terms)
- מדיניות פרטיות (privacy policy)
- שימוש בטפסים (form usage)
- אחריות (liability)
- יצירת קשר (contact)

Mark clearly: "דף זה בבנייה - התוכן יעודכן בקרוב"

## Formspree Integration
- Use Formspree (https://formspree.io)
- Form endpoint is already set up - use: https://formspree.io/f/YOUR_FORM_ID
- Add HTML comment near form: "<!-- Replace YOUR_FORM_ID with your Formspree form ID. Sign up at formspree.io, create a form, and paste your ID here -->"
- Configure for file uploads (enctype="multipart/form-data")
- Add honeypot field for spam prevention (_gotcha field, hidden)
- Add _subject field: "בקשה חדשה לפינוי מהאתר"
- Add _replyto field connected to user's email input

## Code Quality Guidelines
- Well-commented code in English (for AI editing)
- Section separators in HTML for easy navigation
- CSS organized by section
- Mobile-first responsive breakpoints
- BEM-like class naming for clarity
- No inline styles
- Print stylesheet basics (hide nav, show full content)

## Testing Checklist (add as HTML comment)
- [ ] RTL layout correct
- [ ] Form submission works
- [ ] File upload works
- [ ] All links work
- [ ] Mobile responsive
- [ ] Accessibility widget works
- [ ] Keyboard navigation works
- [ ] Contact buttons clickable

## Placeholder Content
Use realistic Hebrew placeholder text, not Lorem Ipsum.
Add TODO comments where real content/images needed.
Phone number placeholder: 050-0000000 (mark with TODO to replace)

## DO NOT implement yet:
- Russian language
- Portfolio site (just empty placeholder)
- Blog
- Online payment
- Booking system
- WhatsApp integration

Start by creating the complete file structure and a fully functional junk removal landing page with all sections, working contact form (with Formspree placeholder), accessibility widget, and required legal pages.

---

## 📋 Post-Build Setup Steps

### 1. Formspree Setup (2 minutes)
1. Go to [formspree.io](https://formspree.io)
2. Sign up with your email
3. Create new form → Copy the form ID
4. Replace `YOUR_FORM_ID` in the code

### 2. GitHub Pages Deployment
1. Push code to GitHub repository
2. Go to repo Settings → Pages
3. Select source branch (main) and save

**Your site will be live at:** https://avirbig.github.io/cohen_services_hub/sites/junk-removal/

### 3. Update Placeholders
- Replace phone number (050-0000000) with real number
- Add real business images
- Complete terms & conditions content
- Update accessibility statement with consultant info if needed
