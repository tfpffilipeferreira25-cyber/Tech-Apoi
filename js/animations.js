// Animation Manager - McDonald's Style Animations
class AnimationManager {
  constructor() {
    this.animations = new Map();
    this.observers = new Map();
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // McDonald's signature bounce animation
  bounceIn(element, delay = 0) {
    if (this.isReducedMotion) return;
    
    setTimeout(() => {
      element.style.cssText += `
        opacity: 0;
        transform: scale(0.3) translateY(100px);
        animation: mc-bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        animation-delay: ${delay}ms;
      `;
    }, delay);
  }

  // Energetic slide animations
  slideInDirection(element, direction = 'left', delay = 0) {
    if (this.isReducedMotion) return;
    
    const directions = {
      left: 'mc-slide-in-left',
      right: 'mc-slide-in-right',
      up: 'mc-slide-in-up',
      down: 'mc-slide-in-down'
    };

    setTimeout(() => {
      element.style.cssText += `
        opacity: 0;
        animation: ${directions[direction]} 0.6s ease-out forwards;
        animation-delay: ${delay}ms;
      `;
    }, delay);
  }

  // Pulsing effect for important elements
  pulse(element, duration = 2000) {
    if (this.isReducedMotion) return;
    
    element.style.animation = `mc-pulse ${duration}ms infinite`;
  }

  // Floating effect
  float(element) {
    if (this.isReducedMotion) return;
    
    element.style.animation = 'mc-float 3s ease-in-out infinite';
  }

  // Wobble effect for interactive elements
  wobble(element) {
    if (this.isReducedMotion) return;
    
    element.style.animation = 'mc-wobble 0.5s ease-in-out';
    setTimeout(() => {
      element.style.animation = '';
    }, 500);
  }

  // Elastic scale effect
  elasticScale(element, scale = 1.1) {
    if (this.isReducedMotion) return;
    
    const originalTransform = element.style.transform;
    element.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    element.style.transform = `${originalTransform} scale(${scale})`;
    
    setTimeout(() => {
      element.style.transform = originalTransform;
    }, 300);
  }

  // Magnetic hover effect
  magneticHover(element, strength = 0.3) {
    element.addEventListener('mousemove', (e) => {
      if (this.isReducedMotion) return;
      
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = '';
    });
  }

  // Staggered animations for lists
  staggeredAnimation(elements, animationType = 'bounceIn', stagger = 100) {
    elements.forEach((element, index) => {
      const delay = index * stagger;
      
      switch (animationType) {
        case 'bounceIn':
          this.bounceIn(element, delay);
          break;
        case 'slideLeft':
          this.slideInDirection(element, 'left', delay);
          break;
        case 'slideRight':
          this.slideInDirection(element, 'right', delay);
          break;
        default:
          this.bounceIn(element, delay);
      }
    });
  }

  // Intersection Observer for scroll animations
  observeElement(element, callback, options = {}) {
    const defaultOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observerOptions = { ...defaultOptions, ...options };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    observer.observe(element);
    this.observers.set(element, observer);
  }

  // Auto-animate elements on scroll
  autoAnimateOnScroll() {
    // Animate titles
    document.querySelectorAll('.section-title').forEach(title => {
      this.observeElement(title, (el) => {
        this.bounceIn(el);
      });
    });

    // Animate subtitles
    document.querySelectorAll('.section-subtitle').forEach(subtitle => {
      this.observeElement(subtitle, (el) => {
        this.slideInDirection(el, 'up', 200);
      });
    });

    // Animate buttons
    document.querySelectorAll('.mc-button, .button').forEach(button => {
      this.observeElement(button, (el) => {
        this.elasticScale(el);
      });
    });

    // Animate team members
    const teamMembers = document.querySelectorAll('.team-member');
    if (teamMembers.length > 0) {
      this.observeElement(teamMembers[0].parentElement, () => {
        this.staggeredAnimation(teamMembers, 'bounceIn', 150);
      });
    }

    // Animate cards
    document.querySelectorAll('.mc-card, .about-content').forEach(card => {
      this.observeElement(card, (el) => {
        this.bounceIn(el, 100);
      });
    });
  }

  // Cleanup method
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.animations.clear();
  }
}

// Particle System for Background Effects
class ParticleSystem {
  constructor(container) {
    this.container = container;
    this.particles = [];
    this.animationId = null;
    this.isActive = false;
  }

  createParticle() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.5 + 0.1,
      life: 1.0
    };
  }

  init(particleCount = 50) {
    this.particles = [];
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.createParticle());
    }
    this.isActive = true;
    this.animate();
  }

  animate() {
    if (!this.isActive) return;

    this.particles.forEach((particle, index) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.life -= 0.005;

      if (particle.life <= 0 || 
          particle.x < 0 || particle.x > window.innerWidth ||
          particle.y < 0 || particle.y > window.innerHeight) {
        this.particles[index] = this.createParticle();
      }
    });

    this.render();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  render() {
    // This would typically render to a canvas
    // For now, we'll create DOM elements (not recommended for many particles)
    this.particles.forEach((particle, index) => {
      let element = document.getElementById(`particle-${index}`);
      if (!element) {
        element = document.createElement('div');
        element.id = `particle-${index}`;
        element.style.cssText = `
          position: fixed;
          pointer-events: none;
          background: radial-gradient(circle, rgba(0,122,255,0.6) 0%, transparent 70%);
          border-radius: 50%;
          z-index: -1;
        `;
        document.body.appendChild(element);
      }

      element.style.left = `${particle.x}px`;
      element.style.top = `${particle.y}px`;
      element.style.width = `${particle.size}px`;
      element.style.height = `${particle.size}px`;
      element.style.opacity = particle.life * particle.opacity;
    });
  }

  stop() {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    // Clean up DOM elements
    this.particles.forEach((_, index) => {
      const element = document.getElementById(`particle-${index}`);
      if (element) element.remove();
    });
  }
}

// Performance Monitor
class PerformanceMonitor {
  constructor() {
    this.fps = 0;
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.isMonitoring = false;
  }

  start() {
    this.isMonitoring = true;
    this.monitor();
  }

  monitor() {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    this.frameCount++;

    if (currentTime >= this.lastTime + 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.frameCount = 0;
      this.lastTime = currentTime;
      
      // Adjust animations based on performance
      this.adjustPerformance();
    }

    requestAnimationFrame(() => this.monitor());
  }

  adjustPerformance() {
    if (this.fps < 30) {
      // Reduce animation complexity
      document.documentElement.style.setProperty('--transition-smooth', 'all 0.2s ease');
      document.documentElement.style.setProperty('--transition-bounce', 'all 0.3s ease');
    } else if (this.fps > 50) {
      // Restore full animations
      document.documentElement.style.setProperty('--transition-smooth', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');
      document.documentElement.style.setProperty('--transition-bounce', 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)');
    }
  }

  stop() {
    this.isMonitoring = false;
  }

  getFPS() {
    return this.fps;
  }
}

// Export classes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AnimationManager, ParticleSystem, PerformanceMonitor };
}
