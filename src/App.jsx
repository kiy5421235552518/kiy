import React, { useState, useEffect } from 'react';
import { Trophy, Users, Settings, Plus, Trash2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

// 預設題庫資料
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
    description: "在注音符號中，總共有多少個聲符？",
    options: ["17個", "21個", "24個", "37個"],
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
      setScore(score + 10);
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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
      {/* 首頁大廳 */}
      {view === 'home' && (
        <div className="max-w-xl w-full bg-slate-800 p-8 rounded-2xl shadow-2xl text-center border border-slate-700">
          <Trophy className="w-16 h-16 mx-auto text-amber-400 mb-4 animate-bounce" />
          <h1 className="text-3xl font-bold mb-2">梧南國小 115學年度多元闖關平台</h1>
          <p className="text-slate-400 mb-8">歡迎來到梧南闖關大廳，請選擇你的身分來登入：</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => { setView('student'); setCurrentIdx(0); setScore(0); setIsFinished(false); }}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 font-semibold py-3 px-6 rounded-xl transition shadow-lg"
            >
              <Users className="w-5 h-5" /> 我是學生闖關
            </button>
            <button
              onClick={() => setView('admin')}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 font-semibold py-3 px-6 rounded-xl transition shadow-lg"
            >
              <Settings className="w-5 h-5" /> 老師管理後台
            </button>
          </div>
          <footer className="mt-8 text-xs text-slate-500">台中市梧棲區梧南國小 115學年度多元評量系統</footer>
        </div>
      )}

      {/* 學生闖關介面 */}
      {view === 'student' && !isFinished && questions.length > 0 && (
        <div className="max-w-xl w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setView('home')} className="text-slate-400 hover:text-white flex items-center gap-1 text-sm">
              <ArrowLeft className="w-4 h-4" /> 返回大廳
            </button>
            <span className="text-sm font-semibold text-emerald-400">關卡 {currentIdx + 1} / {questions.length}</span>
          </div>
          <h2 className="text-xl font-bold text-amber-300 mb-2">{questions[currentIdx].title}</h2>
          <p className="text-slate-200 text-lg mb-6">{questions[currentIdx].description}</p>
          <div className="space-y-3">
            {questions[currentIdx].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selectedOpt !== null}
                className={`w-full text-left p-4 rounded-xl font-medium transition border ${
                  selectedOpt === null
                    ? 'bg-slate-700 hover:bg-slate-600 border-slate-600'
                    : selectedOpt === idx
                    ? idx === questions[currentIdx].answer ? 'bg-emerald-600 border-emerald-500' : 'bg-rose-600 border-rose-500'
                    : idx === questions[currentIdx].answer ? 'bg-emerald-600 border-emerald-500' : 'bg-slate-700 border-slate-600 opacity-50'
                }`}
              >
                {String.fromCharCode(65 + idx)}. {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 闖關完成頁面 */}
      {view === 'student' && isFinished && (
        <div className="max-w-xl w-full bg-slate-800 p-8 rounded-2xl shadow-2xl text-center border border-slate-700">
          <CheckCircle className="w-16 h-16 mx-auto text-emerald-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">恭喜完成所有挑戰！</h2>
          <p className="text-lg text-slate-300 mb-6">你的總得分：<span className="text-amber-400 font-bold text-2xl">{score}</span> 分</p>
          <button
            onClick={() => setView('home')}
            className="bg-emerald-600 hover:bg-emerald-500 font-semibold py-3 px-8 rounded-xl transition"
          >
            返回首頁大廳
          </button>
        </div>
      )}

      {/* 老師後台介面 */}
      {view === 'admin' && (
        <div className="max-w-2xl w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setView('home')} className="text-slate-400 hover:text-white flex items-center gap-1 text-sm">
              <ArrowLeft className="w-4 h-4" /> 返回大廳
            </button>
            <h2 className="text-xl font-bold text-indigo-400">老師題庫管理後台</h2>
          </div>

          {/* 新增題目表單 */}
          <form onSubmit={handleAddQuestion} className="bg-slate-900 p-4 rounded-xl mb-6 border border-slate-700 space-y-4">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2"><Plus className="w-4 h-4" /> 新增闖關題目</h3>
            <input
              type="text"
              placeholder="關卡標題 (例如：第三關：歷史達人)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white"
            />
            <textarea
              placeholder="題目內容描述..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white"
              rows="2"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                  className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white"
                />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-300">正確答案：
                <select
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="ml-2 bg-slate-800 border border-slate-700 rounded p-1 text-white text-sm"
                >
                  <option value={0}>選項 A</option>
                  <option value={1}>選項 B</option>
                  <option value={2}>選項 C</option>
                  <option value={3}>選項 D</option>
                </select>
              </label>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold py-2 px-4 rounded-lg transition">
                確認新增
              </button>
            </div>
          </form>

          {/* 現有題目列表 */}
          <h3 className="font-semibold text-slate-200 mb-3">現有題庫清單 ({questions.length} 題)</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {questions.map((q, index) => (
              <div key={q.id} className="bg-slate-900 p-3 rounded-lg border border-slate-700 flex justify-between items-center">
                <div>
                  <span className="text-xs text-indigo-400 font-bold mr-2">#{index + 1}</span>
                  <span className="font-medium text-sm">{q.title}</span>
                  <p className="text-xs text-slate-400 truncate max-w-xs">{q.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteQ(q.id)}
                  className="text-rose-400 hover:text-rose-300 p-2"
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
