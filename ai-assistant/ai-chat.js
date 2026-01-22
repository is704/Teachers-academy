// مساعد ذكي متطور مع ردود واقعية
const AI_RESPONSES = {
    // الردود العامة
    greeting: [
        "مرحباً! أنا مساعدك الذكي في تطوير مهارات التدريس. أسألني عن أي شيء: مهارات التحدث، القراءة، الاستماع، أو الكتابة.",
        "أهلاً وسهلاً! أنا هنا لأرشدك في رحلتك لتصبح معلماً متميزاً. كيف يمكنني مساعدتك اليوم؟",
        "مرحباً بك في أكاديمية الأساتذة! أنا المساعد الذكي، جاهز للإجابة على استفساراتك التعليمية."
    ],
    
    // مهارة التحدث
    speaking: [
        "💬 **لتطوير مهارة التحدث:**\n1. تدرب على الشرح أمام المرآة 10 دقائق يومياً\n2. سجل صوتك وأنت تشرح درساً\n3. انضم لغرف المحادثة التفاعلية في قسم المجتمع\n4. استخدم تقنية 'التكرار' لتثبيت المصطلحات",
        "🎤 **نصائح للتحدث بطلاقة:**\n• خذ نفساً عميقاً قبل البدء\n• تحدث ببطء ووضوح\n• استخدم أمثلة واقعية\n• اطلب التغذية الراجعة من الزملاء",
        "📱 **تمرين عملي:**\nاشرح مفهوم 'الكسور' لمدة 3 دقائق كما لو أنك أمام طلاب. سجل نفسك وحلل الأداء."
    ],
    
    // مهارة القراءة
    reading: [
        "📚 **تطوير مهارة القراءة:**\n1. اقرأ بصوت عالٍ لتحسين النطق\n2. استخدم تقنية SQ3R (استطلع، اسأل، اقرأ، راجع، تذكر)\n3. خذ ملاحظات أثناء القراءة\n4. ناقش ما قرأته مع الآخرين",
        "🔍 **للفهم العميق:**\n• اقرأ الفقرة مرة بسرعة\n• حدد الأفكار الرئيسية\n• ابحث عن الكلمات الجديدة\n• لخص كل قسم بكلماتك",
        "📖 **تمرين:**\nاقرأ مقالاً تعليمياً، ثم اشرحه لشخص آخر كما لو كنت تدرسه."
    ],
    
    // مهارة الاستماع
    listening: [
        "👂 **تحسين الاستماع:**\n1. استمع لتسجيلات تعليمية مختلفة\n2. لخص ما سمعته بعد كل جلسة\n3. تدرب على التمييز بين الأصوات\n4. مارس الاستماع النشط (أسئلة، تعليقات)",
        "🎧 **نصائح:**\n• ركز على المتحدث\n• احتفظ بمفكرة للملاحظات\n• اسأل نفسك: ماذا فهمت؟\n• تدرب على الاستماع بدون تشتيت",
        "📼 **تمرين:**\nاستمع لمحاضرة على اليوتيوب، ثم اكتب 5 نقاط رئيسية فهمتها."
    ],
    
    // مهارة الكتابة
    writing: [
        "✍️ **تطوير الكتابة:**\n1. اكتب يومياً ولو فقرة واحدة\n2. استخدم قوالب جاهزة للخطط الدراسية\n3. راجع ما كتبته بعد يوم\n4. اطلب التصحيح من المساعد الذكي",
        "📝 **نصائح للأسلوب:**\n• ابدأ بالعنوان الجذاب\n• استخدم فقرات قصيرة\n• رتب الأفكار منطقياً\n• ختم بخلاصة أو سؤال",
        "📄 **تمرين:**\nاكتب خطة درس لموضوع 'دورة الماء في الطبيعة' لمدة 45 دقيقة."
    ],
    
    // تقنيات التدريس
    teaching: [
        "👨‍🏫 **تقنيات التدريس الفعال:**\n• التعلم التعاوني\n• التعليم القائم على المشاريع\n• استخدام الوسائل البصرية\n• التغذية الراجعة الفورية",
        "🏫 **إدارة الصف:**\n• وضع قواعد واضحة\n• تنويع الأنشطة\n• تشجيع المشاركة\n• تقييم مستمر",
        "🎯 **نصائح للمعلم الجديد:**\n1. كن متحمساً\n2. تعرف على طلابك\n3. كن مرناً\n4. تعلم من الأخطاء\n5. استمر في التطور"
    ],
    
    // الردود العامة
    default: [
        "هذا سؤال ممتاز! هل تريدني أن أعطيك أمثلة عملية أو تمريناً مباشراً؟",
        "أستطيع مساعدتك في هذا. هل يمكنك توضيح مستواك الحالي في هذه المهارة؟",
        "لدي عدة اقتراحات لهذا الموضوع. أي جانب تريد التركيز عليه؟"
    ]
};

// المساعد الذكي المحسن
class EnhancedAIAssistant {
    constructor() {
        this.conversationHistory = [];
    }
    
    getResponse(userInput) {
        const input = userInput.toLowerCase();
        
        // تصنيف السؤال
        let category = 'default';
        
        if (input.includes('تحدث') || input.includes('كلام') || input.includes('شرح') || input.includes('محادثة')) {
            category = 'speaking';
        } else if (input.includes('كتابة') || input.includes('يكتب') || input.includes('كتب') || input.includes('اكتب')) {
            category = 'writing';
        } else if (input.includes('قراءة') || input.includes('يقرأ') || input.includes('اقرأ') || input.includes('مقروء')) {
            category = 'reading';
        } else if (input.includes('استماع') || input.includes('يسمع') || input.includes('اسمع') || input.includes('سمع')) {
            category = 'listening';
        } else if (input.includes('تدريس') || input.includes('معلم') || input.includes('درس') || input.includes('تعليم')) {
            category = 'teaching';
        } else if (input.includes('مرحبا') || input.includes('اهلا') || input.includes('سلام') || input.includes('السلام')) {
            category = 'greeting';
        }
        
        // اختيار رد عشوائي من الفئة
        const responses = AI_RESPONSES[category] || AI_RESPONSES.default;
        const randomIndex = Math.floor(Math.random() * responses.length);
        const response = responses[randomIndex];
        
        // حفظ المحادثة
        this.conversationHistory.push({
            user: userInput,
            ai: response,
            time: new Date().toISOString()
        });
        
        // حفظ في localStorage
        this.saveConversation();
        
        return response;
    }
    
    saveConversation() {
        if (this.conversationHistory.length > 50) {
            this.conversationHistory = this.conversationHistory.slice(-50);
        }
        localStorage.setItem('ai_conversation', JSON.stringify(this.conversationHistory));
    }
    
    loadConversation() {
        const saved = localStorage.getItem('ai_conversation');
        if (saved) {
            this.conversationHistory = JSON.parse(saved);
        }
    }
}

// تهيئة المساعد
const aiAssistant = new EnhancedAIAssistant();
aiAssistant.loadConversation();

// تحديث دالة المحادثة
document.addEventListener('DOMContentLoaded', function() {
    const aiInput = document.getElementById('aiInput');
    const sendButton = document.getElementById('sendAiMessage');
    const aiMessages = document.getElementById('aiMessages');
    
    // إضافة رسائل سابقة
    aiAssistant.conversationHistory.forEach(msg => {
        addMessageToChat(msg.user, true);
        addMessageToChat(msg.ai, false);
    });
    
    // إضافة رسالة ترحيبية إذا لم توجد محادثة
    if (aiAssistant.conversationHistory.length === 0) {
        setTimeout(() => {
            addMessageToChat(AI_RESPONSES.greeting[0], false);
        }, 500);
    }
    
    function addMessageToChat(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        
        // معالجة النصوص متعددة الأسطر
        const formattedText = text.replace(/\n/g, '<br>');
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = formattedText;
        
        const time = document.createElement('div');
        time.className = 'message-time';
        const now = new Date();
        time.textContent = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
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
        addMessageToChat(message, true);
        aiInput.value = '';
        
        // إظهار مؤشر التفكير
        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'message ai-message thinking';
        thinkingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        aiMessages.appendChild(thinkingDiv);
        
        // محاكاة التفكير ثم الرد
        setTimeout(() => {
            aiMessages.removeChild(thinkingDiv);
            const response = aiAssistant.getResponse(message);
            addMessageToChat(response, false);
        }, 1000 + Math.random() * 1000);
    }
    
    // إرسال الرسائل
    sendButton.addEventListener('click', sendMessage);
    aiInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // إضافة أزرار سريعة للأسئلة الشائعة
    setupQuickQuestions();
});

// أزرار الأسئلة السريعة
function setupQuickQuestions() {
    const quickQuestions = [
        { text: "كيف أطور مهارة التحدث؟", emoji: "💬" },
        { text: "أعطني تمرين كتابة", emoji: "✍️" },
        { text: "نصائح للقراءة السريعة", emoji: "📚" },
        { text: "كيف أكون معلمًا ناجحًا؟", emoji: "👨‍🏫" }
    ];
    
    const container = document.querySelector('.ai-quick-actions');
    if (!container) return;
    
    container.innerHTML = '';
    
    quickQuestions.forEach(q => {
        const button = document.createElement('button');
        button.className = 'quick-btn';
        button.innerHTML = `${q.emoji} ${q.text}`;
        button.onclick = () => {
            document.getElementById('aiInput').value = q.text;
            document.getElementById('sendAiMessage').click();
        };
        container.appendChild(button);
    });
}

// أنماط إضافية للدردشة
const style = document.createElement('style');
style.textContent = `
    .typing-indicator {
        display: flex;
        gap: 4px;
        padding: 10px;
    }
    
    .typing-indicator span {
        width: 8px;
        height: 8px;
        background: #666;
        border-radius: 50%;
        animation: typing 1s infinite ease-in-out;
    }
    
    .typing-indicator span:nth-child(1) { animation-delay: 0s; }
    .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes typing {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }
    
    .quick-btn {
        margin: 5px;
        padding: 10px 15px;
        background: #e3f2fd;
        border: 1px solid #bbdefb;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .quick-btn:hover {
        background: #bbdefb;
        transform: translateY(-2px);
    }
`;
document.head.appendChild(style);
