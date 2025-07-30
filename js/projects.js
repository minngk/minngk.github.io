/**
 * Projects Management System
 * Handles project data loading, display, and management
 */

class ProjectsManager {
  constructor() {
    this.projects = [];
    this.filteredProjects = [];
    this.settings = {};
    this.isLoaded = false;
  }

  /**
   * Load projects data from JSON file
   */
  async loadProjects() {
    try {
      const response = await fetch('./data/projects.json');
      if (!response.ok) {
        throw new Error(`Failed to load projects: ${response.status}`);
      }
      
      const data = await response.json();
      this.projects = data.projects || [];
      this.settings = data.settings || {};
      this.filteredProjects = [...this.projects];
      this.isLoaded = true;
      
      return this.projects;
    } catch (error) {
      console.error('Error loading projects:', error);
      // Load fallback data
      this.loadFallbackData();
      return this.projects;
    }
  }

  /**
   * Load fallback data if JSON fails to load
   */
  loadFallbackData() {
    this.projects = [
      {
        id: 'gominage',
        name: 'gominage',
        description: 'HTML5 Canvasを使用したブラウザゲーム。JavaScript ES6+とカスタム物理シミュレーションで開発されたクライアントサイドゲームです。',
        icon: 'fab fa-js-square',
        technologies: ['JavaScript', 'HTML5', 'CSS3', 'Canvas'],
        github: 'https://github.com/minngk/gominage',
        demo: null,
        featured: true,
        createdAt: '2025-01-01',
        status: 'active',
        color: '#F7DF1E',
        language: 'JavaScript'
      }
    ];
    this.filteredProjects = [...this.projects];
    this.isLoaded = true;
  }

  /**
   * Get language-specific icon class
   */
  getLanguageIcon(language) {
    const iconMap = {
      'Go': 'fab fa-golang',
      'JavaScript': 'fab fa-js-square',
      'TypeScript': 'fab fa-js-square',
      'Python': 'fab fa-python',
      'React': 'fab fa-react',
      'Vue': 'fab fa-vuejs',
      'Node.js': 'fab fa-node-js',
      'HTML': 'fab fa-html5',
      'CSS': 'fab fa-css3-alt',
      'PHP': 'fab fa-php',
      'Java': 'fab fa-java',
      'C++': 'fas fa-code',
      'C#': 'fas fa-code',
      'Ruby': 'fas fa-gem',
      'Rust': 'fas fa-cog',
      'Swift': 'fab fa-swift',
      'Kotlin': 'fas fa-mobile-alt'
    };
    return iconMap[language] || 'fas fa-code';
  }

  /**
   * Get project card variant class based on language
   */
  getCardVariant(language) {
    const variantMap = {
      'Go': 'go-lang',
      'JavaScript': 'javascript',
      'TypeScript': 'javascript',
      'Python': 'python',
      'React': 'react',
      'Vue': 'vue'
    };
    return variantMap[language] || '';
  }

  /**
   * Create project card HTML
   */
  createProjectCard(project) {
    const cardVariant = this.getCardVariant(project.language);
    const technologies = project.technologies.map(tech => 
      `<span class="tech-tag">${tech}</span>`
    ).join('');

    const githubLink = project.github ? 
      `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link primary">
        <i class="fab fa-github"></i>
        GitHub
      </a>` : '';

    const demoLink = project.demo ? 
      `<a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="project-link secondary">
        <i class="fas fa-external-link-alt"></i>
        Demo
      </a>` : '';

    const featuredBadge = project.featured ? 
      '<div class="featured-badge">Featured</div>' : '';

    return `
      <div class="project-card ${cardVariant}" data-project-id="${project.id}">
        ${featuredBadge}
        <div class="project-card-content">
          <i class="${project.icon || this.getLanguageIcon(project.language)} project-icon" aria-hidden="true"></i>
          <h3 class="project-title">${project.name}</h3>
          <p class="project-description">${project.description}</p>
          <div class="project-technologies">
            ${technologies}
          </div>
          <div class="project-links">
            ${githubLink}
            ${demoLink}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Display projects in the grid
   */
  displayProjects(projects = this.filteredProjects) {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) {
      console.error('Projects grid element not found');
      return;
    }

    // Show loading state
    projectsGrid.innerHTML = '<div class="projects-loading">プロジェクトを読み込み中...</div>';

    // Sort projects (featured first if enabled)
    const sortedProjects = [...projects];
    if (this.settings.showFeaturedFirst) {
      sortedProjects.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }

    // Generate HTML for all projects
    const projectsHTML = sortedProjects.map(project => 
      this.createProjectCard(project)
    ).join('');

    // Update DOM
    if (sortedProjects.length === 0) {
      projectsGrid.innerHTML = `
        <div class="projects-empty">
          <i class="fas fa-folder-open"></i>
          <h3>プロジェクトが見つかりません</h3>
          <p>現在表示できるプロジェクトがありません。</p>
        </div>
      `;
    } else {
      projectsGrid.innerHTML = projectsHTML;
    }

    // Add fade-in animation
    const cards = projectsGrid.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('fade-in');
    });

    // Dispatch event for other components
    document.dispatchEvent(new CustomEvent('projectsDisplayed', {
      detail: { projects: sortedProjects }
    }));
  }

  /**
   * Filter projects by technology
   */
  filterByTechnology(tech) {
    if (!tech) {
      this.filteredProjects = [...this.projects];
    } else {
      this.filteredProjects = this.projects.filter(project =>
        project.technologies.some(t => 
          t.toLowerCase().includes(tech.toLowerCase())
        )
      );
    }
    this.displayProjects();
  }

  /**
   * Filter projects by language
   */
  filterByLanguage(language) {
    if (!language) {
      this.filteredProjects = [...this.projects];
    } else {
      this.filteredProjects = this.projects.filter(project =>
        project.language && project.language.toLowerCase() === language.toLowerCase()
      );
    }
    this.displayProjects();
  }

  /**
   * Search projects by name or description
   */
  searchProjects(query) {
    if (!query) {
      this.filteredProjects = [...this.projects];
    } else {
      const searchTerm = query.toLowerCase();
      this.filteredProjects = this.projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.technologies.some(tech => 
          tech.toLowerCase().includes(searchTerm)
        )
      );
    }
    this.displayProjects();
  }

  /**
   * Get project by ID
   */
  getProject(id) {
    return this.projects.find(project => project.id === id);
  }

  /**
   * Add new project
   */
  addProject(projectData) {
    // Validate required fields
    if (!projectData.name || !projectData.github) {
      throw new Error('必須フィールド（name, github）が不足しています');
    }

    // Generate ID if not provided
    if (!projectData.id) {
      projectData.id = this.generateId(projectData.name);
    }

    // Set defaults
    const newProject = {
      id: projectData.id,
      name: projectData.name,
      description: projectData.description || '',
      icon: projectData.icon || this.getLanguageIcon(projectData.language),
      technologies: projectData.technologies || [],
      github: projectData.github,
      demo: projectData.demo || null,
      featured: projectData.featured || false,
      createdAt: new Date().toISOString(),
      status: 'active',
      color: projectData.color || '#333',
      language: projectData.language || 'Other'
    };

    // Add to projects array
    this.projects.unshift(newProject);
    this.filteredProjects = [...this.projects];

    // Refresh display
    this.displayProjects();

    // Save to localStorage for persistence
    this.saveToLocalStorage();

    return newProject;
  }

  /**
   * Generate unique ID from name
   */
  generateId(name) {
    const baseId = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    let id = baseId;
    let counter = 1;
    
    while (this.projects.some(p => p.id === id)) {
      id = `${baseId}-${counter}`;
      counter++;
    }
    
    return id;
  }

  /**
   * Save projects to localStorage
   */
  saveToLocalStorage() {
    try {
      const data = {
        projects: this.projects,
        settings: this.settings,
        timestamp: Date.now()
      };
      localStorage.setItem('portfolioProjects', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  /**
   * Load projects from localStorage
   */
  loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('portfolioProjects');
      if (saved) {
        const data = JSON.parse(saved);
        // Merge with loaded projects, prioritizing localStorage
        const savedIds = data.projects.map(p => p.id);
        const newProjects = this.projects.filter(p => !savedIds.includes(p.id));
        this.projects = [...data.projects, ...newProjects];
        this.filteredProjects = [...this.projects];
        return true;
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
    }
    return false;
  }

  /**
   * Initialize projects manager
   */
  async init() {
    try {
      await this.loadProjects();
      this.loadFromLocalStorage();
      this.displayProjects();
    } catch (error) {
      console.error('Failed to initialize projects manager:', error);
      this.loadFallbackData();
      this.displayProjects();
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const projectsManager = new ProjectsManager();
  projectsManager.init();
  
  // Make manager globally available
  window.projectsManager = projectsManager;
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProjectsManager;
}