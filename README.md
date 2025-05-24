# ✨ Product Highlighter Extension

A Chrome extension that brings your product browsing experience to life with dynamic, intelligent highlighting on [Cocolux.com](https://cocolux.com)! 

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## 🌟 Features

### 🎯 Smart Product Highlighting
- **Intelligent Detection**: Automatically identifies and highlights product names across the website
- **Scroll-Aware**: Highlights appear smoothly as you scroll through products
- **Dynamic Navigation**: Seamless highlighting persists while browsing between pages
- **Eye-Catching Animation**: Products grab attention with subtle blinking effects

### ⚡ Performance Optimized
- **Color Caching**: Instant highlighting with pre-fetched colors
- **Batch Processing**: Efficient handling of multiple products
- **Smart Observer**: Minimal resource usage with optimized DOM watching
- **Navigation Enhancement**: Pre-loads data before page changes

## 🚀 How It Works

1. **Detection**: Monitors the webpage for product names using smart selectors
2. **Color Assignment**: Each product gets a unique highlight color from our API
3. **Visibility Tracking**: Uses IntersectionObserver to track visible products
4. **Smooth Animation**: Applies eye-catching blinking effect to visible products
5. **Navigation Handling**: Maintains highlighting during page navigation

```javascript
// Example of highlight animation
.cosafe-highlighted {
  animation: highlightBlink 2s infinite;
}
```

## 💫 Technical Features

- **Efficient DOM Observation**: Smart MutationObserver configuration
- **Batch Color Pre-fetching**: Reduces API calls and improves performance
- **Request Animation Frame**: Ensures smooth visual transitions
- **History API Integration**: Enhanced page navigation handling
- **Idle Callback Usage**: Non-blocking post-navigation setup

## 🔧 Installation

1. Clone the repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension directory

## 🎨 Configuration

The extension automatically works on Cocolux.com domains and supports various product layouts:

- Product listing pages
- Product detail pages
- Search results
- Category pages

## 🏗️ Architecture

- **Color Service**: RESTful API for product color assignments
- **DOM Observers**: Efficient content change monitoring
- **Navigation Handler**: Smooth cross-page functionality
- **Performance Optimizer**: Smart resource management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<p align="center">Made with ❤️ for better product browsing</p>