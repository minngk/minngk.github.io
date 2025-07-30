/**
 * GitHub API Integration
 * Fetches user statistics from GitHub API
 */

class GitHubAPI {
  constructor(username = 'minngk') {
    this.username = username;
    this.apiUrl = `https://api.github.com/users/${username}`;
    this.cache = {
      data: null,
      timestamp: null,
      ttl: 5 * 60 * 1000 // 5 minutes cache
    };
  }

  /**
   * Check if cached data is still valid
   */
  isCacheValid() {
    if (!this.cache.data || !this.cache.timestamp) {
      return false;
    }
    return (Date.now() - this.cache.timestamp) < this.cache.ttl;
  }

  /**
   * Fetch user data from GitHub API
   */
  async fetchUserData() {
    // Return cached data if valid
    if (this.isCacheValid()) {
      return this.cache.data;
    }

    try {
      const response = await fetch(this.apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Cache the data
      this.cache.data = {
        public_repos: data.public_repos || 0,
        followers: data.followers || 0,
        following: data.following || 0,
        avatar_url: data.avatar_url || '',
        bio: data.bio || '',
        location: data.location || '',
        company: data.company || '',
        blog: data.blog || '',
        created_at: data.created_at || ''
      };
      this.cache.timestamp = Date.now();

      return this.cache.data;
    } catch (error) {
      console.warn('Failed to fetch GitHub data:', error);
      
      // Return fallback data
      return {
        public_repos: '?',
        followers: '?',
        following: '?',
        avatar_url: '',
        bio: '',
        location: '',
        company: '',
        blog: '',
        created_at: ''
      };
    }
  }

  /**
   * Update DOM elements with GitHub stats
   */
  async updateStats() {
    const reposElement = document.getElementById('repos-count');
    const followersElement = document.getElementById('followers-count');
    const followingElement = document.getElementById('following-count');

    // Show loading state
    if (reposElement) reposElement.textContent = '...';
    if (followersElement) followersElement.textContent = '...';
    if (followingElement) followingElement.textContent = '...';

    try {
      const data = await this.fetchUserData();

      // Update stats with animation
      if (reposElement) {
        this.animateNumber(reposElement, data.public_repos);
      }
      if (followersElement) {
        this.animateNumber(followersElement, data.followers);
      }
      if (followingElement) {
        this.animateNumber(followingElement, data.following);
      }

      // Dispatch custom event for other components
      document.dispatchEvent(new CustomEvent('githubDataLoaded', {
        detail: data
      }));

    } catch (error) {
      console.error('Error updating GitHub stats:', error);
      
      // Show error state
      if (reposElement) reposElement.textContent = '?';
      if (followersElement) followersElement.textContent = '?';
      if (followingElement) followingElement.textContent = '?';
    }
  }

  /**
   * Animate number counting effect
   */
  animateNumber(element, targetValue) {
    if (typeof targetValue !== 'number') {
      element.textContent = targetValue;
      return;
    }

    const startValue = 0;
    const duration = 1000; // 1 second
    const startTime = Date.now();

    const updateNumber = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOut);
      
      element.textContent = currentValue.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent = targetValue.toLocaleString();
      }
    };

    requestAnimationFrame(updateNumber);
  }

  /**
   * Get repository information
   */
  async getRepositories(page = 1, perPage = 30) {
    try {
      const response = await fetch(
        `https://api.github.com/users/${this.username}/repos?page=${page}&per_page=${perPage}&sort=updated&direction=desc`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API responded with status: ${response.status}`);
      }

      const repos = await response.json();
      return repos.map(repo => ({
        name: repo.name,
        description: repo.description || '',
        html_url: repo.html_url,
        homepage: repo.homepage || '',
        language: repo.language || '',
        stargazers_count: repo.stargazers_count || 0,
        forks_count: repo.forks_count || 0,
        updated_at: repo.updated_at,
        created_at: repo.created_at,
        topics: repo.topics || []
      }));
    } catch (error) {
      console.warn('Failed to fetch repositories:', error);
      return [];
    }
  }

  /**
   * Check API rate limit
   */
  async checkRateLimit() {
    try {
      const response = await fetch('https://api.github.com/rate_limit');
      const data = await response.json();
      return data.rate;
    } catch (error) {
      console.warn('Failed to check rate limit:', error);
      return null;
    }
  }
}

// Initialize GitHub API when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const githubApi = new GitHubAPI();
  
  // Update stats immediately
  githubApi.updateStats();
  
  // Set up periodic updates (every 5 minutes)
  setInterval(() => {
    githubApi.updateStats();
  }, 5 * 60 * 1000);

  // Make API instance globally available
  window.githubApi = githubApi;
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GitHubAPI;
}