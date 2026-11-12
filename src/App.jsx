import React, { useState, useEffect } from 'react';
import { 
  Trophy, Users, Settings, Plus, Trash2, ArrowLeft, 
  CheckCircle, Compass, Map, Key, Sparkles, Award, 
  Image as ImageIcon, Type, List, Coins, Gift, Music, 
  ArrowRight, XCircle, Edit3
} from 'lucide-react';

// ==========================================
// 預設題庫 (包含選擇題、填充題、過關畫面設定)
// ==========================================
const INITIAL_STATIONS = [
  {
    id: 1,
    title: "第一關：古老校園的認知識別",
    tag: "觀察與識別",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop", // 學校/教室圖
    description: "請問圖片中的這個地方，是我們在學校每天都會用來上課的什麼空間？",
    type: "fill-in", // fill-in 或 multiple-choice
    options: [],
    answer: "教室",
    coinReward: 30, // 答對獲得金幣
    successMessage: "太棒了！這就是我們每天快樂學習的教室！",
    successImage: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "第二關：數學寶箱的秘密",
    tag: "數學運算",
    image: "https://images.unsplash.com/photo-1611125832047-1d7b420063fa?q=80&w=800&auto=format&fit=crop", // 金幣圖
    description: "探險家找到了 8 顆金幣，打開寶箱後又發現了 5 顆，請問總共有幾顆金幣？",
    type: "multiple-choice",
    options: ["11 顆", "12 顆", "13 顆", "14 顆"],
    answer: 2, // 選項 C (index 2)
    coinReward: 20,
    successMessage: "計算完全正確！你擁有成為黃金算術大師的潛力！",
    successImage: "https://images.unsplash.com/photo-1599050751795-6cdaafbc2319?q=80&w=800&auto=format&fit=crop"
  }
];

// ==========================================
// 預設盲盒獎勵庫
// ==========================================
const INITIAL_GACHA = [
  { id: 1, name: "傳說中的幸運珍珠", emoji: "🦪" },
  { id: 2, name: "黃金探險羅盤", emoji: "🧭" },
  { id: 3, name: "校長的神秘金鑰", emoji: "🗝️" },
  { id: 4, name: "映霞樓守護寶石", emoji: "💎" },
  { id: 5, name: "智慧貓頭鷹羽毛", emoji: "🪶" }
];

// ==========================================
// 音效播放系統
// ==========================================
const playSound = (type) => {
  try {
    let url = '';
    // 使用開源免費音效資源
    if (type === 'start') url = 'https://www.soundjay.com/misc/sounds/magic-chime-01.mp3';
    if (type === 'correct') url = 'https://www.soundjay.com/buttons/sounds/button-09.mp3';
    if (type === 'wrong') url = 'https://www.soundjay.com/buttons/sounds/button-10.mp3';
    
    if (url) {
      const audio = new Audio(url);
      audio.volume = 0.6;
      audio.play().catch(e => console.log("音效播放被瀏覽器阻擋", e));
    }
  } catch(e) {}
};

export default function App() {
  // 畫面切換狀態：'home', 'login', 'student', 'success_transition', 'result', 'admin'
  const [view, setView] = useState('home'); 
  
  // 資料庫狀態 (LocalStorage)
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('wunan_115_v3_questions');
    return saved ? JSON.parse(saved) : INITIAL_STATIONS;
  });
  
  const [gachaList, setGachaList] = useState(() => {
    const saved = localStorage.getItem('wunan_115_v3_gacha');
    return saved ? JSON.parse(saved) : INITIAL_GACHA;
  });

  // 學生闖關狀態
  const [studentInfo, setStudentInfo] = useState({ id: '', name: '' });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0); 
  const [fillInText, setFillInText] = useState(''); // 填充題輸入框
  const [errorShake, setErrorShake] = useState(false); // 答錯動畫
  const [finalGacha, setFinalGacha] = useState(null); 

  // 後台：新增題目表單狀態
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

  // 後台：新增盲盒表單狀態
  const [newGachaName, setNewGachaName] = useState('');
  const [newGachaEmoji, setNewGachaEmoji] = useState('🎁');

  // 資料儲存效應
  useEffect(() => { localStorage.setItem('wunan_115_v3_questions', JSON.stringify(questions)); }, [questions]);
  useEffect(() => { localStorage.setItem('wunan_115_v3_gacha', JSON.stringify(gachaList)); }, [gachaList]);

  // ==========================================
  // 遊戲邏輯處理
  // ==========================================
  const handleStartGame = () => {
    playSound('start');
    setView('login');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!studentInfo.id || !studentInfo.name) return alert("請輸入座號與姓名！");
    setCurrentIdx(0);
    setScore(0);
    setFillInText('');
    setView('student');
  };

  const submitAnswer = (isCorrect) => {
    if (isCorrect) {
      playSound('correct');
      setScore(prev => prev + (questions[currentIdx].coinReward || 20));
      setView('success_transition');
    } else {
      playSound('wrong');
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 800);
    }
  };

  // 選擇題點擊
  const handleMCQ = (idx) => {
    submitAnswer(idx === questions[currentIdx].answer);
  };

  // 填充題送出
  const handleFillIn = (e) => {
    e.preventDefault();
    if(!fillInText.trim()) return;
    const isCorrect = fillInText.trim() === questions[currentIdx].answer;
    submitAnswer(isCorrect);
  };

  // 進入下一關或結算
  const goNextStage = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setFillInText('');
      setView('student');
    } else {
      // 抽盲盒
      const randomPrize = gachaList[Math.floor(Math.random() * gachaList.length)];
      setFinalGacha(randomPrize);
      setView('result');
    }
  };

  // ==========================================
  // 後台管理邏輯
  // ==========================================
  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return alert('請填寫關卡名稱與題目描述！');
    
    const newQ = {
      id: Date.now(),
      title: newTitle,
      tag: newTag || "一般測驗",
      image: newImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800",
      description: newDesc,
      type: qType,
      options: qType === 'multiple-choice' ? [...newOptions] : [],
      answer: qType === 'multiple-choice' ? Number(newMCQAnswer) : newFillAnswer.trim(),
      coinReward: Number(newCoin) || 20,
      successMessage: newSuccMsg || "恭喜答對，繼續保持！",
      successImage: newSuccImg || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800"
    };
    
    setQuestions([...questions, newQ]);
    alert('✅ 題目新增成功！');
    // 重置表單
    setNewTitle(''); setNewDesc(''); setNewImage(''); setNewSuccMsg(''); setNewSuccImg('');
  };

  const handleAddGacha = (e) => {
    e.preventDefault();
    if(!newGachaName) return;
    setGachaList([...gachaList, { id: Date.now(), name: newGachaName, emoji: newGachaEmoji }]);
    setNewGachaName('');
  };

  // ==========================================
  // 畫面渲染
  // ==========================================
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-x-hidden font-sans selection:bg-amber-500 selection:text-stone-900"
         style={{ backgroundImage: `radial-gradient(circle at 50% 0%, #3a2618 0%, #0c0805 80%)` }}>
      
      {/* 裝飾背景光 */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-3xl">
        
        {/* ==================== 首頁大廳 (質感探險風格) ==================== */}
        {view === 'home' && (
          <div className="bg-stone-900/80 backdrop-blur-xl border border-stone-700/50 rounded-3xl p-8 sm:p-12 shadow-2xl text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-900/30 border border-amber-700/50 text-amber-400 text-xs font-bold tracking-widest uppercase mb-6 shadow-inner">
              <Compass className="w-4 h-4 animate-spin-slow" /> 皇家探險者公會 ‧ 實境評量
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-amber-100 via-amber-200 to-yellow-600 drop-shadow-sm mb-4 leading-tight">
              梧南國小 115學年度<br />一年級多元闖關評量
            </h1>
            
            <p className="text-stone-400 font-medium mb-10 max-w-md mx-auto">
              準備好展現你的智慧了嗎？解開隱藏在圖片中的謎題，蒐集金幣並抽取專屬於你的神祕盲盒寶物！
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <button onClick={handleStartGame} className="flex items-center justify-center gap-3 bg-gradient-to-b from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-black py-4 px-6 rounded-2xl text-lg transition-transform hover:scale-[1.02] shadow-lg shadow-amber-900/20">
                <Key className="w-5 h-5" /> 展開尋寶旅程
              </button>
              <button onClick={() => setView('admin')} className="flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-300 font-bold py-4 px-6 rounded-2xl text-base transition-colors shadow-lg">
                <Settings className="w-5 h-5" /> 教師管理中心
              </button>
            </div>
          </div>
        )}

        {/* ==================== 學生登入頁面 ==================== */}
        {view === 'login' && (
          <div className="bg-stone-900/90 backdrop-blur-xl border border-stone-700/50 rounded-3xl p-8 sm:p-10 shadow-2xl text-center max-w-md mx-auto">
            <div className="bg-stone-800 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-5 border border-stone-600 shadow-inner">
            </div>
            <h2 className="text-2xl font-black text-stone-100 mb-2">探險者報到處</h2>
            <p className="text-sm text-stone-400 mb-8">請登錄你的身份，領取專屬測驗卷</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="text" placeholder="你的座號 (例如: 01)" value={studentInfo.id} onChange={e => setStudentInfo({...studentInfo, id: e.target.value})} className="w-full bg-stone-950 border border-stone-700 rounded-xl p-4 text-stone-100 text-center text-lg focus:outline-none focus:border-amber-500 font-bold transition-colors" />
              <input type="text" placeholder="你的姓名 (例如: 沛均)" value={studentInfo.name} onChange={e => setStudentInfo({...studentInfo, name: e.target.value})} className="w-full bg-stone-950 border border-stone-700 rounded-xl p-4 text-stone-100 text-center text-lg focus:outline-none focus:border-amber-500 font-bold transition-colors" />
              <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-stone-50 font-bold py-4 rounded-xl text-lg transition-transform hover:scale-[1.02] shadow-lg mt-4">
                確認登錄
              </button>
            </form>
            <button onClick={() => setView('home')} className="mt-6 text-sm font-medium text-stone-500 hover:text-stone-300 transition-colors">返回首頁</button>
          </div>
        )}

        {/* ==================== 闖關測驗區 (支援圖片與雙題型) ==================== */}
        {view === 'student' && questions.length > 0 && (
          <div className={`bg-stone-900/95 border border-stone-700/50 rounded-3xl overflow-hidden shadow-2xl transition-transform duration-300 ${errorShake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
            
            {/* 頂部圖片題幹 */}
            <div className="h-56 sm:h-72 w-full relative group">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${questions[currentIdx].image}')` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/20 to-transparent"></div>
              
              {/* 狀態列 */}
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
              <div className="inline-block px-3 py-1 rounded-md bg-stone-800 border border-stone-700 text-amber-400 text-xs font-bold mb-4">
                {questions[currentIdx].tag}
              </div>
              
              <h2 className="text-2xl font-black text-stone-50 mb-3">{questions[currentIdx].title}</h2>
              <p className="text-stone-300 text-lg leading-relaxed mb-8 bg-stone-800/50 p-4 rounded-xl border border-stone-700/50">
                {questions[currentIdx].description}
              </p>

              {/* 答題區：選擇題 or 填充題 */}
              {questions[currentIdx].type === 'multiple-choice' ? (
                <div className="space-y-3">
                  {questions[currentIdx].options.map((opt, idx) => (
                    <button key={idx} onClick={() => handleMCQ(idx)} className="w-full text-left p-4 rounded-xl font-bold bg-stone-800 hover:bg-stone-700 border border-stone-700 hover:border-amber-500 text-stone-200 transition-all flex items-center gap-4 group">
                      <span className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-sm border border-stone-700 group-hover:bg-amber-500/20 group-hover:text-amber-400 group-hover:border-amber-500 transition-colors shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleFillIn} className="flex flex-col sm:flex-row gap-3">
                  <input type="text" value={fillInText} onChange={e => setFillInText(e.target.value)} placeholder="請輸入你的答案..." className="flex-1 bg-stone-950 border border-stone-700 rounded-xl p-4 text-stone-100 text-lg focus:outline-none focus:border-amber-500 transition-colors" />
                  <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-stone-50 font-bold px-8 py-4 rounded-xl transition-colors shadow-lg whitespace-nowrap">
                    送出答案
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ==================== 答對過關專屬畫面 ==================== */}
        {view === 'success_transition' && (
          <div className="bg-stone-900/95 border border-emerald-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.15)] text-center relative animate-[fade-in_0.5s_ease-out]">
            <div className="h-64 w-full bg-cover bg-center" style={{ backgroundImage: `url('${questions[currentIdx].successImage}')` }}></div>
            
            <div className="p-8 sm:p-10 relative z-20 -mt-8 bg-gradient-to-b from-transparent to-stone-900 via-stone-900 pt-10">
              <div className="w-20 h-20 mx-auto bg-emerald-500 rounded-full flex items-center justify-center border-4 border-stone-900 shadow-xl -mt-20 mb-6 relative z-30">
                <CheckCircle className="w-10 h-10 text-stone-50" />
              </div>
              
              <h2 className="text-3xl font-black text-emerald-400 mb-4">挑戰成功！</h2>
              <p className="text-stone-200 text-lg font-medium bg-stone-800 p-5 rounded-2xl border border-stone-700 shadow-inner mb-8">
                {questions[currentIdx].successMessage}
              </p>

              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-6 py-2 rounded-full mb-8">
                <Coins className="w-5 h-5 text-amber-500" />
                <span className="text-amber-400 font-bold">獲得 {questions[currentIdx].coinReward || 20} 枚金幣</span>
              </div>
              
              <br />
              <button onClick={goNextStage} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-10 rounded-xl text-lg transition-transform hover:scale-[1.02] shadow-lg shadow-emerald-900/50 flex items-center gap-2 mx-auto">
                繼續前進下一關 <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ==================== 結算與盲盒畫面 ==================== */}
        {view === 'result' && (
          <div className="bg-stone-900/95 backdrop-blur-xl border border-stone-700/50 rounded-3xl p-8 sm:p-12 shadow-2xl text-center relative overflow-hidden">
            <h2 className="text-3xl font-black text-stone-100 mb-2">測驗完成！</h2>
            <div className="text-stone-400 mb-8 font-medium">總共蒐集到了 <span className="text-amber-400 font-bold text-2xl mx-1">{score}</span> 枚金幣</div>

            {/* 盲盒展示 */}
            <div className="bg-gradient-to-br from-stone-800 to-stone-900 border border-stone-700 rounded-3xl p-8 mb-10 relative shadow-inner">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-600 text-stone-50 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <Gift className="w-4 h-4" /> 通關專屬盲盒
              </div>
              <p className="text-stone-300 text-sm mb-4 mt-2">恭喜 {studentInfo.name} 抽中神秘大獎：</p>
              <div className="text-6xl mb-4 animate-bounce">{finalGacha?.emoji}</div>
              <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 drop-shadow-md">
                {finalGacha?.name}
              </div>
            </div>

            <button onClick={() => setView('home')} className="bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-200 font-bold py-4 px-10 rounded-xl transition-colors">
              返回首頁大廳
            </button>
          </div>
        )}

        {/* ==================== 教師後台管理中心 ==================== */}
        {view === 'admin' && (
          <div className="bg-stone-900/95 backdrop-blur-xl border border-stone-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-stone-800">
              <button onClick={() => setView('home')} className="text-stone-400 hover:text-stone-200 flex items-center gap-2 font-bold transition-colors">
                <ArrowLeft className="w-4 h-4" /> 返回
              </button>
              <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-500" /> 教師管理中心
              </h2>
            </div>

            {/* 區塊 1: 新增題目 */}
            <div className="mb-10">
              <h3 className="font-bold text-amber-400 flex items-center gap-2 mb-4 border-l-4 border-amber-500 pl-3">
                <Edit3 className="w-5 h-5" /> 新增評量關卡
              </h3>
              
              <form onSubmit={handleAddQuestion} className="bg-stone-950/50 border border-stone-800 rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="關卡名稱 (例：第一關...)" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="bg-stone-900 border border-stone-700 rounded-lg p-3 text-stone-200 text-sm outline-none focus:border-amber-500" />
                  <input type="text" placeholder="領域標籤 (例：國語、數學)" value={newTag} onChange={e => setNewTag(e.target.value)} className="bg-stone-900 border border-stone-700 rounded-lg p-3 text-stone-200 text-sm outline-none focus:border-amber-500" />
                </div>
                
                <input type="text" placeholder="題目圖片網址 (URL)" value={newImage} onChange={e => setNewImage(e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-lg p-3 text-stone-200 text-sm outline-none focus:border-amber-500" />
                <textarea placeholder="題目描述..." value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-lg p-3 text-stone-200 text-sm outline-none focus:border-amber-500" rows="2" />
                
                {/* 題型切換 */}
                <div className="flex items-center gap-4 bg-stone-900 p-3 rounded-lg border border-stone-700">
                  <span className="text-stone-400 text-sm font-bold">題型設定：</span>
                  <label className="flex items-center gap-2 text-sm text-stone-200 cursor-pointer">
                    <input type="radio" name="qType" checked={qType === 'multiple-choice'} onChange={() => setQType('multiple-choice')} className="accent-amber-500" /> 選擇題
                  </label>
                  <label className="flex items-center gap-2 text-sm text-stone-200 cursor-pointer">
                    <input type="radio" name="qType" checked={qType === 'fill-in'} onChange={() => setQType('fill-in')} className="accent-amber-500" /> 填充題
                  </label>
                </div>

                {/* 根據題型顯示對應的輸入框 */}
                {qType === 'multiple-choice' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-900/50 p-4 rounded-lg border border-stone-800">
                    {newOptions.map((opt, i) => (
                      <input key={i} type="text" placeholder={`選項 ${String.fromCharCode(65 + i)}`} value={opt} onChange={e => { const up = [...newOptions]; up[i] = e.target.value; setNewOptions(up); }} className="bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-stone-200 text-sm outline-none focus:border-amber-500" />
                    ))}
                    <div className="col-span-1 sm:col-span-2 flex items-center justify-end mt-2 gap-3">
                      <span className="text-sm font-bold text-stone-400">正確解答：</span>
                      <select value={newMCQAnswer} onChange={e => setNewMCQAnswer(e.target.value)} className="bg-stone-900 border border-stone-700 rounded-lg p-2 text-stone-200 text-sm font-bold outline-none">
                        <option value={0}>選項 A</option>
                        <option value={1}>選項 B</option>
                        <option value={2}>選項 C</option>
                        <option value={3}>選項 D</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="bg-stone-900/50 p-4 rounded-lg border border-stone-800">
                    <input type="text" placeholder="請輸入正確的填充題文字解答" value={newFillAnswer} onChange={e => setNewFillAnswer(e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-lg p-3 text-stone-200 text-sm outline-none focus:border-amber-500 font-bold" />
                  </div>
                )}

                {/* 過關畫面與金幣設定 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-stone-800 pt-4">
                  <div>
                    <label className="text-xs text-stone-400 mb-1 block">本題獲得金幣</label>
                    <input type="number" placeholder="預設 20" value={newCoin} onChange={e => setNewCoin(e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-stone-200 text-sm outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="text-xs text-stone-400 mb-1 block">過關稱讚話語</label>
                    <input type="text" placeholder="例：太棒了！" value={newSuccMsg} onChange={e => setNewSuccMsg(e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-stone-200 text-sm outline-none focus:border-amber-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-stone-400 mb-1 block">過關獎勵圖片 (URL)</label>
                    <input type="text" placeholder="貼上圖片網址" value={newSuccImg} onChange={e => setNewSuccImg(e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-stone-200 text-sm outline-none focus:border-amber-500" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-stone-50 font-bold py-3 rounded-lg mt-2 transition-colors">
                  儲存並新增關卡
                </button>
              </form>
            </div>

            {/* 區塊 2: 盲盒管理 */}
            <div className="mb-6 border-t border-stone-800 pt-8">
              <h3 className="font-bold text-emerald-400 flex items-center gap-2 mb-4 border-l-4 border-emerald-500 pl-3">
                <Gift className="w-5 h-5" /> 盲盒獎品管理
              </h3>
              
              <form onSubmit={handleAddGacha} className="flex gap-2 mb-4">
                <input type="text" placeholder="輸入 Emoji (例: 👑)" value={newGachaEmoji} onChange={e => setNewGachaEmoji(e.target.value)} className="w-20 bg-stone-950 border border-stone-700 rounded-lg p-2 text-center text-xl outline-none focus:border-emerald-500" />
                <input type="text" placeholder="獎品名稱 (例: 神秘皇冠)" value={newGachaName} onChange={e => setNewGachaName(e.target.value)} className="flex-1 bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-sm text-stone-200 outline-none focus:border-emerald-500" />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 px-4 rounded-lg text-sm font-bold text-white transition-colors">新增</button>
              </form>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {gachaList.map(g => (
                  <div key={g.id} className="bg-stone-950 border border-stone-800 p-2.5 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-lg">{g.emoji}</span>
                      <span className="text-xs text-stone-300 truncate">{g.name}</span>
                    </div>
                    <button onClick={() => { if(gachaList.length>1) setGachaList(gachaList.filter(x=>x.id!==g.id)); else alert('至少留一個盲盒'); }} className="text-stone-500 hover:text-rose-400 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 區塊 3: 題庫列表管理 */}
            <div className="border-t border-stone-800 pt-8">
              <h3 className="font-bold text-stone-300 flex items-center gap-2 mb-4 border-l-4 border-stone-500 pl-3">
                <List className="w-5 h-5" /> 現有題庫清單 (共 {questions.length} 題)
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {questions.map((q, idx) => (
                  <div key={q.id} className="bg-stone-950 border border-stone-800 p-4 rounded-xl flex justify-between items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black text-amber-500">#{idx + 1}</span>
                        <span className="text-sm font-bold text-stone-200 truncate">{q.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-400">{q.type === 'fill-in' ? '填充' : '選擇'}</span>
                      </div>
                      <div className="text-xs text-stone-500 truncate flex items-center gap-2">
                        <span>過關金幣: {q.coinReward}</span> • <span>解答: {q.type==='multiple-choice'? String.fromCharCode(65+q.answer) : q.answer}</span>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteQ(q.id)} className="text-stone-500 hover:text-rose-400 p-2 bg-stone-900 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
