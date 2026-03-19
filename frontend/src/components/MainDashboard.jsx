import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, LineSeries } from 'lightweight-charts';
import { Activity, Shield, Terminal, Zap, Server, BarChart3 } from 'lucide-react';

const DashModule = ({ title, icon: Icon, children, status = "active" }) => (
  <div className="dash-module h-full border-r border-b first:border-l last:border-r border-white/10 group">
    <div className="module-header bg-black/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Icon size={14} className="text-accent opacity-70" />
        <span className="font-mono text-[10px] tracking-widest text-[#FFFFFF]/50">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[9px] font-mono text-accent opacity-40">{status.toUpperCase()}</span>
        <div className={`status-indicator ${status === 'active' ? 'bg-accent' : 'bg-green-500'}`} />
      </div>
    </div>
    <div className="flex-1 relative overflow-hidden bg-[#050505]">
      {children}
    </div>
  </div>
);

const QuantModule = () => {
  const chartContainerRef = useRef();
  
  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = createChart(chartContainerRef.current, {
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: '#94a3b8' },
      grid: { vertLines: { color: 'rgba(255, 255, 255, 0.05)' }, horzLines: { color: 'rgba(255, 255, 255, 0.05)' } },
      width: chartContainerRef.current.clientWidth,
      height: 360,
      timeScale: { visible: false }
    });
    
    const lineSeries = chart.addSeries(LineSeries, { color: '#007AFF', lineWidth: 2 });
    
    // Simulate Alpha Algorithm
    const generateData = () => {
      let val = 100;
      return Array.from({ length: 100 }, (_, i) => {
        val += (Math.random() - 0.45) * 5; // Slight upward bias (Alpha)
        return { time: i, value: val };
      });
    };
    
    lineSeries.setData(generateData());
    
    const handleResize = () => chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    window.addEventListener('resize', handleResize);
    return () => { chart.remove(); window.removeEventListener('resize', handleResize); };
  }, []);

  return <div ref={chartContainerRef} className="w-full h-full p-4" />;
};

const FractalModule = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    
    const draw = () => {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const H = 0.32; // Hurst Exponent
      ctx.beginPath();
      ctx.strokeStyle = '#007AFF';
      ctx.lineWidth = 1;
      
      let x = 0;
      let y = canvas.height / 2;
      ctx.moveTo(x, y);
      
      for (let i = 0; i < canvas.width; i++) {
         // Fractal noise simulation
         const noise = (Math.random() - 0.5) * Math.pow(i / 100, H) * 50;
         y = canvas.height / 2 + noise + Math.sin(frame / 20 + i / 50) * 20;
         ctx.lineTo(i, y);
      }
      ctx.stroke();
      
      frame++;
      requestAnimationFrame(draw);
    };
    
    draw();
  }, []);

  return (
    <div className="p-4 h-full flex flex-col justify-between">
      <div className="text-[10px] font-mono opacity-40 mb-2">HURST EXPONENT: H ≈ 0.32</div>
      <canvas ref={canvasRef} className="flex-1 opacity-80" width={400} height={300} />
      <div className="mt-4 text-[10px] font-mono text-accent">FRACTAL ANALYSIS: COLD_DYNAMIC_MODE</div>
    </div>
  );
};

const AutomationModule = () => {
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    const messages = [
      "SYSTEM: Initializing Fesiomatyzacja-Engine v2.1.0",
      "QUANT: α-strategy loading sequence [OK]",
      "AGENT: Web3Forms initialized at /api/submit",
      "CI/CD: Fly.io machine monitoring active",
      "AUTH: GPG integrity verified",
      "HFT: Execution target set to <1ms",
      "ORCHESTRATOR: Running α-orchestrator.js",
      "SYSTEM: System status [GREEN]"
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      setLogs(prev => [...prev.slice(-10), messages[i % messages.length]]);
      i++;
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="terminal-container p-6">
      {logs.map((log, idx) => (
        <div key={idx} className="terminal-line opacity-80 animate-in fade-in slide-in-from-left-4 text-[#00FF41]">
          {log}
        </div>
      ))}
    </div>
  );
};

const SecurityAuditTable = () => (
  <div className="p-6 font-mono text-[10px] overflow-auto">
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-white/10 opacity-40">
          <th className="pb-2">UID</th>
          <th className="pb-2">TARGET</th>
          <th className="pb-2">CVSS v4</th>
          <th className="pb-2">STATUS</th>
        </tr>
      </thead>
      <tbody className="opacity-80">
        <tr className="border-b border-white/5"><td className="py-2">AUD-01</td><td>Caido/Proxy</td><td className="text-red-500">9.2</td><td>RESOLVED</td></tr>
        <tr className="border-b border-white/5"><td className="py-2">AUD-02</td><td>Logic Bypass</td><td className="text-orange-500">7.5</td><td>PATCHED</td></tr>
        <tr className="border-b border-white/5"><td className="py-2">AUD-03</td><td>Burp Ext</td><td className="text-yellow-500">6.1</td><td>VERIFIED</td></tr>
        <tr><td className="py-2">AUD-04</td><td>Agent-Hook</td><td className="text-red-500">8.8</td><td>MONITORING</td></tr>
      </tbody>
    </table>
  </div>
);

const SoftwareStats = () => (
  <div className="p-10 grid grid-cols-2 gap-8 h-full items-center">
    <div className="text-center border-r border-white/10">
      <div className="text-[9px] font-mono opacity-40 uppercase mb-2">HFT Uptime</div>
      <div className="text-3xl font-black text-white px-2">99.998%</div>
    </div>
    <div className="text-center">
      <div className="text-[9px] font-mono opacity-40 uppercase mb-2">Avg. Latency</div>
      <div className="text-3xl font-black text-accent px-2">&lt; 0.82ms</div>
    </div>
    <div className="text-center border-r border-white/10">
      <div className="text-[9px] font-mono opacity-40 uppercase mb-2">Agent Throughput</div>
      <div className="text-3xl font-black text-white px-2">412 GB/s</div>
    </div>
    <div className="text-center">
      <div className="text-[9px] font-mono opacity-40 uppercase mb-2">Cold Start</div>
      <div className="text-3xl font-black text-white px-2">1.4s</div>
    </div>
  </div>
);

const SystemHealth = () => (
   <div className="p-8 h-full flex flex-col justify-center">
      <div className="flex items-center gap-6 mb-8">
         <div className="bg-accent/10 border border-accent/30 p-4">
            <Server className="text-accent" size={32} />
         </div>
         <div>
            <div className="text-xs font-mono opacity-40">FLY.IO ORCHESTRATOR</div>
            <div className="text-2xl font-black">4 MACHINES ACTIVE</div>
         </div>
      </div>
      <div className="space-y-3 opacity-60 font-mono text-[9px]">
         <div className="flex justify-between border-b border-white/5 pb-1"><span>ROSERAM-MACHINE-X1</span><span className="text-green-500">HEALTHY</span></div>
         <div className="flex justify-between border-b border-white/5 pb-1"><span>ROSERAM-MACHINE-X2</span><span className="text-green-500">HEALTHY</span></div>
         <div className="flex justify-between border-b border-white/5 pb-1"><span>ROSERAM-MACHINE-X3</span><span className="text-yellow-500">IDLE</span></div>
         <div className="flex justify-between"><span>REPO: FESIOMATYZACJA</span><span className="text-accent">SYNCCED</span></div>
      </div>
   </div>
);

export const MainDashboard = () => (
  <div className="w-full flex items-center justify-center py-20 px-6">
    <div className="dashboard-grid shadow-2xl overflow-hidden">
      <DashModule title="Quant / Alpha Algorithm" icon={BarChart3} status="active">
        <QuantModule />
      </DashModule>
      
      <DashModule title="Math / Fractal Fractal" icon={Activity} status="active">
        <FractalModule />
      </DashModule>
      
      <DashModule title="Automation / Orchestrator" icon={Terminal} status="running">
        <AutomationModule />
      </DashModule>
      
      <DashModule title="Audit / Vuln Scanner" icon={Shield} status="active">
        <SecurityAuditTable />
      </DashModule>
      
      <DashModule title="System / Closed Software" icon={Zap} status="active">
        <SoftwareStats />
      </DashModule>
      
      <DashModule title="Infrastructure / Fly.io" icon={Server} status="healthy">
        <SystemHealth />
      </DashModule>
    </div>
  </div>
);
