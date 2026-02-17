import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MessageCircle, Send, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollArea } from '../components/ui/scroll-area';

export default function ChatbotPage() {
  const { chatHistory, addChatMessage, clearChatHistory } = useStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    addChatMessage({
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    });

    // Simulate AI typing
    setIsTyping(true);

    // Mock AI response (in real app, this would call an API)
    setTimeout(() => {
      const response = generateResponse(userMessage);
      addChatMessage({
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      });
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)] p-4 lg:p-8 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl gradient-secondary flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Chatbot Islami</h1>
              <p className="text-sm text-muted-foreground">
                Asisten spiritual Anda
              </p>
            </div>
          </div>
          {chatHistory.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearChatHistory}
              className="rounded-xl"
            >
              Hapus Riwayat
            </Button>
          )}
        </div>
      </motion.div>

      {/* Chat Container */}
      <div className="flex-1 bg-card rounded-3xl shadow-soft-md flex flex-col overflow-hidden">
        {/* Disclaimer */}
        {chatHistory.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="m-6 p-4 rounded-2xl bg-warning/10 border-2 border-warning/30 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-warning-foreground flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-warning-foreground mb-1">Perhatian</p>
              <p className="text-muted-foreground">
                Chatbot ini bersifat empatik dan non-judgmental, tetapi tidak memberikan fatwa resmi. 
                Untuk masalah fiqih yang kompleks, silakan berkonsultasi dengan ulama yang kompeten.
              </p>
            </div>
          </motion.div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="space-y-4">
            {chatHistory.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 mx-auto rounded-3xl gradient-spiritual flex items-center justify-center mb-4">
                  <span className="text-4xl">🤲</span>
                </div>
                <h3 className="font-semibold mb-2">Assalamu'alaikum!</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Saya di sini untuk membantu Anda dengan pertanyaan seputar ibadah, motivasi spiritual, 
                  dan dukungan emosional. Silakan mulai percakapan.
                </p>
                
                {/* Suggested Questions */}
                <div className="mt-8 grid gap-2 max-w-md mx-auto">
                  {[
                    "Bagaimana cara meningkatkan khusyuk dalam sholat?",
                    "Apa yang harus dilakukan jika terlewat sahur?",
                    "Bagaimana mengatasi rasa malas beribadah?",
                  ].map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => {
                        setInput(question);
                        setTimeout(() => handleSend(), 100);
                      }}
                      className="rounded-2xl text-left justify-start h-auto py-3"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="popLayout">
              {chatHistory.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] lg:max-w-[70%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-accent/30 text-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs mt-2 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-accent/30 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">Mengetik...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex items-end gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tulis pertanyaan Anda..."
              className="rounded-2xl resize-none"
              disabled={isTyping}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              size="icon"
              className="rounded-xl h-10 w-10 flex-shrink-0"
            >
              {isTyping ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock AI response generator
function generateResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('sholat') || lowerMessage.includes('salat')) {
    return `Alhamdulillah, pertanyaan yang bagus tentang sholat. 🙏\n\nSholat adalah tiang agama dan waktu khusus untuk berkomunikasi dengan Allah SWT. Beberapa tips untuk meningkatkan kualitas sholat:\n\n1. Pastikan wudhu dengan sempurna\n2. Tenangkan hati sebelum memulai\n3. Pahami makna bacaan\n4. Fokus pada setiap gerakan\n5. Hindari hal yang mengganggu konsentrasi\n\nSemoga sholat Anda semakin khusyuk. 💚`;
  }

  if (lowerMessage.includes('puasa') || lowerMessage.includes('sahur')) {
    return `Ma syaa Allah, semangat untuk berpuasa! 🌙\n\nPuasa adalah bentuk pengendalian diri dan ibadah yang mulia. Jika terlewat sahur:\n\n1. Tetap niatkan puasa dari hati\n2. Puasa tetap sah meski tanpa sahur\n3. Jaga dari hal yang membatalkan puasa\n4. Perbanyak dzikir dan doa\n\nAllah mengetahui niat dan usaha Anda. Tetap semangat! 💪`;
  }

  if (lowerMessage.includes('malas') || lowerMessage.includes('motivasi') || lowerMessage.includes('semangat')) {
    return `Saya memahami perasaan Anda. Kita semua mengalami masa-masa seperti ini. 💙\n\nYang penting adalah Anda tetap berusaha:\n\n1. Mulai dari yang kecil dan konsisten\n2. Ingat tujuan beribadah kepada Allah\n3. Cari teman yang saling mengingatkan\n4. Berdoa memohon kekuatan dari Allah\n5. Jangan terlalu keras pada diri sendiri\n\nAllah melihat usaha Anda, bukan hanya hasilnya. Keep going! 🌟`;
  }

  if (lowerMessage.includes('tilawah') || lowerMessage.includes('quran') || lowerMessage.includes('alquran')) {
    return `Subhanallah, niat untuk membaca Al-Qur'an sangat mulia! 📖\n\nBeberapa tips untuk konsisten tilawah:\n\n1. Tentukan waktu khusus setiap hari\n2. Mulai dengan target kecil (1-2 halaman)\n3. Pahami terjemahan untuk lebih bermakna\n4. Dengarkan murotal saat beraktivitas\n5. Ajak keluarga untuk tilawah bersama\n\nSetiap huruf yang dibaca bernilai pahala. Barakallahu fiik! ✨`;
  }

  if (lowerMessage.includes('doa') || lowerMessage.includes('dua')) {
    return `Alhamdulillah, doa adalah senjata mukmin. 🤲\n\nAllah SWT berfirman: "Berdoalah kepada-Ku, niscaya akan Aku kabulkan" (QS. Al-Mu'min: 60)\n\nTips berdoa:\n1. Pilih waktu mustajab (sepertiga malam, setelah adzan, dll)\n2. Awali dengan memuji Allah dan sholawat\n3. Berdoa dengan tulus dan khusyuk\n4. Yakin Allah akan mengabulkan\n5. Iringi dengan usaha dan ikhtiar\n\nAllah mendengar setiap doa Anda. 💚`;
  }

  // Default response
  return `Terima kasih atas pertanyaan Anda. 🙏\n\nSaya di sini untuk mendengarkan dan membantu. Setiap perjalanan spiritual itu unik, dan yang terpenting adalah niat tulus kita kepada Allah SWT.\n\nJika Anda memiliki pertanyaan lebih spesifik tentang ibadah atau butuh motivasi spiritual, silakan tanyakan. Saya siap membantu! 💙\n\nIngat, Allah Maha Pengasih dan Maha Penyayang. Teruslah berusaha dan jangan menyerah.`;
}
