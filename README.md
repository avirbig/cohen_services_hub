# Cohen Services Hub

A multi-website project hosting various personal and business websites.

## 🌐 Live Sites

| Site | URL | Status |
|------|-----|--------|
| Junk Removal | [avirbig.github.io/cohen_services_hub/sites/junk-removal/](https://avirbig.github.io/cohen_services_hub/sites/junk-removal/) | Active |
| Portfolio | [avirbig.github.io/cohen_services_hub/sites/portfolio/](https://avirbig.github.io/cohen_services_hub/sites/portfolio/) | Coming Soon |

## 📁 Project Structure

```
cohen_services_hub/
├── README.md                    # This file
├── PROJECT_INSTRUCTIONS.md      # Build instructions for AI agents
├── shared/                      # Shared assets across all sites
│   ├── css/
│   │   ├── base.css            # Common styles, RTL, variables
│   │   └── accessibility.css   # Accessibility widget styles
│   ├── js/
│   │   ├── utils.js            # Common utilities
│   │   └── accessibility.js    # Accessibility widget
│   └── assets/
│       └── icons/              # Shared icons
├── sites/
│   ├── junk-removal/           # כהן פינויים וירושות
│   │   ├── index.html
│   │   ├── terms.html
│   │   ├── accessibility-statement.html
│   │   ├── css/styles.css
│   │   ├── js/main.js
│   │   └── assets/images/
│   └── portfolio/              # Personal portfolio (future)
│       └── index.html
└── .github/
    └── workflows/
        └── deploy.yml          # GitHub Pages deployment
```

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Flexbox, Grid
- **Vanilla JavaScript** - No frameworks
- **Formspree** - Form handling
- **GitHub Pages** - Hosting

## 🚀 Deployment

The site is automatically deployed via GitHub Actions when pushing to the `main` branch.

### Manual Deployment

1. Push changes to `main` branch
2. GitHub Actions will automatically build and deploy
3. Site will be live within a few minutes

## ⚙️ Configuration

### Formspree Setup

1. Create account at [formspree.io](https://formspree.io)
2. Create a new form
3. Copy the form ID
4. Replace `YOUR_FORM_ID` in `sites/junk-removal/index.html`

## 🌍 Localization

- **Primary Language**: Hebrew (RTL)
- **Future**: Russian support planned

## ♿ Accessibility

All sites comply with:
- WCAG 2.1 Level AA
- Israeli accessibility regulations (תקנות נגישות לשירות 2013)

## 📝 License

© 2026 Cohen Services. All rights reserved.
