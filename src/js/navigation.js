/**
 * Navigation Controller
 * Handles scroll-based nav transitions, smooth scrolling, and mobile menu
 */

export class Navigation {
  constructor() {
    this.nav = document.getElementById('main-nav');
    this.toggle = document.getElementById('nav-toggle');
    this.menu = document.getElementById('nav-menu');
    this.links = document.querySelectorAll('.nav__link');
    this.scrollIndicator = document.querySelector('.hero__scroll-indicator');
    this.isOpen = false;

    this.init();
  }

  init() {
    // Scroll listener
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    this.onScroll();

    // Mobile toggle
    this.toggle.addEventListener('click', () => this.toggleMenu());

    // Smooth scroll links
    this.links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          this.scrollTo(href);
          this.closeMenu();
        }
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
        this.closeMenu();
      }
    });
  }

  onScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      this.nav.classList.add('scrolled');
    } else {
      this.nav.classList.remove('scrolled');
    }

    // Hide scroll indicator after scrolling
    if (this.scrollIndicator) {
      if (scrollY > 100) {
        this.scrollIndicator.style.opacity = '0';
        this.scrollIndicator.style.pointerEvents = 'none';
      } else {
        this.scrollIndicator.style.opacity = '1';
        this.scrollIndicator.style.pointerEvents = '';
      }
    }

    // Show/hide building progress
    const progressBar = document.getElementById('building-progress');
    if (progressBar) {
      if (scrollY > window.innerHeight * 0.8) {
        progressBar.classList.add('visible');
      } else {
        progressBar.classList.remove('visible');
      }
    }
  }

  scrollTo(selector) {
    const target = document.querySelector(selector);
    if (target) {
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
      const top = target.offsetTop - navHeight - 10;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.menu.classList.toggle('open', this.isOpen);
    this.toggle.classList.toggle('active', this.isOpen);
    document.body.style.overflow = this.isOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.isOpen = false;
    this.menu.classList.remove('open');
    this.toggle.classList.remove('active');
    document.body.style.overflow = '';
  }
}
