/**
 * Main JavaScript File
 * Coordinates all components and handles global functionality
 */

class PortfolioApp {
  constructor() {
    this.components = {
      githubApi: null,
      projectsManager: null,
      themeManager: null
    };
    this.isInitialized = false;
    this.observers = {};
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log('Initializing Portfolio App...');
      
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }

      // Initialize core components
      await this.initializeComponents();
      
      // Setup global event listeners
      this.setupEventListeners();
      
      // Setup intersection observers for animations
      this.setupIntersectionObservers();
      
      // Setup smooth scrolling
      this.setupSmoothScrolling();
      
      // Add loading complete class
      document.body.classList.add('loaded');
      
      this.isInitialized = true;
      console.log('Portfolio App initialized successfully');
      
      // Dispatch app ready event
      document.dispatchEvent(new CustomEvent('appReady'));
      
    } catch (error) {
      console.error('Failed to initialize Portfolio App:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Initialize core components
   */
  async initializeComponents() {
    // Components will be initialized by their own scripts
    // We just need to wait for them to be available
    await this.waitForGlobalComponents();
    
    // Store references to global components
    this.components.githubApi = window.githubApi;
    this.components.projectsManager = window.projectsManager;
    this.components.themeManager = window.themeManager;
  }

  /**
   * Wait for global components to be available
   */
  waitForGlobalComponents() {
    return new Promise((resolve) => {
      const checkComponents = () => {
        if (window.githubApi && window.projectsManager && window.themeManager) {
          resolve();
        } else {
          setTimeout(checkComponents, 50);
        }
      };
      checkComponents();
    });
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Handle GitHub data loading
    document.addEventListener('githubDataLoaded', (e) => {
      this.handleGitHubDataLoaded(e.detail);
    });

    // Handle projects display
    document.addEventListener('projectsDisplayed', (e) => {
      this.handleProjectsDisplayed(e.detail);
    });

    // Handle theme changes
    document.addEventListener('themeChanged', (e) => {
      this.handleThemeChanged(e.detail);
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleWindowResize();
      }, 100);
    });

    // Handle scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.handleScroll();
      }, 10);
    });

    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardShortcuts(e);
    });

    // Handle visibility change (tab switching)
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });

    // Handle online/offline status
    window.addEventListener('online', () => {
      this.handleNetworkStatusChange(true);
    });

    window.addEventListener('offline', () => {
      this.handleNetworkStatusChange(false);
    });
  }

  /**
   * Setup intersection observers for animations
   */
  setupIntersectionObservers() {
    // Observer for fade-in animations
    this.observers.fadeIn = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          this.observers.fadeIn.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    // Observer for section visibility
    this.observers.sections = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.handleSectionVisible(entry.target);
        }
      });
    }, {
      threshold: 0.3
    });

    // Observe elements
    document.querySelectorAll('.about-section, .projects-section').forEach(section => {
      this.observers.sections.observe(section);
    });

    document.querySelectorAll('.project-card, .stat-card').forEach(element => {
      this.observers.fadeIn.observe(element);
    });
  }

  /**
   * Setup smooth scrolling for anchor links
   */
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * Handle GitHub data loaded
   */
  handleGitHubDataLoaded(data) {
    console.log('GitHub data loaded:', data);
    
    // Update any additional UI elements based on GitHub data
    if (data.bio) {
      const bioElement = document.querySelector('.github-bio');
      if (bioElement) {
        bioElement.textContent = data.bio;
      }
    }
  }

  /**
   * Handle projects displayed
   */
  handleProjectsDisplayed(data) {
    console.log('Projects displayed:', data.projects.length);
    
    // Re-observe new project cards for animations
    document.querySelectorAll('.project-card:not(.observed)').forEach(card => {
      card.classList.add('observed');
      this.observers.fadeIn.observe(card);
    });
  }

  /**
   * Handle theme changed
   */
  handleThemeChanged(data) {
    console.log('Theme changed to:', data.theme);
    
    // Update any theme-dependent elements
    document.documentElement.setAttribute('data-theme', data.theme);
  }

  /**
   * Handle window resize
   */
  handleWindowResize() {
    // Update any size-dependent calculations
    const isMobile = window.innerWidth < 768;
    document.body.classList.toggle('mobile', isMobile);
  }

  /**
   * Handle scroll events
   */
  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class for styling
    document.body.classList.toggle('scrolled', scrollTop > 50);
    
    // Update scroll progress
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = scrollTop / scrollHeight;
    
    document.documentElement.style.setProperty('--scroll-progress', scrollProgress);
  }

  /**
   * Handle keyboard shortcuts
   */
  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + K: Focus search (if exists)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.querySelector('#search-input');
      if (searchInput) {
        searchInput.focus();
      }
    }

    // Escape: Clear focus/close modals
    if (e.key === 'Escape') {
      document.activeElement?.blur();
      document.querySelectorAll('.modal.active, .dropdown.active').forEach(el => {
        el.classList.remove('active');
      });
    }
  }

  /**
   * Handle visibility change (tab switching)
   */
  handleVisibilityChange() {
    if (document.hidden) {
      // Page is now hidden
      this.pauseAnimations();
    } else {
      // Page is now visible
      this.resumeAnimations();
      
      // Refresh GitHub stats if it's been a while
      if (this.components.githubApi) {
        this.components.githubApi.updateStats();
      }
    }
  }

  /**
   * Handle network status changes
   */
  handleNetworkStatusChange(isOnline) {
    document.body.classList.toggle('offline', !isOnline);
    
    if (isOnline) {
      console.log('Network connection restored');
      // Retry failed API calls
      if (this.components.githubApi) {
        this.components.githubApi.updateStats();
      }
    } else {
      console.log('Network connection lost');
      this.showOfflineMessage();
    }
  }

  /**
   * Handle section visibility
   */
  handleSectionVisible(section) {
    const sectionId = section.id;
    
    // Update navigation if it exists
    document.querySelectorAll(`[href="#${sectionId}"]`).forEach(link => {
      link.classList.add('active');
    });
    
    // Remove active class from other nav links
    document.querySelectorAll(`[href^="#"]:not([href="#${sectionId}"])`).forEach(link => {
      link.classList.remove('active');
    });
  }

  /**
   * Pause animations for performance
   */
  pauseAnimations() {
    document.documentElement.style.setProperty('--animation-play-state', 'paused');
  }

  /**
   * Resume animations
   */
  resumeAnimations() {
    document.documentElement.style.setProperty('--animation-play-state', 'running');
  }

  /**
   * Show offline message
   */
  showOfflineMessage() {
    // Create and show offline notification
    const notification = document.createElement('div');
    notification.className = 'offline-notification';
    notification.innerHTML = `
      <i class="fas fa-wifi-slash"></i>
      <span>オフライン状態です</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('visible');
    }, 100);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.classList.remove('visible');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);
  }

  /**
   * Handle initialization errors
   */
  handleInitializationError(error) {
    console.error('App initialization failed:', error);
    
    // Show error message to user
    const errorMessage = document.createElement('div');
    errorMessage.className = 'init-error';
    errorMessage.innerHTML = `
      <h3>読み込みエラー</h3>
      <p>アプリケーションの初期化に失敗しました。ページを再読み込みしてください。</p>
      <button onclick="location.reload()">再読み込み</button>
    `;
    
    document.body.appendChild(errorMessage);
  }

  /**
   * Get app status
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      components: Object.keys(this.components).reduce((status, key) => {
        status[key] = !!this.components[key];
        return status;
      }, {}),
      theme: this.components.themeManager?.getCurrentTheme(),
      online: navigator.onLine
    };
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    // Disconnect observers
    Object.values(this.observers).forEach(observer => {
      observer.disconnect();
    });
    
    // Remove event listeners would go here if needed
    console.log('Portfolio App cleaned up');
  }
}

// Initialize the application
const portfolioApp = new PortfolioApp();
portfolioApp.init();

// Make app instance globally available for debugging
window.portfolioApp = portfolioApp;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortfolioApp;
}