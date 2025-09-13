# Modu - Static Commercial Webpage

A modern, responsive commercial webpage built with Tailwind CSS and vanilla JavaScript, featuring a contact form that integrates with Spring Boot backend.

## 🚀 Features

- **Modern Design**: Clean, professional design with gradient backgrounds and smooth animations
- **Responsive Layout**: Fully responsive design that works on desktop, tablet, and mobile
- **Tailwind CSS**: Utility-first CSS framework for fast development
- **Contact Form**: Functional contact form with validation and Spring Boot integration
- **Smooth Scrolling**: Enhanced navigation experience with smooth scrolling
- **SEO Optimized**: Semantic HTML and proper meta tags for search engines
- **Accessibility**: Built with accessibility best practices

## 📁 Project Structure

```
modu-web-page/
├── index.html                  # Main homepage
├── pages/
│   ├── about.html             # About us page
│   └── contact.html           # Dedicated contact page
├── assets/
│   ├── css/
│   │   ├── input.css          # Tailwind input file
│   │   └── style.css          # Compiled Tailwind CSS
│   └── js/
│       └── main.js            # JavaScript functionality
├── components/                 # Reusable HTML components
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind configuration
├── SPRING_INTEGRATION.md      # Spring Boot integration guide
└── README.md                  # This file
```

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first CSS framework
- **Vanilla JavaScript**: Contact form handling and interactions
- **Font Awesome**: Icons
- **Google Fonts**: Inter font family

### Backend Integration
- **Spring Boot**: REST API backend
- **JSON**: Data exchange format
- **Fetch API**: HTTP client for form submission

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd modu-web-page
```

2. **Install dependencies**
```bash
npm install
```

3. **Build CSS (for development)**
```bash
npm run build-css
```

4. **Build CSS (for production)**
```bash
npm run build
```

5. **Start development server**
```bash
npm run dev
```

The website will be available at `http://localhost:3000`

## 📱 Pages

### Homepage (`index.html`)
- Hero section with call-to-action
- Services overview
- About section with statistics
- Client testimonials
- Contact form
- Footer with links

### About Page (`pages/about.html`)
- Company story and mission
- Core values
- Team showcase
- Call-to-action section

### Contact Page (`pages/contact.html`)
- Detailed contact information
- Enhanced contact form with additional fields
- FAQ section
- Map placeholder

## 🔧 Customization

### Colors
Update the color scheme in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your primary colors
      },
      accent: {
        // Your accent colors
      }
    }
  }
}
```

### Typography
Modify font families in `tailwind.config.js` and update the Google Fonts link in HTML files.

### Content
- Update company information in HTML files
- Modify service offerings and descriptions
- Replace placeholder images and icons
- Update contact information

## 📧 Contact Form Integration

The contact form is designed to work with a Spring Boot backend. See `SPRING_INTEGRATION.md` for detailed setup instructions.

### Configuration
Update the API endpoint in `assets/js/main.js`:

```javascript
const CONFIG = {
    API_BASE_URL: 'http://your-spring-app.com/api',
    CONTACT_ENDPOINT: '/contact',
    // ... other settings
};
```

### Features
- Client-side validation
- Loading states
- Error handling
- Success feedback
- CORS support
- Request timeout handling

## 🎨 Design System

### Component Classes
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.card` - Card component
- `.form-input` - Form input styling
- `.section-padding` - Consistent section spacing
- `.container-custom` - Container with max-width

### Utility Classes
- `.text-balance` - Text balancing
- `.gradient-bg` - Gradient background

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## 🚀 Deployment

### Static Hosting
Deploy to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### Build for Production
```bash
npm run build
```

This creates an optimized CSS file for production use.

## 🔒 Security Considerations

- Input validation on both client and server
- CSRF protection (configure in Spring Boot)
- Rate limiting (implement in backend)
- HTTPS in production
- Environment variables for sensitive data

## 📈 Performance

- Minified CSS in production
- Optimized images (use appropriate formats and sizes)
- Lazy loading for images below the fold
- CDN for external resources

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test responsiveness across devices
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions about Spring Boot integration, see `SPRING_INTEGRATION.md`.

For general support:
- Check the documentation
- Open an issue
- Contact: hello@modu.com

## 🏗️ Future Enhancements

- [ ] Add blog functionality
- [ ] Implement dark mode
- [ ] Add animations library (AOS, Framer Motion)
- [ ] Multi-language support
- [ ] Analytics integration
- [ ] Performance monitoring
- [ ] A/B testing capabilities