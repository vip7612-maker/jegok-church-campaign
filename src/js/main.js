/**
 * 제곡교회 새 성전 건축 모금 캠페인
 * Main Entry Point
 */

import { ParallaxEngine } from './parallax.js';
import { Navigation } from './navigation.js';
import { DonorWall } from './donorWall.js';
import { BuildingProgress } from './buildingProgress.js';
import { Fundraising } from './fundraising.js';

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize core systems
  const parallax = new ParallaxEngine();
  const navigation = new Navigation();
  const donorWall = new DonorWall();
  const buildingProgress = new BuildingProgress();
  const fundraising = new Fundraising(donorWall, buildingProgress);

  // Hero parallax effect on mouse move
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      heroBg.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    });
  }

  // Hero reveal animation
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    const reveals = heroContent.querySelectorAll('.reveal-up');
    reveals.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('revealed');
      }, 300 + i * 200);
    });
  }

  console.log('🧱 제곡교회 캠페인 사이트가 로드되었습니다.');
});
