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

// ==================== تحديثات جديدة ====================

// نظام الإشعارات المحسن
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.init();
    }
    
    init() {
        // إضافة أنماط الإشعارات
        this.addNotificationStyles();
    }
    
    addNotificationStyles() {
        const styles = `
            .notification-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px 25px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                transform: translateX(120%);
                transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                z-index: 99999;
                max-width: 350px;
                border-left: 5px solid #4f46e5;
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .notification-toast.show {
                transform: translateX(0);
            }
            
            .notification-toast.success {
                border-left-color: #10b981;
                background: linear-gradient(135deg, #d4edda, #c3e6cb);
            }
            
            .notification-toast.warning {
                border-left-color: #f59e0b;
                background: linear-gradient(135deg, #fff3cd, #ffeaa7);
            }
            
            .notification-toast.error {
                border-left-color: #ef4444;
                background: linear-gradient(135deg, #f8d7da, #f5c6cb);
            }
            
            .notification-toast.info {
                border-left-color: #3b82f6;
                background: linear-gradient(135deg, #d1ecf1, #bee5eb);
            }
            
            .notification-icon {
                font-size: 1.5rem;
            }
            
            .notification-content {
                flex: 1;
            }
            
            .notification-title {
                font-weight: bold;
                margin-bottom: 5px;
                color: #333;
            }
            
            .notification-message {
                color: #555;
                font-size: 0.95rem;
                line-height: 1.4;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background 0.3s;
            }
            
            .notification-close:hover {
                background: rgba(0,0,0,0.1);
            }
            
            .notification-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: currentColor;
                opacity: 0.3;
                width: 100%;
                transform-origin: left;
                animation: progressBar 5s linear forwards;
            }
            
            @keyframes progressBar {
                from { transform: scaleX(1); }
                to { transform: scaleX(0); }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    show(title, message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification-toast ${type}`;
        
        const icons = {
            success: '✅',
            warning: '⚠️',
            error: '❌',
            info: 'ℹ️'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">${icons[type] || 'ℹ️'}</div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">&times;</button>
            <div class="notification-progress"></div>
        `;
        
        document.body.appendChild(notification);
        
        // إظهار الإشعار
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // إغلاق الزر
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.hide(notification);
        });
        
        // إغلاق تلقائي
        if (duration > 0) {
            setTimeout(() => {
                this.hide(notification);
            }, duration);
        }
        
        this.notifications.push(notification);
        return notification;
    }
    
    hide(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }
}

// نظام المصادقة البسيط
class AuthSystem {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('teacher_user')) || null;
        this.init();
    }
    
    init() {
        this.updateAuthUI();
    }
    
    updateAuthUI() {
        const loginBtn = document.getElementById('loginBtn');
        const userMenu = document.getElementById('userMenu');
        
        if (this.currentUser) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (userMenu) {
                userMenu.style.display = 'flex';
                userMenu.querySelector('.user-name').textContent = this.currentUser.name;
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';
        }
    }
    
    login(email, password) {
        // محاكاة المصادقة
        const user = {
            id: Date.now(),
            name: 'مستخدم تجريبي',
            email: email,
            avatar: '👨‍🏫',
            level: 'متوسط',
            joinDate: new Date().toISOString()
        };
        
        this.currentUser = user;
        localStorage.setItem('teacher_user', JSON.stringify(user));
        
        this.updateAuthUI();
        window.notificationSystem.show('تم تسجيل الدخول', `مرحباً ${user.name}!`, 'success');
        
        return user;
    }
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('teacher_user');
        
        this.updateAuthUI();
        window.notificationSystem.show('تم تسجيل الخروج', 'نراك قريباً!', 'info');
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
}

// نظام الإحصائيات في الوقت الحقيقي
class LiveStats {
    constructor() {
        this.stats = {
            activeUsers: Math.floor(Math.random() * 50) + 20,
            exercisesCompleted: Math.floor(Math.random() * 1000) + 500,
            hoursSpent: Math.floor(Math.random() * 5000) + 2000,
            partnerships: Math.floor(Math.random() * 200) + 100
        };
        
        this.init();
    }
    
    init() {
        this.updateStatsDisplay();
        this.startLiveUpdates();
    }
    
    updateStatsDisplay() {
        // تحديث الإحصائيات في الصفحة
        document.querySelectorAll('.live-stat').forEach(element => {
            const statType = element.dataset.stat;
            if (this.stats[statType] !== undefined) {
                const currentValue = parseInt(element.textContent) || 0;
                const targetValue = this.stats[statType];
                
                this.animateCounter(element, currentValue, targetValue);
            }
        });
    }
    
    animateCounter(element, start, end) {
        const duration = 2000;
        const steps = 60;
        const stepValue = (end - start) / steps;
        let current = start;
        
        const timer = setInterval(() => {
            current += stepValue;
            if ((stepValue > 0 && current >= end) || (stepValue < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            
            element.textContent = Math.floor(current).toLocaleString('ar-EG');
        }, duration / steps);
    }
    
    startLiveUpdates() {
        // تحديث الإحصائيات كل 30 ثانية
        setInterval(() => {
            this.stats.activeUsers += Math.floor(Math.random() * 3) - 1;
            this.stats.exercisesCompleted += Math.floor(Math.random() * 10);
            this.stats.hoursSpent += Math.floor(Math.random() * 5);
            this.stats.partnerships += Math.floor(Math.random() * 2);
            
            // التأكد من أن الأرقام موجبة
            Object.keys(this.stats).forEach(key => {
                if (this.stats[key] < 0) this.stats[key] = 0;
            });
            
            this.updateStatsDisplay();
        }, 30000);
    }
}

// تهيئة جميع الأنظمة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة أنظمة جديدة
    window.notificationSystem = new NotificationSystem();
    window.authSystem = new AuthSystem();
    window.liveStats = new LiveStats();
    
    // إضافة أحداث للأزرار الجديدة
    setupNewButtons();
    
    // تحديث التقدم أول مرة
    if (window.progressSystem) {
        window.progressSystem.updateUI();
    }
    
    // إضافة تأثيرات تفاعلية
    addInteractiveEffects();
});

// إعداد الأزرار الجديدة
function setupNewButtons() {
    // زر تسجيل الدخول
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const email = prompt('أدخل بريدك الإلكتروني:');
            if (email) {
                window.authSystem.login(email, 'password123');
            }
        });
    }
    
    // زر تسجيل الخروج
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            window.authSystem.logout();
        });
    }
    
    // زر المشاركة
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            if (navigator.share) {
                navigator.share({
                    title: 'أكاديمية الأساتذة',
                    text: 'موقع رائع لتطوير مهارات التدريس!',
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(window.location.href);
                window.notificationSystem.show('تم النسخ', 'تم نسخ الرابط إلى الحافظة', 'success');
            }
        });
    }
    
    // زر الوضع الليلي
    const darkModeBtn = document.getElementById('darkModeBtn');
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('dark_mode', isDark);
            
            window.notificationSystem.show(
                'الوضع الليلي',
                isDark ? 'تم تفعيل الوضع الليلي' : 'تم تعطيل الوضع الليلي',
                'info'
            );
        });
        
        // استعادة الوضع الليلي
        if (localStorage.getItem('dark_mode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    }
}

// إضافة تأثيرات تفاعلية
function addInteractiveEffects() {
    // تأثيرات للبطاقات
    const cards = document.querySelectorAll('.skill-card, .community-card, .exercise-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // تأثيرات للأزرار
    const buttons = document.querySelectorAll('.btn, .skill-btn, .reading-btn, .audio-btn, .writing-btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('mouseup', () => {
            btn.style.transform = 'scale(1)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
        });
    });
    
    // تأثيرات للصور
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
            img.style.transition = 'opacity 0.5s';
        });
        
        img.style.opacity = '0';
    });
}

// وظائف مساعدة
window.helpers = {
    // تنسيق التاريخ العربي
    formatDate: function(date) {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(date).toLocaleDateString('ar-EG', options);
    },
    
    // تنسيق الوقت
    formatTime: function(minutes) {
        if (minutes < 60) {
            return `${minutes} دقيقة`;
        } else {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${hours} ساعة ${mins > 0 ? `${mins} دقيقة` : ''}`;
        }
    },
    
    // نسخ النص
    copyToClipboard: function(text) {
        navigator.clipboard.writeText(text).then(() => {
            window.notificationSystem.show('تم النسخ', 'تم نسخ النص إلى الحافظة', 'success');
        });
    },
    
    // تنزيل الملف
    downloadFile: function(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

// أنماط الوضع الليلي
const darkModeStyles = `
    body.dark-mode {
        background: #1a1a1a;
        color: #f0f0f0;
    }
    
    body.dark-mode .navbar {
        background: #2d2d2d;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    
    body.dark-mode .skill-card,
    body.dark-mode .community-card,
    body.dark-mode .exercise-card,
    body.dark-mode .ai-chat-box,
    body.dark-mode .progress-container,
    body.dark-mode .writing-editor,
    body.dark-mode .reading-material,
    body.dark-mode .audio-player,
    body.dark-mode .partner-card {
        background: #2d2d2d;
        color: #f0f0f0;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    body.dark-mode .notification-toast {
        background: #2d2d2d;
        color: #f0f0f0;
    }
    
    body.dark-mode input,
    body.dark-mode textarea,
    body.dark-mode select {
        background: #3d3d3d;
        color: #f0f0f0;
        border-color: #555;
    }
`;

// إضافة أنماط الوضع الليلي
const darkModeSheet = document.createElement('style');
darkModeSheet.textContent = darkModeStyles;
document.head.appendChild(darkModeSheet);

// ==================== نهاية التحديثات ====================
