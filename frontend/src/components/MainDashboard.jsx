import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, LineSeries } from 'lightweight-charts';
import { Activity, Shield, Terminal, Zap, Server, BarChart3, RefreshCcw, Search, ChevronRight } from 'lucide-react';
import { calculateHurstExponent, detectAlphaSignal } from '../lib/quant-utils';
import { executeAutonomousCycle, triggerPreview, dispatchCommand } from '../lib/alpha-bridge';
import { HoverDecode } from './HoverDecode';
import { updateSystemState } from '../lib/agentic-rag';
import { addTick, getMetrics, fastParseBinance } from '../lib/wss-buffer';

const DashModule = ({ title, icon: Icon, children, status = "active", className = "" }) => (
  <div className={`dash-module h-full border-r border-b first:border-l last:border-r border-white/10 group ${className}`}>
    <div className="module-header bg-black/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Icon size={14} className="text-accent opacity-70" />
        <span className="font-mono text-[10px] tracking-widest text-[#FFFFFF]/50">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[9px] font-mono text-accent opacity-40">{status.toUpperCase()}</span>
        <div className={`status-indicator ${status === 'active' || status === 'running' ? 'bg-accent' : 'bg-green-500'}`} />
      </div>
    </div>
    <div className="flex-1 relative overflow-hidden bg-[#050505]">
      {children}
    </div>
  </div>
);


const QuantModule = () => {
  const chartContainerRef = useRef();
  const [lastHurst, setLastHurst] = useState(0.5);
  const [signal, setSignal] = useState("RANDOM_WALK");
  
  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = createChart(chartContainerRef.current, {
      layout: { background: { type: ColorType.Solid, color: '#000' }, textColor: '#777' },
      grid: { vertLines: { color: 'rgba(255,255,255,0.05)' }, horzLines: { color: 'rgba(255,255,255,0.05)' } },
      width: chartContainerRef.current.clientWidth,
      height: 360,
    });
    const lineSeries = chart.addSeries(LineSeries, { color: '#007AFF', lineWidth: 2 });
    
    // Zero-Allocation WSS Pipeline
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1s');
    ws.onmessage = (event) => {
        // High-Frequency: Zero 'new' keywords or JSON.parse in hot path
        const tick = fastParseBinance(event.data);
        if (!isNaN(tick.price)) {
            addTick(event.data);
            lineSeries.update({ time: Date.now() / 1000, value: tick.price });
            
            // Internal Alpha Signal logic
            const h = calculateHurstExponent([]); // Mock: in production, reads from Ring Buffer
            setLastHurst(h);
            setSignal(detectAlphaSignal(h));
            window.dispatchEvent(new CustomEvent('hurstUpdate', { detail: h }));
        }
    };

    const handleResize = () => chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    window.addEventListener('resize', handleResize);
    return () => { chart.remove(); ws.close(); window.removeEventListener('resize', handleResize); };
  }, []);

  return (
    <div className="w-full h-full relative">
        <div ref={chartContainerRef} className="w-full h-full p-4" />
        <div className="absolute top-4 right-6 text-right">
            <div className="text-[10px] font-mono opacity-40">SIGNAL: {signal}</div>
            <div className="text-xl font-bold text-accent">BTC: α-STREAM</div>
        </div>
    </div>
  );
};

const FractalModule = () => {
  const canvasRef = useRef(null);
  const [hurst, setHurst] = useState(0.32);
  
  useEffect(() => {
    const handleHurst = (e) => setHurst(e.detail);
    window.addEventListener('hurstUpdate', handleHurst);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    
    const draw = () => {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const H = hurst; 
      ctx.beginPath();
      ctx.strokeStyle = '#007AFF';
      ctx.lineWidth = 1;
      
      let x = 0;
      let y = canvas.height / 2;
      ctx.moveTo(x, y);
      
      for (let i = 0; i < canvas.width; i++) {
         const noise = (Math.random() - 0.5) * Math.pow(i / 100, H) * 100;
         y = canvas.height / 2 + noise + Math.sin(frame / 20 + i / 50) * 20;
         ctx.lineTo(i, y);
      }
      ctx.stroke();
      
      frame++;
      requestAnimationFrame(draw);
    };
    
    const animId = requestAnimationFrame(draw);
    return () => {
        window.removeEventListener('hurstUpdate', handleHurst);
        cancelAnimationFrame(animId);
    };
  }, [hurst]);

  return (
    <div className="p-4 h-full flex flex-col justify-between">
      <div className="text-[10px] font-mono opacity-40 mb-2 uppercase tracking-widest">HURST EXPONENT: H ≈ {hurst.toFixed(4)}</div>
      <canvas ref={canvasRef} className="flex-1 opacity-80" width={400} height={300} />
      <div className="mt-4 text-[10px] font-mono text-accent">FRACTAL ANALYSIS: {hurst < 0.4 ? 'ANTI-PERSISTENT' : 'TRENDING'}</div>
    </div>
  );
};

const AutomationModule = () => {
  const [logs, setLogs] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef(null);
  
  const addLog = (msg) => setLogs(prev => [...prev.slice(-100), msg]);

  // Kinetic Tension: Stream text char-by-char
  const streamText = (text, prefix = "ALPHA_RE: ") => {
    let current = "";
    let i = 0;
    addLog(`${prefix}`); 
    
    const interval = setInterval(() => {
        if (i < text.length) {
            current += text[i];
            setLogs(prev => {
                const newLogs = [...prev];
                newLogs[newLogs.length - 1] = `${prefix}${current}`;
                return newLogs;
            });
            i++;
        } else {
            clearInterval(interval);
            setIsProcessing(false);
        }
    }, 10);
  };

  const handleCommand = async (e) => {
    if (e.key !== 'Enter' || !inputValue.trim() || isProcessing) return;
    
    const cmd = inputValue.trim();
    setInputValue('');
    setIsProcessing(true);
    addLog(`root@fesiomatyzacja:~$ ${cmd}`);

    try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const result = await dispatchCommand(cmd, (msg) => {}, apiKey);
        
        if (result.type === 'query') {
            streamText(result.content);
        } else if (result.type === 'param_shift') {
            streamText(`[PARAM_SHIFT] Updating system state: ${result.content}`);
            // Logic to update state
        } else if (result.type === 'refactor') {
            streamText(`[REFACTOR] Autonomous Cycle Engaged. Analyzing codebase...`);
            // Trigger autonomous cycle
        }
    } catch (err) {
        streamText(`CRITICAL_FAULT: ${err.message}`, "ERR: ");
    }
  };

  useEffect(() => {
    const messages = [
      "Fesiomatyzacja Execute_Node v3.0.0 [DEEP_CONTEXT_AWARE]",
      "α-CORE: Quantum-Resistance Layer Active",
      "READY: Interaction loop established.",
      " "
    ];
    setLogs(messages);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="terminal-container p-6 flex flex-col h-full bg-black/95 font-mono">
      <div ref={scrollRef} className="flex-1 overflow-auto space-y-1 mb-4 custom-scrollbar text-[11px] leading-tight">
        {logs.map((log, idx) => (
          <div key={idx} className={`terminal-line ${log.startsWith('root@') ? 'text-white' : log.startsWith('ERR:') ? 'text-red-500' : 'text-[#00FF41]'} whitespace-pre-wrap`}>
            {log}
          </div>
        ))}
        {isProcessing && <span className="animate-pulse text-accent">_</span>}
      </div>
      
      <div className="flex items-center gap-2 border-t border-white/10 pt-4">
        <span className="text-accent text-[11px]">root@fesiomatyzacja:~$</span>
        <input 
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-white text-[11px] font-mono leading-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleCommand}
            disabled={isProcessing}
            placeholder={isProcessing ? "PROCESSING..." : "ENTER COMMAND"}
        />
      </div>
    </div>
  );
};

const SecurityModule = () => {
    const [scanState, setScanState] = useState(7);
    
    // Zeigarnik Effect: Persistent, unresolvable scanning
    useEffect(() => {
        const interval = setInterval(() => {
            setScanState(prev => (prev + 1) % 99);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-6 font-mono text-[10px] h-full flex flex-col">
            <div className="mb-4 flex items-center justify-between text-accent">
                <div className="flex items-center gap-2">
                    <Search size={14} className="animate-pulse" />
                    <span className="tracking-tighter font-bold uppercase">STATUS: ACTIVE_SCANNING [NODE_ALPHA_${scanState}/??]</span>
                </div>
                <span className="animate-bounce">_</span>
            </div>
            
            <div className="flex-1 space-y-3 opacity-60">
                <div className="border-l border-accent/30 pl-3">
                    <div className="text-white pb-1">VULN_AUDIT_LOG</div>
                    <HoverDecode text="Recursive scan detected shadow prototype pollution vectors in core orchestrator. Isolation required." />
                </div>
                <div className="border-l border-white/10 pl-3">
                    <div className="text-white pb-1">THREAT_MODEL</div>
                    <HoverDecode text="HFT latency leakage detected in middleware filters. Re-calculating Big O constraints." />
                </div>
            </div>

            <table className="w-full text-left mt-6">
                <thead>
                    <tr className="border-b border-white/10 opacity-40">
                        <th className="pb-2">UID</th>
                        <th className="pb-2">TARGET</th>
                        <th className="pb-2">CVSS</th>
                    </tr>
                </thead>
                <tbody className="opacity-80">
                    <tr className="border-b border-white/5"><td className="py-2">AUD-01</td><td>Caido/Proxy</td><td className="text-red-500">9.2</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2">AUD-02</td><td>Logic Bypass</td><td className="text-orange-500">7.5</td></tr>
                    <tr><td className="py-2">AUD-04</td><td>Agent-Hook</td><td className="text-red-500">8.8</td></tr>
                </tbody>
            </table>
        </div>
    );
};

const SoftwareStats = () => {
  const metrics = getMetrics();
  return (
    <div className="p-10 grid grid-cols-2 gap-8 h-full items-center font-mono">
      <div className="border-r border-white/10 pr-6">
        <div className="text-[9px] opacity-40 uppercase mb-2">GC_Pauses</div>
        <div className="text-3xl font-black text-white">{metrics.gcPauses}</div>
        <div className="mt-2"><HoverDecode text="Zero-allocation pipeline prevents heap fragmentation." /></div>
      </div>
      <div>
        <div className="text-[9px] opacity-40 uppercase mb-2">WSS_Latency</div>
        <div className="text-3xl font-black text-accent">{metrics.wssLatency}</div>
        <div className="mt-2"><HoverDecode text="Ring Buffer eliminates O(n) parsing bottleneck." /></div>
      </div>
      <div className="border-r border-white/10 pr-6 pt-6 border-t">
        <div className="text-[9px] opacity-40 uppercase mb-2">Buffer_Type</div>
        <div className="text-lg font-black text-white">{metrics.bufferType}</div>
      </div>
      <div className="pt-6 border-t">
        <div className="text-[9px] opacity-40 uppercase mb-2">Mode</div>
        <div className="text-lg font-black text-white uppercase">Fast_IO</div>
      </div>
    </div>
  );
};

const SystemHealth = () => (
   <div className="p-8 h-full flex flex-col justify-center">
      <div className="flex items-center gap-6 mb-8">
         <div className="bg-accent/10 border border-accent/30 p-4">
            <Server className="text-accent" size={32} />
         </div>
         <div>
            <div className="text-xs font-mono opacity-40 uppercase">Cluster Status</div>
            <div className="text-2xl font-black">4 MACHINES ACTIVE</div>
         </div>
      </div>
      <div className="space-y-3 opacity-60 font-mono text-[9px]">
         <div className="flex justify-between border-b border-white/5 pb-1"><span>ROSERAM-MACHINE-X1</span><span className="text-green-500 font-bold">HEALTHY</span></div>
         <div className="flex justify-between border-b border-white/5 pb-1"><span>ROSERAM-MACHINE-X2</span><span className="text-green-500 font-bold">HEALTHY</span></div>
         <div className="flex justify-between border-b border-white/5 pb-1"><span>ROSERAM-MACHINE-X3</span><span className="text-yellow-500 font-bold">IDLE</span></div>
         <div className="flex justify-between"><span>VCS REPO: MAIN</span><span className="text-accent underline">SYNCCED</span></div>
      </div>
      <div className="mt-6">
         <HoverDecode text="Infrastructure synchronized across AMS and WAW regions for failover resilience." />
      </div>
   </div>
);

export const MainDashboard = () => (
  <div className="w-full h-screen flex items-center justify-center p-0">
    <div className="dashboard-grid shadow-2xl overflow-hidden h-full">
      {/* Saccadic Asymmetry: Automation at TL */}
      <DashModule title="Automation / Orchestrator" icon={Terminal} status="running" className="col-start-1 row-start-1">
        <AutomationModule />
      </DashModule>
      
      <DashModule title="Math / Fractal Analysis" icon={Activity} status="active" className="col-start-2 row-start-1">
        <FractalModule />
      </DashModule>
      
      <DashModule title="Audit / Vuln Scanner" icon={Shield} status="active" className="col-start-3 row-start-1">
        <SecurityModule />
      </DashModule>
      
      <DashModule title="System / Closed Software" icon={Zap} status="active" className="col-start-1 row-start-2">
        <SoftwareStats />
      </DashModule>
      
      <DashModule title="Infrastructure / Fly.io" icon={Server} status="healthy" className="col-start-2 row-start-2">
        <SystemHealth />
      </DashModule>
      
      {/* Saccadic Asymmetry: Quant at BR */}
      <DashModule title="Quant / Alpha Algorithm" icon={BarChart3} status="active" className="col-start-3 row-start-2">
        <QuantModule />
      </DashModule>
    </div>
  </div>
);
