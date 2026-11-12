import React, { useState, useEffect } from 'react';
import { 
  Trophy, Users, Settings, Plus, Trash2, ArrowLeft, 
  CheckCircle, Compass, Map, Key, Sparkles, Award, 
  Coins, Gift, ArrowRight, XCircle, Edit3, Lock, AlertTriangle, Anchor
} from 'lucide-react';

// ==========================================
// 1. 學生座號專屬獎勵庫 (老師可在此更換每位孩子的專屬圖片與文字)
// ==========================================
const STUDENT_REWARDS_DB = {
  "01": {
    text: "沛均在幾何小勇士那一關表現得很棒喔！觀察力非常敏銳，不愧是海盜船上的航海士！",
    // 老師可以把下面的網址換成你特製的圖片網址
    image: "https://images.unsplash.com/photo-1589998059171-987d88716cc9?q=80&w=800&auto=format&fit=crop" 
  },
  "02": {
    text: "宸羽今天的拼寫非常正確，是個細心的小探險家，成功解開了寶藏密碼！",
    image: "https://images.unsplash.com/photo-1563241527-20044cb8fad0?q=80&w=800&auto=format&fit=crop"
  }
};

// ==========================================
// 2. 預設題庫 (包含選擇題、填充題、過關畫面設定)
// ==========================================
const INITIAL_STATIONS = [
  {
    id: 1,
    title: "第一關：古老校園的認知識別",
    tag: "觀察與識別",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop", 
    description: "請問圖片中的這個地方，是我們在學校每天都會用來上課的什麼空間？",
    type: "fill-in", 
    options: [],
    answer: "教室",
    coinReward: 30, 
    successMessage: "太棒了！這就是我們每天快樂學習的教室！",
    successImage: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "第二關：數學寶箱的秘密",
    tag: "數學運算",
    image: "https://images.unsplash.com/photo-1611125832047-1d7b420063fa?q=80&w=800&auto=format&fit=crop", 
    description: "探險家找到了 8 顆金幣，打開寶箱後又發現了 5 顆，請問總共有幾顆金幣？",
    type: "multiple-choice",
    options: ["11 顆", "12 顆", "13 顆", "14 顆"],
    answer: 2, 
    coinReward: 20,
    successMessage: "計算完全正確！你擁有成為黃金算術大師的潛力！",
    successImage: "https://images.unsplash.com/photo-1599050751795-6cdaafbc2319?q=80&w=800&auto=format&fit=crop"
  }
];

const INITIAL_GACHA = [
  { id: 1, name: "傳說中的幸運珍珠", emoji: "🦪" },
  { id: 2, name: "海盜船長的羅盤", emoji: "🧭" },
  { id: 3, name: "幽靈海域的神秘金鑰", emoji: "🗝️" },
  { id: 4, name: "深海守護寶石", emoji: "💎" },
  { id: 5, name: "海妖的七彩羽毛", emoji: "🪶" }
];

// 音效播放系統
const playSound = (type) => {
  try {
    let url = '';
    if (type === 'start') url = 'https://www.soundjay.com/misc/sounds/magic-chime-01.mp3';
    if (type === 'correct') url = 'https://www.soundjay.com/buttons/sounds/button-09.mp3';
    if (type === 'wrong') url = 'https://www.soundjay.com/buttons/sounds/button-10.mp3';
    
    if (url) {
      const audio = new Audio(url);
      audio.volume = 0.6;
      audio.play().catch(e => console.log("音效未啟用", e));
    }
  } catch(e) {}
};

export default function App() {
  const [view, setView] = useState('home'); 
  
  const [questions, setQuestions] = useState(() => JSON.parse(localStorage.getItem('wunan_115_v5_questions')) || INITIAL_STATIONS);
  const [gachaList, setGachaList] = useState(() => JSON.parse(localStorage.getItem('wunan_115_v5_gacha')) || INITIAL_GACHA);
  const [wrongPenalty, setWrongPenalty] = useState(() => Number(localStorage.getItem('wunan_115_v5_penalty')) || 5);

  const [studentInfo, setStudentInfo] = useState({ id: '', name: '' });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0); 
  const [fillInText, setFillInText] = useState(''); 
  const [finalGacha, setFinalGacha] = useState(null); 
  const [studentFeedback, setStudentFeedback] = useState(null);

  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [qType, setQType] = useState('multiple-choice');
  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newMCQAnswer, setNewMCQAnswer] = useState(0);
  const [newFillAnswer, setNewFillAnswer] = useState('');
  const [newCoin, setNewCoin] = useState(20);
  const [newSuccMsg, setNewSuccMsg] = useState('');
  const [newSuccImg, setNewSuccImg] = useState('');
  const [newGachaName, setNewGachaName] = useState('');
  const [newGachaEmoji, setNewGachaEmoji] = useState('🎁');

  useEffect(() => localStorage.setItem('wunan_115_v5_questions', JSON.stringify(questions)), [questions]);
  useEffect(() => localStorage.setItem('wunan_115_v5_gacha', JSON.stringify(gachaList)), [gachaList]);
  useEffect(() => localStorage.setItem('wunan_115_v5_penalty', wrongPenalty.toString()), [wrongPenalty]);

  const handleStartGame = () => { playSound('start'); setView('login'); };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!studentInfo.id || !studentInfo.name) return alert("請輸入座號與姓名！");
    setCurrentIdx(0); setScore(0); setFillInText(''); setView('student');
  };

  const submitAnswer = (isCorrect) => {
    if (isCorrect) {
      playSound('correct');
      setScore(prev => prev + (questions[currentIdx].coinReward || 20));
      setView('success_transition');
    } else {
      playSound('wrong');
      setScore(prev => Math.max(0, prev - wrongPenalty));
      setView('wrong_transition');
    }
  };

  const goNextStage = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setFillInText('');
      setView('student');
    } else {
      // 抽盲盒
      setFinalGacha(gachaList[Math.floor(Math.random() * gachaList.length)]);
      
      // 根據座號取得專屬獎勵圖文，若無則給予預設海盜寶藏圖
      const feedback = STUDENT_REWARDS_DB[studentInfo.id] || {
        text: `${studentInfo.name}，你今天展現了超棒的尋寶精神，成功將寶藏帶回海盜船！繼續保持喔！`,
        image: "https://images.unsplash.com/photo-1596701053887-fdf051a37c04?q=80&w=800&auto=format&fit=crop" // 預設金幣寶箱圖
      };
      setStudentFeedback(feedback);
      
      setView('result');
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // ★ 教師後台密碼已更改為 wunan
    if (adminPasswordInput === 'wunan') {
      setView('admin');
      setAdminPasswordInput('');
    } else {
      alert("密碼錯誤，請重新輸入！");
      setAdminPasswordInput('');
    }
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return alert('請填寫關卡名稱與題目描述！');
    const newQ = {
      id: Date.now(), title: newTitle, tag: newTag || "一般測驗",
      image: newImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800",
      description: newDesc, type: qType, options: qType === 'multiple-choice' ? [...newOptions] : [],
      answer: qType === 'multiple-choice' ? Number(newMCQAnswer) : newFillAnswer.trim(),
      coinReward: Number(newCoin) || 20, successMessage: newSuccMsg || "恭喜答對，繼續保持！",
      successImage: newSuccImg || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800"
    };
    setQuestions([...questions, newQ]);
    alert('✅ 題目新增成功！');
    setNewTitle(''); setNewDesc(''); setNewImage(''); setNewSuccMsg(''); setNewSuccImg('');
  };

  const handleAddGacha = (e) => {
    e.preventDefault();
    if(!newGachaName) return;
    setGachaList([...gachaList, { id: Date.now(), name: newGachaName, emoji: newGachaEmoji }]);
    setNewGachaName('');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-x-hidden font-sans selection:bg-amber-500 selection:text-stone-900">
      
      {/* 🏴‍☠️ 海盜與寶藏沉浸式背景 🏴‍☠️ */}
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
           style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1920&auto=format&fit=crop')` }}>
      </div>
      
      {/* 氛圍調色遮罩 (暗角與深褐色調) */}
      <div className="fixed inset-0 z-0 bg-stone-950/70 backdrop-blur-[1px]"></div>
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,6,0.15)_0%,rgba(12,8,5,0.9)_100%)]"></div>
      
      {/* 模擬油燈呼吸的光暈特效 */}
      <div className="fixed top-1/4 left-1/4 w-[40rem] h-[40rem] bg-amber-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

      <div className="relative z-10 w-full max-w-3xl">
        
        {/* ==================== 1. 首頁大廳 ==================== */}
        {view === 'home' && (
          <div className="bg-stone-900/80 backdrop-blur-xl border border-amber-900/50 rounded-3xl p-8 sm:p-12 shadow-[0_0_60px_rgba(0,0,0,0.8)] text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-900/40 border border-amber-700/50 text-amber-400 text-xs font-bold tracking-widest uppercase mb-6 shadow-inner">
              <Anchor className="w-4 h-4 animate-pulse" /> 梧南國小海盜尋寶特攻隊
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-amber-100 via-amber-200 to-yellow-600 drop-shadow-md mb-4 leading-tight">
              梧南國小 115學年度<br />一年級多元闖關評量
            </h1>
            
            <p className="text-stone-300 font-medium mb-10 max-w-md mx-auto leading-relaxed">
              勇敢的小海盜們！解開隱藏在各個島嶼的謎題，蒐集金幣，並抽取專屬於你的神祕盲盒寶物吧！
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <button onClick={handleStartGame} className="flex items-center justify-center gap-3 bg-gradient-to-b from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-black py-4 px-6 rounded-2xl text-lg transition-transform hover:scale-[1.02] shadow-lg shadow-amber-900/40">
                <Key className="w-5 h-5" /> 登船出發尋寶
              </button>
              <button onClick={() => setView('admin_login')} className="flex items-center justify-center gap-2 bg-stone-800/80 hover:bg-stone-700 border border-stone-600 text-stone-300 font-bold py-4 px-6 rounded-2xl text-base transition-colors shadow-lg backdrop-blur-sm">
                <Settings className="w-5 h-5" /> 船長管理室
              </button>
            </div>
          </div>
        )}

        {/* ==================== 2. 教師後台密碼登入 ==================== */}
        {view === 'admin_login' && (
          <div className="bg-stone-900/90 backdrop-blur-xl border border-amber-900/50 rounded-3xl p-8 sm:p-10 shadow-2xl text-center max-w-sm mx-auto">
            <div className="bg-rose-900/30 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-5 border border-rose-500/30">
              <Lock className="w-10 h-10 text-rose-400" />
            </div>
            <h2 className="text-2xl font-black text-stone-100 mb-2">船長安全鎖</h2>
            <p className="text-sm text-stone-400 mb-8">請輸入船長專屬密碼以進入管理室</p>
            
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input type="password" placeholder="請輸入密碼..." value={adminPasswordInput} onChange={e => setAdminPasswordInput(e.target.value)} className="w-full bg-stone-950 border border-stone-700 rounded-xl p-4 text-stone-100 text-center text-lg focus:outline-none focus:border-rose-500 font-bold transition-colors tracking-widest" />
              <button type="submit" className="w-full bg-rose-700 hover:bg-rose-600 text-stone-50 font-bold py-4 rounded-xl text-lg transition-transform hover:scale-[1.02] shadow-lg">
                解鎖進入
              </button>
            </form>
            <button onClick={() => setView('home')} className="mt-6 text-sm font-medium text-stone-500 hover:text-stone-300">返回甲板首頁</button>
          </div>
        )}

        {/* ==================== 3. 學生登入 ==================== */}
        {view === 'login' && (
          <div className="bg-stone-900/90 backdrop-blur-xl border border-amber-900/50 rounded-3xl p-8 sm:p-10 shadow-2xl text-center max-w-md mx-auto">
            <div className="bg-stone-800 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-5 border border-stone-600 shadow-inner">
              <Compass className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-2xl font-black text-stone-100 mb-2">小海盜報到處</h2>
            <p className="text-sm text-stone-400 mb-8">請登錄你的身份，領取專屬尋寶圖</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="text" placeholder="你的座號 (例如: 01)" value={studentInfo.id} onChange={e => setStudentInfo({...studentInfo, id: e.target.value})} className="w-full bg-stone-950 border border-stone-700 rounded-xl p-4 text-stone-100 text-center text-lg focus:outline-none focus:border-amber-500 font-bold" />
              <input type="text" placeholder="你的姓名 (例如: 沛均)" value={studentInfo.name} onChange={e => setStudentInfo({...studentInfo, name: e.target.value})} className="w-full bg-stone-950 border border-stone-700 rounded-xl p-4 text-stone-100 text-center text-lg focus:outline-none focus:border-amber-500 font-bold" />
              <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-stone-50 font-bold py-4 rounded-xl text-lg transition-transform hover:scale-[1.02] shadow-lg mt-4">
                確認登錄
              </button>
            </form>
          </div>
        )}

        {/* ==================== 4. 闖關測驗區 ==================== */}
        {view === 'student' && questions.length > 0 && (
          <div className="bg-stone-900/95 border border-amber-900/50 rounded-3xl overflow-hidden shadow-2xl transition-transform duration-300">
            <div className="h-56 sm:h-72 w-full relative group">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${questions[currentIdx].image}')` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/20 to-transparent"></div>
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                <span className="text-xs font-bold px-3 py-1.5 bg-stone-900/80 text-stone-300 rounded-lg border border-stone-700 backdrop-blur-md">
                  第 {currentIdx + 1} / {questions.length} 關
                </span>
                <span className="text-xs font-black px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 rounded-lg shadow-md flex items-center gap-1.5">
                  <Coins className="w-4 h-4" /> 金幣 {score}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 relative z-20 -mt-6">
              <div className="inline-block px-3 py-1 rounded-md bg-stone-800 border border-stone-700 text-amber-400 text-xs font-bold mb-4">{questions[currentIdx].tag}</div>
              <h2 className="text-2xl font-black text-stone-50 mb-3">{questions[currentIdx].title}</h2>
              <p className="text-stone-300 text-lg leading-relaxed mb-8 bg-stone-800/50 p-4 rounded-xl border border-stone-700/50">
                {questions[currentIdx].description}
              </p>

              {questions[currentIdx].type === 'multiple-choice' ? (
                <div className="space-y-3">
                  {questions[currentIdx].options.map((opt, idx) => (
                    <button key={idx} onClick={() => submitAnswer(idx === questions[currentIdx].answer)} className="w-full text-left p-4 rounded-xl font-bold bg-stone-800 hover:bg-stone-700 border border-stone-700 hover:border-amber-500 text-stone-200 transition-all flex items-center gap-4 group">
                      <span className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-sm border border-stone-700 group-hover:bg-amber-500/20 group-hover:text-amber-400 group-hover:border-amber-500 shrink-0">{String.fromCharCode(65 + idx)}</span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); if(fillInText.trim
