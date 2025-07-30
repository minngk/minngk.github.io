/**
 * Theme Management System
 * Handles theme switching and customization
 */

class ThemeManager {
  constructor() {
    this.themes = {
      cafe: {
        name: 'Cafe',
        colors: {
          'primary-bg': 'linear-gradient(135deg, #f7f3e9 0%, #e8ddd4 100%)',
          'text-primary': '#6b4423',
          'text-secondary': '#8b6f47',
          'accent-primary': '#d4a574',
          'accent-secondary': '#b8956a',
          'card-bg': 'rgba(255, 255, 255, 0.8)',
          'shadow-light': 'rgba(107, 68, 35, 0.1)',
          'shadow-medium': 'rgba(107, 68, 35, 0.2)'
        }
      },
      dark: {
        name: 'Dark',
        colors: {
          'primary-bg': 'linear-gradient(135deg, #2c1810 0%, #3d2817 100%)',
          'text-primary': '#f4e6d3',
          'text-secondary': '#d4c4a8',
          'accent-primary': '#d4a574',
          'accent-secondary': '#b8956a',
          'card-bg': 'rgba(0, 0, 0, 0.3)',
          'shadow-light': 'rgba(0, 0, 0, 0.3)',
          'shadow-medium': 'rgba(0, 0, 0, 0.5)'
        }
      },
      ocean: {
        name: 'Ocean',
        colors: {
          'primary-bg': 'linear-gradient(135deg, #e6f7ff 0%, #bae0ff 100%)',
          'text-primary': '#003a8c',
          'text-secondary': '#1f54a3',
          'accent-primary': '#1890ff',
          'accent-secondary': '#096dd9',
          'card-bg': 'rgba(255, 255, 255, 0.8)',
          'shadow-light': 'rgba(0, 58, 140, 0.1)',
          'shadow-medium': 'rgba(0, 58, 140, 0.2)'
        }
      },
      forest: {
        name: 'Forest',
        colors: {
          'primary-bg': 'linear-gradient(135deg, #f0f9f0 0%, #d9f7be 100%)',
          'text-primary': '#135200',
          'text-secondary': '#389e0d',
          'accent-primary': '#52c41a',
          'accent-secondary': '#73d13d',
          'card-bg': 'rgba(255, 255, 255, 0.8)',
          'shadow-light': 'rgba(19, 82, 0, 0.1)',
          'shadow-medium': 'rgba(19, 82, 0, 0.2)'
        }
      }
    };

    this.currentTheme = 'cafe';
    this.systemPreference = 'light';
    this.init();
  }

  /**
   * Initialize theme manager
   */
  init() {
    this.detectSystemPreference();
    this.loadSavedTheme();
    this.applyTheme(this.currentTheme);
    this.setupEventListeners();
  }

  /**
   * Detect system color scheme preference
   */
  detectSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.systemPreference = 'dark';
    } else {
      this.systemPreference = 'light';
    }

    // Listen for changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        this.systemPreference = e.matches ? 'dark' : 'light';
        this.handleSystemPreferenceChange();
      });
    }
  }

  /**
   * Handle system preference changes
   */
  handleSystemPreferenceChange() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    
    // Only apply system preference if no manual theme is set
    if (!savedTheme) {
      const autoTheme = this.systemPreference === 'dark' ? 'dark' : 'cafe';
      this.applyTheme(autoTheme);
    }
  }

  /**
   * Load saved theme from localStorage
   */
  loadSavedTheme() {
    try {
      const savedTheme = localStorage.getItem('portfolio-theme');
      if (savedTheme && this.themes[savedTheme]) {
        this.currentTheme = savedTheme;
      } else if (this.systemPreference === 'dark') {
        this.currentTheme = 'dark';
      }
    } catch (error) {
      console.warn('Failed to load saved theme:', error);
    }
  }

  /**
   * Save theme to localStorage
   */
  saveTheme(themeName) {
    try {
      localStorage.setItem('portfolio-theme', themeName);
    } catch (error) {
      console.warn('Failed to save theme:', error);
    }
  }

  /**
   * Apply theme to the document
   */
  applyTheme(themeName) {
    if (!this.themes[themeName]) {
      console.warn(`Theme "${themeName}" not found`);
      return;
    }

    const theme = this.themes[themeName];
    const root = document.documentElement;

    // Apply CSS custom properties
    Object.entries(theme.colors).forEach(([property, value]) => {
      root.style.setProperty(`--${property}`, value);
    });

    // Update current theme
    this.currentTheme = themeName;

    // Add theme class to body
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${themeName}`);

    // Save to localStorage
    this.saveTheme(themeName);

    // Dispatch theme change event
    document.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme: themeName, colors: theme.colors }
    }));

    // Update theme selector if it exists
    this.updateThemeSelector();
  }

  /**
   * Switch to next theme in rotation
   */
  switchTheme() {
    const themeNames = Object.keys(this.themes);
    const currentIndex = themeNames.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    const nextTheme = themeNames[nextIndex];
    
    this.applyTheme(nextTheme);
  }

  /**
   * Get current theme info
   */
  getCurrentTheme() {
    return {
      name: this.currentTheme,
      displayName: this.themes[this.currentTheme].name,
      colors: this.themes[this.currentTheme].colors
    };
  }

  /**
   * Get all available themes
   */
  getAllThemes() {
    return Object.entries(this.themes).map(([key, theme]) => ({
      key,
      name: theme.name,
      colors: theme.colors
    }));
  }

  /**
   * Create theme selector element
   */
  createThemeSelector() {
    const selector = document.createElement('div');
    selector.className = 'theme-selector';
    selector.innerHTML = `
      <button class="theme-toggle" aria-label="テーマを変更">
        <i class="fas fa-palette"></i>
      </button>
      <div class="theme-dropdown">
        ${Object.entries(this.themes).map(([key, theme]) => `
          <button class="theme-option" data-theme="${key}" ${key === this.currentTheme ? 'aria-current="true"' : ''}>
            <span class="theme-preview" style="background: ${theme.colors['accent-primary']}"></span>
            ${theme.name}
          </button>
        `).join('')}
      </div>
    `;

    // Add event listeners
    const toggle = selector.querySelector('.theme-toggle');
    const dropdown = selector.querySelector('.theme-dropdown');
    const options = selector.querySelectorAll('.theme-option');

    toggle.addEventListener('click', () => {
      dropdown.classList.toggle('active');
    });

    options.forEach(option => {
      option.addEventListener('click', () => {
        const theme = option.dataset.theme;
        this.applyTheme(theme);
        dropdown.classList.remove('active');
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!selector.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });

    return selector;
  }

  /**
   * Update theme selector to reflect current theme
   */
  updateThemeSelector() {
    const options = document.querySelectorAll('.theme-option');
    options.forEach(option => {
      if (option.dataset.theme === this.currentTheme) {
        option.setAttribute('aria-current', 'true');
        option.classList.add('active');
      } else {
        option.removeAttribute('aria-current');
        option.classList.remove('active');
      }
    });
  }

  /**
   * Setup keyboard shortcuts and other event listeners
   */
  setupEventListeners() {
    // Keyboard shortcut: Ctrl/Cmd + Shift + T
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.switchTheme();
      }
    });

    // Add theme selector to header if it doesn't exist
    document.addEventListener('DOMContentLoaded', () => {
      if (!document.querySelector('.theme-selector')) {
        const header = document.querySelector('.header-section .container');
        if (header) {
          const selector = this.createThemeSelector();
          selector.style.position = 'absolute';
          selector.style.top = '20px';
          selector.style.right = '20px';
          header.style.position = 'relative';
          header.appendChild(selector);
        }
      }
    });
  }

  /**
   * Add custom theme
   */
  addCustomTheme(name, colors) {
    if (this.themes[name]) {
      console.warn(`Theme "${name}" already exists`);
      return false;
    }

    this.themes[name] = {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      colors: colors
    };

    return true;
  }

  /**
   * Remove custom theme
   */
  removeCustomTheme(name) {
    if (['cafe', 'dark', 'ocean', 'forest'].includes(name)) {
      console.warn(`Cannot remove built-in theme "${name}"`);
      return false;
    }

    if (!this.themes[name]) {
      console.warn(`Theme "${name}" not found`);
      return false;
    }

    delete this.themes[name];

    // Switch to default theme if current theme was removed
    if (this.currentTheme === name) {
      this.applyTheme('cafe');
    }

    return true;
  }

  /**
   * Export current theme configuration
   */
  exportTheme() {
    return {
      name: this.currentTheme,
      colors: this.themes[this.currentTheme].colors,
      timestamp: Date.now()
    };
  }

  /**
   * Import theme configuration
   */
  importTheme(themeData) {
    try {
      if (!themeData.name || !themeData.colors) {
        throw new Error('Invalid theme data format');
      }

      this.addCustomTheme(themeData.name, themeData.colors);
      this.applyTheme(themeData.name);
      
      return true;
    } catch (error) {
      console.error('Failed to import theme:', error);
      return false;
    }
  }
}

// Initialize theme manager
document.addEventListener('DOMContentLoaded', () => {
  const themeManager = new ThemeManager();
  
  // Make theme manager globally available
  window.themeManager = themeManager;
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}