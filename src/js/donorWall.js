/**
 * Donor Wall - Virtual Brick Wall
 * Renders donor bricks with animation effects
 */

const BRICK_COLORS = [
  '#C66B3D', '#B85C38', '#A84E30', '#D47A4A', '#9A4228',
  '#BE6A3A', '#C07045', '#A5522E', '#D08050', '#B06035'
];

// Demo donors
const DEMO_DONORS = [
  '김은혜', '이요셉', '박사랑', '정믿음', '최소망',
  '한복음', '윤감사', '조은총', '송축복', '임하나',
  '강선교', '오복되', '유찬양', '서예배', '전도윤',
  '황영광', '문온유', '심제곡', '나기쁨', '구평화',
  '권사랑', '민찬미', '장새벽', '고은빛', '백은혜',
  '류감사', '안소원', '차승리', '하영복', '홍예린',
  '주은별', '양하은', '피새롬', '마여은', '태지원',
  '도현주', '맹하경', '사도윤', '채은정', '추미래'
];

export class DonorWall {
  constructor() {
    this.wallEl = document.getElementById('brick-wall');
    this.countEl = document.getElementById('total-bricks');
    this.donors = [];

    this.init();
  }

  init() {
    // Load existing donors from localStorage
    const saved = localStorage.getItem('jegok-donors');
    if (saved) {
      try {
        this.donors = JSON.parse(saved);
      } catch (e) {
        this.donors = [];
      }
    }

    // Add demo donors if no saved donors
    if (this.donors.length === 0) {
      this.donors = DEMO_DONORS.map((name, i) => ({
        name,
        category: ['foundation', 'frame', 'walls', 'interior'][i % 4],
        timestamp: Date.now() - (DEMO_DONORS.length - i) * 60000,
        demo: true
      }));
    }

    this.render();
  }

  render() {
    if (!this.wallEl) return;

    this.wallEl.innerHTML = '';

    this.donors.forEach((donor, index) => {
      const brick = this.createBrickElement(donor, index);
      this.wallEl.appendChild(brick);
    });

    this.updateCount();
  }

  createBrickElement(donor, index) {
    const brick = document.createElement('div');
    brick.className = 'brick';
    brick.style.backgroundColor = BRICK_COLORS[index % BRICK_COLORS.length];
    brick.style.animationDelay = `${Math.min(index * 30, 2000)}ms`;
    brick.textContent = donor.name;
    brick.title = `${donor.name}님의 사랑의 벽돌`;
    return brick;
  }

  addBrick(name, category) {
    const donor = {
      name,
      category,
      timestamp: Date.now(),
      demo: false
    };

    this.donors.push(donor);

    // Save to localStorage
    localStorage.setItem('jegok-donors', JSON.stringify(this.donors));

    // Animate new brick
    if (this.wallEl) {
      const brick = this.createBrickElement(donor, this.donors.length - 1);
      brick.classList.add('brick--new');
      brick.style.animationDelay = '0ms';
      this.wallEl.appendChild(brick);
    }

    this.updateCount();
    return donor;
  }

  addMultipleBricks(name, category, count) {
    const donors = [];
    for (let i = 0; i < count; i++) {
      const donor = {
        name,
        category,
        timestamp: Date.now() + i,
        demo: false
      };
      this.donors.push(donor);
      donors.push(donor);

      if (this.wallEl) {
        const brick = this.createBrickElement(donor, this.donors.length - 1);
        brick.classList.add('brick--new');
        brick.style.animationDelay = `${i * 100}ms`;
        this.wallEl.appendChild(brick);
      }
    }

    localStorage.setItem('jegok-donors', JSON.stringify(this.donors));
    this.updateCount();
    return donors;
  }

  updateCount() {
    if (this.countEl) {
      const targetCount = this.donors.length;
      const current = parseInt(this.countEl.textContent) || 0;

      if (current === targetCount) return;

      // Animate count
      const duration = 500;
      const start = performance.now();

      const update = (time) => {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        this.countEl.textContent = Math.round(current + (targetCount - current) * eased);

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
    }
  }

  getDonorCount() {
    return this.donors.length;
  }
}
