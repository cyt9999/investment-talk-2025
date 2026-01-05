import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Calendar, 
  ArrowRight, 
  Target, 
  Zap, 
  Lock, 
  BarChart3,
  Clock,
  BrainCircuit,
  ChevronRight,
  Rocket,
  Mic,
  Award,
  Activity,
  History,
  Info,
  Crown,
  Sparkles,
  Search,
  Bell,
  CheckCircle2,
  PlayCircle,
  BarChart
} from 'lucide-react';

const App = () => {
  const [activeScreen, setActiveScreen] = useState(0);

  // 視覺配色方案
  const colors = {
    primary: '#95B1FF',
    primaryGradient: 'linear-gradient(135deg, #95B1FF 0%, #346AFF 100%)',
    bg: '#141414',
    bg2: '#282828', 
    line: '#404040', 
    textSecondary: '#B0B0B0', 
    textSecondary2: '#E0E0E0', 
  };

  const screens = [
    // Screen 1: 年度戰報
    {
      title: "投資Talk君2025年度回顧",
      content: (
        <div className="flex flex-col h-full animate-in fade-in duration-500">
          <div className="mt-8 mb-4">
            <span className="text-sm font-bold px-4 py-1.5 rounded-full border border-[#404040] text-[#E0E0E0] tracking-widest uppercase bg-[#282828]">
              2025 Performance Review
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-1 text-white">超越大盤的</h1>
          <h1 className="text-4xl font-bold mb-8" style={{ background: colors.primaryGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            邏輯勝利
          </h1>

          <div className="bg-[#282828] rounded-3xl p-7 mb-6 border border-[#404040] relative overflow-hidden shadow-2xl">
            <div className="absolute top-[-20px] right-[-20px] opacity-10">
              <TrendingUp size={140} color={colors.primary} />
            </div>
            <p className="text-[#B0B0B0] text-sm mb-2 font-medium">年度投資報酬率 (ROI)</p>
            <h2 className="text-6xl font-bold text-white mb-5">+27.78%</h2>
            <div className="flex items-center gap-2 text-[#95B1FF] font-bold text-base">
              <Target size={18} />
              <span>超額收益 Alpha: +9.90%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-auto pb-6">
            <div className="bg-[#282828] rounded-2xl p-5 border border-[#404040]">
              <p className="text-[#B0B0B0] text-xs mb-1 font-medium">S&P 500 指數</p>
              <p className="text-white text-xl font-bold">+17.88%</p>
            </div>
            <div className="bg-[#282828] rounded-2xl p-5 border border-[#404040]">
              <p className="text-[#B0B0B0] text-xs mb-1 font-medium">勝率信心值</p>
              <p className="text-white text-xl font-bold">84%</p>
            </div>
          </div>
        </div>
      )
    },
    // Screen 2: 2025 智慧軌跡 (恢復完整 5 項) + Nudge
    {
      title: "智慧軌跡",
      content: (
        <div className="flex flex-col h-full pt-4 animate-in slide-in-from-right duration-500">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Calendar size={24} color={colors.primary} />
            2025 美股重大事件回顧
          </h2>
          <p className="text-[#B0B0B0] text-sm mb-8">對齊宏觀數據發布與核心決策</p>
          
          <div className="flex-1 overflow-y-auto space-y-9 pl-4 relative pr-2 custom-scrollbar">
            <div className="absolute left-[15px] top-4 bottom-4 w-[1px] bg-[#404040]"></div>
            {[
              { date: '01/01', tag: '策略定調', title: '降 Beta 至 1.0 進入 2025', desc: '預判 2025 為盈餘驅動年，放棄過度估值擴張，追求穩健 EPS 成長。', color: colors.primary },
              { date: '04/09', tag: '解放日', title: '關稅風暴：左側加倉', desc: '川普政策震盪，堅定不交籌碼，反而帶領粉絲加倉 QQQ 與特斯拉。', color: '#FF8A8A' },
              { date: '07/22', tag: '經濟重置', title: 'GE 獲利獲利了結，佈局能源', desc: '獲利接近 100% 後果斷調倉。AI 盡頭是能源，GEV 成為核心。', color: colors.primary },
              { date: '08/01', tag: '數據修正', title: '非農暴雷：聯準會拖底預期', desc: '就業數據大幅下修，判斷降息空間足以支撐韌性，持倉未動。', color: '#ADC4FF' },
              { date: '11/24', tag: '對沖啟動', title: 'Beta 再次壓降：應對 2026', desc: '市場熱度 64% 啟動對沖。為 2026 宏觀波動提前鎖定利潤。', color: colors.primary }
            ].map((item, idx) => (
              <div key={idx} className="relative pl-12">
                <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-[#141414] z-10 flex items-center justify-center`} style={{ backgroundColor: item.color }}>
                   <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <div className="flex items-center gap-3 mb-1.5">
                  <p className="text-sm font-bold" style={{ color: item.color }}>{item.date}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#404040] text-white font-bold uppercase">{item.tag}</span>
                </div>
                <h3 className="text-white font-bold text-base mb-1">{item.title}</h3>
                <p className="text-[#B0B0B0] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* 固定 Nudge */}
          <div className="mt-4 p-4 rounded-2xl bg-[#95B1FF]/10 border border-[#95B1FF]/30">
            <div className="flex items-center gap-2 mb-2">
              <Bell size={16} className="text-[#95B1FF]" />
              <p className="text-white font-bold text-sm">掌握即時動向</p>
            </div>
            <p className="text-[#B0B0B0] text-xs leading-relaxed">
              每周二四更新 <span className="text-white font-bold">「美股趨勢」</span>、每周五更新 <span className="text-white font-bold">「美股盤勢」</span>，不錯過關鍵進出場訊號。
            </p>
          </div>
        </div>
      )
    },
    // Screen 3: 英雄交易 (修復佈局、強化均價變化) + Nudge
    {
      title: "英雄交易",
      content: (
        <div className="flex flex-col h-full pt-4 animate-in fade-in duration-500">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Award size={24} color={colors.primary} />
            投資Talk君交易實錄
          </h2>
          <p className="text-[#B0B0B0] text-sm mb-6">公開2025重點持倉</p>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
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
                comment: '「AWS利潤率被低估，電商與雲服務兩架馬車並進。」',
                metric: '關鍵指標：AWS Operating Margin / 電商 Margin' 
              },
              { 
                code: 'TSLA', name: '特斯拉', 
                roi: '+23.5%', 
                op: '底層策略入場 $220.00 ➡️ 均價 $247.00 ➡️ 年底 $305', 
                comment: '「自動駕駛的唯一股，堅守 FSD 信念。」',
                metric: '關鍵指標：FSD 滲透率 / 算力基礎設施化' 
              }
            ].map((stock, idx) => (
              <div key={idx} className="bg-[#282828] border border-[#404040] rounded-2xl p-5 shadow-lg relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded bg-[#404040] text-[#95B1FF] font-black">{stock.code}</span>
                    <span className="text-white font-bold text-base">{stock.name}</span>
                  </div>
                  <p className="text-2xl font-black italic" style={{ color: colors.primary }}>{stock.roi}</p>
                </div>
                
                {/* 重要數據優先 */}
                <div className="mb-4 bg-[#1a1a1a] p-3 rounded-xl border border-[#404040]">
                  <p className="text-[#95B1FF] text-[10px] font-black uppercase tracking-widest mb-1">{stock.metric}</p>
                  <p className="text-white text-xs font-bold leading-relaxed">{stock.op}</p>
                </div>

                {/* 發言次之 */}
                <p className="text-[#B0B0B0] text-sm italic mb-1 leading-relaxed">“{stock.comment}”</p>
              </div>
            ))}
          </div>

          {/* 固定 Nudge (P3 固定下方) */}
          <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2 text-[#95B1FF]">
              <Search size={16} />
              <p className="text-white font-bold text-sm">解鎖完整實踐路徑</p>
            </div>
            <p className="text-[#B0B0B0] text-xs leading-relaxed">
              升級付費在 <span className="text-white font-bold">持倉清單</span> 中看 Talk 君的持倉均價、買進賣出動態與詳細調整邏輯。
            </p>
          </div>
        </div>
      )
    },
    // Screen 4: 2025 重大功能回顧 (回滾上一版)
    {
      title: "功能回顧",
      content: (
        <div className="flex flex-col h-full pt-4 animate-in slide-in-from-bottom duration-500">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Rocket size={24} color={colors.primary} />
            2025 重大功能回顧
          </h2>
          <p className="text-[#B0B0B0] text-sm mb-6">不懈疊代，打造實用的投資工具</p>
          
          <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
            <div className="space-y-4">
              {[
                { date: '2025/05', title: '產品正式上線', desc: '核心觀點、五大清單系統啟動。' },
                { date: '2025/08', title: '量化監測體系', desc: '市場情緒指標、歷史趨勢圖表、Beta 計算機。', highlight: true },
                { date: '2025/11', title: '全維數據集成', desc: '文字聊天室、即時美股大盤、持倉均價、板塊 ETF。' },
                { date: '2025/12', title: '內容多媒體化', desc: '語音直播與回放、個股即時新聞集成。' }
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border transition-all ${item.highlight ? 'border-[#95B1FF]/50 bg-[#95B1FF]/5' : 'border-[#404040] bg-[#282828]'}`}>
                  <p className="text-[#95B1FF] text-xs font-black mb-1">{item.date}</p>
                  <h4 className="text-white font-bold text-base mb-1">{item.title}</h4>
                  <p className="text-[#B0B0B0] text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Q4 及年度統計數據 */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#282828] p-5 rounded-3xl border-2 border-white/10 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Mic size={18} className="text-[#95B1FF]" />
                  <p className="text-white font-black text-sm uppercase tracking-widest">Q4 實績</p>
                </div>
                <div className="bg-white text-[#141414] text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">Content Stats</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-[#141414] p-3 rounded-2xl border border-[#404040] text-center">
                  <p className="text-white text-xl font-black mb-1">3 場</p>
                  <p className="text-[#B0B0B0] text-[10px] uppercase">語音直播</p>
                </div>
                <div className="bg-[#141414] p-3 rounded-2xl border border-[#404040] text-center">
                  <p className="text-white text-xl font-black">86 篇</p>
                  <p className="text-[#B0B0B0] text-[10px] uppercase">獨家貼文</p>
                </div>
              </div>

              <div className="p-3 bg-[#95B1FF]/20 rounded-xl border border-[#95B1FF]/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <PlayCircle size={14} className="text-[#95B1FF]" />
                   <p className="text-white text-xs font-bold">1/9 直播預告：非農就業報告剖析</p>
                </div>
                <ChevronRight size={14} className="text-[#95B1FF]" />
              </div>
            </div>
            
            {/* Roadmap */}
            <div className="text-center pt-2 pb-6">
              <p className="text-[#B0B0B0] text-[10px] uppercase tracking-widest mb-1 opacity-50">即將上線</p>
              <div className="flex justify-center gap-4">
                <p className="text-white font-bold text-xs flex items-center gap-1"><Calendar size={12} /> 美股事件行事曆</p>
                <p className="text-white font-bold text-xs flex items-center gap-1"><Zap size={12} /> 計算機 2.0</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    // Screen 5: Beta 控管 (經典儀表板)
    {
      title: "Beta 控管",
      content: (
        <div className="flex flex-col h-full pt-4 animate-in fade-in duration-500">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <ShieldCheck size={24} color={colors.primary} />
            波動率的馴服者
          </h2>
          <p className="text-[#B0B0B0] text-sm mb-8">高手與散戶的分水嶺：Beta 控管</p>
          
          <div className="bg-[#282828] rounded-3xl p-8 border border-[#404040] flex flex-col items-center mb-8 shadow-2xl relative overflow-hidden">
            <div className="relative w-48 h-48 mb-4">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#404040" strokeWidth="10" strokeDasharray="141 282" />
                <circle cx="50" cy="50" r="45" fill="none" stroke={colors.primary} strokeWidth="10" strokeDasharray="120 282" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                <p className="text-[#B0B0B0] text-xs">組合實時 Beta</p>
                <p className="text-white text-4xl font-black">1.26</p>
                <p className="text-[#95B1FF] text-xs font-bold mt-1">防禦對應中</p>
              </div>
            </div>
            
            <div className="flex items-center gap-8 w-full justify-center">
              <div className="text-center">
                <p className="text-[#B0B0B0] text-xs mb-1">對沖前</p>
                <p className="text-white text-xl font-bold">1.50</p>
              </div>
              <ArrowRight size={20} color={colors.line2} />
              <div className="text-center">
                <p className="text-[#B0B0B0] text-xs mb-1">對沖後</p>
                <p className="text-white text-xl font-bold">1.26</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#282828] rounded-2xl p-5 border-l-4 border-[#346AFF] shadow-lg">
            <div className="flex gap-3">
              <Zap size={22} color="#346AFF" className="shrink-0" />
              <p className="text-[#E0E0E0] text-sm leading-relaxed">
                <span className="text-white font-bold">SOXL ➡️ SOXS 切換：</span>
                在市場參與度達 64% 時啟動對沖，鎖定了核心持倉超過 50% 的利潤增長。
              </p>
            </div>
          </div>
        </div>
      )
    },
    // Screen 6: 2026 展望
    {
      title: "2026 展望",
      content: (
        <div className="flex flex-col h-full pt-4 animate-in slide-in-from-bottom duration-500">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Activity size={24} color={colors.primary} />
            2026：宏觀大年
          </h2>
          <p className="text-[#B0B0B0] text-base mb-8">從「盈餘驅動」轉向「政策驅動」</p>
          
          <div className="bg-[#282828] rounded-3xl p-7 border border-[#404040] mb-6 shadow-xl">
            <h3 className="text-[#95B1FF] font-black text-xl mb-6 flex items-center gap-2">
              <BrainCircuit size={22} />
              三大觀察核心
            </h3>
            <div className="space-y-6">
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-[#404040] flex items-center justify-center text-sm font-black text-white shrink-0">1</div>
                <div>
                  <h4 className="text-white text-base font-bold mb-1">聯準會主席變更</h4>
                  <p className="text-[#B0B0B0] text-sm leading-relaxed">新舊主席交接期的政策連續性將是市場波動的核心來源。</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-[#404040] flex items-center justify-center text-sm font-black text-white shrink-0">2</div>
                <div>
                  <h4 className="text-white text-base font-bold mb-1">失業率與軟著陸</h4>
                  <p className="text-[#B0B0B0] text-sm leading-relaxed">正式驗證美國經濟是否能在長期高利率環境下實現著陸。</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-[#404040] flex items-center justify-center text-sm font-black text-white shrink-0">3</div>
                <div>
                  <h4 className="text-white text-base font-bold mb-1">持續關注與控管 Beta</h4>
                  <p className="text-[#B0B0B0] text-sm leading-relaxed">關注組合 Beta，以高防禦姿態等待市場方向明朗。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    // Screen 7: 行動轉化
    {
      title: "行動轉化",
      content: (
        <div className="flex flex-col h-full pt-10 items-center text-center animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-[#95B1FF]/15 rounded-3xl flex items-center justify-center mb-8 border border-[#95B1FF]/30 shadow-2xl">
            <Lock size={48} color={colors.primary} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">掌握 2026 佈局先機</h2>
          <p className="text-[#B0B0B0] text-base mb-12 px-8 leading-relaxed">
            2025 年我們在數據中贏得勝利。面對充滿變數的 2026，你清楚帳戶的風險係數嗎？
          </p>
          
          <button className="w-full py-6 rounded-2xl font-bold text-xl text-white mb-5 shadow-2xl shadow-[#346AFF]/30 flex items-center justify-center gap-3 transition-transform active:scale-95" 
            style={{ background: colors.primaryGradient }}>
            立即測算：我的持倉 Beta 值
            <ChevronRight size={24} />
          </button>
          
          <button className="w-full py-6 rounded-2xl font-bold text-lg text-[#E0E0E0] border border-[#404040] flex items-center justify-center gap-3 hover:bg-[#333333] transition-all active:scale-95 bg-[#282828]">
            <Crown size={20} className="text-[#FFD700]" />
            查看 Talk 君即時持倉 Beta
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 p-4 font-sans select-none">
      {/* iPhone Pro Max Shell */}
      <div className="w-[390px] h-[844px] bg-[#141414] rounded-[55px] shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden border-[10px] border-[#2F2F2F] flex flex-col">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#2F2F2F] rounded-b-3xl z-50 flex items-center justify-center">
           <div className="w-10 h-1 rounded-full bg-[#141414]"></div>
        </div>
        <div className="h-12 flex justify-between items-end px-10 pb-1">
          <span className="text-white text-sm font-bold">9:41</span>
          <div className="flex gap-2 items-center">
            <div className="w-4 h-2 rounded-sm bg-white/40"></div>
            <div className="w-5 h-5 rounded-full bg-white"></div>
          </div>
        </div>
        <div className="flex-1 px-8 py-5 overflow-hidden">
          {screens[activeScreen].content}
        </div>
        <div className="h-24 flex items-center justify-center gap-3 px-2">
          {screens.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveScreen(idx)}
              className={`h-2 rounded-full transition-all duration-500 ${activeScreen === idx ? 'w-10 bg-[#95B1FF]' : 'w-2 bg-[#666666]'}`}
            />
          ))}
        </div>
        <div className="h-1.5 w-36 bg-[#2F2F2F] rounded-full mx-auto mb-3 opacity-50"></div>
        <div className="absolute left-0 top-0 bottom-0 w-16 z-20 cursor-pointer" onClick={() => setActiveScreen(Math.max(0, activeScreen - 1))}></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 z-20 cursor-pointer" onClick={() => setActiveScreen(Math.min(screens.length - 1, activeScreen + 1))}></div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #404040; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
