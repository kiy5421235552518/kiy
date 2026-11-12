import React, { useState, useEffect } from 'react';
import { 
  Trophy, Users, Settings, Plus, Trash2, ArrowLeft, 
  CheckCircle, Compass, Map, Key, Sparkles, Award, 
  Coins, Gift, ArrowRight, XCircle, Edit3, Lock, AlertTriangle, Anchor, Type, Check
} from 'lucide-react';

// ==========================================
// 1. 學生座號專屬獎勵庫
// ==========================================
const STUDENT_REWARDS_DB = {
  "01": {
    text: "沛均在幾何小勇士那一關表現得很棒喔！觀察力非常敏銳，不愧是海盜船上的航海士！",
    image: "https://images.unsplash.com/photo-1589998059171-987d88716cc9?q=80&w=800&auto=format&fit=crop" 
  },
  "02": {
    text: "宸羽今天的拼寫非常正確，是個細心的小探險家，成功解開了寶藏密碼！",
    image: "https://images.unsplash.com/photo-1563241527-20044cb8fad0?q=80&w=800&auto=format&fit=crop"
  }
};

// ==========================================
// 2. 預設 6 大關卡 (結合梧南國小一年級多元評量)
// ==========================================
const INITIAL_STATIONS = [
  {
    id: 1, title: "第1關：琅琅上口", tag: "國語文表達",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
    description: "海盜船長要求大家朗讀航海日誌！請問在朗讀時，怎樣的表現最棒？",
    type: "multiple-choice", options: ["聲音響亮且帶有豐富情感", "越快唸完越厲害", "小小聲讓大家聽不見", "一邊跳舞一邊轉圈"],
    answer: 0, coinReward: 20, successMessage: "聲音宏亮！你絕對是個出色的航海發言人！",
    successImage: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2, title: "第2關：拼寫高手", tag: "ㄅㄆㄇ魔法",
    image: "https://images.unsplash.com/photo-1550592704-6c76defa99ce?q=80&w=800&auto=format&fit=crop",
    description: "開啟藏寶箱需要注音密碼！請問注音符號「ㄅㄆㄇ」中，總共有幾個聲符？",
    type: "multiple-choice", options: ["16 個", "21 個", "37 個", "18 個"],
    answer: 1, coinReward: 20, successMessage: "注音密碼破解成功！寶箱順利打開了！",
    successImage: "https://images.unsplash.com/photo-1599050751795-6cdaafbc2319?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3, title: "第3關：幾何小勇士", tag: "形狀與空間",
    image: "https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?q=80&w=800&auto=format&fit=crop",
    description: "在神秘島嶼上發現一塊石板，這塊石板有「四條一樣長的邊」和「四個直角」，請問它是什麼形狀？",
    type: "fill-in", options: [],
    answer: "正方形", coinReward: 30, successMessage: "形狀辨識完美！這就是傳說中的正方石板！",
    successImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4, title: "第4關：數學天才", tag: "生活數學算術",
    image: "https://images.unsplash.com/photo-1611125832047-1d7b420063fa?q=80&w=800&auto=format&fit=crop",
    description: "小海盜口袋裡有 8 顆金幣，船長又獎勵了 5 顆，請問他現在一共有幾顆？",
    type: "multiple-choice", options: ["11 顆", "12 顆", "13 顆", "14 顆"],
    answer: 2, coinReward: 20, successMessage: "計算完全正確！你擁有成為黃金算術大師的潛力！",
    successImage: "https://images.unsplash.com/photo-1596701053887-fdf051a37c04?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 5, title: "第5關：安全小尖兵", tag: "校園安全",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop",
    description: "在海盜船的走廊上活動時，哪種行為才是真正的安全小尖兵？",
    type: "multiple-choice", options: ["在走廊快速奔跑追逐", "走廊不奔跑、靠右慢行輕聲走", "滑著滑板穿過甲板", "爬到欄杆上探險"],
    answer: 1, coinReward: 20, successMessage: "沒錯！安全第一，才能繼續偉大的航道！",
    successImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 6, title: "第6關：清潔達人", tag: "環境與自理",
    image: "https://images.unsplash.com/photo-1528323273322-d81458248d40?q=80&w=800&auto=format&fit=crop",
    description: "尋寶活動結束後，發現自己的座位底下有紙屑和小垃圾，應該怎麼做？",
    type: "multiple-choice", options: ["踢到隔壁同學桌底", "裝作沒看見直接離開", "主動撿起並丟入垃圾桶", "留在原地等老師來清"],
    answer: 2, coinReward: 20, successMessage: "愛護環境最棒了！乾淨的船艙讓人心曠神怡！",
    successImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop"
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
  // 視圖狀態：home, admin_login, login, student_map, student_quiz, success_transition, wrong_transition, result, admin
  const [view, setView] = useState('home'); 
  
  // 系統儲存資料 (升級至 v8)
  const [themeSettings, setThemeSettings] = useState(() => JSON.parse(localStorage.getItem('wunan_115_v8_theme')) || { main: '梧南國小 115學年度', sub: '一年級多元闖關評量' });
  const [questions, setQuestions] = useState(() => JSON.parse(localStorage.getItem('wunan_115_v8_questions')) || INITIAL_STATIONS);
  const [gachaList, setGachaList] = useState(() => JSON.parse(localStorage.getItem('wunan_115_v8_gacha')) || INITIAL_GACHA);
  const [wrongPenalty, setWrongPenalty] = useState(() => Number(localStorage.getItem('wunan_115_v8_penalty')) || 5);
  const [studentRewards, setStudentRewards] = useState(() => JSON.parse(localStorage.getItem('wunan_115_v8_rewards')) || []);

  // 學生闖關狀態
  const [studentInfo, setStudentInfo] = useState({ id: '', name: '' });
  const [score, setScore] = useState(0); 
  const [completedStations, setCompletedStations] = useState([]); // 記錄已完成的關卡 ID
  const [activeStationId, setActiveStationId] = useState(null); // 目前正在挑戰的關卡 ID
  const [fillInText, setFillInText] = useState(''); 
  const [finalGacha, setFinalGacha] = useState(null); 
  const [studentFeedback, setStudentFeedback] = useState(null);

  // 教師後台狀態
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [editMainTitle, setEditMainTitle] = useState(themeSettings.main);
  const [editSubTitle, setEditSubTitle] = useState(themeSettings.sub);

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

  const [newRewardId, setNewRewardId] = useState('');
  const [newRewardText, setNewRewardText] = useState('');
  const [newRewardImage, setNewRewardImage] = useState('');

  // 儲存效應
  useEffect(() => localStorage.setItem('wunan_115_v8_theme', JSON.stringify(themeSettings)), [themeSettings]);
  useEffect(() => localStorage.setItem('wunan_115_v8_questions', JSON.stringify(questions)), [questions]);
  useEffect(() => localStorage.setItem('wunan_115_v8_gacha', JSON.stringify(gachaList)), [gachaList]);
  useEffect(() => localStorage.setItem('wunan_115_v8_penalty', wrongPenalty.toString()), [wrongPenalty]);
  useEffect(() => localStorage.setItem('wunan_115_v8_rewards', JSON.stringify(studentRewards)), [studentRewards]);

  // ==========================================
  // 遊戲流程邏輯
  // ==========================================
  const handleStartGame = () => { playSound('start'); setView('login'); };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!studentInfo.id || !studentInfo.name) return alert("請輸入座號與姓名！");
    setCompletedStations([]); // 清空進度
    setScore(0); 
    setView('student_map'); // 登入後進入「尋寶地圖」
  };

  const handleSelectStation = (id) => {
    if (completedStations.includes(id)) return;
    setActiveStationId(id);
    setFillInText('');
    setView('student_quiz');
  };

  const submitAnswer = (isCorrect) => {
    const currentQ = questions.find(q => q.id === activeStationId);
    if (isCorrect) {
      playSound('correct');
      setScore(prev => prev + (currentQ.coinReward || 20));
      setCompletedStations(prev => [...prev, activeStationId]);
      setView('success_transition');
    } else {
      playSound('wrong');
      setScore(prev => Math.max(0, prev - wrongPenalty));
      setView('wrong_transition');
    }
  };

  const goNextFromSuccess = () => {
    // 判斷是否所有關卡都完成了
    if (completedStations.length >= questions.length) {
      setFinalGacha(gachaList[Math.floor(Math.random() * gachaList.length)]);
      const customReward = studentRewards.find(r => r.id === studentInfo.id) || STUDENT_REWARDS_DB[studentInfo.id];
      const feedback = customReward || {
        text: `${studentInfo.name}，你展現了超棒的尋寶精神，成功將寶藏帶回海盜船！繼續保持喔！`,
        image: "https://images.unsplash.com/photo-1596701053887-fdf051a37c04?q=80&w=800&auto=format&fit=crop"
      };
      setStudentFeedback(feedback);
      setView('result');
    } else {
      // 尚未完成，回到尋寶地圖選關卡
      setView('student_map');
    }
  };

  // ==========================================
  // 教師後台邏輯
  // ==========================================
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPasswordInput === 'wunan') {
      setView('admin'); setAdminPasswordInput('');
    } else {
      alert("密碼錯誤！"); setAdminPasswordInput('');
    }
  };

  const handleUpdateTheme = (e) => {
    e.preventDefault();
    setThemeSettings({ main: editMainTitle, sub: editSubTitle });
    alert('✅ 主題名稱更新成功！');
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
    alert('✅ 關卡新增成功！');
    setNewTitle(''); setNewDesc(''); setNewImage(''); setNewSuccMsg(''); setNewSuccImg('');
  };

  const handleDeleteQ = (id) => {
    if (questions.length <= 1) return alert('至少需保留一個關卡！');
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleAddGacha = (e) => {
    e.preventDefault();
    if(!newGachaName) return;
    setGachaList([...gachaList, { id: Date.now(), name: newGachaName, emoji: newGachaEmoji }]);
    setNewGachaName('');
  };

  const handleAddStudentReward = (e) => {
    e.preventDefault();
    if (!newRewardId || !newRewardText) return alert("請輸入座號與專屬評語！");
    const existingIdx = studentRewards.findIndex(r => r.id === newRewardId);
    const newRewardObj = { id: newRewardId, text: newRewardText, image: newRewardImage || "https://images.unsplash.com/photo-1596701053887-fdf051a37c04?q=80&w=800&auto=format&fit=crop" };
    if (existingIdx >= 0) {
      const updated = [...studentRewards]; updated[existingIdx] = newRewardObj; setStudentRewards(updated);
      alert(`✅ 已更新座號 ${newRewardId} 的專屬獎勵！`);
    } else {
      setStudentRewards([...studentRewards, newRewardObj]); alert(`✅ 成功新增座號 ${newRewardId} 的專屬獎勵！`);
    }
    setNewRewardId(''); setNewRewardText(''); setNewRewardImage('');
  };

  const currentQ = questions.find(q => q.id === activeStationId);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-x-hidden font-sans selection:bg-amber-500 selection:text-stone-900">
      
      {/* 🏴‍☠️ 海盜與寶藏沉浸式背景 🏴‍☠️ */}
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1920&auto=format&fit=crop')` }}></div>
      <div className="fixed inset-0 z-0 bg-stone-950/70 backdrop-blur-[1px]"></div>
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,6,0.15)_0%,rgba(12,8,5,0.9)_100%)]"></div>
      <div className="fixed top-1/4 left-1/4 w-[40rem] h-[40rem] bg-amber-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

      {/* 右下角：低調的教師後台設定按鈕 */}
      {view === 'home' && (
        <button onClick={() => setView('admin_login')} className="fixed bottom-6 right-6 p-4 bg-stone-900/60 hover:bg-stone-800 border border-stone-600/50 rounded-full text-stone-400 hover:text-amber-400 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.6)] backdrop-blur-md z-50 group">
          <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
        </button>
      )}

      <div className="relative z-10 w-full max-w-4xl">
        
        {/* ==================== 1. 首頁大廳 ==================== */}
        {view === 'home' && (
          <div className="bg-stone-900/80 backdrop-blur-xl border border-amber-900/50 rounded-3xl p-8 sm:p-12 shadow-[0_0_60px_rgba(0,0,0,0.8)] text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-900/40 border border-amber-700/50 text-amber-400 text-xs font-bold tracking-widest uppercase mb-6 shadow-inner">
              <Anchor className="w-4 h-4 animate-pulse" /> 探險尋寶特攻隊
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-amber-100 via-amber-200 to-yellow-600 drop-shadow-md mb-4 leading-tight">
              {themeSettings.main}<br />{themeSettings.sub}
            </h1>
            <p className="text-stone-300 font-medium mb-10 max-w-md mx-auto leading-relaxed">
              勇敢的小海盜們！解開隱藏在各個島嶼的謎題，蒐集金幣，並抽取專屬於你的神祕盲盒寶物吧！
            </p>
            <div className="flex justify-center max-w-lg mx-auto">
              <button onClick={handleStartGame} className="flex items-center justify-center gap-3 bg-gradient-to-b from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-black py-4 px-10 rounded-2xl text-xl transition-transform hover:scale-[1.02] shadow-lg shadow-amber-900/40">
                <Key className="w-6 h-6" /> 登船出發尋寶
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
              <button type="submit" className="w-full bg-rose-700 hover:bg-rose-600 text-stone-50 font-bold py-4 rounded-xl text-lg transition-transform hover:scale-[1.02] shadow-lg">解鎖進入</button>
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
              <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-stone-50 font-bold py-4 rounded-xl text-lg transition-transform hover:scale-[1.02] shadow-lg mt-4">確認登錄，展開地圖</button>
            </form>
          </div>
        )}

        {/* ==================== 4. 尋寶地圖 (任選關卡) ==================== */}
        {view === 'student_map' && (
          <div className="bg-stone-900/90 backdrop-blur-xl border border-amber-900/50 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
            <div className="flex justify-between items-center mb-8 border-b border-stone-800 pb-4">
              <div className="text-stone-300 font-bold">航海士 <span className="text-amber-400">{studentInfo.name}</span></div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold px-3 py-1.5 bg-stone-800/80 text-stone-300 rounded-lg border border-stone-700">
                  進度 {completedStations.length} / {questions.length}
                </span>
                <span className="text-xs font-black px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 rounded-lg shadow-md flex items-center gap-1.5">
                  <Coins className="w-4 h-4" /> 金幣 {score}
                </span>
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-stone-50 mb-2 flex items-center gap-2">
               選擇你要挑戰的島嶼
            </h2>
            <p className="text-stone-400 mb-8 text-sm">點擊未完成的島嶼進行挑戰。全部通關後即可開啟最終寶藏！</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {questions.map((q, idx) => {
                const isDone = completedStations.includes(q.id);
                return (
                  <button 
                    key={q.id} 
                    onClick={() => handleSelectStation(q.id)}
                    disabled={isDone}
                    className={`relative rounded-2xl overflow-hidden text-left transition-all duration-300 border-2 ${isDone ? 'border-stone-800 opacity-60 cursor-not-allowed' : 'border-amber-700/50 hover:border-amber-400 hover:scale-[1.02] shadow-lg group'}`}
                  >
                    <div className="h-32 w-full bg-cover bg-center" style={{ backgroundImage: `url('${q.image}')` }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-xs font-bold text-amber-400 mb-1">{q.tag}</div>
                      <div className="font-bold text-stone-100 truncate text-sm">{q.title}</div>
                      <div className="flex items-center gap-1 text-xs text-yellow-500 mt-2 font-black">
                        <Coins className="w-3 h-3" /> {q.coinReward} 金幣
                      </div>
                    </div>

                    {isDone && (
                      <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-[2px] flex flex-col items-center justify-center">
                        <div className="bg-emerald-500/20 p-3 rounded-full border border-emerald-500/50 mb-2">
                          <Check className="w-8 h-8 text-emerald-400" />
                        </div>
                        <span className="text-emerald-400 font-bold text-sm">已通關</span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ==================== 5. 闖關測驗 UI ==================== */}
        {view === 'student_quiz' && currentQ && (
          <div className="bg-stone-900/95 border border-amber-900/50 rounded-3xl overflow-hidden shadow-2xl transition-transform duration-300 max-w-2xl mx-auto">
            <div className="h-56 sm:h-72 w-full relative group">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${currentQ.image}')` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/20 to-transparent"></div>
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                <button onClick={() => setView('student_map')} className="text-xs font-bold px-3 py-1.5 bg-stone-900/80 text-stone-300 rounded-lg border border-stone-700 backdrop-blur-md flex items-center gap-1 hover:text-amber-400">
                  <ArrowLeft className="w-3 h-3" /> 返回地圖
                </button>
                <span className="text-xs font-black px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 rounded-lg shadow-md flex items-center gap-1.5">
                  <Coins className="w-4 h-4" /> 金幣 {score}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 relative z-20 -mt-6">
              <div className="inline-block px-3 py-1 rounded-md bg-stone-800 border border-stone-700 text-amber-400 text-xs font-bold mb-4">{currentQ.tag}</div>
              <h2 className="text-2xl font-black text-stone-50 mb-3">{currentQ.title}</h2>
              <p className="text-stone-300 text-lg leading-relaxed mb-8 bg-stone-800/50 p-4 rounded-xl border border-stone-700/50">
                {currentQ.description}
              </p>

              {currentQ.type === 'multiple-choice' ? (
                <div className="space-y-3">
                  {currentQ.options.map((opt, idx) => (
                    <button key={idx} onClick={() => submitAnswer(idx === currentQ.answer)} className="w-full text-left p-4 rounded-xl font-bold bg-stone-800 hover:bg-stone-700 border border-stone-700 hover:border-amber-500 text-stone-200 transition-all flex items-center gap-4 group">
                      <span className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-sm border border-stone-700 group-hover:bg-amber-500/20 group-hover:text-amber-400 group-hover:border-amber-500 shrink-0">{String.fromCharCode(65 + idx)}</span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); if(fillInText.trim()) submitAnswer(fillInText.trim() === currentQ.answer); }} className="flex flex-col sm:flex-row gap-3">
                  <input type="text" value={fillInText} onChange={e => setFillInText(e.target.value)} placeholder="請輸入你的答案..." className="flex-1 bg-stone-950 border border-stone-700 rounded-xl p-4 text-stone-100 text-lg focus:outline-none focus:border-amber-500 transition-colors" />
                  <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-stone-50 font-bold px-8 py-4 rounded-xl shadow-lg whitespace-nowrap">送出答案</button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ==================== 6. 答對畫面 ==================== */}
        {view === 'success_transition' && currentQ && (
          <div className="bg-stone-900/95 border border-emerald-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.15)] text-center relative animate-[fade-in_0.5s_ease-out] max-w-2xl mx-auto">
            <div className="h-64 w-full bg-cover bg-center" style={{ backgroundImage: `url('${currentQ.successImage}')` }}></div>
            <div className="p-8 sm:p-10 relative z-20 -mt-8 bg-gradient-to-b from-transparent to-stone-900 via-stone-900 pt-10">
              <div className="w-20 h-20 mx-auto bg-emerald-500 rounded-full flex items-center justify-center border-4 border-stone-900 shadow-xl -mt-20 mb-6 relative z-30">
                <CheckCircle className="w-10 h-10 text-stone-50" />
              </div>
              <h2 className="text-3xl font-black text-emerald-400 mb-4">挑戰成功！</h2>
              <p className="text-stone-200 text-lg font-medium bg-stone-800 p-5 rounded-2xl border border-stone-700 shadow-inner mb-8">
                {currentQ.successMessage}
              </p>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-6 py-2 rounded-full mb-8">
                <Coins className="w-5 h-5 text-amber-500" />
                <span className="text-amber-400 font-bold">獲得 {currentQ.coinReward || 20} 枚金幣</span>
              </div>
              <br />
              <button onClick={goNextFromSuccess} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-10 rounded-xl text-lg shadow-lg flex items-center gap-2 mx-auto transition-transform hover:scale-[1.02]">
                {completedStations.length >= questions.length ? "領取最終寶藏！" : "返回地圖繼續探險"} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ==================== 7. 答錯專屬畫面 ==================== */}
        {view === 'wrong_transition' && (
          <div className="bg-stone-900/95 border border-rose-500/50 rounded-3xl p-8 sm:p-12 shadow-[0_0_60px_rgba(244,63,94,0.2)] text-center relative animate-[shake_0.5s_ease-in-out] max-w-xl mx-auto">
            <div className="w-24 h-24 mx-auto bg-rose-500/20 rounded-full flex items-center justify-center mb-6 border-2 border-rose-500/40">
              <XCircle className="w-12 h-12 text-rose-500" />
            </div>
            <h2 className="text-3xl font-black text-stone-100 mb-4">哎呀！好像不對喔～</h2>
            <p className="text-stone-300 text-lg mb-8 max-w-md mx-auto">
              海上探險難免會遇到大風大浪，請再仔細觀察題目，重新挑戰一次吧！
            </p>
            {wrongPenalty > 0 && (
              <div className="inline-flex items-center gap-2 bg-rose-950/50 border border-rose-900/50 px-5 py-2 rounded-full mb-8 text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span className="text-rose-300 font-bold">答錯掉落了 {wrongPenalty} 枚金幣</span>
              </div>
            )}
            <br />
            <button onClick={() => { setFillInText(''); setView('student_quiz'); }} className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 px-12 rounded-xl text-lg shadow-lg transition-transform hover:scale-[1.02]">
              再試一次
            </button>
          </div>
        )}

        {/* ==================== 8. 結算與專屬座號獎勵畫面 ==================== */}
        {view === 'result' && (
          <div className="bg-stone-900/90 backdrop-blur-xl border border-amber-900/50 rounded-3xl p-6 sm:p-10 shadow-2xl text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-stone-100 mb-2">所有島嶼探索完成！</h2>
            <div className="text-stone-300 mb-6 font-medium">總共蒐集到了 <span className="text-amber-400 font-bold text-3xl mx-2">{score}</span> 枚金幣</div>

            {studentFeedback && (
              <div className="mb-8">
                <img src={studentFeedback.image} alt="專屬獎勵圖" className="w-full h-48 sm:h-64 object-cover rounded-2xl border-2 border-amber-500/50 shadow-lg mb-4" />
                <div className="bg-stone-800/80 border border-amber-600/40 rounded-2xl p-5 shadow-inner text-amber-100 text-left relative">
                  <div className="absolute -top-3 left-4 bg-amber-600 text-xs font-bold px-3 py-0.5 rounded text-white shadow-md flex items-center gap-1">
                    <Anchor className="w-3 h-3" /> 船長的話
                  </div>
                  <p className="mt-2 leading-relaxed text-sm sm:text-base font-medium">
                    {studentFeedback.text}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-stone-800 to-stone-900 border border-stone-700 rounded-3xl p-6 mb-8 relative shadow-inner">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-600 text-stone-50 text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5"><Gift className="w-4 h-4" /> 通關專屬盲盒</div>
              <p className="text-stone-300 text-sm mb-3 mt-2">恭喜 {studentInfo.name} 抽中神秘大獎：</p>
              <div className="text-6xl mb-3 animate-bounce">{finalGacha?.emoji}</div>
              <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">{finalGacha?.name}</div>
            </div>

            <button onClick={() => setView('home')} className="bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-200 font-bold py-4 px-10 rounded-xl transition-colors">
              返回甲板首頁
            </button>
          </div>
        )}

        {/* ==================== 9. 教師後台管理中心 ==================== */}
        {view === 'admin' && (
          <div className="bg-stone-900/95 backdrop-blur-xl border border-amber-900/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-stone-800">
              <button onClick={() => setView('home')} className="text-stone-400 hover:text-stone-200 flex items-center gap-2 font-bold transition-colors">
                <ArrowLeft className="w-4 h-4" /> 登出後台
              </button>
              <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-500" /> 船長管理室
              </h2>
            </div>

            {/* 自訂主題名稱 */}
            <div className="mb-10 bg-stone-950/50 border border-stone-800 rounded-2xl p-5">
              <h3 className="font-bold text-amber-400 flex items-center gap-2 mb-4 border-l-4 border-amber-500 pl-3">
                <Type className="w-5 h-5" /> 遊戲主題名稱設定
              </h3>
              <form onSubmit={handleUpdateTheme} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-stone-400 mb-1 block">主標題</label>
                    <input type="text" value={editMainTitle} onChange={e => setEditMainTitle(e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-lg p-3 text-stone-200 text-sm outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="text-xs text-stone-400 mb-1 block">副標題</label>
                    <input type="text" value={editSubTitle} onChange={e => setEditSubTitle(e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-lg p-3 text-stone-200 text-sm outline-none focus:border-amber-500" />
                  </div>
                </div>
                <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-stone-50 font-bold py-2.5 px-6 rounded-lg transition-colors w-full sm:w-auto">
                  儲存主題名稱
                </button>
              </form>
            </div>

            {/* 難度設定 */}
            <div className="mb-10 bg-stone-950/50 border border-stone-800 rounded-2xl p-5">
              <h3 className="font-bold text-rose-400 flex items-center gap-2 mb-4 border-l-4 border-rose-500 pl-3">
                <AlertTriangle className="w-5 h-5" /> 遊戲難度設定
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-stone-200 font-bold mb-1">答錯扣除金幣數量</div>
                  <div className="text-xs text-stone-500">學生答錯時會扣除的金幣 (最低不低於 0)</div>
                </div>
                <input type="number" min="0" value={wrongPenalty} onChange={e => setWrongPenalty(Number(e.target.value))} className="w-24 bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-stone-200 text-center font-bold outline-none focus:border-rose-500" />
              </div>
            </div>

            {/* 專屬學生獎勵管理 */}
            <div className="mb-10 bg-stone-950/50 border border-stone-800 rounded-2xl p-5">
              <h3 className="font-bold text-cyan-400 flex items-center gap-2 mb-4 border-l-4 border-cyan-500 pl-3">
                <Users className="w-5 h-5" /> 學生過關專屬圖文管理
              </h3>
              <form onSubmit={handleAddStudentReward} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-stone-400 mb-1 block">設定座號 (例如：01)</label>
                    <input type="text" placeholder="輸入座號..." value={newRewardId} onChange={e => setNewRewardId(e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-lg p-3 text-stone-200 text-sm outline-none focus:border-cyan-500" />
                  </div>
                  <div>
                    <label className="text-xs text-stone-400 mb-1 block">專屬客製化圖片網址 (URL)</label>
                    <input type="text" placeholder="貼上你設計好的圖片網址..." value={newRewardImage} onChange={e => setNewRewardImage(e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-lg p-3 text-stone-200 text-sm outline-none focus:border-cyan-500" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-stone-400 mb-1 block">給他的專屬評語 (船長的話)</label>
                  <textarea placeholder="例如：沛均表現得很好..." value={newRewardText} onChange={e => setNewRewardText(e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-lg p-3 text-stone-200 text-sm outline-none focus:border-cyan-500" rows="2" />
                </div>
                <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 px-6 rounded-lg transition-colors w-full sm:w-auto">
                  儲存專屬獎勵
                </button>
              </form>

              {studentRewards.length > 0 && (
                <div className="mt-6 border-t border-stone-800 pt-4">
                  <div className="text-xs text-stone-400 mb-3">已設定的專屬座號清單：</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {studentRewards.map(r => (
                      <div key={r.id} className="bg-stone-900 border border-stone-700 p-3 rounded-xl flex items-start gap-3">
                        <img src={r.image} alt="reward" className="w-12 h-12 rounded-lg object-cover border border-stone-600 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-amber-400 font-black text-sm">座號: {r.id}</div>
                          <div className="text-stone-300 text-xs truncate mt-1">{r.text}</div>
                        </div>
                        <button onClick={() => setStudentRewards(studentRewards.filter(sr => sr.id !== r.id))} className="text-stone-500 hover:text-rose-400 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 新增題目/關卡 */}
            <div className="mb-10">
              <h3 className="font-bold text-amber-400 flex items-center gap-2 mb-4 border-l-4 border-amber-500 pl-3"><Edit3 className="w-5 h-5" /> 新增地圖島嶼 (評量關卡)</h3>
              <form onSubmit={handleAddQuestion} className="bg-stone-950/50 border border-stone-800 rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="關卡名稱 (例：第7關...)" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="bg-stone-900 border border-stone-700 rounded-lg p-3 text-stone-200 text-sm outline-none focus:border-amber-500" />
                  <input type="text" placeholder="領域標籤 (例：自然科學)" value={newTag} onChange={e => setNewTag(e.target.value)} className="bg-stone-900 border border-stone-700 rounded-lg p-3 text-stone-200 text-sm outline-none focus:border-amber-500" />
                </div>
                <input type="text" placeholder="島嶼背景圖片網址 (URL)" value={newImage} onChange={e => setNewImage(e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-lg p-3 text-stone-200 text-sm outline-none focus:border-amber-500" />
                <textarea placeholder="題目描述..." value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-lg p-3 text-stone-200 text-sm outline-none focus:border-amber-500" rows="2" />
                
                <div className="flex items-center gap-4 bg-stone-900 p-3 rounded-lg border border-stone-700">
                  <span className="text-stone-400 text-sm font-bold">題型設定：</span>
                  <label className="flex items-center gap-2 text-sm text-stone-200"><input type="radio" checked={qType === 'multiple-choice'} onChange={() => setQType('multiple-choice')} className="accent-amber-500" /> 選擇題</label>
                  <label className="flex items-center gap-2 text-sm text-stone-200"><input type="radio" checked={qType === 'fill-in'} onChange={() => setQType('fill-in')} className="accent-amber-500" /> 填充題</label>
                </div>

                {qType === 'multiple-choice' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-900/50 p-4 rounded-lg border border-stone-800">
                    {newOptions.map((opt, i) => <input key={i} type="text" placeholder={`選項 ${String.fromCharCode(65 + i)}`} value={opt} onChange={e => { const up = [...newOptions]; up[i] = e.target.value; setNewOptions(up); }} className="bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-stone-200 text-sm outline-none focus:border-amber-500" />)}
                    <div className="col-span-1 sm:col-span-2 flex items-end justify-end mt-2 gap-3"><span className="text-sm font-bold text-stone-400">正確解答：</span><select value={newMCQAnswer} onChange={e => setNewMCQAnswer(e.target.value)} className="bg-stone-900 border border-stone-700 rounded-lg p-2 text-stone-200 text-sm font-bold outline-none"><option value={0}>選項 A</option><option value={1}>選項 B</option><option value={2}>選項 C</option><option value={3}>選項 D</option></select></div>
                  </div>
                ) : (
                  <div className="bg-stone-900/50 p-4 rounded-lg border border-stone-800"><input type="text" placeholder="請輸入正確的填充題文字解答" value={newFillAnswer} onChange={e => setNewFillAnswer(e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-lg p-3 text-stone-200 text-sm outline-none focus:border-amber-500 font-bold" /></div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-stone-800 pt-4">
                  <div><label className="text-xs text-stone-400 mb-1 block">答對獲得金幣</label><input type="number" placeholder="預設 20" value={newCoin} onChange={e => setNewCoin(e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-stone-200 text-sm outline-none focus:border-amber-500" /></div>
                  <div><label className="text-xs text-stone-400 mb-1 block">過關稱讚話語</label><input type="text" placeholder="例：太棒了！" value={newSuccMsg} onChange={e => setNewSuccMsg(e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-stone-200 text-sm outline-none focus:border-amber-500" /></div>
                  <div className="sm:col-span-2"><label className="text-xs text-stone-400 mb-1 block">過關獎勵圖片 (URL)</label><input type="text" placeholder="貼上圖片網址" value={newSuccImg} onChange={e => setNewSuccImg(e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-stone-200 text-sm outline-none focus:border-amber-500" /></div>
                </div>
                <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-stone-50 font-bold py-3 rounded-lg mt-2 transition-colors">儲存並新增關卡</button>
              </form>
            </div>

            {/* 現有題庫清單 (支援刪除) */}
            <div className="mb-10">
              <h3 className="font-bold text-stone-300 flex items-center gap-2 mb-4 border-l-4 border-stone-500 pl-3">地圖島嶼清單 (共 {questions.length} 關)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                {questions.map((q, idx) => (
                  <div key={q.id} className="bg-stone-950 border border-stone-800 p-3 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-cover bg-center shrink-0" style={{backgroundImage: `url('${q.image}')`}}></div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-stone-200 truncate">{q.title}</div>
                        <div className="text-xs text-amber-500 font-bold">{q.coinReward} 金幣</div>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteQ(q.id)} className="text-stone-500 hover:text-rose-400 p-2 bg-stone-900 rounded-lg transition-colors shrink-0">
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
