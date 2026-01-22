// نظام التقدم والمكافآت
class ProgressSystem {
    constructor() {
        this.progress = JSON.parse(localStorage.getItem('teacher_progress')) || {
            speaking: { exercises: 0, level: 1 },
            reading: { exercises: 0, level: 1 },
            listening: { exercises: 0, level: 1 },
            writing: { exercises: 0, level: 1 },
            achievements: [],
            points: 0
        };
    }
    
    completeExercise(skill) {
        this.progress[skill].exercises++;
        
        // ترقية المستوى
        const levels = [0, 5, 15, 30, 50];
        for (let i = levels.length - 1; i >= 0; i--) {
            if (this.progress[skill].exercises >= levels[i]) {
                this.progress[skill].level = i + 1;
                break;
            }
        }
        
        // نقاط المكافأة
        this.progress.points += 10;
        
        // الإنجازات
        this.checkAchievements(skill);
        
        this.save();
        this.updateUI();
        this.showNotification(`🎉 أكملت تمرين ${this.getSkillName(skill)}! +10 نقاط`);
    }
    
    checkAchievements(skill) {
        const achievements = [
            { id: 'first_exercise', condition: () => this.getTotalExercises() === 1, title: 'البداية 🚀' },
            { id: 'speaking_master', condition: () => this.progress.speaking.exercises >= 10, title: 'خطيب ممتاز 🎤' },
            { id: 'daily_streak', condition: () => this.getStreak() >= 3, title: 'ملتزم ⭐' },
            { id: 'level_up', condition: () => Object.values(this.progress).some(s => s.level >= 3), title: 'متقدم 📈' }
        ];
        
        achievements.forEach(achievement => {
            if (!this.progress.achievements.includes(achievement.id) && achievement.condition()) {
                this.progress.achievements.push(achievement.id);
                this.showAchievement(achievement.title);
            }
        });
    }
    
    getTotalExercises() {
        return Object.values(this.progress)
            .filter(s => typeof s === 'object' && s.exercises)
            .reduce((sum, s) => sum + s.exercises, 0);
    }
    
    getStreak() {
        // محاكاة نظام التسلسل اليومي
        return Math.floor(Math.random() * 5) + 1;
    }
    
    getSkillName(skill) {
        const names = {
            speaking: 'التحدث',
            reading: 'القراءة',
            listening: 'الاستماع',
            writing: 'الكتابة'
        };
        return names[skill] || skill;
    }
    
    save() {
        localStorage.setItem('teacher_progress', JSON.stringify(this.progress));
    }
    
    updateUI() {
        // تحديث شريط التقدم
        document.querySelectorAll('.skill-progress').forEach(bar => {
            const skill = bar.dataset.skill;
            if (this.progress[skill]) {
                const percentage = Math.min(100, (this.progress[skill].exercises / 50) * 100);
                bar.style.width = `${percentage}%`;
                bar.parentElement.querySelector('.progress-text').textContent = `${percentage.toFixed(0)}%`;
            }
        });
        
        // تحديث النقاط
        const pointsElement = document.getElementById('userPoints');
        if (pointsElement) {
            pointsElement.textContent = this.progress.points;
        }
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    showAchievement(title) {
        const achievement = document.createElement('div');
        achievement.className = 'achievement-notification';
        achievement.innerHTML = `
            <div class="achievement-content">
                <i class="fas fa-trophy"></i>
                <div>
                    <h4>إنجاز جديد! 🎯</h4>
                    <p>${title}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(achievement);
        
        setTimeout(() => {
            achievement.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            achievement.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(achievement);
            }, 500);
        }, 5000);
    }
}

// أنماط إضافية
const progressStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
        z-index: 9999;
        max-width: 300px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .achievement-notification {
        position: fixed;
        top: 20px;
        left: 20px;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 5px 25px rgba(0,0,0,0.3);
        transform: translateX(-100%);
        transition: transform 0.3s ease-out;
        z-index: 9999;
        max-width: 300px;
    }
    
    .achievement-notification.show {
        transform: translateX(0);
    }
    
    .achievement-content {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .achievement-content i {
        font-size: 2rem;
    }
    
    .skill-progress-bar {
        height: 10px;
        background: #e5e7eb;
        border-radius: 5px;
        overflow: hidden;
        margin: 10px 0;
    }
    
    .skill-progress {
        height: 100%;
        background: linear-gradient(90deg, #4f46e5, #10b981);
        transition: width 0.5s ease;
    }
    
    .progress-text {
        font-size: 0.9rem;
        color: #666;
    }
`;

// إضافة الأنماط
const styleSheet = document.createElement('style');
styleSheet.textContent = progressStyles;
document.head.appendChild(styleSheet);

// تهيئة النظام
document.addEventListener('DOMContentLoaded', () => {
    window.progressSystem = new ProgressSystem();
    window.progressSystem.updateUI();
    
    // ربط أزرار المهارات
    document.querySelectorAll('.skill-btn').forEach(button => {
        button.addEventListener('click', function() {
            const skill = this.closest('.skill-card').querySelector('h3').textContent;
            let skillKey = '';
            
            if (skill.includes('تحدث')) skillKey = 'speaking';
            else if (skill.includes('قراءة')) skillKey = 'reading';
            else if (skill.includes('استماع')) skillKey = 'listening';
            else if (skill.includes('كتابة')) skillKey = 'writing';
            
            if (skillKey) {
                window.progressSystem.completeExercise(skillKey);
            }
        });
    });
});
