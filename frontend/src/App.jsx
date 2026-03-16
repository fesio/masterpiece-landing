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
  personal: {
    title: "Personal Intelligence & Smart Life",
    text: "<p>Odzyskaj 2 godziny każdego dnia. Tworzymy spersonalizowane skrypty i asystentów AI, którzy zarządzają Twoim kalendarzem, filtrują maile i automatyzują rutynowe zadania domowe oraz zawodowe. Twoje cyfrowe życie na autopilocie.</p>",
    list: ["🚀 Spersonalizowani asystenci głosowi i tekstowi", "🚀 Automatyzacja skrzynki e-mail i kalendarza", "🚀 Integracje Smart Home (Home Assistant, IoT)"],
    chartType: 'bar',
    chartData: {
      labels: ['Planowanie', 'E-maile', 'Research', 'Admin'],
      datasets: [
        { label: 'Czas manualny (min)', data: [60, 90, 45, 30], backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: '#3b82f6', borderWidth: 1 },
        { label: 'Z AI (min)', data: [5, 10, 5, 2], backgroundColor: '#3b82f6' }
      ]
    },
    botMsg: "Chcesz odzyskać czas w życiu prywatnym czy w pracy biurowej?"
  },
  business: {
    title: "Business OS & AI Agents",
    text: "<p>Zbuduj autonomiczny oddział w swojej firmie. Wdrażamy agentów AI, którzy obsługują klientów, generują raporty i nadzorują logistykę 24/7. Wszystko to na bezpiecznych, lokalnych modelach LLM – Twoje dane nigdy nie opuszczają firmy.</p>",
    list: ["🛡️ Prywatne instancje LLM (Llama 3, Mistral) na Twoich serwerach", "🛡️ Autonomiczni agenci sprzedażowi i wsparcia", "🛡️ Pełna automatyzacja dokumentów i CRM"],
    chartData: {
      labels: ['Zabezpieczone lokalnie', 'Szyfrowane', 'Publiczne (Brak)'],
      datasets: [{ data: [80, 20, 0], backgroundColor: ['#3b82f6', '#8b5cf6', '#1e293b'], borderWidth: 0 }]
    },
    chartType: 'doughnut',
    botMsg: "Bezpieczeństwo danych to priorytet. Interesuje Cię postawienie własnego ChatGPT na Twoim serwerze?"
  },
  enterprise: {
    title: "Infrastructure & Open Source Systems",
    text: "<p>Projektujemy i wdrażamy skalowalną architekturę dla największych wyzwań. Od customowych forków systemów open-source (jak ClawdBot), przez klastry GKE, aż po zaawansowane systemy tradingu algorytmicznego oparte o inżynierię poznawczą.</p>",
    list: ["💎 Customowe systemy Open Source i architektura GKE", "💎 Algorytmiczne systemy tradingowe (Win Rate 67%+)", "💎 Rozwiązania klasy Enterprise dla dużych wolumenów danych"],
    chartType: 'line',
    chartData: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [{
        label: 'Wydajność systemów skalowalnych',
        data: [100, 250, 600, 1200],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    botMsg: "Budujemy coś od zera, czy potrzebujesz optymalizacji istniejącej architektury klasy Enterprise?"
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
    <div className="text-white min-h-screen flex flex-col font-sans bg-[#020617] overflow-x-hidden">
      
      <WarpSpeedPreloader isVisible={showSplash} />
      
      <div className={`transition-opacity duration-1000 ${showSplash ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
      <header className="bg-transparent border-b border-white/5 p-6 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-extrabold text-white tracking-tighter">TECH<span className="text-accent-blue">PARTNER</span></h1>
            <nav className="hidden md:flex gap-8 font-semibold text-white/60">
                <span className="hover:text-white transition-colors cursor-pointer text-sm tracking-widest uppercase">Ecosystem</span>
                <span className="hover:text-white transition-colors cursor-pointer text-sm tracking-widest uppercase">OS Projects</span>
                <span className="hover:text-white transition-colors cursor-pointer text-sm tracking-widest uppercase">Contact</span>
            </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto p-6 flex flex-col items-center">
        
        <div className="text-center max-w-3xl mx-auto my-20">
            <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-none text-gradient px-4">Przekraczamy granice <br/><span className="text-accent-gradient">możliwości.</span></h2>
            <p className="text-xl text-slate-400 font-light">Od drobnych automatyzacji po skalowalne systemy Enterprise. <br/>Twoja innowacja napędzana naszą inżynierią.</p>
        </div>

        <div className="bento-grid w-full mb-12">
            <div onClick={() => handleCategorySelect('personal')} className="bento-item flex flex-col justify-between group">
                <div>
                  <span className="text-5xl mb-6 block group-hover:scale-110 transition-transform">🚀</span>
                  <h3 className="text-2xl font-bold text-white mb-3">Personal Intelligence</h3>
                  <p className="text-slate-400 text-sm font-light leading-relaxed">Inteligentni asystenci, skrypty i automatyzacja codzienności. Odzyskaj swój czas.</p>
                </div>
            </div>

            <div onClick={() => handleCategorySelect('business')} className="bento-item bento-large flex flex-col justify-between group">
                <div className="relative z-10">
                  <span className="text-7xl mb-6 block group-hover:scale-110 transition-transform">🛡️</span>
                  <h3 className="text-4xl font-extrabold text-white mb-4">Business OS & AI Agents</h3>
                  <p className="text-slate-300 text-lg font-light leading-relaxed mb-6">Wdrażamy agentów AI na Twoich własnych, lokalnych serwerach. Pełna prywatność, zero ryzyka, maksymalna wydajność.</p>
                  <ul className="text-accent-blue font-semibold space-y-2">
                    <li>• Local LLM Implementation</li>
                    <li>• Autonomous Sales Agents</li>
                    <li>• Cognitive Logistics</li>
                  </ul>
                </div>
                <div className="absolute bottom-4 right-4 text-white/5 font-black text-8xl uppercase pointer-events-none">Shield</div>
            </div>

            <div onClick={() => handleCategorySelect('enterprise')} className="bento-item bento-wide flex flex-col justify-between group">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <span className="text-5xl mb-4 block group-hover:scale-110 transition-transform">💎</span>
                    <h3 className="text-2xl font-bold text-white mb-2">Enterprise & Open Source</h3>
                    <p className="text-slate-400 text-sm font-light">Skalowalne systemy, forki Open Source (ClawdBot) i trading klasy instytucjonalnej.</p>
                  </div>
                  <div className="w-full md:w-48 h-24 bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 animate-pulse-slow bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
                      <span className="text-blue-400 font-bold text-xs tracking-tighter uppercase">Infrastructure Live</span>
                  </div>
                </div>
            </div>
        </div>

        {selectedCategory && currentData && (
          <div ref={detailsRef} className="w-full bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-10 shadow-2xl mb-12 animate-in fade-in slide-in-from-bottom-8">
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                  <div className="flex-1 w-full">
                      <span className="text-accent-blue font-bold uppercase tracking-widest text-xs mb-2 block">Solution Insight</span>
                      <h3 className="text-4xl font-extrabold text-white mb-6 leading-tight">{currentData.title}</h3>
                      <div className="prose prose-invert max-w-none mb-8 text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: currentData.text }}></div>
                      <ul className="space-y-4 text-white/80 font-medium mb-10">
                        {currentData.list.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 bg-accent-blue rounded-full"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                      <button className="bg-gradient-to-r from-accent-blue to-accent-purple hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] text-white font-bold py-4 px-10 rounded-2xl transition-all w-full md:w-auto">
                          Wybierz to rozwiązanie
                      </button>
                  </div>
                  <div className="flex-1 w-full flex justify-center items-center bg-black/20 rounded-3xl p-8 border border-white/5">
                      <div className="relative w-full h-[400px]">
                        {currentData.chartType === 'bar' && (
                          <Bar data={currentData.chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { ticks: { color: '#64748b' }, grid: { display: false } } } }} />
                        )}
                        {currentData.chartType === 'doughnut' && (
                          <Doughnut data={currentData.chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Outfit', size: 12 } } } } }} />
                        )}
                        {currentData.chartType === 'line' && (
                          <Line data={currentData.chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { ticks: { color: '#64748b' }, grid: { display: false } } } }} />
                        )}
                      </div>
                  </div>
              </div>
          </div>
        )}

        <section className="w-full bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12 shadow-2xl mb-12">
            <h2 className="text-4xl font-extrabold text-white mb-8 text-center tracking-tight">Gotowy na <span className="text-accent-blue">skalowanie?</span></h2>
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Twoje Imię</label>
                <input 
                  type="text" 
                  placeholder="Jak się nazywasz?"
                  className="bg-white/5 border border-white/10 text-white rounded-xl p-4 outline-none focus:ring-2 focus:ring-accent-blue transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Wiadomość / Cel</label>
                <textarea 
                  placeholder="Opisz krótko swój problem lub wizję systemu..."
                  className="bg-white/5 border border-white/10 text-white rounded-xl p-4 h-40 outline-none focus:ring-2 focus:ring-accent-blue transition-all resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting || !message.trim()}
                className={`mt-6 w-full py-5 rounded-2xl font-black text-lg text-white transition-all shadow-[0_10px_30px_rgba(59,130,246,0.3)] ${
                  (message.trim() && !isSubmitting) 
                    ? 'bg-accent-blue hover:scale-[1.02] cursor-pointer' 
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Inicjalizacja...' : isSuccess ? 'Zgłoszenie wysłane! ✅' : 'Rozpocznij projekt'}
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
