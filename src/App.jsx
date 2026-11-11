import React, { useState, useEffect } from 'react';
import { ChevronRight, Key, Coins, Map, Users, Settings, Download, Search, Image as ImageIcon, Star, Trophy, MessageSquare, LogOut, Lock, Upload, Volume2 } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection, serverTimestamp } from 'firebase/firestore';

const LEVEL_DATA = [
  {
    id: 'l1',
    title: '第一關：方位之謎',
    backgroundUrl: '',
    description: '運用校園地圖與方位概念，尋找寶藏的正確座標！'
  },
  {
    id: 'l2',
    title: '第二關：ㄅㄆㄇ達人',
    backgroundUrl: '',
    description: '結合注音符號與拼音技巧，闖過語言關卡！'
  },
  {
    id: 'l3',
    title: '第三關：幾何小勇士',
    backgroundUrl: '',
    description: '辨識校園建築與生活中的各種幾何圖形！'
  },
  {
    id: 'l4',
    title: '第四關：數學天才',
    backgroundUrl: '',
    description: '透過生活實境應用題，考驗你的邏輯與計算能力！'
  }
];

export default function App() {
  const [view, setView] = useState('welcome');
  const [role, setRole] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [coins, setCoins] = useState(10);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [feedback, setFeedback] = useState('歡迎來到梧南闖關平台！請選擇你的身份開始挑戰。');

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'student') {
      setView('student-hub');
      setFeedback('請輸入你的姓名並選擇關卡開始闖關！');
    } else {
      setView('teacher-hub');
      setFeedback('歡迎老師進入管理後台。');
    }
  };

  const getFeedback = (name) => {
    return `太棒了！${name || '同學'} 順利通關，獲得了大家的掌聲與獎勵！`;
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans">
      <header className="bg-stone-800 border-b border-stone-700 p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-3">
          <Trophy className="text-yellow-500" size={32} />
          <h1 className="text-xl font-bold tracking-wider">梧南國小 115學年度多元闖關平台</h1>
        </div>
        {role && (
          <button 
            onClick={() => { setRole(null); setView('welcome'); }}
            className="flex items-center space-x-1 px-3 py-1.5 bg-stone-700 hover:bg-stone-600 rounded-lg text-sm transition-colors border border-stone-600"
          >
            <LogOut size={16} />
            <span>返回首頁</span>
          </button>
        )}
      </header>

      <main className="flex-1 p-6 max-w-4xl w-full mx-auto flex flex-col justify-center">
        {view === 'welcome' && (
          <div className="text-center space-y-8 bg-stone-800 p-8 rounded-2xl border border-stone-700 shadow-xl">
            <h2 className="text-3xl font-bold text-yellow-400">歡迎來到梧南闖關大廳</h2>
            <p className="text-stone-300 max-w-lg mx-auto leading-relaxed">
              準備好展開精彩有趣的校園實境解謎與多元評量挑戰了嗎？請選擇你的身份來登入：
            </p>
            <div className="flex justify-center gap-6 pt-4">
              <button 
                onClick={() => handleLogin('student')}
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 border border-emerald-500 text-lg flex items-center space-x-2"
              >
                <Users size={20} />
                <span>我是學生闖關</span>
              </button>
              <button 
                onClick={() => handleLogin('teacher')}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 border border-indigo-500 text-lg flex items-center space-x-2"
              >
                <Settings size={20} />
                <span>老師管理後台</span>
              </button>
            </div>
          </div>
        )}

        {view === 'student-hub' && (
          <div className="space-y-6">
            <div className="bg-stone-800 p-6 rounded-xl border border-stone-700 flex justify-between items-center">
              <div>
                <label className="block text-sm text-stone-400 mb-1">請輸入你的姓名或座號：</label>
                <input 
                  type="text" 
                  value={playerName} 
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="例如：01 幾何小達人" 
                  className="bg-stone-900 border border-stone-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                />
              </div>
              <div className="flex items-center space-x-2 bg-stone-900 px-4 py-2 rounded-lg border border-stone-700">
                <Coins className="text-yellow-400" size={24} />
                <span className="font-bold text-lg">{coins} 點數</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LEVEL_DATA.map((lvl) => (
                <div key={lvl.id} className="bg-stone-800 p-6 rounded-xl border border-stone-700 hover:border-stone-500 transition-all flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-yellow-400 mb-2">{lvl.title}</h3>
                    <p className="text-stone-300 text-sm mb-4">{lvl.description}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setCurrentLevel(lvl);
                      setView('playing');
                    }}
                    className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 text-stone-950 font-bold rounded-lg transition-colors flex items-center justify-center space-x-1"
                  >
                    <span>開始挑戰</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'playing' && currentLevel && (
          <div className="bg-stone-800 p-8 rounded-xl border border-stone-700 space-y-6 text-center">
            <h2 className="text-2xl font-bold text-yellow-400">{currentLevel.title}</h2>
            <p className="text-stone-300">{currentLevel.description}</p>
            <div className="p-6 bg-stone-900 rounded-lg border border-stone-700">
              <p className="text-stone-400 mb-4">[ 關卡互動任務進行中... ]</p>
              <button 
                onClick={() => {
                  setCoins(coins + 5);
                  setCompletedLevels([...completedLevels, currentLevel.id]);
                  setView('student-hub');
                }}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors"
              >
                完成挑戰領取獎勵！
              </button>
            </div>
          </div>
        )}

        {view === 'teacher-hub' && (
          <div className="bg-stone-800 p-8 rounded-xl border border-stone-700 space-y-6">
            <h2 className="text-2xl font-bold text-yellow-400">老師管理與成績後台</h2>
            <p className="text-stone-300">在此檢視學生闖關進度、各關卡正確率與即時回饋。</p>
            <div className="border-t border-stone-700 pt-4">
              <div className="flex justify-between items-center bg-stone-900 p-4 rounded-lg">
                <span className="font-bold">學生通關即時動態</span>
                <span className="text-emerald-400 text-sm">● 系統連線正常</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-stone-800 border-t border-stone-700 p-4 text-center text-xs text-stone-400">
        台中市梧棲區梧南國小 115學年度多元闖關評量系統
      </footer>
    </div>
  );
}
