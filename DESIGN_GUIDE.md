# 🎨 UI/UX Design Guide

## Color Palette

### Primary Colors (Purple Gradient)
```
#7c3aed - Primary 700 (Deep Purple)
#a855f7 - Primary 500 (Medium Purple)  ← Main Brand Color
#c084fc - Primary 400 (Light Purple)
#e9d5ff - Primary 200 (Very Light Purple)
```

### Accent Colors (Blue Gradient)
```
#1e40af - Accent 800 (Deep Blue)
#2563eb - Accent 700 (Medium Blue)
#3b82f6 - Accent 500 (Bright Blue)  ← Secondary Color
#60a5fa - Accent 400 (Light Blue)
#93c5fd - Accent 300 (Very Light Blue)
```

### Background Colors
```
#0f0c29 - Dark Purple (Top)
#302b63 - Medium Purple (Middle)
#24243e - Dark Blue (Bottom)

Gradient: linear-gradient(to bottom, #0f0c29, #302b63, #24243e)
```

### Utility Colors
```
Success: #10b981 (Green)
Error: #ef4444 (Red)
Warning: #f59e0b (Orange)
Info: #3b82f6 (Blue)
```

### Text Colors
```
Primary Text: #ffffff (White)
Secondary Text: #d1d5db (Gray 300)
Muted Text: #9ca3af (Gray 400)
```

---

## Typography

### Font Family
```css
font-family: 'Poppins', 'Inter', system-ui, sans-serif;
```

### Font Weights
- Light: 300
- Regular: 400
- Medium: 500
- Semi-Bold: 600
- Bold: 700
- Extra-Bold: 800

### Font Sizes
```
Hero Heading:     4xl - 7xl (36px - 72px)
Page Heading:     3xl - 5xl (30px - 48px)
Section Heading:  2xl - 3xl (24px - 30px)
Card Title:       xl - 2xl (20px - 24px)
Body Text:        base - lg (16px - 18px)
Small Text:       sm - xs (12px - 14px)
```

---

## Component Styles

### Glass Card (Glassmorphism)
```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
}

.glass-dark {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
}
```

### Gradient Button
```css
.gradient-button {
  background: linear-gradient(135deg, #a855f7 0%, #3b82f6 100%);
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
}

.gradient-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(168, 85, 247, 0.5);
}
```

### Input Field
```css
.input-field {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: white;
  transition: all 0.3s;
}

.input-field:focus {
  outline: none;
  border-color: #a855f7;
  box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.5);
}
```

### Card with Hover Effect
```css
.card-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(168, 85, 247, 0.3);
}
```

---

## Animations

### Fade In Up
```javascript
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}
```

### Scale In
```javascript
const scaleIn = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: 'spring', stiffness: 200 }
}
```

### Float Animation
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
```

### Shake Animation (Error)
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}

.shake {
  animation: shake 0.5s;
}
```

---

## Page Layouts

### Hero Section
```
┌─────────────────────────────────────────┐
│                                         │
│         🚀 [Icon - Animated]            │
│                                         │
│    Turning Your Ideas Into Reality 🚀   │
│                                         │
│  Professional Video Editing, Poster     │
│    Design, Web & App Development        │
│                                         │
│    [Get Started]  [View Services]       │
│                                         │
│    [Stats Cards - 4 columns]            │
│                                         │
└─────────────────────────────────────────┘
```

### Service Card
```
┌─────────────────────────────────┐
│  🎬 [Icon with Gradient BG]     │
│                                 │
│  Video Editing                  │
│                                 │
│  Professional video editing     │
│  with smooth transitions        │
│                                 │
└─────────────────────────────────┘
```

### Application Form
```
┌────────────────────────────────────┐
│   📧 [Icon]                        │
│                                    │
│   Apply for a Project              │
│   Fill out the form below          │
│                                    │
│   👤 Client Name                   │
│   [________________]               │
│                                    │
│   🏙️ City                          │
│   [________________]               │
│                                    │
│   💼 Type of Service               │
│   [Select ▼_______]                │
│                                    │
│   📅 Days to Complete (Min: 3)     │
│   [3_______________]               │
│                                    │
│   [Submit Application]             │
│                                    │
└────────────────────────────────────┘
```

---

## Spacing System

```
Padding/Margin Scale:
1 = 0.25rem (4px)
2 = 0.5rem (8px)
3 = 0.75rem (12px)
4 = 1rem (16px)
5 = 1.25rem (20px)
6 = 1.5rem (24px)
8 = 2rem (32px)
10 = 2.5rem (40px)
12 = 3rem (48px)
16 = 4rem (64px)
20 = 5rem (80px)
```

### Common Spacing
```
Card Padding: p-6 to p-8 (24px - 32px)
Section Padding: py-16 to py-20 (64px - 80px)
Container Max Width: max-w-7xl (1280px)
Gap Between Items: gap-4 to gap-6 (16px - 24px)
```

---

## Border Radius

```
Small:    rounded-lg (0.5rem / 8px)
Medium:   rounded-xl (0.75rem / 12px)
Large:    rounded-2xl (1rem / 16px)
XLarge:   rounded-3xl (1.5rem / 24px)
Full:     rounded-full (9999px)
```

---

## Shadow System

```css
/* Small Shadow */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);

/* Medium Shadow */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

/* Large Shadow */
box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);

/* Glow Effect (Purple) */
box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);

/* Glow Effect (Blue) */
box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
```

---

## Responsive Breakpoints

```javascript
// Tailwind Breakpoints
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Laptop
xl: 1280px  // Desktop
2xl: 1536px // Large Desktop
```

### Usage Example
```jsx
className="text-base sm:text-lg md:text-xl lg:text-2xl"
// Mobile: 16px
// Tablet: 18px
// Laptop: 20px
// Desktop: 24px
```

---

## Icon Guidelines

### Icon Library: React Icons

```javascript
import { 
  FaVideo,      // Video Editing
  FaImage,      // Poster Design
  FaCode,       // Website Creation
  FaMobile,     // App Development
  FaUser,       // User/Profile
  FaEnvelope,   // Email
  FaLock,       // Password/Security
  FaCheckCircle // Success
} from 'react-icons/fa';
```

### Icon Sizes
```
Small:   16px - 20px
Medium:  24px - 32px
Large:   40px - 48px
Hero:    56px - 72px
```

---

## Form Validation Styles

### Error State
```css
.input-error {
  border-color: #ef4444;
  animation: shake 0.5s;
}
```

### Success State
```css
.input-success {
  border-color: #10b981;
}
```

### Loading State
```css
.spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #a855f7;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}
```

---

## Toast Notifications

### Success Toast
```javascript
toast.success('Your request has been submitted successfully! 🎉', {
  position: 'top-right',
  autoClose: 3000,
  theme: 'dark'
});
```

### Error Toast
```javascript
toast.error('Minimum 3 days required!', {
  icon: '⚠️'
});
```

---

## Accessibility

### Focus States
```css
:focus-visible {
  outline: 2px solid #a855f7;
  outline-offset: 2px;
}
```

### ARIA Labels
```jsx
<button aria-label="Submit application">
  Submit
</button>
```

### Alt Text
```jsx
<img src="icon.png" alt="Video editing service icon" />
```

---

## Performance Optimizations

### Image Optimization
- Use WebP format
- Add width/height attributes
- Lazy load images below fold

### Code Splitting
```javascript
const Home = lazy(() => import('./pages/Home'));
```

### Minimize Re-renders
```javascript
export default React.memo(ComponentName);
```

---

## Mobile-First Approach

### Start with Mobile
```css
/* Mobile first (default) */
.text-base

/* Then add larger screens */
sm:text-lg md:text-xl lg:text-2xl
```

### Touch Targets
```
Minimum size: 44x44px for tap targets
Spacing: At least 8px between elements
```

---

## Design Principles

1. **Consistency** - Use the same patterns throughout
2. **Hierarchy** - Clear visual hierarchy with typography
3. **Whitespace** - Generous spacing for breathing room
4. **Contrast** - Ensure text is readable on backgrounds
5. **Feedback** - Provide immediate feedback for user actions
6. **Performance** - Smooth 60fps animations
7. **Accessibility** - WCAG 2.1 Level AA compliance

---

## UI Component Checklist

- [ ] Consistent colors from palette
- [ ] Proper font sizes and weights
- [ ] Adequate spacing (padding/margin)
- [ ] Smooth hover/active states
- [ ] Loading states for async actions
- [ ] Error states with clear messages
- [ ] Success feedback (toast/confetti)
- [ ] Mobile responsive (test all breakpoints)
- [ ] Keyboard accessible
- [ ] Screen reader friendly

---

**Design System Version:** 1.0
**Last Updated:** October 2025
**Built with Tailwind CSS + Framer Motion**
