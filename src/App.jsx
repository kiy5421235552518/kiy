import React, { useState, useEffect } from 'react';
import { Trophy, Users, Settings, Plus, Trash2, ArrowLeft, CheckCircle, Compass, Map, Key, Sparkles, Award, ShieldAlert, Crown } from 'lucide-react';

// 尋寶主題預設題庫
const INITIAL_QUESTIONS = [
  {
    id: 1,
    title: "第一站：神祕古地圖 - 地理探險",
    description: "相傳藏寶圖的第一個線索藏在梧南國小的第二期校庭建築中，請問這棟建築的名稱是什麼？",
    options: ["映霞樓", "迎曦樓", "梧南樓", "海風樓"],
    answer: 0
  },
  {
    id: 2,
    title: "第二站：古老的密碼箱 - 語文解謎",
    description: "要開啟寶箱的第一道鎖，必須破解注音符號（ㄅㄆㄇ）的祕密：總共有多少個聲符？",
    options: ["17個", "21個", "24個", "37個"],
    answer: 1
  },
  {
    id: 3,
    title: "第三站：海豚守護者的試煉 - 校園傳說",
    description: "守護這座梧南黃金寶藏的學校代表吉祥物是哪一個？",
    options: ["台灣黑熊", "海豚", "石虎", "梅花鹿"],
    answer: 1
  }
];

export default function App() {
  const [view, setView] = useState('home'); // 'home', 'student', 'admin', 'quiz'
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('wunan_ultimate_treasure');
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
    localStorage.setItem('wunan_ultimate_treasure', JSON.stringify(questions));
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
    alert('成功新增尋寶關卡！');
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
    <div className="min-h-screen bg-[#0c0a09] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(217,119,6,0.15),rgba(255,255,255,0))] text-amber-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* 背景浮動金沙光點裝飾 */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-yellow-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* 尋寶大廳首頁 */}
      {view === 'home' && (
