/**
 * Building Progress Visualization
 * Shows fundraising progress as building construction stages
 */

const STAGES = [
  { id: 'foundation', label: '기초/토목', goalPercent: 20 },
  { id: 'frame', label: '골조', goalPercent: 45 },
  { id: 'walls', label: '벽면', goalPercent: 70 },
  { id: 'roof', label: '지붕', goalPercent: 90 },
  { id: 'interior', label: '인테리어', goalPercent: 100 }
];

export class BuildingProgress {
  constructor() {
    this.progressFill = document.getElementById('progress-fill');
    this.currentAmountEl = document.getElementById('progress-current');
    this.goalAmountEl = document.getElementById('progress-goal');
    this.stageElements = document.querySelectorAll('.building-progress__stage');
    
    this.goalAmount = 500000000; // 5억
    this.currentAmount = 175000000; // 시뮬레이션: 1.75억 (35%)
    
    this.init();
  }

  init() {
    this.update();
  }

  update() {
    const percentage = Math.min((this.currentAmount / this.goalAmount) * 100, 100);
    
    // Update progress bar
    if (this.progressFill) {
      this.progressFill.style.width = `${percentage}%`;
    }

    // Update amount display
    if (this.currentAmountEl) {
      this.animateAmount(this.currentAmountEl, this.currentAmount);
    }

    // Update stages
    this.stageElements.forEach(stageEl => {
      const stageId = stageEl.dataset.stage;
      const stage = STAGES.find(s => s.id === stageId);
      if (!stage) return;

      stageEl.classList.remove('active', 'completed');

      if (percentage >= stage.goalPercent) {
        stageEl.classList.add('completed');
      } else {
        // Find current stage
        const prevStage = STAGES[STAGES.indexOf(stage) - 1];
        const prevGoal = prevStage ? prevStage.goalPercent : 0;
        if (percentage >= prevGoal) {
          stageEl.classList.add('active');
        }
      }
    });
  }

  addDonation(amount) {
    this.currentAmount = Math.min(this.currentAmount + amount, this.goalAmount);
    this.update();
  }

  animateAmount(element, target) {
    const formatted = this.formatKoreanAmount(target);
    element.textContent = formatted;
  }

  formatKoreanAmount(amount) {
    if (amount >= 100000000) {
      const eok = Math.floor(amount / 100000000);
      const remainder = amount % 100000000;
      if (remainder > 0) {
        const man = Math.floor(remainder / 10000);
        return `${eok}억 ${man.toLocaleString()}만`;
      }
      return `${eok}억`;
    } else if (amount >= 10000) {
      const man = Math.floor(amount / 10000);
      return `${man.toLocaleString()}만`;
    }
    return amount.toLocaleString();
  }
}
