# URL Shortener - Frontend

A minimalist, modern React frontend for the URL Shortener service.

## Features

- ✨ **Minimalist Design**: Clean, modern interface with gradient background
- 🔗 **URL Shortening**: Easy-to-use form for shortening URLs
- 📊 **Analytics**: Real-time visit tracking and statistics
- 📋 **Copy to Clipboard**: One-click copying of shortened URLs
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile
- ⚡ **Fast**: Optimized for performance with React 19
- 🎨 **Modern UI**: Beautiful gradients, shadows, and animations

## Design Philosophy

This frontend follows a **minimalist design approach** with:

- **Clean Layout**: Simple, uncluttered interface
- **Modern Typography**: System fonts for optimal readability
- **Subtle Animations**: Smooth transitions and hover effects
- **Accessible Colors**: High contrast and color-blind friendly
- **Mobile-First**: Responsive design that works on all devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- Backend server running on `http://localhost:3000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Usage

### Basic URL Shortening

1. Enter a long URL in the input field
2. Click "Shorten" button
3. Copy the generated short URL
4. View analytics and visit counts

### Features Overview

- **Input Validation**: Automatic URL validation
- **Loading States**: Visual feedback during processing
- **Error Handling**: User-friendly error messages
- **Analytics**: Real-time visit tracking
- **Copy Functionality**: One-click URL copying
- **Reset Form**: Easy form clearing for new URLs

## API Integration

The frontend connects to the backend API at `http://localhost:3000`:

- `POST /api/shorten` - Create short URL
- `GET /api/analytics/:shortCode` - Get URL analytics
- `GET /:shortCode` - Redirect to original URL

## Styling

The app uses a custom CSS approach with:

- **CSS Variables**: Consistent color scheme
- **Flexbox/Grid**: Modern layout techniques
- **CSS Gradients**: Beautiful background effects
- **Media Queries**: Responsive breakpoints
- **Smooth Transitions**: Enhanced user experience

## Components

### Main App Component

- **State Management**: React hooks for local state
- **API Integration**: Axios for HTTP requests
- **Error Handling**: Comprehensive error states
- **Loading States**: User feedback during operations

### Key Features

1. **URL Input**: Validates and processes URLs
2. **Result Display**: Shows shortened URL with copy button
3. **Analytics Panel**: Displays visit counts and creation date
4. **Feature Grid**: Highlights app capabilities
5. **Responsive Design**: Adapts to all screen sizes

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Structure

```
src/
├── App.jsx          # Main application component
├── App.css          # Application styles
├── index.css        # Global styles
├── main.jsx         # Application entry point
└── assets/          # Static assets
```

## Customization

### Colors

The app uses a purple-blue gradient theme. To customize:

1. Update CSS variables in `App.css`
2. Modify gradient backgrounds
3. Adjust color schemes for different themes

### Layout

- Modify `.main` class for content width
- Update `.input-group` for form layout
- Adjust `.feature-grid` for feature display

## Performance

- **Optimized Bundle**: Vite for fast builds
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Lazy loading capabilities
- **Minimal Dependencies**: Only essential packages

## Accessibility

- **Semantic HTML**: Proper heading structure
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant colors
- **Focus Management**: Clear focus indicators

## License

MIT License - feel free to use in your projects!