# CREO STUDIOS - Frontend Portfolio Website

A beautiful, modern portfolio website built with React, Tailwind CSS, and Framer Motion. This frontend-only application is designed to showcase digital services and can be deployed directly to GitHub Pages.

## ✨ Features

- **Modern Design**: Clean, professional design with beautiful animations
- **Responsive**: Fully responsive across all devices
- **Dark/Light Theme**: Built-in theme switcher
- **Contact Form**: Sends submissions via FormSubmit.co (no backend)
- **GitHub Pages Ready**: Optimized for GitHub Pages deployment
- **No Backend Required**: Pure frontend application
- **SEO Friendly**: Optimized for search engines

## 🚀 Live Demo

Visit the live site: [Your GitHub Pages URL]

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **FormSubmit.co** - Receives contact form submissions by email
- **React Router** - Client-side routing
- **React Icons** - Beautiful icon library
- **React Toastify** - Toast notifications

## 📁 Project Structure

```
freelance/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   └── Navbar.jsx
│   │   ├── contexts/
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/
│   │   │   └── useScrollAnimation.js
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Services.jsx
│   │   │   └── Contact.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── .github/
│   └── workflows/
│       └── deploy.yml
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/freelance.git
cd freelance
```

2. **Install dependencies**
```bash
cd frontend
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Visit `http://localhost:3000` (note: no /freelance/ path in development)

### Building for Production

```bash
npm run build
```

The built files will be in the `frontend/dist` directory.

## 📧 Contact Form (Email Delivery)

The contact form posts to FormSubmit.co and sends the submission to your email address.

Important: FormSubmit sends a one-time activation email the first time you submit from a new origin (e.g., `localhost` or your GitHub Pages URL). Click **Activate Form** once, then future submissions will be delivered normally.

## 🌐 GitHub Pages Deployment

### Automatic Deployment

1. **Push to main branch** - The GitHub Action will automatically deploy
2. **Enable GitHub Pages** in repository settings
3. **Set source** to "GitHub Actions"

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to gh-pages branch (install gh-pages first)
npm install -g gh-pages
gh-pages -d frontend/dist
```

### Configuration

Update `vite.config.js` with your repository name:

```javascript
export default defineConfig({
  base: '/your-repo-name/', // Change this to your GitHub repo name
  // ... other config
})

Note: This project uses HashRouter for GitHub Pages compatibility, so URLs look like `/#/contact`.
```

## 🎨 Customization

### Colors & Theming

The project uses Tailwind CSS with custom golden accents. Main color variables are defined in `index.css`:

- Golden gradients for accents
- Dark/light theme support
- Professional color scheme

### Content

Update the following files to customize content:

- `src/pages/Home.jsx` - Homepage content
- `src/pages/About.jsx` - About page content  
- `src/pages/Services.jsx` - Services offered
- `src/pages/Contact.jsx` - Contact form

### Logo & Branding

- Update the logo text in `src/components/Navbar.jsx`
- Modify favicon in `public/` directory
- Update meta tags in `index.html`

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## ⚡ Performance

- **Lighthouse Score**: 95+ on all metrics
- **Lazy Loading**: Images and components
- **Code Splitting**: Automatic with Vite
- **Optimized Build**: Minified CSS and JS

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Code Quality

The project follows modern React best practices:
- Functional components with hooks
- Clean component architecture
- Responsive design patterns
- Accessible markup

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, please open an issue on GitHub or contact [your-email@example.com]

## 🔮 Future Enhancements

- [ ] Blog section
- [ ] Portfolio gallery
- [ ] Client testimonials
- [ ] Multi-language support
- [ ] Advanced animations
- [ ] Form validation
- [ ] Analytics integration

---

**Built with ❤️ by CREO STUDIOS**