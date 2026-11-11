import React, { useState, useEffect } from 'react';
import { Trophy, Users, Settings, Plus, Trash2, ArrowLeft, CheckCircle, Compass, Map, Key, Sparkles, Award } from 'lucide-react';

// 寶藏解謎主題預設題庫
const INITIAL_QUESTIONS = [
  {
    id: 1,
    title: "第一站：藏寶圖起點 - 校園地理王",
    description: "相傳藏寶圖的第一個線索藏在第二期校庭建築中，請問這棟建築的名稱是什麼？",
    options: ["映霞樓", "迎曦樓", "梧南樓", "海風樓"],
    answer: 0
  },
  {
    id: 2,
    title: "第二站：密碼解碼室 - 語文金頭腦",
    description: "要開啟第二道寶箱鎖，必須破解注音符號（ㄅㄆㄇ）的祕密：總共有多少個聲符？",
    options: ["17個", "21個", "24個", "37個"],
    answer: 1
  },
  {
    id: 3,
    title: "第三站：尋寶大廳 - 校園生活通",
    description: "守護這座梧南寶藏的學校代表吉祥物是哪一個？",
    options: ["台灣黑熊", "海豚", "石虎", "梅花鹿"],
    answer: 1
  }
];

export default function App() {
  const [view, setView] = useState('home'); // 'home', 'student', 'admin', 'quiz'
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('wunan_treasure_questions');
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  // 學生闖關狀態
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  // 老師後台新增表單狀態
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newAnswer, setNewAnswer] = useState(0);

  useEffect(() => {
    localStorage.setItem('wunan_treasure_questions', JSON.stringify(questions));
  }, [questions]);

  // 處理學生答題
  const handleAnswer = (idx) => {
    setSelectedOpt(idx);
    if (idx === questions[currentIdx].answer) {
      setScore(score + 25);
    }
    setTimeout(() => {
      setSelectedOpt(null);
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx(currentIdx + 1);
      } else {
        setIsFinished(true);
      }
    }, 1000);
  };

  // 老師新增題目
  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newTitle || !newDesc || newOptions.some(opt => !opt)) {
      alert('請填寫完整的關卡標題、謎題與所有選項！');
      return;
    }
    const newQ = {
      id: Date.now(),
      title: newTitle,
      description: newDesc,
      options: [...newOptions],
      answer: Number(newAnswer)
    };
    setQuestions([...questions, newQ]);
    setNewTitle('');
    setNewDesc('');
    setNewOptions(['', '', '', '']);
    alert('成功新增藏寶關卡！');
  };

  // 刪除題目
  const handleDeleteQ = (id) => {
    if (questions.length <= 1) {
      alert('藏寶圖至少需保留一個關卡！');
      return;
    }
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-slate-900 to-indigo-950 text-amber-50 flex flex-col items-center justify-center p-4">
      {/* 寶藏大廳首頁 */}
      {view === 'home' && (
        <div className="max-w-xl w-full bg-slate-900/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl text-center border-2 border-amber-500/40 relative overflow-hidden">
          {/* 裝飾光暈 */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="inline-flex p-4 bg-amber-500/20 rounded-2xl mb-4 text-amber-400 border border-amber-500/30">
            <Compass className="w-14 h-14 animate-spin-slow" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-wide bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent">
            🗺️ 梧南國小 實境解謎藏寶圖
          </h1>
          <p className="text-amber-200/80 mb-8 text-sm sm:text-base leading-relaxed">
            歡迎來到校園尋寶大廳！準備好運用你的智慧，解開藏寶圖中的所有謎題了嗎？
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => { setView('student'); setCurrentIdx(0); setScore(0); setIsFinished(false); }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-extrabold py-4 px-6 rounded-2xl transition shadow-lg shadow-amber-950/50 group"
            >
              <Key className="w-5 h-5 group-hover:scale-110 transition-transform" /> 開始尋寶闖關
            </button>
            <button
              onClick={() => setView('admin')}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 px-6 rounded-2xl transition shadow-lg shadow-indigo-950/50 group"
            >
              <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> 老師藏寶後台
            </button>
          </div>
          
          <footer className="mt-10 text-xs text-amber-400/60 border-t border-amber-500/20 pt-4 flex items-center justify-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 台中市梧棲區梧南國小 115學年度多元解謎系統
          </footer>
        </div>
      )}

      {/* 學生尋寶闖關介面 */}
      {view === 'student' && !isFinished && questions.length > 0 && (
        <div className="max-w-xl w-full bg-slate-900/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-2 border-amber-500/40 relative">
          <div className="flex justify-between items-center mb-6 border-b border-amber-500/20 pb-4">
            <button onClick={() => setView('home')} className="text-amber-200/70 hover:text-amber-300 flex items-center gap-1 text-sm font-medium transition">
              <ArrowLeft className="w-4 h-4" /> 返回大廳
            </button>
            <span className="text-xs font-extrabold px-3.5 py-1 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30 flex items-center gap-1">
               關卡 {currentIdx + 1} / {questions.length}
            </span>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-amber-300 mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" /> {questions[currentIdx].title}
            </h2>
            <p className="text-amber-50/90 text-lg leading-relaxed bg-slate-950/50 p-4 rounded-2xl border border-amber-500/10">
              {questions[currentIdx].description}
            </p>
          </div>

          <div className="space-y-3">
            {questions[currentIdx].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selectedOpt !== null}
                className={`w-full text-left p-4 rounded-2xl font-semibold transition border text-base flex items-center justify-between ${
                  selectedOpt === null
                    ? 'bg-slate-800/90 hover:bg-slate-800 border-amber-500/20 text-amber-100 hover:border-amber-400 shadow-md'
                    : selectedOpt === idx
                    ? idx === questions[currentIdx].answer ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-900/40' : 'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-900/40'
                    : idx === questions[currentIdx].answer ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-900/40' : 'bg-slate-800/40 border-slate-700 text-amber-400/40 opacity-50'
                }`}
              >
                <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                <span className="w-7 h-7 rounded-full bg-slate-900/60 flex items-center justify-center text-xs border border-amber-500/20">
                  {String.fromCharCode(65 + idx)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 尋寶完成頁面 */}
      {view === 'student' && isFinished && (
        <div className="max-w-xl w-full bg-slate-900/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl text-center border-2 border-amber-500/40">
          <div className="inline-flex p-4 bg-amber-500/20 rounded-3xl mb-4 text-amber-400 border border-amber-500/30">
            <Trophy className="w-16 h-16 animate-bounce" />
          </div>
          <h2 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
            🎉 恭喜尋寶成功！
          </h2>
          <p className="text-amber-100/90 mb-6 text-lg">
            你已成功解開所有謎題，獲得寶藏積分：<span className="text-amber-400 font-extrabold text-3xl">{score}</span> 分
          </p>
          <button
            onClick={() => setView('home')}
            className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-extrabold py-3 px-8 rounded-2xl transition shadow-lg shadow-amber-950/50"
          >
            返回寶藏大廳
          </button>
        </div>
      )}

      {/* 老師藏寶管理後台 */}
      {view === 'admin' && (
        <div className="max-w-2xl w-full bg-slate-900/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-2 border-amber-500/40">
          <div className="flex justify-between items-center mb-6 border-b border-amber-500/20 pb-4">
            <button onClick={() => setView('home')} className="text-amber-200/70 hover:text-amber-300 flex items-center gap-1 text-sm font-medium transition">
              <ArrowLeft className="w-4 h-4" /> 返回大廳
            </button>
            <h2 className="text-xl font-bold text-amber-300 flex items-center gap-2">
              <Settings className="w-5 h-5" /> 老師藏寶題庫後台
            </h2>
          </div>

          {/* 新增題目表單 */}
          <form onSubmit={handleAddQuestion} className="bg-slate-950/80 p-5 rounded-2xl mb-6 border border-amber-500/20 space-y-4">
            <h3 className="font-bold text-amber-200 flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4 text-amber-400" /> 新增藏寶關卡與謎題
            </h3>
            <input
              type="text"
              placeholder="關卡標題 (例如：第四站：神祕寶箱)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-900 border border-amber-500/30 rounded-xl p-3 text-sm text-amber-100 placeholder-amber-400/30 focus:outline-none focus:border-amber-400"
            />
            <textarea
              placeholder="謎題內容描述..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full bg-slate-900 border border-amber-500/30 rounded-xl p-3 text-sm text-amber-100 placeholder-amber-400/30 focus:outline-none focus:border-amber-400"
              rows="2"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {newOptions.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`選項 ${String.fromCharCode(65 + i)}`}
                  value={opt}
                  onChange={(e) => {
                    const updated = [...newOptions];
                    updated[i] = e.target.value;
                    setNewOptions(updated);
                  }}
                  className="bg-slate-900 border border-amber-500/30 rounded-xl p-2.5 text-sm text-amber-100 placeholder-amber-400/30 focus:outline-none focus:border-amber-400"
                />
              ))}
            </div>
            <div className="flex items-center justify-between pt-2">
              <label className="text-sm text-amber-200 font-medium">正確答案：
                <select
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="ml-2 bg-slate-900 border border-amber-500/30 rounded-xl p-2 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                >
                  <option value={0}>選項 A</option>
                  <option value={1}>選項 B</option>
                  <option value={2}>選項 C</option>
                  <option value={3}>選項 D</option>
                </select>
              </label>
              <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-extrabold py-2.5 px-5 rounded-xl transition shadow-md">
                確認新增關卡
              </button>
            </div>
          </form>

          {/* 現有題庫清單 */}
          <h3 className="font-bold text-amber-200 mb-3 text-sm flex items-center justify-between">
            <span>現有藏寶關卡清單</span>
            <span className="text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full text-xs border border-amber-500/30">共 {questions.length} 關</span>
          </h3>
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {questions.map((q, index) => (
              <div key={q.id} className="bg-slate-950/60 p-3.5 rounded-xl border border-amber-500/20 flex justify-between items-center">
                <div>
                  <span className="text-xs text-amber-400 font-extrabold mr-2">#{index + 1}</span>
                  <span className="font-semibold text-sm text-amber-100">{q.title}</span>
                  <p className="text-xs text-amber-200/60 truncate max-w-xs mt-0.5">{q.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteQ(q.id)}
                  className="text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-500/15 transition"
                  title="刪除此題"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
