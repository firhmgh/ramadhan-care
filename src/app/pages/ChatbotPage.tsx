import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MessageCircle, Send, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollArea } from '../components/ui/scroll-area';
import { cn } from '../components/ui/utils';

export default function ChatbotPage() {
  const { chatHistory, addChatMessage, clearChatHistory } = useStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll ke bawah
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [chatHistory, isTyping]);

  const handleSend = async (textInput?: string) => {
    const messageText = textInput || input;
    if (!messageText.trim()) return;

    if (!textInput) setInput('');

    addChatMessage({
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date(),
    });

    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(messageText.trim());
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
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-screen p-2 md:p-4 gap-4 max-w-full">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 px-2"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl gradient-secondary flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Chatbot Islami</h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Asisten spiritual Anda
              </p>
            </div>
          </div>
          {chatHistory.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearChatHistory}
              className="rounded-xl h-9 px-3 text-xs md:text-sm hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Hapus Riwayat</span>
            </Button>
          )}
        </div>
      </motion.div>

      {/* Chat Container Utama */}
      <div className="flex-1 bg-card md:rounded-3xl shadow-soft-md flex flex-col overflow-hidden border border-border/50 relative h-full">
        
        {/* Messages Area */}
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="p-4 md:p-6 space-y-6 pb-4">
            
            {/* Empty State / Welcome Screen */}
            {chatHistory.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-[50vh] py-8 text-center"
              >
                {/* Disclaimer */}
                <div className="mb-8 w-full max-w-2xl mx-auto p-3 rounded-xl bg-warning/5 border border-warning/20 flex gap-3 text-left">
                  <AlertCircle className="w-5 h-5 text-warning-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-warning-foreground block mb-0.5">Perhatian</span>
                    Chatbot ini bersifat empatik tetapi tidak memberikan fatwa resmi. Untuk masalah fiqih kompleks, silakan tanya ulama.
                  </p>
                </div>

                <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl gradient-spiritual flex items-center justify-center mb-6 shadow-sm">
                  <span className="text-3xl md:text-4xl">🤲</span>
                </div>
                <h3 className="font-semibold text-xl md:text-2xl mb-3">Assalamu'alaikum!</h3>
                <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto mb-10 px-4">
                  Saya siap membantu menjawab pertanyaan seputar ibadah, motivasi, dan dukungan spiritual.
                </p>
                
                {/* Tombol saran pertanyaan dibuat lebih lebar (max-w-2xl) dan responsive grid */}
                <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-3 px-2">
                  {[
                    "Bagaimana cara khusyuk dalam sholat?",
                    "Apa yang harus dilakukan jika terlewat sahur?",
                    "Bagaimana mengatasi malas beribadah?",
                    "Doa agar hati tenang?",
                  ].map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleSend(question)}
                      className="w-full rounded-xl justify-start h-auto py-4 px-4 text-sm md:text-base whitespace-normal text-left hover:bg-accent/50 hover:border-accent transition-all"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Chat History Bubbles */}
            <AnimatePresence mode="popLayout">
              {chatHistory.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={cn(
                      "max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 text-sm md:text-base shadow-sm",
                      message.role === 'user'
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-accent/30 text-foreground rounded-bl-none border border-accent/20"
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
                    <p className={cn(
                      "text-[10px] md:text-xs mt-2 text-right opacity-70",
                      message.role === 'user' ? "text-primary-foreground" : "text-muted-foreground"
                    )}>
                      {new Date(message.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start w-full"
              >
                <div className="bg-accent/20 rounded-2xl rounded-bl-none px-4 py-4 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground mr-1">Bot sedang mengetik</span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-primary/60"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area - Full Width */}
        <div className="border-t border-border p-3 md:p-5 bg-card z-10">
          <div className="flex items-end gap-2 md:gap-3 w-full max-w-5xl mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Tulis pertanyaan Anda..."
              className="flex-1 rounded-xl min-h-[50px] py-3 px-4 resize-none bg-background focus-visible:ring-1 text-base"
              disabled={isTyping}
              autoComplete="off"
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              size="icon"
              className="rounded-xl h-[50px] w-[50px] flex-shrink-0 shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              {isTyping ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 ml-0.5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock AI response generator (Tetap sama)
function generateResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  if (lowerMessage.includes('sholat') || lowerMessage.includes('salat')) {
    return `Alhamdulillah, pertanyaan yang bagus tentang sholat. 🙏\n\nSholat adalah tiang agama. Tips untuk meningkatkan kualitas sholat:\n1. Sempurnakan wudhu\n2. Pahami makna bacaan\n3. Fokus pada gerakan (tuma'ninah)\n4. Hindari gangguan saat sholat\n\nSemoga sholat Anda semakin khusyuk. 💚`;
  }
  if (lowerMessage.includes('puasa') || lowerMessage.includes('sahur')) {
    return `Ma syaa Allah, semangat puasanya! 🌙\n\nJika terlewat sahur:\n1. Niatkan puasa dari hati\n2. Puasa tetap sah tanpa sahur\n3. Jaga stamina dan hindari aktivitas berat berlebih\n\nAllah menilai usaha dan niat Anda. 💪`;
  }
  if (lowerMessage.includes('malas') || lowerMessage.includes('motivasi')) {
    return `Wajar merasa lelah, tapi jangan menyerah. 💙\n\nTips membangkitkan semangat:\n1. Mulai dari ibadah wajib yang ringan\n2. Berdoa minta kekuatan ("Allahumma inni a'udzubika minal kasal")\n3. Ingat pahala yang Allah janjikan\n\nKeep going! 🌟`;
  }
  return `Terima kasih atas pertanyaannya. 🙏\n\nSetiap perjalanan spiritual itu unik. Lakukan yang terbaik semampu Anda, dan Allah Maha Mengetahui isi hati hamba-Nya.\n\nAda hal lain yang ingin didiskusikan?`;
}