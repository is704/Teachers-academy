// نظام التصحيح الآلي للنصوص العربية
class AIFeedbackSystem {
    constructor() {
        this.commonErrors = {
            spelling: {
                'انشاء': 'إنشاء',
                'هاذا': 'هذا',
                'الذى': 'الذي',
                'اثناء': 'أثناء',
                'يئتي': 'يأتي',
                'لان': 'لأن',
                'شئ': 'شيء',
                'فى': 'في',
                'الى': 'إلى',
                'او': 'أو',
                'ام': 'أم',
                'بئ': 'بأي',
                'ليئ': 'لأي',
                'ولئ': 'ولأي'
            },
            grammar: {
                'هو قام': 'قام',
                'هي ذهبت': 'ذهبت',
                'نحن سنذهب': 'سنذهب',
                'أنتم ستدرسون': 'ستدرسون'
            },
            punctuation: {
                '،': '،',
                '؛': '؛',
                '؟': '؟',
                '!': '!'
            }
        };
        
        this.writingTips = [
            "استخدم جمل قصيرة وواضحة",
            "تأكد من تناسق الأزمنة في النص",
            "استخدم أدوات الربط المناسبة بين الجمل",
            "تجنب التكرار غير الضروري",
            "راجع النص بصوت عالٍ لاكتشاف الأخطاء",
            "استخدم عناوين فرعية لتنظيم النص",
            "اضف أمثلة لتوضيح الأفكار",
            "اختتم النص بخلاصة أو توصية",
            "استخدم لغة مناسبة للجمهور المستهدف",
            "راجع قواعد الكتابة الأكاديمية"
        ];
    }
    
    // تحليل النص
    analyzeText(text) {
        const analysis = {
            stats: this.calculateStats(text),
            errors: this.findErrors(text),
            suggestions: this.getSuggestions(text),
            score: 0
        };
        
        // حساب النقاط (100 - الأخطاء × 2)
        const errorPenalty = analysis.errors.length * 2;
        analysis.score = Math.max(0, 100 - errorPenalty);
        
        return analysis;
    }
    
    // حساب إحصائيات النص
    calculateStats(text) {
        const words = text.split(/\s+/).filter(word => word.length > 0);
        const sentences = text.split(/[.!؟]/).filter(s => s.trim());
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
        
        const avgSentenceLength = sentences.length > 0 ? words.length / sentences.length : 0;
        const avgParagraphLength = paragraphs.length > 0 ? sentences.length / paragraphs.length : 0;
        
        // حساب الكلمات المتكررة
        const wordFreq = {};
        words.forEach(word => {
            const cleanWord = word.replace(/[.,!؟;:]/g, '').toLowerCase();
            if (cleanWord.length > 2) {
                wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
            }
        });
        
        // الكلمات الأكثر تكراراً
        const frequentWords = Object.entries(wordFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([word, count]) => ({ word, count }));
        
        return {
            words: words.length,
            sentences: sentences.length,
            paragraphs: paragraphs.length,
            avgSentenceLength: Math.round(avgSentenceLength),
            avgParagraphLength: Math.round(avgParagraphLength),
            frequentWords,
            readingTime: Math.ceil(words.length / 200) // دقائق (بمعدل 200 كلمة/دقيقة)
        };
    }
    
    // البحث عن الأخطاء
    findErrors(text) {
        const errors = [];
        
        // 1. أخطاء الإملاء
        Object.entries(this.commonErrors.spelling).forEach(([wrong, correct]) => {
            const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
            const matches = text.match(regex);
            if (matches) {
                errors.push({
                    type: 'خطأ إملائي',
                    message: `الكلمة "${wrong}" غير صحيحة`,
                    suggestion: `استبدلها بـ "${correct}"`,
                    count: matches.length,
                    example: `${wrong} → ${correct}`
                });
            }
        });
        
        // 2. أخطاء النحو الأساسية
        Object.entries(this.commonErrors.grammar).forEach(([wrong, correct]) => {
            if (text.includes(wrong)) {
                errors.push({
                    type: 'خطأ نحوي',
                    message: `تراكيب نحوية غير صحيحة`,
                    suggestion: `استخدم "${correct}" بدلاً من "${wrong}"`,
                    example: `${wrong} → ${correct}`
                });
            }
        });
        
        // 3. علامات الترقيم
        const punctuationRegex = /[.,;:!؟]/g;
        const punctuationCount = (text.match(punctuationRegex) || []).length;
        const wordCount = text.split(/\s+/).filter(w => w).length;
        const punctuationRatio = wordCount > 0 ? punctuationCount / wordCount : 0;
        
        if (punctuationRatio < 0.05) {
            errors.push({
                type: 'علامات الترقيم',
                message: 'النص يحتاج إلى المزيد من علامات الترقيم',
                suggestion: 'أضف فصولاً وعلامات ترقيم لتحسين القراءة'
            });
        }
        
        // 4. طول الجمل
        const sentences = text.split(/[.!؟]/).filter(s => s.trim());
        sentences.forEach((sentence, index) => {
            const wordsInSentence = sentence.split(/\s+/).filter(w => w).length;
            if (wordsInSentence > 25) {
                errors.push({
                    type: 'جملة طويلة',
                    message: `الجملة ${index + 1} طويلة جداً (${wordsInSentence} كلمة)`,
                    suggestion: 'قسّم الجملة إلى جملتين أو أكثر',
                    example: sentence.substring(0, 50) + '...'
                });
            }
        });
        
        // 5. التكرار
        const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const wordCounts = {};
        words.forEach(word => {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
        });
        
        Object.entries(wordCounts).forEach(([word, count]) => {
            if (count > 5 && words.length > 100) {
                errors.push({
                    type: 'تكرار',
                    message: `الكلمة "${word}" مكررة كثيراً (${count} مرة)`,
                    suggestion: 'استخدم مرادفات أو أعِد الصياغة'
                });
            }
        });
        
        return errors;
    }
    
    // اقتراحات للتحسين
    getSuggestions(text) {
        const suggestions = [];
        const stats = this.calculateStats(text);
        
        // اقتراحات بناءً على الإحصائيات
        if (stats.avgSentenceLength > 20) {
            suggestions.push({
                type: 'هيكل',
                message: 'الجمل طويلة، حاول تقسيمها لجمل أقصر'
            });
        }
        
        if (stats.avgParagraphLength > 5) {
            suggestions.push({
                type: 'تنظيم',
                message: 'الفقرات طويلة، قسمها إلى فقرات أصغر'
            });
        }
        
        if (stats.words < 100) {
            suggestions.push({
                type: 'تطوير',
                message: 'النص قصير، أضف مزيداً من التفاصيل والأمثلة'
            });
        }
        
        // اقتراحات عامة
        if (!text.includes(':')) {
            suggestions.push({
                type: 'توضيح',
                message: 'استخدم النقطتان (:) لتوضيح الأفكار'
            });
        }
        
        if (!text.includes('-')) {
            suggestions.push({
                type: 'تنظيم',
                message: 'استخدم الشرطة (-) لعرض القوائم'
            });
        }
        
        return suggestions;
    }
    
    // نصائح كتابية مخصصة
    getWritingTips(stats) {
        const tips = [];
        
        if (stats.words < 50) {
            tips.push('حاول كتابة نص أطول (100 كلمة على الأقل)');
        }
        
        if (stats.avgSentenceLength > 25) {
            tips.push('اختصر الجمل الطويلة إلى جمل متوسطة الطول (15-20 كلمة)');
        }
        
        if (stats.frequentWords.length > 0 && stats.frequentWords[0].count > 10) {
            tips.push(`حاول تقليل تكرار كلمة "${stats.frequentWords[0].word}" واستخدام مرادفات`);
        }
        
        // إضافة نصائح عشوائية
        const randomTips = [...this.writingTips]
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
        
        return [...tips, ...randomTips];
    }
    
    // تصحيح النص تلقائياً
    autoCorrect(text) {
        let correctedText = text;
        
        // تصحيح الأخطاء الإملائية
        Object.entries(this.commonErrors.spelling).forEach(([wrong, correct]) => {
            const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
            correctedText = correctedText.replace(regex, correct);
        });
        
        // تحسين علامات الترقيم
        correctedText = correctedText
            .replace(/\s*,\s*/g, '، ')
            .replace(/\s*\.\s*/g, '. ')
            .replace(/\s*\?\s*/g, '؟ ')
            .replace(/\s*!\s*/g, '! ');
        
        return correctedText;
    }
    
    // تقييم مستوى الكتابة
    evaluateLevel(text) {
        const stats = this.calculateStats(text);
        const errors = this.findErrors(text);
        
        let score = 100;
        score -= errors.length * 5;
        score -= Math.max(0, stats.avgSentenceLength - 20) * 2;
        
        if (stats.words < 50) score -= 20;
        if (stats.words > 1000) score += 10;
        
        if (score >= 85) return { level: 'متقدم', score };
        if (score >= 70) return { level: 'متوسط', score };
        if (score >= 50) return { level: 'مبتدئ', score };
        return { level: 'يحتاج تحسين', score };
    }
    
    // توليد تعليقات بناءة
    generateFeedback(analysis) {
        const feedback = [];
        
        feedback.push(`📊 **إحصائيات النص:**`);
        feedback.push(`• عدد الكلمات: ${analysis.stats.words}`);
        feedback.push(`• عدد الجمل: ${analysis.stats.sentences}`);
        feedback.push(`• وقت القراءة: ${analysis.stats.readingTime} دقيقة`);
        
        if (analysis.errors.length > 0) {
            feedback.push(`\n🔍 **الأخطاء التي تحتاج تصحيح:**`);
            analysis.errors.slice(0, 5).forEach(error => {
                feedback.push(`• ${error.type}: ${error.message}`);
                if (error.suggestion) {
                    feedback.push(`  → ${error.suggestion}`);
                }
            });
        } else {
            feedback.push(`\n✅ **ممتاز!** لا توجد أخطاء كبيرة.`);
        }
        
        if (analysis.suggestions.length > 0) {
            feedback.push(`\n💡 **اقتراحات للتحسين:**`);
            analysis.suggestions.forEach(suggestion => {
                feedback.push(`• ${suggestion.message}`);
            });
        }
        
        feedback.push(`\n🎯 **التقييم العام:** ${analysis.score}/100`);
        
        return feedback.join('\n');
    }
}

// تهيئة النظام
const aiFeedback = new AIFeedbackSystem();
window.aiFeedback = aiFeedback;

// وظائف مساعدة للاستخدام المباشر
window.analyzeMyText = function(text) {
    return aiFeedback.analyzeText(text);
};

window.correctMyText = function(text) {
    return aiFeedback.autoCorrect(text);
};

window.getWritingLevel = function(text) {
    return aiFeedback.evaluateLevel(text);
};

// تصدير للنظام العام
if (typeof module !== 'undefined' && module.exports) {
    module.exports = aiFeedback;
}
