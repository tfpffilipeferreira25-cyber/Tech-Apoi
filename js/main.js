// Tech Apoio - Main JavaScript Module
// McDonald's-inspired animations and interactions

class TechApoioApp {
  constructor() {
    this.isInitialized = false;
    this.currentSection = 0;
    this.sections = [];
    this.scrollDots = [];
    this.isDark = localStorage.getItem('darkMode') === 'true';
    this.currentLang = localStorage.getItem('lang') || 'pt';
    this.isScrolling = false;
    
    this.init();
  }

  init() {
    if (this.isInitialized) return;
    
    document.addEventListener('DOMContentLoaded', () => {
      this.setupElements();
      this.createScrollIndicator();
      this.setupScrollObserver();
      this.setupNavigation();
      this.setupThemeToggle();
      this.setupLanguageToggle();
      this.setupParallaxEffect();
      this.setupSmoothScrolling();
      this.initializeAnimations();
      this.setupMcDonaldsEffects();
      
      this.isInitialized = true;
      console.log('🍟 Tech Apoio App initialized with McDonald\'s style!');
    });
  }

  setupElements() {
    this.sections = document.querySelectorAll('.section');
    this.nav = document.querySelector('.nav-fixed');
    this.scrollIndicator = document.querySelector('.scroll-indicator');
    this.themeBtn = document.getElementById('theme-btn');
    this.langBtn = document.getElementById('lang-btn');
  }

  createScrollIndicator() {
    if (!this.scrollIndicator) return;
    
    this.sections.forEach((section, index) => {
      const dot = document.createElement('div');
      dot.classList.add('scroll-dot');
      dot.setAttribute('data-section', section.id);
      dot.addEventListener('click', () => this.scrollToSection(section.id));
      
      // McDonald's style bounce effect on creation
      dot.style.transform = 'scale(0)';
      this.scrollIndicator.appendChild(dot);
      
      setTimeout(() => {
        dot.style.transform = 'scale(1)';
        dot.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      }, index * 100);
    });
    
    this.scrollDots = document.querySelectorAll('.scroll-dot');
  }

  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section || this.isScrolling) return;
    
    this.isScrolling = true;
    
    // McDonald's style loading effect
    this.showLoadingEffect();
    
    section.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    
    setTimeout(() => {
      this.isScrolling = false;
      this.hideLoadingEffect();
    }, 1000);
  }

  setupScrollObserver() {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-10% 0px -10% 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const section = entry.target;
        const sectionId = section.id;
        const correspondingDot = document.querySelector(`[data-section="${sectionId}"]`);
        
        if (entry.isIntersecting) {
          // McDonald's style entrance animation
          section.classList.add('visible');
          this.triggerMcDonaldsAnimation(section);
          
          // Update active dot with bounce
          this.updateActiveDot(correspondingDot);
          
          // Update active nav link
          this.updateActiveNavLink(sectionId);
        }
      });
    }, observerOptions);

    this.sections.forEach(section => sectionObserver.observe(section));
  }

  updateActiveDot(activeDot) {
    this.scrollDots.forEach(dot => {
      dot.classList.remove('active');
      dot.style.transform = 'scale(1)';
    });
    
    if (activeDot) {
      activeDot.classList.add('active');
      // McDonald's bounce effect
      activeDot.style.transform = 'scale(0.8)';
      setTimeout(() => {
        activeDot.style.transform = 'scale(1.6)';
      }, 100);
    }
  }

  updateActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('active');
        // McDonald's style active animation
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
          link.style.transform = 'scale(1.05)';
          setTimeout(() => {
            link.style.transform = 'scale(1)';
          }, 150);
        }, 100);
      }
    });
  }

  triggerMcDonaldsAnimation(section) {
    const animatedElements = section.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .mc-bounce-in');
    
    animatedElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('visible');
        
        // Add McDonald's style effects
        element.style.transform = 'scale(0.8)';
        setTimeout(() => {
          element.style.transform = 'scale(1.05)';
          setTimeout(() => {
            element.style.transform = 'scale(1)';
          }, 200);
        }, 100);
      }, index * 150);
    });
  }

  setupNavigation() {
    if (!this.nav) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateNav = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 50) {
        this.nav.classList.add('scrolled');
      } else {
        this.nav.classList.remove('scrolled');
      }

      // McDonald's style hide/show
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        this.nav.style.transform = 'translateY(-100%)';
      } else {
        this.nav.style.transform = 'translateY(0)';
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateNav);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick);
    
    // Setup nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        this.scrollToSection(targetId);
      });
    });
  }

  setupThemeToggle() {
    if (!this.themeBtn) return;

    const updateTheme = (dark) => {
      document.body.classList.toggle('dark', dark);
      this.themeBtn.textContent = dark ? '☀️' : '🌙';
      
      // McDonald's style button animation
      this.animateButton(this.themeBtn);
    };

    this.themeBtn.addEventListener('click', () => {
      this.isDark = !this.isDark;
      updateTheme(this.isDark);
      localStorage.setItem('darkMode', this.isDark);
    });

    updateTheme(this.isDark);
  }

  setupLanguageToggle() {
    if (!this.langBtn) return;

    const updateLanguage = (lang) => {
      const elements = document.querySelectorAll('[data-pt][data-en]');
      
      elements.forEach(el => {
        el.style.opacity = '0.7';
        el.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          el.textContent = el.getAttribute(`data-${lang}`);
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 150);
      });
      
      this.langBtn.textContent = lang === 'pt' ? '🇬🇧' : '🇵🇹';
      this.animateButton(this.langBtn);
    };

    this.langBtn.addEventListener('click', () => {
      this.currentLang = this.currentLang === 'pt' ? 'en' : 'pt';
      updateLanguage(this.currentLang);
      localStorage.setItem('lang', this.currentLang);
    });

    updateLanguage(this.currentLang);
  }

  animateButton(button) {
    button.style.transform = 'scale(0.8) rotate(-10deg)';
    setTimeout(() => {
      button.style.transform = 'scale(1.1) rotate(5deg)';
      setTimeout(() => {
        button.style.transform = 'scale(1) rotate(0deg)';
      }, 150);
    }, 100);
  }

  setupParallaxEffect() {
    let rafId;

    const handleMouseMove = (e) => {
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        document.querySelectorAll('.background-image').forEach(img => {
          img.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
        });
        
        rafId = null;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href').substring(1);
        this.scrollToSection(targetId);
      });
    });
  }

  initializeAnimations() {
    // Initialize first section
    const firstSection = document.querySelector('.section');
    if (firstSection) {
      firstSection.classList.add('visible');
      this.triggerMcDonaldsAnimation(firstSection);
    }

    // Team member hover effects
    this.setupTeamMemberEffects();
    
    // Button ripple effects
    this.setupButtonEffects();
  }

  setupTeamMemberEffects() {
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
      member.addEventListener('mouseenter', () => {
        member.style.transform = 'translateY(-15px) scale(1.03) rotate(1deg)';
      });
      
      member.addEventListener('mouseleave', () => {
        member.style.transform = 'translateY(0) scale(1) rotate(0deg)';
      });
    });
  }

  setupButtonEffects() {
    const buttons = document.querySelectorAll('.mc-button, .button');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.createRippleEffect(e, button);
      });
    });
  }

  createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      transform: scale(0);
      animation: mc-ripple 0.8s ease-out;
      pointer-events: none;
      z-index: 1000;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 800);
  }

  setupMcDonaldsEffects() {
    // Golden arches inspired loading animation
    this.createLoadingElement();
    
    // Energetic hover effects for all interactive elements
    this.addEnergeticHovers();
    
    // Bounce animations for cards
    this.addCardBounceEffects();
  }

  createLoadingElement() {
    const loader = document.createElement('div');
    loader.className = 'mc-loader';
    loader.innerHTML = `
      <div class="mc-spinner"></div>
      <p>Carregando...</p>
    `;
    loader.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.95);
      padding: 30px;
      border-radius: 20px;
      display: none;
      z-index: 10000;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(loader);
    this.loader = loader;
  }

  showLoadingEffect() {
    if (this.loader) {
      this.loader.style.display = 'block';
      this.loader.style.transform = 'translate(-50%, -50%) scale(0.8)';
      setTimeout(() => {
        this.loader.style.transform = 'translate(-50%, -50%) scale(1)';
      }, 100);
    }
  }

  hideLoadingEffect() {
    if (this.loader) {
      this.loader.style.transform = 'translate(-50%, -50%) scale(0.8)';
      setTimeout(() => {
        this.loader.style.display = 'none';
      }, 200);
    }
  }

  addEnergeticHovers() {
    const interactiveElements = document.querySelectorAll('.nav-link, .control-btn, .scroll-dot');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.transform += ' scale(1.1)';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = element.style.transform.replace(' scale(1.1)', '');
      });
    });
  }

  addCardBounceEffects() {
    const cards = document.querySelectorAll('.about-content, .team-member');
    
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('mc-bounce-in');
      }, index * 200);
    });
  }
}

// Initialize the app
const techApoioApp = new TechApoioApp();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TechApoioApp;
}
