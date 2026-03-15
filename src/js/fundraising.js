/**
 * Fundraising System
 * Category selection, unit calculation, and donation simulation
 */

const CATEGORIES = {
  foundation: {
    name: '기초/토목 공사',
    icon: '🏗️',
    tagline: '든든한 반석과 생명이 흐르는 터전',
    unitPrice: 50000
  },
  frame: {
    name: '골조 공사',
    icon: '🦴',
    tagline: '든든하게 지탱할 뼈대와 우산',
    unitPrice: 100000
  },
  walls: {
    name: '외장/벽면 공사',
    icon: '🧱',
    tagline: '따뜻하게 품어줄 벽돌 한 장',
    unitPrice: 10000
  },
  interior: {
    name: '내부/인테리어',
    icon: '✨',
    tagline: '희망의 공간을 채워주세요',
    unitPrice: 30000
  }
};

export class Fundraising {
  constructor(donorWall, buildingProgress) {
    this.donorWall = donorWall;
    this.buildingProgress = buildingProgress;

    this.selectedCategory = 'walls';
    this.unitCount = 1;

    // DOM Elements
    this.categoryCards = document.querySelectorAll('.donate-category');
    this.formCategoryIcon = document.getElementById('form-category-icon');
    this.formCategoryName = document.getElementById('form-category-name');
    this.donorNameInput = document.getElementById('donor-name');
    this.unitCountDisplay = document.getElementById('unit-count');
    this.totalAmountDisplay = document.getElementById('total-amount');
    this.submitBtn = document.getElementById('donate-submit');
    this.submitUnits = document.getElementById('submit-units');
    this.decreaseBtn = document.getElementById('unit-decrease');
    this.increaseBtn = document.getElementById('unit-increase');
    this.unitPresets = document.querySelectorAll('.unit-preset');

    // Modal elements
    this.modal = document.getElementById('donation-modal');
    this.modalText = document.getElementById('modal-text');
    this.modalDonorName = document.getElementById('modal-donor-name');
    this.modalClose = document.getElementById('modal-close');
    this.modalConfirm = document.getElementById('modal-confirm');

    // Material modal
    this.materialModal = document.getElementById('material-modal');
    this.materialBtn = document.getElementById('material-donate-btn');
    this.materialClose = document.getElementById('material-modal-close');
    this.materialForm = document.getElementById('material-form');

    this.init();
  }

  init() {
    // Category selection
    this.categoryCards.forEach(card => {
      card.addEventListener('click', () => {
        const category = card.dataset.category;
        this.selectCategory(category);
      });
    });

    // Unit controls
    this.decreaseBtn?.addEventListener('click', () => this.changeUnit(-1));
    this.increaseBtn?.addEventListener('click', () => this.changeUnit(1));

    this.unitPresets.forEach(preset => {
      preset.addEventListener('click', () => {
        this.unitCount = parseInt(preset.dataset.units);
        this.updateDisplay();
      });
    });

    // Submit
    this.submitBtn?.addEventListener('click', () => this.handleDonation());

    // Modal close
    this.modalClose?.addEventListener('click', () => this.closeModal());
    this.modalConfirm?.addEventListener('click', () => this.closeModal());
    this.modal?.querySelector('.modal__overlay')?.addEventListener('click', () => this.closeModal());

    // Material donation
    this.materialBtn?.addEventListener('click', () => this.openMaterialModal());
    this.materialClose?.addEventListener('click', () => this.closeMaterialModal());
    this.materialModal?.querySelector('.modal__overlay')?.addEventListener('click', () => this.closeMaterialModal());
    this.materialForm?.addEventListener('submit', (e) => this.handleMaterialSubmit(e));

    // Init display
    this.updateDisplay();
  }

  selectCategory(categoryId) {
    this.selectedCategory = categoryId;

    // Update UI
    this.categoryCards.forEach(card => {
      card.classList.toggle('selected', card.dataset.category === categoryId);
    });

    const cat = CATEGORIES[categoryId];
    if (this.formCategoryIcon) this.formCategoryIcon.textContent = cat.icon;
    if (this.formCategoryName) this.formCategoryName.textContent = cat.name;

    this.updateDisplay();

    // Scroll to form
    const formSection = document.getElementById('donate-form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  changeUnit(delta) {
    this.unitCount = Math.max(1, this.unitCount + delta);
    this.updateDisplay();
  }

  updateDisplay() {
    const cat = CATEGORIES[this.selectedCategory];
    const total = cat.unitPrice * this.unitCount;

    if (this.unitCountDisplay) this.unitCountDisplay.textContent = this.unitCount;
    if (this.totalAmountDisplay) this.totalAmountDisplay.textContent = `${total.toLocaleString()}원`;
    if (this.submitUnits) this.submitUnits.textContent = this.unitCount;

    // Update presets active state
    this.unitPresets.forEach(preset => {
      preset.classList.toggle('active', parseInt(preset.dataset.units) === this.unitCount);
    });
  }

  handleDonation() {
    const name = this.donorNameInput?.value.trim() || '익명';
    const cat = CATEGORIES[this.selectedCategory];
    const total = cat.unitPrice * this.unitCount;

    // Send donation details via email
    this.sendDonationEmail(name, cat, total);

    // Add bricks to wall
    this.donorWall.addMultipleBricks(name, this.selectedCategory, this.unitCount);

    // Add to building progress
    this.buildingProgress.addDonation(total);

    // Show success modal
    this.showSuccessModal(name, cat, total);

    // Reset form
    if (this.donorNameInput) this.donorNameInput.value = '';
    this.unitCount = 1;
    this.updateDisplay();
  }

  sendDonationEmail(name, category, amount) {
    const subject = encodeURIComponent(`[제곡교회 성전건축] 후원 신청 - ${name}`);
    const body = encodeURIComponent(
      `제곡교회 새 성전 건축 후원 신청\n` +
      `========================================\n\n` +
      `■ 후원자 이름: ${name}\n` +
      `■ 후원 분야: ${category.icon} ${category.name}\n` +
      `■ 구좌 수: ${this.unitCount}구좌\n` +
      `■ 1구좌 금액: ${category.unitPrice.toLocaleString()}원\n` +
      `■ 총 후원 금액: ${amount.toLocaleString()}원\n\n` +
      `========================================\n` +
      `입금 계좌: 농협은행 352-1234-5678-01 (제곡교회)\n` +
      `입금 시 '성전건축 + 이름' 기재 부탁드립니다.\n\n` +
      `감사합니다. 하나님께서 풍성히 채워주실 줄 믿습니다!\n`
    );
    window.open(`mailto:vip7612@gmail.com?subject=${subject}&body=${body}`, '_self');
  }

  showSuccessModal(name, category, amount) {
    if (this.modalText) {
      this.modalText.textContent = `${name}님, ${category.name}에 ${amount.toLocaleString()}원을 후원해주셔서 진심으로 감사합니다!`;
    }
    if (this.modalDonorName) {
      this.modalDonorName.textContent = name;
    }

    this.modal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.modal?.classList.remove('active');
    document.body.style.overflow = '';

    // Scroll to wall section
    setTimeout(() => {
      const wall = document.getElementById('wall');
      if (wall) {
        wall.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  }

  openMaterialModal() {
    this.materialModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeMaterialModal() {
    this.materialModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  handleMaterialSubmit(e) {
    e.preventDefault();

    const materialName = document.getElementById('material-name')?.value.trim() || '';
    const materialPhone = document.getElementById('material-phone')?.value.trim() || '';
    const materialItem = document.getElementById('material-item')?.value.trim() || '';

    const subject = encodeURIComponent(`[제곡교회 성전건축] 현물 후원 문의 - ${materialName}`);
    const body = encodeURIComponent(
      `제곡교회 새 성전 건축 현물(자재) 후원 문의\n` +
      `========================================\n\n` +
      `■ 이름: ${materialName}\n` +
      `■ 연락처: ${materialPhone}\n` +
      `■ 후원 물품/자재: ${materialItem}\n\n` +
      `========================================\n` +
      `확인 후 연락 부탁드립니다. 감사합니다!\n`
    );
    window.open(`mailto:vip7612@gmail.com?subject=${subject}&body=${body}`, '_self');

    alert('현물 후원 문의가 접수되었습니다.\n교회에서 곧 연락드리겠습니다. 감사합니다!');
    this.materialForm?.reset();
    this.closeMaterialModal();
  }
}
