// متتبع التقدم التعليمي
class ProgressTracker {
    constructor() {
        this.progress = JSON.parse(localStorage.getItem('teachingProgress')) || {
            speaking: { level: 1, exercises: 0, hours: 0 },
            reading: { level: 1, exercises: 0, hours: 0 },
            listening: { level: 1, exercises: 0, hours: 0 },
            writing: { level: 1, exercises: 0, hours: 0 }
        };
    }

    // تحديث التقدم
    updateProgress(skill, exerciseCount = 1, hours = 0.5) {
        this.progress[skill].exercises += exerciseCount;
        this.progress[skill].hours += hours;
        
        // ترقية المستوى
        if (this.progress[skill].exercises >= 10) {
            this.progress[skill].level = 2;
        }
        if (this.progress[skill].exercises >= 25) {
            this.progress[skill].level = 3;
        }
        if (this.progress[skill].exercises >= 50) {
            this.progress[skill].level = 4;
        }
        
        this.saveProgress();
        this.updateUI();
    }

    // حفظ التقدم
    saveProgress() {
        localStorage.setItem('teachingProgress', JSON.stringify(this.progress));
    }

    // تحديث واجهة المستخدم
    updateUI() {
        // تحديث المخطط البياني
        if (window.progressChart) {
            const data = this.getProgressData();
            window.progressChart.data.datasets[0].data = data.percentages;
            window.progressChart.update();
        }
    }

    // الحصول على بيانات التقدم
    getProgressData() {
        const skills = ['speaking', 'reading', 'listening', 'writing'];
        const percentages = skills.map(skill => {
            const maxExercises = 50;
            return Math.min(100, (this.progress[skill].exercises / maxExercises) * 100);
        });

        return {
            labels: ['التحدث', 'القراءة', 'الاستماع', 'الكتابة'],
            percentages,
            levels: skills.map(skill => this.progress[skill].level)
        };
    }
}

// تهيئة متتبع التقدم
const progressTracker = new ProgressTracker();

// مخطط التقدم
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('progressChart')) {
        const ctx = document.getElementById('progressChart').getContext('2d');
        const progressData = progressTracker.getProgressData();
        
        window.progressChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: progressData.labels,
                datasets: [{
                    label: 'مستوى التقدم',
                    data: progressData.percentages,
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
                    borderColor: 'rgba(79, 70, 229, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(79, 70, 229, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(79, 70, 229, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // إضافة حدث للتدريب على المهارات
    document.querySelectorAll('.skill-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const skillCard = this.closest('.skill-card');
            const skillName = skillCard.querySelector('h3').textContent;
            
            let skillKey = '';
            if (skillName.includes('تحدث')) skillKey = 'speaking';
            else if (skillName.includes('قراءة')) skillKey = 'reading';
            else if (skillName.includes('استماع')) skillKey = 'listening';
            else if (skillName.includes('كتابة')) skillKey = 'writing';
            
            if (skillKey) {
                progressTracker.updateProgress(skillKey);
                alert(`تم تحديث تقدمك في ${skillName}! استمر في العمل الجيد.`);
            }
        });
    });

    // عرض التقرير الكامل
    window.viewDetailedProgress = function() {
        const data = progressTracker.getProgressData();
        let report = 'تقرير تقدمك التعليمي:\n\n';
        
        data.labels.forEach((label, index) => {
            report += `${label}: ${data.percentages[index].toFixed(1)}%\n`;
            report += `المستوى: ${data.levels[index]}\n`;
            report += `---\n`;
        });
        
        alert(report);
    };

    // تحميل بيانات التقدم عند البدء
    progressTracker.updateUI();
});

// دعم وضع الهاتف المحمول
function initMobileSupport() {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = 'white';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            }
        });
    }
}

// تهيئة التطبيق
window.addEventListener('load', function() {
    initMobileSupport();
    
    // تحريك السلس للروابط
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
