// مساعد الذكاء الاصطناعي للتعليم
class AITeachingAssistant {
    constructor() {
        this.responses = {
            greetings: [
                "مرحباً! أنا مساعدك الذكي لتعلم مهارات التدريس. كيف يمكنني مساعدتك اليوم؟",
                "أهلاً وسهلاً! أنا هنا لأرشدك في رحلة تطوير مهاراتك التدريسية.",
                "مرحباً بك في أكاديمية الأساتذة! أنا المعلم الذكي جاهز للإجابة على استفساراتك."
            ],
            speaking: [
                "لتطوير مهارة التحدث: ابدأ بالتحدث مع نفسك أمام المرآة، ثم انضم لغرف المحادثة التفاعلية.",
                "نصيحتي للتحدث: تدرب على شرح مفهوم واحد يومياً لمدة 5 دقائق.",
                "جرب تسجيل صوتك وأنت تشرح درساً، ثم استمع للتسجيل وحلل أداءك."
            ],
            writing: [
                "لتحسين الكتابة: اكتب يومياً فقرة عن موضوع تعليمي، ثم اطلب من المساعد تصحيحها.",
                "استخدم قوالب الخطط الدراسية الجاهزة، ثم عدل عليها تدريجياً.",
                "نصيحة: اقرأ ما تكتبه بصوت عالٍ لتكتشف الأخطاء بنفسك."
            ],
            reading: [
                "لتطوير القراءة: ابدأ بنصوص قصيرة، ثم زد الطول تدريجياً.",
                "استخدم تقنية القراءة السريعة: اقرأ أول وآخر جملة في كل فقرة.",
                "مارس القراءة الناقدة: اطرح أسئلة أثناء القراءة وحاول الإجابة عليها."
            ],
            listening: [
                "لتحسين الاستماع: استمع لتسجيلات تعليمية ثم لخص ما سمعته.",
                "جرب: استمع لمقطع صوتي مرة واحدة فقط ثم حاول إعادة صياغته.",
                "نصيحة: ركز على الكلمات المفتاحية أثناء الاستماع."
            ],
            default: [
                "هذا سؤال رائع! دعني أفكر في أفضل طريقة لمساعدتك...",
                "أعتقد أن السؤال يحتاج لبعض التفصيل. هل يمكنك توضيح أكثر؟",
                "لدي عدة اقتراحات لهذا الموضوع. أيهما تفضل أن نبدأ به؟"
            ]
        };
    }

    // تحليل السؤال وتحديد الفئة
    analyzeQuestion(question) {
        const lowerQuestion = question.toLowerCase();
        
        if (lowerQuestion.includes('تحدث') || lowerQuestion.includes('كلام') || lowerQuestion.includes('محادثة')) {
            return 'speaking';
        } else if (lowerQuestion.includes('كتابة') || lowerQuestion.includes('يكتب') || lowerQuestion.includes('كتب')) {
            return 'writing';
        } else if (lowerQuestion.includes('قراءة') || lowerQuestion.includes('يقرأ') || lowerQuestion.includes('اقرأ')) {
            return 'reading';
        } else if (lowerQuestion.includes('استماع') || lowerQuestion.includes('يسمع') || lowerQuestion.includes('اسمع')) {
            return 'listening';
        } else if (lowerQuestion.includes('مرحبا') || lowerQuestion.includes('اهلا') || lowerQuestion.includes('سلام')) {
            return 'greetings';
        } else {
            return 'default';
        }
    }

    // توليد رد
    generateResponse(question) {
        const category = this.analyzeQuestion(question);
        const responses = this.responses[category];
        const randomIndex = Math.floor(Math.random() * responses.length);
        
        // محاكاة تفكير الذكاء الاصطناعي
        setTimeout(() => {
            return responses[randomIndex];
        }, 1000 + Math.random() * 2000);
        
        return responses[randomIndex];
    }

    // تصحيح النص
    async correctText(text) {
        // محاكاة تصحيح النص
        const corrections = {
            common: {
                'انشاء': 'إنشاء',
                'هاذا': 'هذا',
                'الذى': 'الذي',
                'اثناء': 'أثناء',
                'يئتي': 'يأتي'
            }
        };

        let correctedText = text;
        let suggestions = [];

        // البحث عن الأخطاء الشائعة
        for (const [wrong, correct] of Object.entries(corrections.common)) {
            if (text.includes(wrong)) {
                correctedText = correctedText.replace(new RegExp(wrong, 'g'), correct);
                suggestions.push(`صححت "${wrong}" إلى "${correct}"`);
            }
        }

        // تحليل الأسلوب
        const words = text.split(' ').length;
        const sentences = text.split(/[.!؟]/).filter(s => s.trim()).length;
        
        if (words / sentences > 25) {
            suggestions.push("الجمل طويلة جداً. حاول تقسيمها إلى جمل أقصر.");
        }

        if (words < 50) {
            suggestions.push("النص قصير. حاول إضافة تفاصيل أكثر.");
        }

        return {
            correctedText,
            suggestions,
            stats: {
                words,
                sentences,
                readability: words / sentences
            }
        };
    }
}

// تهيئة المساعد الذكي
const aiAssistant = new AITeachingAssistant();

// الدردشة مع الذكاء الاصطناعي
document.addEventListener('DOMContentLoaded', function() {
    const aiInput = document.getElementById('aiInput');
    const sendButton = document.getElementById('sendAiMessage');
    const aiMessages = document.getElementById('aiMessages');

    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = text;
        
        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = new Date().toLocaleTimeString('ar-EG', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.appendChild(content);
        messageDiv.appendChild(time);
        aiMessages.appendChild(messageDiv);
        
        // التمرير لأسفل
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    function sendMessage() {
        const message = aiInput.value.trim();
        if (!message) return;

        // إضافة رسالة المستخدم
        addMessage(message, true);
        
        // مسح حقل الإدخال
        aiInput.value = '';
        
        // محاكاة التفكير
        const thinking = document.createElement('div');
        thinking.className = 'message ai-message';
        thinking.innerHTML = '<div class="message-content"><i class="fas fa-spinner fa-spin"></i> يفكر...</div>';
        aiMessages.appendChild(thinking);
        
        // إضافة رد الذكاء الاصطناعي بعد تأخير
        setTimeout(() => {
            aiMessages.removeChild(thinking);
            const response = aiAssistant.generateResponse(message);
            addMessage(response, false);
        }, 1500);
    }

    // إرسال بالزر
    sendButton.addEventListener('click', sendMessage);
    
    // إرسال بـ Enter
    aiInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

// وظيفة السؤال السريع
window.askAI = function(question) {
    const aiInput = document.getElementById('aiInput');
    aiInput.value = question;
    document.getElementById('sendAiMessage').click();
};

// فتح المنتدى
window.openForum = function() {
    alert('سيتم فتح منتدى النقاش قريباً. هذه ميزة قيد التطوير.');
};

// الانضمام لغرفة محادثة
window.joinChatRoom = function() {
    const rooms = ['غرفة المبتدئين', 'غرفة المتوسطين', 'غرفة المتقدمين'];
    const selected = prompt(`اختر غرفة:\n${rooms.join('\n')}`);
    if (selected) {
        alert(`أنت الآن في ${selected}. استعد للمحادثة!`);
    }
};

// إيجاد شريك
window.findPartner = function() {
    const partners = [
        { name: 'أحمد', level: 'متوسط', interests: ['اللغة العربية', 'الرياضيات'] },
        { name: 'سارة', level: 'مبتدئ', interests: ['العلوم', 'اللغات'] },
        { name: 'محمد', level: 'متقدم', interests: ['التاريخ', 'التربية'] }
    ];
    
    const partner = partners[Math.floor(Math.random() * partners.length)];
    alert(`وجدنا لك شريكاً:\nالاسم: ${partner.name}\nالمستوى: ${partner.level}\nالاهتمامات: ${partner.interests.join(', ')}`);
};
