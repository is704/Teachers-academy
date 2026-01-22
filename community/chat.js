// نظام الدردشة والمجتمع
class CommunityChat {
    constructor() {
        this.messages = JSON.parse(localStorage.getItem('community_messages')) || [];
        this.currentUser = localStorage.getItem('chat_username') || 'متعلم' + Math.floor(Math.random() * 1000);
        this.init();
    }
    
    init() {
        this.renderMessages();
        this.setupEventListeners();
        this.setupVoiceChat();
    }
    
    renderMessages() {
        const container = document.getElementById('chatMessages');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.messages.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `chat-message ${msg.user === this.currentUser ? 'my-message' : 'other-message'}`;
            
            msgDiv.innerHTML = `
                <div class="message-header">
                    <strong>${msg.user}</strong>
                    <span class="message-time">${this.formatTime(msg.time)}</span>
                </div>
                <div class="message-content">${msg.text}</div>
                ${msg.audio ? `<audio controls src="${msg.audio}" style="width: 100%; margin-top: 5px;"></audio>` : ''}
            `;
            
            container.appendChild(msgDiv);
        });
        
        container.scrollTop = container.scrollHeight;
    }
    
    sendMessage(text, audio = null) {
        const message = {
            user: this.currentUser,
            text: text,
            time: new Date().toISOString(),
            audio: audio
        };
        
        this.messages.push(message);
        if (this.messages.length > 100) {
            this.messages = this.messages.slice(-100);
        }
        
        localStorage.setItem('community_messages', JSON.stringify(this.messages));
        this.renderMessages();
        
        // محاكاة ردود الآخرين
        if (Math.random() > 0.5) {
            setTimeout(() => {
                this.addBotResponse(text);
            }, 2000 + Math.random() * 3000);
        }
    }
    
    addBotResponse(userMessage) {
        const responses = [
            "هذا سؤال ممتاز! أتفق معك تماماً.",
            "هل يمكنك شرح الفكرة أكثر؟",
            "لديك نقطة مهمة، أضيف أن...",
            "شكراً للمشاركة، هذا مفيد للجميع.",
            "أود أن أتعلم المزيد عن هذا الموضوع."
        ];
        
        const botUsers = ['أحمد', 'سارة', 'محمد', 'فاطمة', 'خالد'];
        const botUser = botUsers[Math.floor(Math.random() * botUsers.length)];
        
        const response = {
            user: botUser,
            text: responses[Math.floor(Math.random() * responses.length)],
            time: new Date().toISOString()
        };
        
        this.messages.push(response);
        this.renderMessages();
    }
    
    setupVoiceChat() {
        const voiceBtn = document.getElementById('voiceChatBtn');
        if (!voiceBtn) return;
        
        let mediaRecorder;
        let audioChunks = [];
        
        voiceBtn.addEventListener('click', async function() {
            if (this.classList.contains('recording')) {
                // إيقاف التسجيل
                mediaRecorder.stop();
                this.classList.remove('recording');
                this.innerHTML = '<i class="fas fa-microphone"></i> تحدث بصوت';
            } else {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    mediaRecorder = new MediaRecorder(stream);
                    
                    mediaRecorder.ondataavailable = event => {
                        audioChunks.push(event.data);
                    };
                    
                    mediaRecorder.onstop = () => {
                        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                        const audioUrl = URL.createObjectURL(audioBlob);
                        
                        // إرسال رسالة صوتية
                        this.sendMessage('🎤 رسالة صوتية', audioUrl);
                        audioChunks = [];
                    };
                    
                    mediaRecorder.start();
                    this.classList.add('recording');
                    this.innerHTML = '<i class="fas fa-stop"></i> أوقف التسجيل';
                    
                    // إيقاف تلقائي بعد 30 ثانية
                    setTimeout(() => {
                        if (this.classList.contains('recording')) {
                            mediaRecorder.stop();
                            this.classList.remove('recording');
                            this.innerHTML = '<i class="fas fa-microphone"></i> تحدث بصوت';
                        }
                    }, 30000);
                    
                } catch (err) {
                    alert('يجب السماح باستخدام الميكروفون');
                }
            }
        }.bind(this));
    }
    
    setupEventListeners() {
        const sendBtn = document.getElementById('sendChatMessage');
        const input = document.getElementById('chatInput');
        
        if (sendBtn && input) {
            sendBtn.addEventListener('click', () => {
                const text = input.value.trim();
                if (text) {
                    this.sendMessage(text);
                    input.value = '';
                }
            });
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendBtn.click();
                }
            });
        }
        
        // تغيير الاسم
        const nameBtn = document.getElementById('changeNameBtn');
        if (nameBtn) {
            nameBtn.addEventListener('click', () => {
                const newName = prompt('أدخل اسمك الجديد:', this.currentUser);
                if (newName && newName.trim()) {
                    this.currentUser = newName.trim();
                    localStorage.setItem('chat_username', this.currentUser);
                    alert(`تم تغيير الاسم إلى: ${this.currentUser}`);
                }
            });
        }
    }
    
    formatTime(isoTime) {
        const date = new Date(isoTime);
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
}

// بدء النظام عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    window.chatSystem = new CommunityChat();
});
