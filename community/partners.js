// نظام إيجاد وتوصيل الشركاء للتدريب
class LearningPartnersSystem {
    constructor() {
        this.partners = JSON.parse(localStorage.getItem('learning_partners')) || this.generateSamplePartners();
        this.currentUser = JSON.parse(localStorage.getItem('partner_profile')) || this.createDefaultProfile();
        this.matches = JSON.parse(localStorage.getItem('partner_matches')) || [];
        this.init();
    }
    
    generateSamplePartners() {
        return [
            {
                id: 1,
                name: 'أحمد محمد',
                level: 'متوسط',
                skills: ['التحدث', 'القراءة'],
                interests: ['اللغة العربية', 'الرياضيات'],
                goals: ['تحسين النطق', 'التحدث بطلاقة'],
                availability: ['مساءً', 'عطلة نهاية الأسبوع'],
                preferredMethod: 'مكالمات صوتية',
                bio: 'معلم لغة عربية، أبحث عن شريك لممارسة التحدث بشكل منتظم.',
                rating: 4.5,
                matches: 12
            },
            {
                id: 2,
                name: 'سارة عبدالله',
                level: 'مبتدئ',
                skills: ['الكتابة', 'الاستماع'],
                interests: ['العلوم', 'التربية الخاصة'],
                goals: ['تحسين الكتابة الأكاديمية'],
                availability: ['صباحاً', 'بعد الظهر'],
                preferredMethod: 'محادثات كتابية',
                bio: 'طالبة دراسات عليا في التربية، أحتاج مساعدة في كتابة الأبحاث.',
                rating: 4.2,
                matches: 8
            },
            {
                id: 3,
                name: 'محمد الخالد',
                level: 'متقدم',
                skills: ['جميع المهارات'],
                interests: ['التقنية في التعليم', 'اللغات'],
                goals: ['مساعدة الآخرين', 'تطوير مهارات التدريب'],
                availability: ['مرن'],
                preferredMethod: 'أي طريقة',
                bio: 'مدرب معتمد، مستعد لمساعدة المعلمين الجدد في تطوير مهاراتهم.',
                rating: 4.8,
                matches: 25
            },
            {
                id: 4,
                name: 'فاطمة ناصر',
                level: 'متوسط',
                skills: ['القراءة', 'الكتابة'],
                interests: ['الأدب', 'التاريخ'],
                goals: ['سرعة القراءة', 'تحليل النصوص'],
                availability: ['مساءً'],
                preferredMethod: 'مناقشة نصوص',
                bio: 'أستاذة أدب عربي، أبحث عن شركاء لقراءة ومناقشة النصوص الأدبية.',
                rating: 4.3,
                matches: 15
            }
        ];
    }
    
    createDefaultProfile() {
        return {
            id: Date.now(),
            name: 'متعلم جديد',
            level: 'مبتدئ',
            skills: [],
            interests: [],
            goals: [],
            availability: [],
            preferredMethod: 'أي طريقة',
            bio: '',
            completed: false
        };
    }
    
    init() {
        this.setupEventListeners();
        this.renderPartners();
        this.updateMatchStats();
    }
    
    setupEventListeners() {
        // تحديث الملف الشخصي
        const updateBtn = document.getElementById('updateProfileBtn');
        if (updateBtn) {
            updateBtn.addEventListener('click', () => this.showProfileEditor());
        }
        
        // البحث عن شركاء
        const searchBtn = document.getElementById('searchPartnersBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.searchPartners());
        }
        
        // إضافة شريك
        const addPartnerBtn = document.getElementById('addPartnerBtn');
        if (addPartnerBtn) {
            addPartnerBtn.addEventListener('click', () => this.addNewPartner());
        }
    }
    
    renderPartners() {
        const container = document.getElementById('partnersContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.partners.forEach(partner => {
            const partnerCard = this.createPartnerCard(partner);
            container.appendChild(partnerCard);
        });
    }
    
    createPartnerCard(partner) {
        const card = document.createElement('div');
        card.className = 'partner-card';
        card.innerHTML = `
            <div class="partner-header">
                <div class="partner-avatar">
                    ${partner.name.charAt(0)}
                </div>
                <div class="partner-info">
                    <h3>${partner.name}</h3>
                    <div class="partner-level">
                        <span class="level-badge ${partner.level}">${partner.level}</span>
                        <span class="partner-rating">
                            <i class="fas fa-star"></i> ${partner.rating}
                            <small>(${partner.matches} جلسة)</small>
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="partner-skills">
                <strong>المهارات:</strong>
                ${partner.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
            
            <div class="partner-interests">
                <strong>الاهتمامات:</strong>
                ${partner.interests.map(interest => `<span class="interest-tag">${interest}</span>`).join('')}
            </div>
            
            <div class="partner-bio">
                <p>${partner.bio}</p>
            </div>
            
            <div class="partner-availability">
                <strong><i class="fas fa-clock"></i> متاح:</strong>
                ${partner.availability.join('، ')}
            </div>
            
            <div class="partner-actions">
                <button class="btn primary connect-btn" data-id="${partner.id}">
                    <i class="fas fa-handshake"></i> التواصل
                </button>
                <button class="btn secondary view-btn" data-id="${partner.id}">
                    <i class="fas fa-eye"></i> عرض الملف
                </button>
            </div>
        `;
        
        // إضافة أحداث الأزرار
        card.querySelector('.connect-btn').addEventListener('click', (e) => {
            this.connectWithPartner(e.target.dataset.id);
        });
        
        card.querySelector('.view-btn').addEventListener('click', (e) => {
            this.viewPartnerDetails(e.target.dataset.id);
        });
        
        return card;
    }
    
    connectWithPartner(partnerId) {
        const partner = this.partners.find(p => p.id == partnerId);
        if (!partner) return;
        
        // إنشاء طلب اتصال
        const connectionRequest = {
            id: Date.now(),
            partnerId: partnerId,
            partnerName: partner.name,
            date: new Date().toISOString(),
            status: 'pending',
            type: 'connect'
        };
        
        this.matches.push(connectionRequest);
        this.saveMatches();
        
        // عرض رسالة تأكيد
        this.showNotification(`تم إرسال طلب اتصال إلى ${partner.name}`, 'success');
        
        // تحديث الإحصائيات
        this.updateMatchStats();
        
        // اقتراح خطوات التالية
        setTimeout(() => {
            this.suggestNextSteps(partner);
        }, 1000);
    }
    
    viewPartnerDetails(partnerId) {
        const partner = this.partners.find(p => p.id == partnerId);
        if (!partner) return;
        
        const modal = this.createPartnerModal(partner);
        document.body.appendChild(modal);
        
        // إضافة حدث الإغلاق
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
    
    createPartnerModal(partner) {
        const modal = document.createElement('div');
        modal.className = 'partner-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${partner.name} - ملف الشريك</h2>
                    <button class="close-modal">&times;</button>
                </div>
                
                <div class="modal-body">
                    <div class="modal-section">
                        <h3><i class="fas fa-graduation-cap"></i> المستوى والخبرة</h3>
                        <p>المستوى: <strong>${partner.level}</strong></p>
                        <p>عدد الجلسات السابقة: <strong>${partner.matches}</strong></p>
                        <p>التقييم: <strong>${partner.rating}/5</strong></p>
                    </div>
                    
                    <div class="modal-section">
                        <h3><i class="fas fa-bullseye"></i> الأهداف</h3>
                        <ul>
                            ${partner.goals.map(goal => `<li>${goal}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h3><i class="fas fa-calendar-alt"></i> الجدول الزمني</h3>
                        <p>أوقات التوفر: ${partner.availability.join('، ')}</p>
                        <p>طريقة التواصل المفضلة: ${partner.preferredMethod}</p>
                    </div>
                    
                    <div class="modal-section">
                        <h3><i class="fas fa-history"></i> سجل النشاط</h3>
                        <p>آخر نشاط: منذ 2 يوم</p>
                        <p>معدل الاستجابة: 92%</p>
                        <p>متوسط مدة الجلسة: 45 دقيقة</p>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn primary" onclick="window.partnerSystem.connectWithPartner(${partner.id})">
                            <i class="fas fa-handshake"></i> إرسال طلب اتصال
                        </button>
                        <button class="btn secondary" onclick="window.partnerSystem.scheduleSession(${partner.id})">
                            <i class="fas fa-calendar-plus"></i> جدولة جلسة
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return modal;
    }
    
    searchPartners() {
        const skillFilter = document.getElementById('skillFilter')?.value;
        const levelFilter = document.getElementById('levelFilter')?.value;
        const interestFilter = document.getElementById('interestFilter')?.value;
        
        let filtered = [...this.partners];
        
        if (skillFilter) {
            filtered = filtered.filter(partner => 
                partner.skills.some(skill => 
                    skill.toLowerCase().includes(skillFilter.toLowerCase())
                )
            );
        }
        
        if (levelFilter && levelFilter !== 'all') {
            filtered = filtered.filter(partner => partner.level === levelFilter);
        }
        
        if (interestFilter) {
            filtered = filtered.filter(partner => 
                partner.interests.some(interest => 
                    interest.toLowerCase().includes(interestFilter.toLowerCase())
                )
            );
        }
        
        this.displaySearchResults(filtered);
    }
    
    displaySearchResults(partners) {
        const container = document.getElementById('searchResults');
        if (!container) return;
        
        if (partners.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>لا توجد نتائج</h3>
                    <p>حاول تغيير معايير البحث أو أضف شريكاً جديداً</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        partners.forEach(partner => {
            const card = this.createPartnerCard(partner);
            container.appendChild(card);
        });
    }
    
    suggestNextSteps(partner) {
        const suggestions = [
            `ارسل رسالة ترحيب لـ ${partner.name} عبر نظام الرسائل`,
            `اقترح وقتاً للجلسة الأولى خلال الأسبوع القادم`,
            `جهز موضوعاً للمناقشة في الجلسة الأولى`,
            `حدد هدفاً واضحاً للجلسة القادمة`
        ];
        
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        
        this.showNotification(`💡 اقتراح: ${randomSuggestion}`, 'info', 5000);
    }
    
    scheduleSession(partnerId) {
        const partner = this.partners.find(p => p.id == partnerId);
        if (!partner) return;
        
        // إنشاء نموذج جدولة
        const modal = document.createElement('div');
        modal.className = 'schedule-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>جدولة جلسة مع ${partner.name}</h2>
                    <button class="close-modal">&times;</button>
                </div>
                
                <div class="modal-body">
                    <form id="scheduleForm">
                        <div class="form-group">
                            <label>موضوع الجلسة:</label>
                            <input type="text" placeholder="مثال: مناقشة مهارة التحدث" required>
                        </div>
                        
                        <div class="form-group">
                            <label>التاريخ والوقت:</label>
                            <input type="datetime-local" required>
                        </div>
                        
                        <div class="form-group">
                            <label>المدة (دقيقة):</label>
                            <select>
                                <option>30</option>
                                <option>45</option>
                                <option>60</option>
                                <option>90</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>طريقة التواصل:</label>
                            <select>
                                <option>مكالمة صوتية</option>
                                <option>مكالمة فيديو</option>
                                <option>محادثة كتابية</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>ملاحظات إضافية:</label>
                            <textarea placeholder="أي تفاصيل إضافية..."></textarea>
                        </div>
                        
                        <button type="submit" class="btn primary">
                            <i class="fas fa-calendar-check"></i> تأكيد الجدولة
                        </button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // إغلاق النموذج
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // إرسال النموذج
        modal.querySelector('#scheduleForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.confirmSchedule(partnerId);
            document.body.removeChild(modal);
        });
    }
    
    confirmSchedule(partnerId) {
        const partner = this.partners.find(p => p.id == partnerId);
        
        const scheduledSession = {
            id: Date.now(),
            partnerId: partnerId,
            partnerName: partner.name,
            date: new Date().toISOString(),
            type: 'scheduled',
            status: 'confirmed'
        };
        
        this.matches.push(scheduledSession);
        this.saveMatches();
        
        this.showNotification(`✅ تم جدولة جلسة مع ${partner.name}`, 'success');
        this.updateMatchStats();
    }
    
    showProfileEditor() {
        const modal = document.createElement('div');
        modal.className = 'profile-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>تعديل الملف الشخصي</h2>
                    <button class="close-modal">&times;</button>
                </div>
                
                <div class="modal-body">
                    <form id="profileForm">
                        <div class="form-group">
                            <label>اسمك:</label>
                            <input type="text" value="${this.currentUser.name}" required>
                        </div>
                        
                        <div class="form-group">
                            <label>المستوى:</label>
                            <select id="profileLevel">
                                <option value="مبتدئ" ${this.currentUser.level === 'مبتدئ' ? 'selected' : ''}>مبتدئ</option>
                                <option value="متوسط" ${this.currentUser.level === 'متوسط' ? 'selected' : ''}>متوسط</option>
                                <option value="متقدم" ${this.currentUser.level === 'متقدم' ? 'selected' : ''}>متقدم</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>المهارات التي تريد تطويرها:</label>
                            <div class="skills-checkboxes">
                                <label><input type="checkbox" value="التحدث" ${this.currentUser.skills.includes('التحدث') ? 'checked' : ''}> التحدث</label>
                                <label><input type="checkbox" value="القراءة" ${this.currentUser.skills.includes('القراءة') ? 'checked' : ''}> القراءة</label>
                                <label><input type="checkbox" value="الاستماع" ${this.currentUser.skills.includes('الاستماع') ? 'checked' : ''}> الاستماع</label>
                                <label><input type="checkbox" value="الكتابة" ${this.currentUser.skills.includes('الكتابة') ? 'checked' : ''}> الكتابة</label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>الاهتمامات:</label>
                            <input type="text" value="${this.currentUser.interests.join(', ')}" placeholder="مثال: اللغة العربية، الرياضيات، العلوم">
                        </div>
                        
                        <div class="form-group">
                            <label>الأهداف:</label>
                            <textarea placeholder="ماذا تريد تحقيقه من الشراكة؟">${this.currentUser.goals.join('\n')}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>الوصف الشخصي:</label>
                            <textarea placeholder="اكتب نبذة عن نفسك...">${this.currentUser.bio}</textarea>
                        </div>
                        
                        <button type="submit" class="btn primary">
                            <i class="fas fa-save"></i> حفظ التغييرات
                        </button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('#profileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile();
            document.body.removeChild(modal);
        });
    }
    
    updateProfile() {
        const form = document.getElementById('profileForm');
        
        this.currentUser = {
            ...this.currentUser,
            name: form.querySelector('input[type="text"]').value,
            level: form.querySelector('#profileLevel').value,
            skills: Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value),
            interests: form.querySelectorAll('input[type="text"]')[1].value.split(',').map(i => i.trim()).filter(i => i),
            goals: form.querySelectorAll('textarea')[0].value.split('\n').filter(g => g.trim()),
            bio: form.querySelectorAll('textarea')[1].value,
            completed: true
        };
        
        localStorage.setItem('partner_profile', JSON.stringify(this.currentUser));
        this.showNotification('✅ تم تحديث الملف الشخصي بنجاح', 'success');
    }
    
    addNewPartner() {
        const name = prompt('اسم الشريك الجديد:');
        if (!name) return;
        
        const newPartner = {
            id: Date.now(),
            name: name,
            level: 'متوسط',
            skills: ['التحدث', 'القراءة'],
            interests: ['اللغة العربية'],
            goals: ['تطوير المهارات التعليمية'],
            availability: ['مساءً'],
            preferredMethod: 'مكالمات صوتية',
            bio: 'شريك جديد يبحث عن تدريب',
            rating: 4.0,
            matches: 0
        };
        
        this.partners.push(newPartner);
        localStorage.setItem('learning_partners', JSON.stringify(this.partners));
        
        this.renderPartners();
        this.showNotification(`✅ تم إضافة ${name} كشريك جديد`, 'success');
    }
    
    updateMatchStats() {
        const totalMatches = this.matches.length;
        const pendingMatches = this.matches.filter(m => m.status === 'pending').length;
        const completedMatches = this.matches.filter(m => m.status === 'completed').length;
        
        // تحديث واجهة المستخدم
        const statsElement = document.getElementById('matchStats');
        if (statsElement) {
            statsElement.innerHTML = `
                <div class="stat-item">
                    <h3>${totalMatches}</h3>
                    <p>إجمالي الجلسات</p>
                </div>
                <div class="stat-item">
                    <h3>${pendingMatches}</h3>
                    <p>قيد الانتظار</p>
                </div>
                <div class="stat-item">
                    <h3>${completedMatches}</h3>
                    <p>مكتملة</p>
                </div>
            `;
        }
    }
    
    saveMatches() {
        localStorage.setItem('partner_matches', JSON.stringify(this.matches));
    }
    
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
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
        }, duration);
    }
}

// أنماط CSS الإضافية
const partnerStyles = `
    .partner-card {
        background: white;
        border-radius: 15px;
        padding: 25px;
        margin-bottom: 20px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        transition: transform 0.3s;
    }
    
    .partner-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    
    .partner-header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 20px;
    }
    
    .partner-avatar {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
    }
    
    .partner-info h3 {
        margin: 0;
        color: #333;
    }
    
    .partner-level {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 5px;
    }
    
    .level-badge {
        padding: 3px 10px;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: bold;
    }
    
    .level-badge.مبتدئ { background: #d4edda; color: #155724; }
    .level-badge.متوسط { background: #fff3cd; color: #856404; }
    .level-badge.متقدم { background: #e7f5ff; color: #0c63e4; }
    
    .partner-rating {
        color: #f59e0b;
        font-size: 0.9rem;
    }
    
    .partner-skills,
    .partner-interests {
        margin: 15px 0;
    }
    
    .skill-tag,
    .interest-tag {
        display: inline-block;
        background: #e9ecef;
        padding: 5px 10px;
        border-radius: 20px;
        margin: 3px;
        font-size: 0.9rem;
    }
    
    .skill-tag {
        background: #e3f2fd;
        color: #0c63e4;
    }
    
    .interest-tag {
        background: #f3e5f5;
        color: #7b1fa2;
    }
    
    .partner-bio {
        margin: 15px 0;
        color: #666;
        line-height: 1.6;
    }
    
    .partner-availability {
        margin: 15px 0;
        color: #495057;
    }
    
    .partner-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }
    
    /* النماذج */
    .partner-modal,
    .profile-modal,
    .schedule-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    }
    
    .modal-content {
        background: white;
        border-radius: 15px;
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #e9ecef;
    }
    
    .modal-header h2 {
        margin: 0;
        color: #333;
    }
    
    .close-modal {
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: #666;
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .modal-section {
        margin-bottom: 25px;
        padding-bottom: 25px;
        border-bottom: 1px solid #e9ecef;
    }
    
    .modal-section h3 {
        color: #4f46e5;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #495057;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        font-size: 1rem;
    }
    
    .form-group textarea {
        min-height: 100px;
        resize: vertical;
    }
    
    .skills-checkboxes {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 10px;
    }
    
    .skills-checkboxes label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: normal;
    }
    
    /* الإشعارات */
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
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
    
    .notification.success {
        border-left: 4px solid #10b981;
    }
    
    .notification.info {
        border-left: 4px solid #3b82f6;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification.success .notification-content i {
        color: #10b981;
    }
    
    .notification.info .notification-content i {
        color: #3b82f6;
    }
    
    /* الإحصائيات */
    #matchStats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin: 30px 0;
    }
    
    .stat-item {
        background: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    }
    
    .stat-item h3 {
        font-size: 2rem;
        color: #4f46e5;
        margin: 0;
    }
    
    .stat-item p {
        color: #666;
        margin: 5px 0 0;
    }
`;

// إضافة الأنماط
const styleSheet = document.createElement('style');
styleSheet.textContent = partnerStyles;
document.head.appendChild(styleSheet);

// تهيئة النظام
window.partnerSystem = new LearningPartnersSystem();
