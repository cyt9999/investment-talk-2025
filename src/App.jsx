import React, { useState, useRef, useEffect } from 'react';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Award, 
  Rocket, 
  ShieldCheck, 
  Activity, 
  Lock, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight,
  Bell,
  Search,
  Crown,
  PlayCircle,
  Mic,
  Zap,
  BarChart3
} from 'lucide-react';

const App = () => {
  const [activeScreen, setActiveScreen] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [displayBeta, setDisplayBeta] = useState(0);
  const [displayROI, setDisplayROI] = useState(0);
  const scrollRef = useRef(null);

  // 顏色配置
  const colors = {
    primary: '#95B1FF',
    primaryGradient: 'linear-gradient(135deg, #95B1FF 0%, #346AFF 100%)',
    bg: '#141414',
    bg2: '#1a1a1a',
    card: '#242424',
    line: '#404040',
  };

  // 數值跳動動畫邏輯
  useEffect(() => {
    // Screen 1: Overall (Index 0)
    if (activeScreen === 0) { 
      animateValue(0, 27.78, setDisplayROI, 1000);
    }
    // Screen 6: Beta & CTA (Index 5)
    if (activeScreen === 5) { 
      animateValue(0, 1.26, setDisplayBeta, 1000);
    }
  }, [activeScreen]);

  const animateValue = (start, end, setter, duration) => {
    let current = start;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setter(end);
        clearInterval(timer);
      } else {
        setter(Number(current.toFixed(2)));
      }
    }, 16);
  };

  // 分頁邏輯
  const nextScreen = () => {
    if (activeScreen < screens.length - 1) setActiveScreen(activeScreen + 1);
  };

  const prevScreen = () => {
    if (activeScreen > 0) setActiveScreen(activeScreen - 1);
  };

  // 手勢處理
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    if (distance > 70) nextScreen();
    if (distance < -70) prevScreen();
    setTouchStart(null);
  };

  // 切換分頁時滾動回頂部
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [activeScreen]);

  const screens = [
    // 1. Overall (2025 回顧總覽) - Simplified
    {
      id: 'overall',
      content: (
        <div className="flex flex-col min-h-full pb-10 fade-in">
          <div className="mt-12 mb-6">
            <span className="text-sm font-bold px-4 py-2 rounded-full border border-[#404040] text-white tracking-widest uppercase bg-[#282828] shadow-sm">
              2025 Performance Review
            </span>
          </div>
          <h1 className="text-5xl font-black mb-2 text-white leading-tight">超越大盤的</h1>
          <h1 className="text-5xl font-black mb-10" style={{ background: colors.primaryGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            邏輯勝利
          </h1>

          {/* Talk ROI */}
          <div className="bg-[#242424] rounded-[40px] p-8 mb-6 border border-white/5 relative overflow-hidden shadow-2xl scale-in">
            <div className="absolute -top-10 -right-10 opacity-5">
               <TrendingUp size={200} color={colors.primary} />
            </div>
            <p className="text-[#B0B0B0] text-base mb-2 font-medium">Talk 君年度回報 (ROI)</p>
            <h2 className="text-7xl font-black text-white mb-2 tracking-tighter">+{displayROI.toFixed(2)}%</h2>
            <div className="w-full h-1.5 bg-[#404040] rounded-full mt-4 overflow-hidden">
               <div className="h-full bg-primary-gradient" style={{ width: '100%' }}></div>
            </div>
          </div>

          {/* S&P 500 Comparison */}
          <div className="bg-[#1a1a1a] rounded-[32px] p-8 border border-white/5 slide-up" style={{ animationDelay: '0.2s' }}>
             <div className="flex justify-between items-end mb-2">
                <div>
                   <p className="text-[#B0B0B0] text-base font-medium mb-1">S&P 500 指數</p>
                   <h2 className="text-4xl font-black text-[#808080] tracking-tighter">+17.88%</h2>
                </div>
                <BarChart3 size={40} className="text-[#404040] mb-2" />
             </div>
             <div className="w-full h-1.5 bg-[#404040] rounded-full mt-2 overflow-hidden">
                {/* 17.88 / 27.78 approx 64% width relative to Talk */}
               <div className="h-full bg-[#808080]" style={{ width: '64%' }}></div>
            </div>
          </div>
        </div>
      )
    },

    // 2. 2025 智慧軌跡 (Talk 君怎麼做)
    {
      id: 'trajectory',
      content: (
        <div className="flex flex-col min-h-full pb-10">
          <div className="fade-in mt-6">
            <h2 className="text-3xl font-black text-white mb-3 flex items-center gap-3">
              <Calendar size={32} color={colors.primary} />
              2025 智慧軌跡
            </h2>
            <p className="text-[#B0B0B0] text-base mb-10 leading-relaxed">對齊宏觀數據發布與核心決策</p>
          </div>
          <div className="space-y-12 pl-4 relative">
            <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#95B1FF] to-transparent"></div>
            {[
              { date: '01/01', tag: '策略定調', title: '降 Beta 至 1.0', desc: '預判盈餘驅動年，追求穩健 EPS 成長。', color: colors.primary },
              { date: '04/09', tag: '解放日', title: '關稅風暴：左側加倉', desc: '堅定不交籌碼，加倉 QQQ 與特斯拉。', color: '#FF8A8A' },
              { date: '07/22', tag: '獲利了結', title: 'GE 獲利獲利了結，佈局能源', desc: '利潤近 100% 後調倉。AI 的盡頭是能源。', color: colors.primary },
              { date: '08/01', tag: '數據修正', title: '非農暴雷：對沖啟動', desc: '判斷降息空間足，持倉未動應對震盪。', color: '#ADC4FF' },
              { date: '11/24', tag: '對沖啟動', title: 'Beta 壓降應對 2026', desc: '熱度衝破 64% 啟動對沖，鎖定全年利潤。', color: colors.primary }
            ].map((item, idx) => (
              <div key={idx} className="relative pl-12 slide-up opacity-0" style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: 'forwards' }}>
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-[#141414] z-10 flex items-center justify-center shadow-lg" style={{ backgroundColor: item.color }}>
                   <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-sm font-black" style={{ color: item.color }}>{item.date}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#404040] text-white font-bold uppercase">{item.tag}</span>
                </div>
                <h3 className="text-white font-bold text-xl mb-1">{item.title}</h3>
                <p className="text-[#B0B0B0] text-base leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },

    // 3. 交易實錄 (用案例證明)
    {
      id: 'trading',
      content: (
        <div className="flex flex-col min-h-full pb-10">
          <div className="fade-in mt-6">
            <h2 className="text-3xl font-black text-white mb-3 flex items-center gap-3">
              <Award size={32} color={colors.primary} />
              英雄交易實錄
            </h2>
            <p className="text-[#B0B0B0] text-base mb-8">數據定義 Alpha，邏輯驅動獲利</p>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-1">
            {[
              { 
                code: 'GE', name: '奇異航太', 
                roi: '+99.9%', 
                op: '均價 $128.80 ➡️ 11/17 $257.50 結算', 
                comment: '「航天行業幾乎無競爭對手，服務營收穩定。」',
                metric: '關鍵指標：服務營收佔比 / 寡佔定價權' 
              },
              { 
                code: 'INTC', name: '英特爾', 
                roi: '+51.7%', 
                op: '7/25 入場 $20.60 ➡️ 均價 $22.64 ➡️ 年底 $34.35', 
                comment: '「基本面展露逆境反轉，台海風險的對沖資產。」',
                metric: '關鍵指標：P/B Ratio 歷史低位 / 營收轉折點' 
              },
              { 
                code: 'AMZN', name: '亞馬遜', 
                roi: '+22.8%', 
                op: '10/06 入場 $171.70 ➡️ 均價 $176.76 ➡️ 年底 $217', 
                comment: '「AWS利潤率被低估，兩架馬車並進。」',
                metric: '關鍵指標：AWS Operating Margin' 
              },
              { 
                code: 'TSLA', name: '特斯拉', 
                roi: '+23.5%', 
                op: '底層策略入場 $220.00 ➡️ 均價 $247.00 ➡️ 年底 $305', 
                comment: '「自動駕駛的唯一股，堅守 FSD 信念。」',
                metric: '關鍵指標：FSD 滲透率 / 算力基礎設施化' 
              }
            ].map((stock, idx) => (
              <div key={idx} className="bg-[#242424] border border-white/5 rounded-[32px] p-7 shadow-xl slide-up opacity-0" style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: 'forwards' }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <span className="text-sm px-3 py-1 rounded-xl bg-black text-[#95B1FF] font-black border border-white/10 uppercase tracking-widest">{stock.code}</span>
                    <span className="text-white font-black text-xl">{stock.name}</span>
                  </div>
                  <p className="text-3xl font-black italic text-[#95B1FF]">{stock.roi}</p>
                </div>
                
                <p className="text-[#95B1FF] text-sm font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                   <Activity size={14} /> {stock.metric}
                </p>
                
                <div className="mb-5 bg-black/60 p-5 rounded-2xl border-2 border-white/5 shadow-inner">
                  <p className="text-white text-lg font-black leading-relaxed">{stock.op}</p>
                </div>
                
                <p className="text-[#B0B0B0] text-base italic leading-relaxed border-l-2 border-[#95B1FF]/30 pl-4">“{stock.comment}”</p>
              </div>
            ))}
          </div>
        </div>
      )
    },

    // 4. 2025 APP 迭代
    {
      id: 'app-iteration',
      content: (
        <div className="flex flex-col min-h-full pb-10">
          <div className="fade-in mt-6">
            <h2 className="text-3xl font-black text-white mb-3 flex items-center gap-3">
              <Rocket size={32} color={colors.primary} />
              2025 功能回顧
            </h2>
            <p className="text-[#B0B0B0] text-base mb-10 leading-relaxed">工欲善其事，必先利其器</p>
          </div>
          <div className="space-y-8 flex-1 overflow-y-auto custom-scrollbar pr-1">
            {[
              { date: '2025/05', title: 'App 正式上線', desc: '核心觀點、五大清單系統同步啟動。' },
              { date: '2025/08', title: '量化監測體系', desc: '情緒指標、趨勢圖、Beta 計算機。', highlight: true },
              { date: '2025/11', title: '全維數據集成', desc: '文字聊天室、大盤看板、板塊 ETF。' },
              { date: '2025/12', title: '多媒體內容化', desc: '語音直播與回放、個股即時新聞。' }
            ].map((item, idx) => (
              <div key={idx} className={`bg-[#242424] rounded-[32px] overflow-hidden border transition-all slide-up opacity-0 ${item.highlight ? 'border-[#95B1FF]/50' : 'border-white/5'}`} style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'forwards' }}>
                <div className="p-6">
                  <p className="text-[#95B1FF] text-xs font-black mb-1">{item.date}</p>
                  <h4 className="text-white font-black text-xl mb-1">{item.title}</h4>
                  <p className="text-[#B0B0B0] text-base">{item.desc}</p>
                </div>
              </div>
            ))}
            
            {/* Q4 Stats */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#282828] p-8 rounded-[40px] border-2 border-[#95B1FF]/30 shadow-2xl fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center gap-2">
                    <Mic size={20} className="text-[#95B1FF]" />
                    <h4 className="text-white font-black text-xl uppercase tracking-widest">Q4 實績</h4>
                 </div>
                 <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded uppercase font-black">Verified</span>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-black/50 p-5 rounded-3xl border border-white/5 text-center">
                  <p className="text-[#95B1FF] text-3xl font-black mb-1">3 場</p>
                  <p className="text-[#B0B0B0] text-xs uppercase font-bold">語音直播</p>
                </div>
                <div className="bg-black/50 p-5 rounded-3xl border border-white/5 text-center">
                  <p className="text-white text-3xl font-black mb-1">86 篇</p>
                  <p className="text-[#B0B0B0] text-xs uppercase font-bold">專屬貼文</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // 5. 2026 重大事件行事曆 (原 Outlook)
    {
      id: '2026-calendar',
      content: (
        <div className="flex flex-col min-h-full pb-10">
          <div className="fade-in mt-6">
            <h2 className="text-3xl font-black text-white mb-3 flex items-center gap-3">
               <Activity size={32} color={colors.primary} />
               2026 關鍵時刻
            </h2>
            <p className="text-[#B0B0B0] text-base mb-10 leading-relaxed">從「盈餘驅動」轉向「政策驅動」的行事曆</p>
          </div>
          <div className="space-y-10">
            {[
              { id: 1, title: '聯準會主席變更', desc: '新舊交接期的政策連續性與不確定性將是核心。', img: 'https://images.pexels.com/photos/2862155/pexels-photo-2862155.jpeg' },
              { id: 2, title: '失業率與軟著陸', desc: '正式驗證美國經濟是否能在高利率下軟著陸。', img: 'https://images.pexels.com/photos/52608/pexels-photo-52608.jpeg' },
              { id: 3, title: '策略性壓降 Beta', desc: '計畫將組合 Beta 回歸 1.0，以防禦姿態等待。', img: 'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg' }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#242424] rounded-[32px] overflow-hidden border border-white/5 shadow-xl slide-up opacity-0" style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: 'forwards' }}>
                <img src={item.img} alt={item.title} className="h-48 w-full object-cover opacity-60" />
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#95B1FF] text-black font-black flex items-center justify-center">{item.id}</div>
                    <h4 className="text-white text-xl font-black">{item.title}</h4>
                  </div>
                  <p className="text-[#B0B0B0] text-base leading-relaxed pl-14">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },

    // 6. Beta Value & CTA (Combined)
    {
      id: 'beta-cta',
      content: (
        <div className="flex flex-col min-h-full pb-10">
          <div className="fade-in mt-6">
            <h2 className="text-3xl font-black text-white mb-3 flex items-center gap-3">
              <ShieldCheck size={32} color={colors.primary} />
              Beta 風險控管
            </h2>
            <p className="text-[#B0B0B0] text-base mb-8 leading-relaxed">你的帳戶準備好迎接 2026 了嗎？</p>
          </div>

          {/* Gauge Visualization */}
          <div className="bg-[#242424] rounded-[40px] p-8 border border-white/5 flex flex-col items-center mb-8 shadow-2xl relative overflow-hidden scale-in">
            <div className="relative w-56 h-56 mb-4">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#2a2a2a" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke={colors.primary} strokeWidth="8" strokeDasharray={`${(displayBeta / 1.5) * 282} 282`} style={{ transition: 'stroke-dasharray 1s ease-out' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                <p className="text-[#B0B0B0] text-sm mb-1">Talk 君 Beta</p>
                <p className="text-white text-6xl font-black tracking-tighter">{displayBeta.toFixed(2)}</p>
                <p className="text-[#95B1FF] text-xs font-black mt-2 uppercase tracking-widest bg-[#95B1FF]/10 px-3 py-1 rounded-full">Defense Mode</p>
              </div>
            </div>
            
            <div className="bg-[#141414] rounded-3xl p-6 w-full flex items-center gap-4 slide-up" style={{ animationDelay: '0.3s' }}>
               <Zap size={24} className="text-[#95B1FF] shrink-0" />
               <p className="text-[#E0E0E0] text-sm leading-relaxed">
                 面對變數，我們將 Beta 降至 <span className="text-[#95B1FF] font-bold">1.26</span>，你呢？
               </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-auto space-y-4 fade-in" style={{ animationDelay: '0.6s' }}>
            <button className="w-full py-7 rounded-[32px] font-black text-2xl text-white bg-primary-gradient shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
               立即測算我的 Beta
               <ChevronRight size={24} />
            </button>
            <button className="w-full py-7 rounded-[32px] font-black text-xl text-[#E0E0E0] border-2 border-white/10 bg-[#242424] active:scale-95 transition-all flex items-center justify-center gap-3">
              <Crown size={24} className="text-[#FFD700]" /> 查看 Talk 君完整持倉
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    // 使用 100dvh 確保適配移動端瀏覽器高度
    <div 
      className="w-full h-[100dvh] bg-[#141414] text-[#E0E0E0] font-sans select-none overflow-hidden flex flex-col relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Top Navigation (Moved from bottom) */}
      <div className="fixed top-0 left-0 right-0 z-50 pt-10 pb-6 bg-gradient-to-b from-[#141414] via-[#141414]/90 to-transparent flex justify-center gap-2.5 pointer-events-none">
          {screens.map((_, idx) => (
            <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 shadow-md ${activeScreen === idx ? 'w-10 bg-[#95B1FF]' : 'w-2.5 bg-[#404040]'}`} />
          ))}
      </div>

      {/* 2. Main Content Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 pt-20 pb-8 custom-scrollbar relative">
        <div key={activeScreen} className="min-h-full">
          {screens[activeScreen].content}
        </div>
      </div>

      {/* 3. Bottom Control Panel (Fixed CTA) */}
      <div className="h-32 bg-gradient-to-t from-[#141414] via-[#141414] to-transparent flex flex-col items-center justify-center px-8 pb-4 shrink-0 relative z-[40] border-t border-white/5">
        <div className="w-full flex gap-5">
          <button onClick={prevScreen} disabled={activeScreen === 0} className={`flex-1 py-5 rounded-[24px] border border-white/10 flex items-center justify-center text-white font-black text-lg active:scale-95 transition-all ${activeScreen === 0 ? 'opacity-20 pointer-events-none' : 'bg-[#242424]'}`}>
             <ArrowLeft size={20} className="mr-2" /> 上一頁
          </button>
          <button onClick={nextScreen} disabled={activeScreen === screens.length - 1} className={`flex-1 py-5 rounded-[24px] flex items-center justify-center text-white font-black text-lg active:scale-95 transition-all shadow-lg ${activeScreen === screens.length - 1 ? 'opacity-20 pointer-events-none bg-[#242424]' : 'bg-primary-gradient'}`}>
             下一頁 <ArrowRight size={20} className="ml-2" />
          </button>
        </div>
      </div>

      <style>{`
        .bg-primary-gradient { background: linear-gradient(135deg, #95B1FF 0%, #346AFF 100%); }
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .slide-up { animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        .scale-in { animation: scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default App;
