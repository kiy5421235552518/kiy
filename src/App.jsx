import React, { useState, useEffect } from 'react';
import { 
  Trophy, Users, Settings, Plus, Trash2, ArrowLeft, 
  CheckCircle, Compass, Map, Key, Sparkles, Award, 
  BookOpen, Shapes, Calculator, ShieldCheck, Sparkle, Heart
} from 'lucide-react';

// 梧南國小 115學年度多元評量六大闖關預設題庫
const INITIAL_STATIONS = [
  {
    id: 1,
    stationNum: 1,
    title: "第 1 關：琅琅上口",
    tag: "國語文表達",
    iconName: "BookOpen",
    description: "海豚夥伴帶領大家來到朗讀島！請問在朗讀課文時，怎樣的表現最棒？",
    options: ["聲音響亮且帶有豐富情感", "越快唸完越厲害", "小小聲讓大家聽不見", "一邊跳舞一邊轉圈"],
    answer: 0,
    hint: "提示：自信、清晰且有感情的聲音最能打動評審喔！"
  },
  {
    id: 2,
    stationNum: 2,
    title: "第 2 關：拼寫高手",
    tag: "ㄅㄆㄇ注音魔法",
    iconName: "Sparkles",
    description: "開啟藏寶箱需要注音密碼！請問注音符號「ㄅㄆㄇ」中，總共有幾個聲符？",
    options: ["16 個", "21 個", "37 個", "18 個"],
    answer: 1,
    hint: "提示：ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙ，數一數共有 21 個喔！"
  },
  {
    id: 3,
    stationNum: 3,
    title: "第 3 關：幾何小勇士",
    tag: "形狀與空間",
    iconName: "Shapes",
    description: "探險家在映霞樓前發現神祕石板！請問下列哪一種形狀具有「四條一樣長的邊」和「四個直角」？",
    options: ["正方形", "長方形", "三角形", "圓形"],
    answer: 0,
    hint: "提示：四個邊長度一模一樣，看起來端端正正的形狀！"
  },
  {
    id: 4,
    stationNum: 4,
    title: "第 4 關：數學天才",
    tag: "生活數學算術",
    iconName: "Calculator",
    description: "粉紅小海豚書包裡有 8 顆貝殼金幣，藍色小海豚給了她 5 顆，請問她現在一共有幾顆？",
    options: ["11 顆", "12 顆", "13 顆", "14 顆"],
    answer: 2,
    hint: "提示：8 + 5 = 13 顆金幣喔！"
  },
  {
    id: 5,
    stationNum: 5,
    title: "第 5 關：安全小尖兵",
    tag: "校園安全生活",
    iconName: "ShieldCheck",
    description: "在梧南校園尋寶走廊走動時，哪種行為才是真正的安全小尖兵？",
    options: ["在走廊快速奔跑追逐", "走廊不奔跑、靠右慢行輕聲走", "滑著滑板穿過教室", "爬到二樓走廊欄杆上探險"],
    answer: 1,
    hint: "提示：上下樓梯靠右走，校園安全大家守！"
  },
  {
    id: 6,
    stationNum: 6,
    title: "第 6 關：清潔達人",
    tag: "環境與生活自理",
    iconName: "Sparkle",
    description: "尋寶活動結束後，發現自己的座位底下有紙屑和小垃圾，應該怎麼做？",
    options: ["踢到隔壁同學桌底", "裝作沒看見直接離開", "主動撿起並做好垃圾分類丟入垃圾桶", "留在原地等老師來清"],
    answer: 2,
    hint: "提示：隨手做環保、愛護梧南美麗校園！"
  }
];

export default function App() {
  const [view, setView] = useState('home'); // 'home', 'student', 'admin'
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('wunan_115_assessment');
    return saved ? JSON.parse(saved) : INITIAL_STATIONS;
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  // 老師後台新增表單狀態
  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newAnswer, setNewAnswer] = useState(0);

  useEffect(() => {
    localStorage.setItem('wunan_115_assessment', JSON.stringify(questions));
  }, [questions]);

  const handleAnswer = (idx) => {
    setSelectedOpt(idx);
    const isCorrect = idx === questions[currentIdx].answer;
    if (isCorrect) {
      setScore(prev => prev + 10);
    }
    setTimeout(() => {
      setSelectedOpt(null);
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx(prev => prev + 1);
      } else {
        setIsFinished(true);
      }
    }, 1100);
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newTitle || !newDesc || newOptions.some(opt => !opt.trim())) {
      alert('請填寫完整的關卡名稱、題目描述與四個選項！');
      return;
    }
    const newQ = {
      id: Date.now(),
      stationNum: questions.length + 1,
      title: newTitle,
      tag: newTag || "自訂關卡",
      iconName: "Sparkles",
      description: newDesc,
      options: [...newOptions],
      answer: Number(newAnswer),
      hint: "加油！發揮你的聰明才智！"
    };
    setQuestions([...questions, newQ]);
    setNewTitle('');
    setNewTag('');
    setNewDesc('');
    setNewOptions(['', '', '', '']);
    alert('成功新增評量關卡！');
  };

  const handleDeleteQ = (id) => {
    if (questions.length <= 1) {
      alert('至少需保留一個關卡！');
      return;
    }
    setQuestions(questions.filter(q => q.id !== id));
  };

  const resetGame = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedOpt(null);
    setIsFinished(false);
  };

  return (
    <div className="min-h-screen bg-[#1c140d] text-[#fbf3db] flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-x-hidden font-sans selection:bg-amber-500 selection:text-stone-900">
      
      {/* 尋寶古地圖氛圍金沙與光暈背景 */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/30 via-[#1c140d] to-[#0d0906] z-0"></div>
      <div className="fixed top-12 left-10 w-96 h-96 bg-amber-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-orange-700/10 rounded-full blur-[160px] pointer-events-none"></div>

      {/* 主內容區塊 */}
      <div className="relative z-10 w-full max-w-2xl">
        
        {/* ==================== 首頁大廳 ==================== */}
        {view === 'home' && (
          <div className="bg-[#2a1d13]/90 backdrop-blur-md border-2 border-amber-600/50 rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-center relative overflow-hidden">
            
            {/* 上方裝飾標籤 */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black tracking-widest uppercase mb-4 shadow-sm">
              <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
              校園實境解謎 ‧ 寶藏尋奇
            </div>

            {/* 大標題 */}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)] mb-2">
              梧南國小 115學年度
            </h1>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-200 mb-6 tracking-wide">
              一年級多元闖關評量
            </h2>

            {/* 梧南國小海豚吉祥物雙人組 */}
            <div className="my-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-around max-w-md mx-auto">
              <div className="text-center group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl bg-sky-500/20 border-2 border-sky-400/50 flex flex-col items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <span className="text-4xl">🐬</span>
                  <span className="text-[10px] font-bold text-sky-300 mt-1">背著書包</span>
                </div>
                <div className="mt-2 text-xs font-bold text-sky-200">藍色小海豚</div>
                <div className="text-[10px] text-sky-400/80">尋寶隊長</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="p-2 rounded-full bg-amber-500/20 text-amber-400 mb-1">
                  <Key className="w-6 h-6 animate-pulse" />
                </div>
                <span className="text-xs font-black text-amber-400">解鎖寶藏</span>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl bg-pink-500/20 border-2 border-pink-400/50 flex flex-col items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <span className="text-4xl">🐬</span>
                  <span className="text-[10px] font-bold text-pink-300 mt-1">背著書包</span>
                </div>
                <div className="mt-2 text-xs font-bold text-pink-200">粉紅小海豚</div>
                <div className="text-[10px] text-pink-400/80">智慧精靈</div>
              </div>
            </div>

            {/* 六大關卡徽章預覽 */}
            <div className="mb-8">
              <div className="text-xs font-bold text-amber-300/80 mb-3 flex items-center justify-center gap-1.5">
                 六大多元闖關檢查點
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {questions.map((q, idx) => (
                  <div key={q.id} className="bg-amber-950/30 border border-amber-600/30 rounded-xl py-2 px-2.5 flex items-center gap-1.5 text-amber-200">
                    <span className="w-5 h-5 rounded-full bg-amber-500/30 text-amber-300 flex items-center justify-center text-[10px] font-black shrink-0">
                      {idx + 1}
                    </span>
                    <span className="truncate font-semibold">{q.title.replace(/^第\s*\d+\s*關[：:]\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 操作按鈕 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
