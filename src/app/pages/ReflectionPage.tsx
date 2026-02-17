import { useState, useEffect, useRef } from 'react';
import { useStore, MoodType } from '../store/useStore';
import { MoodSelector } from '../components/MoodSelector';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ScrollArea } from '../components/ui/scroll-area';
import { cn } from '../components/ui/utils';
import { 
  BookHeart, 
  Save, 
  Calendar as CalendarIcon, 
  MessageCircle, 
  Send, 
  Loader2, 
  AlertCircle, 
  Trash2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const reflectivePrompts = [
  "Apa yang paling Anda syukuri hari ini?",
  "Ibadah apa yang paling berkesan hari ini?",
  "Bagaimana perasaan Anda saat beribadah hari ini?",
  "Apa pelajaran spiritual yang Anda dapatkan hari ini?",
  "Hal apa yang ingin Anda perbaiki untuk besok?",
];

export default function ReflectionPage() {
  const [activeTab, setActiveTab] = useState<'journal' | 'chat'>('journal');
  const { 
    getJournalByDate, 
    addJournalEntry, 
    chatHistory, 
    addChatMessage, 
    clearChatHistory 
  } = useStore();

  // --- Logic Jurnal ---
  const today = new Date().toISOString().split('T')[0];
  const existingEntry = getJournalByDate(today);

  const [mood, setMood] = useState<MoodType | null>(existingEntry?.mood || null);
  const [story, setStory] = useState(existingEntry?.story || '');
  const [evaluasi, setEvaluasi] = useState(existingEntry?.evaluasi || '');
  const [gratitude, setGratitude] = useState(existingEntry?.gratitude || '');

  const handleSaveJournal = () => {
    if (!mood || !story || !evaluasi) {
      toast.error('Lengkapi mood, cerita, dan evaluasi');
      return;
    }
    addJournalEntry({
      date: today,
      mood,
      story,
      evaluasi,
      gratitude: gratitude || undefined,
    });
    toast.success('Jurnal berhasil disimpan! 📖');
  };

  const wordCount = story.split(/\s+/).filter(Boolean).length;

  // --- Logic Chatbot ---
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chat' && scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [chatHistory, isTyping, activeTab]);

  const handleSendChat = async (textInput?: string) => {
    const messageText = textInput || chatInput;
    if (!messageText.trim()) return;

    if (!textInput) setChatInput('');

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

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-screen p-4 gap-4 max-w-6xl mx-auto">
      
      {/* Tab Switcher */}
      <div className="flex bg-card p-1.5 rounded-2xl border shadow-soft-sm shrink-0">
        <button
          onClick={() => setActiveTab('journal')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all duration-300",
            activeTab === 'journal' 
              ? "bg-primary text-primary-foreground shadow-md" 
              : "text-muted-foreground hover:bg-accent"
          )}
        >
          <BookHeart className="w-5 h-5" />
          <span>Jurnal Refleksi</span>
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all duration-300",
            activeTab === 'chat' 
              ? "bg-secondary text-secondary-foreground shadow-md" 
              : "text-muted-foreground hover:bg-accent"
          )}
        >
          <MessageCircle className="w-5 h-5" />
          <span>Asisten Spiritual</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <AnimatePresence mode="wait">
          
          {/* TAB JURNAL */}
          {activeTab === 'journal' && (
            <motion.div
              key="journal-tab"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full overflow-y-auto pr-1 space-y-6"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-6">
                  {/* Mood Card */}
                  <div className="bg-card rounded-3xl shadow-soft-md p-6 border border-border/50">
                    <MoodSelector value={mood} onChange={setMood} />
                  </div>

                  {/* Inputs */}
                  <div className="bg-card rounded-3xl shadow-soft-md p-6 border border-border/50 space-y-6">
                    <div className="space-y-4">
                      <Label htmlFor="story" className="text-lg font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" /> Cerita Hari Ini
                      </Label>
                      <Textarea
                        id="story"
                        value={story}
                        onChange={(e) => setStory(e.target.value)}
                        placeholder="Tuliskan pengalaman spiritual Anda hari ini..."
                        className="rounded-2xl resize-none min-h-[200px] bg-background"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{wordCount} kata</span>
                        {wordCount > 0 && wordCount < 20 && (
                          <span className="text-warning-foreground italic">Minimal 20 kata agar lebih bermakna</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="evaluasi" className="font-bold">Evaluasi Diri</Label>
                      <Textarea
                        id="evaluasi"
                        value={evaluasi}
                        onChange={(e) => setEvaluasi(e.target.value)}
                        placeholder="Apa yang sudah baik? Apa yang perlu ditingkatkan?"
                        className="rounded-2xl bg-background"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="gratitude" className="font-bold">Rasa Syukur</Label>
                      <Textarea
                        id="gratitude"
                        value={gratitude}
                        onChange={(e) => setGratitude(e.target.value)}
                        placeholder="Hal kecil apa yang Anda syukuri hari ini?"
                        className="rounded-2xl bg-background"
                        rows={3}
                      />
                    </div>

                    <Button onClick={handleSaveJournal} className="w-full h-14 rounded-2xl gradient-primary text-lg font-bold">
                      <Save className="w-5 h-5 mr-2" /> Simpan Jurnal
                    </Button>
                  </div>
                </div>

                {/* Sidebar Jurnal */}
                <div className="md:w-80 space-y-4">
                  <div className="bg-card rounded-3xl shadow-soft-md p-6 border border-border/50">
                    <h3 className="font-bold mb-4 flex items-center gap-2 text-primary">
                      💭 Inspirasi Tulisan
                    </h3>
                    <div className="space-y-2">
                      {reflectivePrompts.map((prompt, i) => (
                        <div 
                          key={i} 
                          className="p-3 text-sm rounded-xl bg-accent/20 hover:bg-accent/40 cursor-pointer transition-colors"
                          onClick={() => setStory(story + (story ? "\n\n" : "") + prompt + "\n")}
                        >
                          {prompt}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 rounded-3xl p-6 border border-primary/20 space-y-3">
                    <div className="flex items-center gap-2 text-primary">
                      <ShieldCheck className="w-5 h-5" />
                      <span className="font-bold text-sm">Privasi Terjamin</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Jurnal ini bersifat privat dan hanya disimpan di perangkat Anda. Tuliskan isi hati Anda dengan tenang.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB CHATBOT */}
          {activeTab === 'chat' && (
            <motion.div
              key="chat-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col bg-card rounded-3xl border border-border/50 shadow-soft-md overflow-hidden"
            >
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between bg-accent/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-bold text-muted-foreground italic">
                    Asisten spiritual cerdas & empatik
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearChatHistory} 
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Bersihkan
                </Button>
              </div>

              {/* Chat Messages */}
              <ScrollArea className="flex-1" ref={scrollRef}>
                <div className="p-4 md:p-6 space-y-6">
                  {chatHistory.length === 0 && (
                    <div className="text-center py-10 space-y-6">
                      <div className="w-16 h-16 rounded-3xl gradient-secondary mx-auto flex items-center justify-center text-3xl">
                        🤲
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">Assalamu'alaikum!</h3>
                        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                          Ada yang ingin Anda diskusikan seputar ibadah atau motivasi hari ini?
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-md mx-auto">
                        {["Tips khusyuk sholat?", "Doa agar hati tenang?", "Lupa niat puasa?", "Motivasi tahajud?"].map((q, i) => (
                          <Button key={i} variant="outline" className="rounded-xl text-xs h-auto py-3 px-4" onClick={() => handleSendChat(q)}>
                            {q}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {chatHistory.map((m, i) => (
                    <div key={i} className={cn("flex w-full", m.role === 'user' ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[85%] md:max-w-[75%] p-4 rounded-2xl shadow-sm",
                        m.role === 'user' 
                          ? "bg-primary text-primary-foreground rounded-br-none" 
                          : "bg-accent/30 text-foreground rounded-bl-none border border-accent/20"
                      )}>
                        <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{m.content}</p>
                        <p className="text-[10px] mt-2 text-right opacity-60">
                          {new Date(m.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-accent/20 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1 items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="p-4 border-t bg-background/50">
                <div className="flex gap-2 max-w-4xl mx-auto">
                  <Input 
                    value={chatInput} 
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                    placeholder="Tulis pesan Anda..."
                    className="rounded-xl h-12 bg-card border-none shadow-inner"
                    disabled={isTyping}
                  />
                  <Button 
                    onClick={() => handleSendChat()} 
                    disabled={!chatInput.trim() || isTyping}
                    className="h-12 w-12 rounded-xl gradient-secondary shadow-md shrink-0"
                  >
                    {isTyping ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Respon generator sederhana
function generateResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  if (lowerMessage.includes('sholat') || lowerMessage.includes('salat')) {
    return `Alhamdulillah. Sholat adalah cara kita berkomunikasi langsung dengan Allah. 🙏\n\nTips khusyuk:\n1. Hadirkan hati sebelum Takbir.\n2. Pahami bacaannya.\n3. Jangan terburu-buru (tuma'ninah).`;
  }
  if (lowerMessage.includes('puasa') || lowerMessage.includes('sahur')) {
    return `Maa syaa Allah, semangat puasanya! 🌙\n\nJika lupa niat namun sudah sahur, puasa Anda tetap sah insya Allah. Teruslah menjaga lisan dan hati selama berpuasa.`;
  }
  if (lowerMessage.includes('malas') || lowerMessage.includes('motivasi')) {
    return `Wajar jika iman naik turun. Sebagaimana kata pepatah, "Al-iimanu yaziidu wa yankush". 💙\n\nCoba mulai dari yang kecil, seperti istighfar 100x atau baca 1 halaman Qur'an saja. Allah sangat mencintai amalan yang sedikit tapi rutin.`;
  }
  return `Maa syaa Allah, mari kita terus istiqomah dalam kebaikan ini. Teruslah melangkah menuju ridho-Nya. ✨\n\nAda hal lain yang ingin Anda ceritakan?`;
}