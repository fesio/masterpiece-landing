import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import './App.css';

// Chart.js registration
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const contentData = {
  automation: {
    title: "Automatyzacja procesów & Agenci AI",
    text: "<p>Zastąp powtarzalną pracę inteligentnymi skryptami. Łączymy systemy, aby działały jako jedna, spójna maszyna. Od automatyzacji odpisywania na maile, po zaawansowanych agentów AI obsługujących logistykę i smart home.</p>",
    list: ["✅ Inteligentni Agenci AI pracujący 24/7", "✅ Integracje API (Zapie, Make, systemy dedykowane)", "✅ Automatyzacja urządzeń Smart Home i IoT"],
    chartType: 'bar',
    chartData: {
      labels: ['Obsługa Klienta', 'Wprowadzanie Danych', 'Raportowanie', 'Logistyka'],
      datasets: [
        { label: 'Godziny pracy (Przed AI)', data: [40, 25, 15, 30], backgroundColor: '#cbd5e1' },
        { label: 'Godziny pracy (Po AI)', data: [5, 2, 1, 10], backgroundColor: '#3b82f6' }
      ]
    },
    botMsg: "Świetny wybór! Automatyzacja to moja pasja. Jaka powtarzalna czynność zajmuje Ci najwięcej czasu?"
  },
  security: {
    title: "Bezpieczeństwo & Wewnętrzne Modele LLM",
    text: "<p>Wdrażaj sztuczną inteligencję bez obaw o wyciek danych. Konfigurujemy lokalne modele językowe (podobnie jak ChatGPT), do których dostęp masz wyłącznie Ty i Twoi pracownicy. Twoje dane biznesowe nigdy nie opuszczają firmy.</p>",
    list: ["✅ Wdrożenia lokalnych modeli (Llama, Mistral) na Twoich serwerach", "✅ Zabezpieczenia systemów i audyty kodu", "✅ Systemy RAG bazujące wyłącznie na Twojej dokumentacji"],
    chartType: 'doughnut',
    chartData: {
      labels: ['Zabezpieczone lokalnie', 'Szyfrowane w chmurze', 'Podatności usunięte'],
      datasets: [{ data: [65, 25, 10], backgroundColor: ['#3b82f6', '#94a3b8', '#10b981'], borderWidth: 0 }]
    },
    botMsg: "Bezpieczeństwo to podstawa. Chcesz porozmawiać o własnym, odizolowanego modelu AI na Twoim serwerze?"
  },
  finance: {
    title: "Inżynieria Finansowa & Trading Boty",
    text: "<p>Odzyskaj kontrolę nad budżetem i pomnażaj kapitał. Oferujemy budowę wirtualnych asystentów księgowych optymalizujących wydatki oraz zaawansowane skrypty do tradingu (TradingView/Pine Script) analizujące rynek kryptowalut i akcji.</p>",
    list: ["✅ Strategie Pine Script (backtesty z 67%+ Win Rate)", "✅ Skanery rynkowe i boty do automatycznego handlu", "✅ AI analizujące Twoje faktury i tnące zbędne koszty"],
    chartType: 'line',
    chartData: {
      labels: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10'],
      datasets: [{
        label: 'Wzrost kapitału (Strategia 67% WR)',
        data: [1000, 1050, 1120, 1080, 1250, 1400, 1350, 1600, 1850, 2100],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    botMsg: "Finanse! Interesuje Cię redukcja wydatków, czy budowa skryptów tradingowych na TradingView?"
  }
};


// --- Komponent: Preloader 3D (Warp Speed Canvas) ---
function WarpSpeedPreloader({ isVisible }) {
  const canvasRef = React.useRef(null);

  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const stars = [];
    const starCount = 400;

    class Star {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = (Math.random() - 0.5) * w;
        this.y = (Math.random() - 0.5) * h;
        this.z = Math.random() * w; // Depth
        this.pz = this.z;
        this.px = this.x;
        this.py = this.y;
      }
      update() {
        this.pz = this.z;
        this.z -= 15; // Speed of travel
        if (this.z < 1) {
          this.reset();
        }
      }
      draw() {
        const sx = (this.x / this.z) * w + w / 2;
        const sy = (this.y / this.z) * h + h / 2;
        const px = (this.x / this.pz) * w + w / 2;
        const py = (this.y / this.pz) * h + h / 2;

        const r = (1 - this.z / w) * 3;
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(168, 85, 247, ${1 - this.z / w})`;
        ctx.lineWidth = r;
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();

        ctx.fillStyle = `rgba(255, 255, 255, ${1 - this.z / w})`;
        ctx.beginPath();
        ctx.arc(sx, sy, r / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < starCount; i++) stars.push(new Star());

    const animate = () => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, w, h);
      stars.forEach(star => {
        star.update();
        star.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isVisible]);

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-1000 ${!isVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="relative z-10 text-center flex flex-col items-center justify-center pointer-events-none p-4 w-full">
        <h1 className="text-white text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-2xl">
          Twoja innowacja. Moja inżynieria poznawcza.
        </h1>
        <span className="text-purple-400 font-semibold text-xl md:text-2xl mt-4 block" style={{textShadow: '0 0 10px rgba(168,85,247,0.8)'}}>
          Upraszczam systemy, abyś Ty odzyskał swój czas
        </span>
      </div>
    </div>
  );
}

// --- Komponent: AI Chatbot ---
function AIChat({ openFromCategory, overrideMsg }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (openFromCategory) {
      setIsOpen(true);
      if (overrideMsg) {
        setMessages(prev => [...prev, { role: 'ai', text: overrideMsg }]);
      }
    }
  }, [openFromCategory, overrideMsg]);

  useEffect(() => {
    if (hasInitialized) return;
    
    // Inicjalizacja - natychmiast po zamknięciu splash screena
    const timer1 = setTimeout(() => {
      if(!isOpen) setIsOpen(true);
      setMessages([{ 
        role: 'ai', 
        text: 'Cześć! 👋 Jestem gotowy, aby pomóc Ci zoptymalizować Twój biznes. Wybierz jeden z kafelków powyżej, a od razu pokażę Ci, co możemy wspólnie osiągnąć.' 
      }]);
    }, 0); 
    
    setHasInitialized(true);
    return () => clearTimeout(timer1);
  }, [hasInitialized, isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!API_KEY) {
        setMessages(prev => [...prev, { role: 'ai', text: 'Konfiguracja w toku... (Brak klucza API na Vercel)' }]);
        setLoading(false);
        return;
      }

      // Budowanie historii kontekstowej ze stanu aplikacji, żeby LLM wiedział z czym ma do czynienia
      const historyCtx = messages.map(m => (m.role === 'user' ? 'Klient: ' : 'Ty: ') + m.text).join('\n');

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ 
              text: `ZASADY PSYCHOLOGICZNE. Zachowuj się jak ekspert ds. cyfryzacji z wykształceniem psychologicznym (imię pracodawcy to "fesio").
Twoim celem jest inicjowanie rozmów z właścicielami małych firm, zdejmowanie z nich technofobii i docelowe zaproponowanie dedykowanego oprogramowania.

BEHAWIOR:
1. WALIDACJA I EMPATIA: Zaczynaj od uznania ich trudu. Małe firmy to stres.
2. RAMOWANIE (Reframing): Technologia = niewidzialny asystent do beznadziejnej papierologii. Zdejmuje lęki.
3. REDUKCJA OPCJI: Nie pytaj "jakiego oprogramowania potrzebujesz?". Skup się tylko i wyłącznie na emocjach i bólu (zabrany czas, rutyna).
4. TONE OF VOICE: Mów ze spokojem, cierpliwie. ZAKAZUJE używania żargonu: API, kod, framework, wdrożenia.

OBECNA REAKCJA:
Gdy klient odpowiedział właśnie na to co zabiera mu czas:
- Zwaliduj to: "Rozumiem, to faktycznie potrafi zabrać połowę dnia." (lub podobnie brzmiąco).
- Zaproponuj ulgę: "A gdybyśmy stworzyli proste, niewidoczne w tle narzędzie, które będzie robić to za Ciebie, podczas gdy Ty skupisz się na klientach? Bez skomplikowanych instrukcji. Po prostu działa. Chcesz usłyszeć, jak mogłoby to wyglądać w Twojej firmie?"

HISTORIA NASZEJ ROZMOWY DO TEJ PORY:
${historyCtx}

Teraz Klient wysłał wiadomość: "${input}"
Odpisz uwzględniając instrukcje reakcji, bardzo naturalnie:` 
            }] 
          }]
        })
      });

      const data = await response.json();
      const aiText = data.candidates[0].content.parts[0].text;
      
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Przepraszam, mam chwilowy problem z przemyśleniem tego. Daj mi chwilkę i napisz jeszcze raz.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end z-50">
      <div 
        id="chat-window" 
        className={`bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden mb-4 flex-col transition-all duration-300 transform origin-bottom-right ${isOpen ? 'opacity-100 scale-100 flex' : 'opacity-0 scale-95 hidden'}`}
      >
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-xl">👨‍💻</div>
            <div>
              <h3 className="font-bold text-sm">Inżynieria Poznawcza - Doradca</h3>
              <p className="text-xs text-green-400 flex items-center gap-1">Zawsze gotowy pomóc</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors text-xl">✖</button>
        </div>
        <div id="chat-messages" className="h-80 p-4 bg-slate-50 overflow-y-auto flex flex-col gap-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.role === 'ai' ? 
              'bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-sm text-sm text-slate-800 max-w-[85%] shadow-sm self-start chat-slide-up' : 
              'bg-blue-600 text-white p-3 rounded-2xl rounded-tr-sm text-sm max-w-[85%] shadow-sm self-end chat-slide-up'} 
              dangerouslySetInnerHTML={{ __html: msg.text }}>
            </div>
          ))}
          {loading && (
            <div id="typing-indicator" className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-sm flex gap-1 items-center self-start shadow-sm w-16 h-10">
              <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Odpowiedz tutaj..." 
            className="bg-slate-100 rounded-full px-4 py-2 text-sm w-full outline-none text-slate-700 disabled:opacity-50" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={loading}
          />
          <button onClick={sendMessage} className="w-10 h-10 bg-blue-600 text-white rounded-full font-bold flex items-center justify-center hover:bg-blue-700 transition-colors">➤</button>
        </div>
      </div>
      
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        id="chat-bubble" 
        className="w-16 h-16 bg-slate-900 rounded-full shadow-2xl flex items-center justify-center text-white text-3xl hover:bg-slate-800 transition-transform transform hover:scale-105 active:scale-95 z-50 relative"
      >
        💬
        {!isOpen && messages.length > 0 && (
          <span id="chat-badge" className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-900">
            {messages.length}
          </span>
        )}
      </button>
    </div>
  );
}


// --- Komponent Główny App ---
function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openChat, setOpenChat] = useState({ open: false, msg: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Stany dla formularza web3forms
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const detailsRef = useRef(null);

  useEffect(() => {
    // Inicjalizacja Lenis (Smooth Scroll)
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    const timer = setTimeout(() => setShowSplash(false), 2500);

    return () => {
      clearTimeout(timer);
      lenis.destroy();
    };
  }, []);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // Open chat with specific message 1.5s after category select
    setTimeout(() => {
      setOpenChat({ open: true, msg: contentData[categoryId].botMsg });
    }, 1500);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("access_key", "dccd5b2d-0139-4d07-8ce6-3b567caf5fde");
    formData.append("name", name);
    formData.append("message", message);
    formData.append("subject", "Nowe zgłoszenie z Landing Page - TechPartner.AI");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      }).then((res) => res.json());

      if (res.success) {
        setIsSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        alert("Wystąpił błąd podczas wysyłania. Spróbuj ponownie.");
      }
    } catch (err) {
      alert("Błąd połączenia. Sprawdź internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentData = selectedCategory ? contentData[selectedCategory] : null;

  return (
    <div className="text-slate-800 min-h-screen flex flex-col font-sans bg-slate-50 overflow-hidden">
      
      <WarpSpeedPreloader isVisible={showSplash} />
      
      <div className={`transition-opacity duration-1000 ${showSplash ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
      <header className="bg-white border-b border-slate-200 p-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">TechPartner<span className="text-blue-600">.AI</span></h1>
            <nav className="hidden md:flex gap-6 font-medium text-slate-600">
                <span className="hover:text-blue-600 cursor-pointer">Usługi</span>
                <span className="hover:text-blue-600 cursor-pointer">O nas</span>
                <span className="hover:text-blue-600 cursor-pointer">Kontakt</span>
            </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto p-6 flex flex-col items-center">
        
        <div className="text-center max-w-2xl mx-auto my-12">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">W czym mogę Ci dziś pomóc?</h2>
            <p className="text-lg text-slate-600">Wybierz obszar, który chcesz zoptymalizować, a my dostarczymy gotowe rozwiązanie. Bez stresu, bez żargonu.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-12">
            <button onClick={() => handleCategorySelect('automation')} className="tile-hover outline-none bg-white p-8 rounded-2xl border border-slate-200 flex flex-col items-center text-center cursor-pointer group focus:ring-4 focus:ring-blue-100">
                <span className="text-6xl mb-4 group-hover:scale-110 transition-transform">🚀</span>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Automatyzacja & AI</h3>
                <p className="text-sm text-slate-500">Uwolnij swój czas. Smart boty, agenci AI, automatyzacja procesów.</p>
            </button>

            <button onClick={() => handleCategorySelect('security')} className="tile-hover outline-none bg-white p-8 rounded-2xl border border-slate-200 flex flex-col items-center text-center cursor-pointer group focus:ring-4 focus:ring-blue-100">
                <span className="text-6xl mb-4 group-hover:scale-110 transition-transform">🛡️</span>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Bezpieczne Dane</h3>
                <p className="text-sm text-slate-500">Prywatne modele LLM (Twój własny ChatGPT), pełna ochrona danych.</p>
            </button>

            <button onClick={() => handleCategorySelect('finance')} className="tile-hover outline-none bg-white p-8 rounded-2xl border border-slate-200 flex flex-col items-center text-center cursor-pointer group focus:ring-4 focus:ring-blue-100">
                <span className="text-6xl mb-4 group-hover:scale-110 transition-transform">💎</span>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Finanse & Strategie</h3>
                <p className="text-sm text-slate-500">Kontrola kosztów i zyskowne strategie Pine Script.</p>
            </button>
        </div>

        {selectedCategory && currentData && (
          <div ref={detailsRef} className="w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm transition-all duration-500 mb-12 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                  <div className="flex-1 w-full">
                      <h3 className="text-3xl font-bold text-slate-900 mb-4">{currentData.title}</h3>
                      <div className="prose prose-slate max-w-none mb-6" dangerouslySetInnerHTML={{ __html: currentData.text }}></div>
                      <ul className="space-y-3 text-slate-700 font-medium mb-8">
                        {currentData.list.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors w-full md:w-auto">
                          Rozpocznij wdrażanie
                      </button>
                  </div>
                  <div className="flex-1 w-full flex justify-center items-center bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="relative w-full max-w-[800px] mx-auto h-[350px] max-h-[400px]">
                        {currentData.chartType === 'bar' && (
                          <Bar data={currentData.chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, animation: { duration: 1000, easing: 'easeOutQuart' } }} />
                        )}
                        {currentData.chartType === 'doughnut' && (
                          <Doughnut data={currentData.chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, animation: { duration: 1000, easing: 'easeOutQuart' } }} />
                        )}
                        {currentData.chartType === 'line' && (
                          <Line data={currentData.chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, animation: { duration: 1000, easing: 'easeOutQuart' } }} />
                        )}
                      </div>
                  </div>
              </div>
          </div>
        )}

        <section className="w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Formularz kontaktowy</h2>
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-slate-700">Imię</label>
                <input 
                  type="text" 
                  placeholder="Jak się nazywasz?"
                  className="bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-slate-700">Wiadomość (jak mamy się skontaktować?)</label>
                <textarea 
                  placeholder="Napisz krótko, co chciałbyś zoptymalizować oraz np. zostaw nr telefonu..."
                  className="bg-slate-50 border border-slate-200 rounded-lg p-3 h-32 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting || !message.trim()}
                className={`mt-4 w-full py-4 rounded-xl font-bold text-white transition-colors ${
                  (message.trim() && !isSubmitting) 
                    ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-md' 
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Wysyłanie...' : isSuccess ? 'Wysłano pomyślnie! ✅' : 'Wyślij zapytanie'}
              </button>
            </form>
        </section>

      </main>
      </div>

      {!showSplash && <AIChat openFromCategory={openChat.open} overrideMsg={openChat.msg} />}
    </div>
  );
}

export default App;
