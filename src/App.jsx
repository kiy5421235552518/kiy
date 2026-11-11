import React, { useState, useEffect } from 'react';
import { Trophy, Users, Settings, Plus, Trash2, ArrowLeft, CheckCircle, Star, Sparkles, Award } from 'lucide-react';

// 梧南國小多元闖關預設題庫
const INITIAL_QUESTIONS = [
  {
    id: 1,
    title: "第一關：校園地理王",
    description: "請問梧南國小的第二期校庭建築名稱是什麼？",
    options: ["映霞樓", "迎曦樓", "梧南樓", "海風樓"],
    answer: 0
  },
  {
    id: 2,
    title: "第二關：語文金頭腦",
    description: "在注音符號（ㄅㄆㄇ）中，總共有多少個聲符？",
    options: ["17個", "21個", "24個", "37個"],
    answer: 1
  },
  {
    id: 3,
    title: "第三關：校園生活通",
    description: "下列哪一個吉祥物是我們梧南國小的代表？",
    options: ["台灣黑熊", "海豚", "石虎", "梅花鹿"],
    answer: 1
  }
];

export default function App() {
  const [view, setView] = useState('home'); // 'home', 'student', 'admin', 'quiz'
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('wunan_quiz_questions');
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
    localStorage.setItem('wunan_quiz_questions', JSON.stringify(questions));
  }, [questions]);

  // 處理學生答題
  const handleAnswer = (idx) => {
    setSelectedOpt(idx);
    if (idx === questions[currentIdx].answer) {
      setScore(score + 20);
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
      alert('請填寫完整的題目與所有選項！');
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
    alert('成功新增題目！');
  };

  // 刪除題目
  const handleDeleteQ = (id) => {
    if (questions.length <= 1) {
      alert('至少需保留一題！');
      return;
    }
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
      {/* 首頁大廳 */}
      {view === 'home' && (
        <div className="max-w-xl w-full bg-slate-800/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl text-center border border-indigo-500/30 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="inline-flex p-3 bg-indigo-500/20 rounded-2xl mb-4 text-amber-400">
            <Trophy className="w-12 h-12 animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight bg-gradient-to-r from-amber-200 via-white to-indigo-200 bg-clip-text text-transparent">
            梧南國小 115學年度多元闖關平台
          </h1>
          <p className="text-indigo-200/80 mb-8 text-sm sm:text-base">
            歡迎來到梧南闖關大廳，準備好展開精彩有趣的校園實境解謎與多元評量挑戰了嗎？
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => { setView('student'); setCurrentIdx(0); setScore(0); setIsFinished(false); }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold py-4 px-6 rounded-2xl transition shadow-lg shadow-emerald-900/30 group"
            >
              <Users className="w-5 h-5 group-hover:scale-110 transition-transform" /> 我是學生闖關
            </button>
            <button
              onClick={() => setView('admin')}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 font-bold py-4 px-6 rounded-2xl transition shadow-lg shadow-indigo-900/30 group"
            >
              <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> 老師管理後台
            </button>
          </div>
          
          <footer className="mt-10 text-xs text-slate-400 border-t border-slate-700/60 pt-4 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 台中市梧棲區梧南國小 115學年度多元評量系統
          </footer>
        </div>
      )}

      {/* 學生闖關介面 */}
      {view === 'student' && !isFinished && questions.length > 0 && (
        <div className="max-w-xl w-full bg-slate-800/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-indigo-500/30">
          <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
            <button onClick={() => setView('home')} className="text-slate-400 hover:text-white flex items-center gap-1 text-sm font-medium transition">
              <ArrowLeft className="w-4 h-4" /> 返回大廳
            </button>
            <span className="text-xs font-bold px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
              關卡 {currentIdx + 1} / {questions.length}
            </span>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-bold text-amber-300 mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" /> {questions[currentIdx].title}
            </h2>
            <p className="text-slate-200 text-lg leading-relaxed">{questions[currentIdx].description}</p>
          </div>

          <div className="space-y-3">
            {questions[currentIdx].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selectedOpt !== null}
                className={`w-full text-left p-4 rounded-2xl font-semibold transition border text-base flex items-center justify-between ${
                  selectedOpt === null
                    ? 'bg-slate-700/80 hover:bg-slate-700 border-slate-600 text-slate-100 hover:border-indigo-400'
                    : selectedOpt === idx
                    ? idx === questions[currentIdx].answer ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/40' : 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-900/40'
                    : idx === questions[currentIdx].answer ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/40' : 'bg-slate-700/40 border-slate-700 text-slate-400 opacity-50'
                }`}
              >
                <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                <span className="w-7 h-7 rounded-full bg-slate-900/40 flex items-center justify-center text-xs">
                  {String.fromCharCode(65 + idx)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 闖關完成頁面 */}
      {view === 'student' && isFinished && (
        <div className="max-w-xl w-full bg-slate-800/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl text-center border border-indigo-500/30">
          <div className="inline-flex p-4 bg-emerald-500/20 rounded-3xl mb-4 text-emerald-400">
            <CheckCircle className="w-16 h-16 animate-bounce" />
          </div>
          <h2 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent">
            恭喜完成所有挑戰！
          </h2>
          <p className="text-slate-300 mb-6 text-lg">
            你的總得分：<span className="text-amber-400 font-extrabold text-3xl">{score}</span> 分
          </p>
          <button
            onClick={() => setView('home')}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 font-bold py-3 px-8 rounded-2xl transition shadow-lg shadow-indigo-900/30"
          >
            返回首頁大廳
          </button>
        </div>
      )}

      {/* 老師後台介面 */}
      {view === 'admin' && (
        <div className="max-w-2xl w-full bg-slate-800/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-indigo-500/30">
          <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
            <button onClick={() => setView('home')} className="text-slate-400 hover:text-white flex items-center gap-1 text-sm font-medium transition">
              <ArrowLeft className="w-4 h-4" /> 返回大廳
            </button>
            <h2 className="text-xl font-bold text-indigo-400 flex items-center gap-2">
              <Settings className="w-5 h-5" /> 老師題庫管理後台
            </h2>
          </div>

          {/* 新增題目表單 */}
          <form onSubmit={handleAddQuestion} className="bg-slate-900/80 p-5 rounded-2xl mb-6 border border-slate-700 space-y-4">
            <h3 className="font-bold text-slate-200 flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4 text-indigo-400" /> 新增闖關題目
            </h3>
            <input
              type="text"
              placeholder="關卡標題 (例如：第四關：科學達人)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <textarea
              placeholder="題目內容描述..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
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
                  className="bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              ))}
            </div>
            <div className="flex items-center justify-between pt-2">
              <label className="text-sm text-slate-300 font-medium">正確答案：
                <select
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="ml-2 bg-slate-800 border border-slate-700 rounded-xl p-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value={0}>選項 A</option>
                  <option value={1}>選項 B</option>
                  <option value={2}>選項 C</option>
                  <option value={3}>選項 D</option>
                </select>
              </label>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-sm font-bold py-2.5 px-5 rounded-xl transition shadow-md shadow-indigo-900/30">
                確認新增題目
              </button>
            </div>
          </form>

          {/* 現有題目列表 */}
          <h3 className="font-bold text-slate-200 mb-3 text-sm flex items-center justify-between">
            <span>現有題庫清單</span>
            <span className="text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full text-xs border border-indigo-500/20">共 {questions.length} 題</span>
          </h3>
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {questions.map((q, index) => (
              <div key={q.id} className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/80 flex justify-between items-center">
                <div>
                  <span className="text-xs text-indigo-400 font-extrabold mr-2">#{index + 1}</span>
                  <span className="font-semibold text-sm text-slate-200">{q.title}</span>
                  <p className="text-xs text-slate-400 truncate max-w-xs mt-0.5">{q.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteQ(q.id)}
                  className="text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-500/10 transition"
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
