# TIBYAN - Decorative Font Implementation Guide

## Overview
TIBYAN now uses the **Amiri** font - a beautiful, decorative Arabic font that provides elegant typography for both Arabic and Latin text. This font enhances the visual appeal of the Arabic sentiment analysis platform while maintaining excellent readability.

## Font Configuration

### 1. Font Import (layout.tsx)
```typescript
import { Amiri } from "next/font/google";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: 'swap',
});
```

### 2. CSS Variables (globals.css)
The font is configured with CSS custom properties for consistent usage:
```css
@theme inline {
  --font-amiri: var(--font-amiri);
  --font-inter: var(--font-inter);
  --font-sans: var(--font-amiri), var(--font-inter), ui-sans-serif, system-ui;
  --font-serif: var(--font-amiri), ui-serif, Georgia;
}
```

### 3. Enhanced Typography
- **Default Body Font**: Amiri is now the primary font for all text
- **Headings**: All h1-h6 elements use Amiri with bold weight (700)
- **Arabic Decorative Elements**: Special `.arabic-decorative` class with star decorations

## Usage in Components

### Tailwind CSS Classes
```html
<!-- Primary decorative font -->
<h1 className="font-amiri">تِبيان</h1>

<!-- With decorative elements -->
<h1 className="font-amiri arabic-decorative">مرحباً بك في تِبيان</h1>

<!-- For UI elements (secondary font) -->
<p className="font-inter">UI Text</p>
```

### Key Components Updated
1. **Dashboard** - Main title and metric cards
2. **Landing Page** - Brand title and loading text
3. **Sidebar** - Navigation items and brand logo
4. **Layout** - Applied as default body font

## Font Features

### Arabic Typography
- **Font Features**: `kern`, `liga`, `calt` enabled for optimal rendering
- **Text Rendering**: `optimizeLegibility` for crisp Arabic text
- **RTL Support**: Proper right-to-left text alignment

### Decorative Elements
```css
.arabic-decorative::before {
  content: "✦";
  position: absolute;
  right: -1rem;
  color: #059669;
}
```

## Technical Implementation

### PostCSS Configuration
```javascript
const config = {
  plugins: ["@tailwindcss/postcss"],
};
```

### CSS Custom Classes
- `.font-amiri` - Applies the Amiri font with enhanced rendering
- `.arabic-decorative` - Adds decorative star elements
- `.btn-primary` / `.btn-secondary` - Buttons use Amiri font

## Benefits

1. **Enhanced Aesthetics**: Beautiful, decorative Arabic typography
2. **Cultural Authenticity**: Amiri font reflects Arabic design heritage
3. **Excellent Readability**: Optimized for both Arabic and Latin scripts
4. **Performance**: Google Fonts integration with `display: swap`
5. **Consistency**: Unified typography across all components

## File Changes

### Updated Files:
- `src/app/layout.tsx` - Font import and configuration
- `src/app/globals.css` - CSS variables and typography rules
- `src/app/page.tsx` - Landing page font classes
- `src/app/dashboard/page.tsx` - Dashboard headings and metrics
- `postcss.config.mjs` - PostCSS configuration

### New Features:
- Amiri font integration
- Arabic decorative elements
- Enhanced button styling
- RTL typography support

The decorative font implementation maintains backward compatibility while significantly enhancing the visual appeal and cultural authenticity of the TIBYAN platform.
