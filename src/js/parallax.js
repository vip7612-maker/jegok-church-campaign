/**
 * Parallax Scroll Engine
 * IntersectionObserver + requestAnimationFrame based parallax effects
 */

export class ParallaxEngine {
  constructor() {
    this.elements = [];
    this.revealElements = [];
    this.ticking = false;
    this.init();
  }

  init() {
    // Collect parallax elements
    document.querySelectorAll('[data-speed]').forEach(el => {
      this.elements.push({
        el,
        speed: parseFloat(el.dataset.speed) || 0.3
      });
    });

    // Setup reveal observer
    this.setupRevealObserver();

    // Setup counter observer
    this.setupCounterObserver();

    // Listen for scroll
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    this.onScroll();
  }

  onScroll() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.updateParallax();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  updateParallax() {
    const scrollY = window.scrollY;

    this.elements.forEach(({ el, speed }) => {
      const rect = el.parentElement.getBoundingClientRect();
      const parentTop = rect.top + scrollY;
      const offset = (scrollY - parentTop) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }

  setupRevealObserver() {
    const options = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    }, options);

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
      observer.observe(el);
    });
  }

  setupCounterObserver() {
    const options = {
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounters(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    document.querySelectorAll('.story-stats').forEach(el => {
      observer.observe(el);
    });
  }

  animateCounters(container) {
    container.querySelectorAll('[data-count]').forEach(counter => {
      const target = parseInt(counter.dataset.count);
      const duration = 2000;
      const start = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        counter.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };

      requestAnimationFrame(updateCounter);
    });
  }
}
