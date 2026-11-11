import React, { useState, useEffect } from 'react';
import { 
  Trophy, Users, Settings, Plus, Trash2, ArrowLeft, 
  CheckCircle, Compass, Map, Key, Sparkles, Award, 
  BookOpen, Shapes, Calculator, ShieldCheck, Sparkle, Gift, Star
} from 'lucide-react';

// ==========================================
// 1. 題庫設定 (加入每關專屬精美背景圖)
// ==========================================
const INITIAL_STATIONS = [
  {
    id: 1,
    title: "第 1 關：琅琅上口",
    tag: "國語文表達",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop", // 古典書本
    description: "海豚夥伴帶領大家來到朗讀島！請問在朗讀課文時，怎樣的表現最棒？",
    options: ["聲音響亮且帶有豐富情感", "越快唸完越厲害", "小小聲讓大家聽不見", "一邊跳舞一邊轉圈"],
    answer: 0,
    hint: "自信、清晰且有感情的聲音最能打動評審喔！"
  },
  {
    id: 2,
    title: "第 2 關：拼寫高手",
    tag: "ㄅㄆㄇ注音魔法",
    image: "https://images.unsplash.com/photo-1550592704-6c76defa99ce?q=80&w=800&auto=format&fit=crop", // 魔法發光字母感覺
    description: "開啟藏寶箱需要注音密碼！請問注音符號「ㄅㄆㄇ」中，總共有幾個聲符？",
    options: ["16 個", "21 個", "37 個", "18 個"],
    answer: 1,
    hint: "ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐ...數一數共有 21 個喔！"
  },
  {
    id: 3,
    title: "第 3 關：幾何小勇士",
    tag: "形狀與空間",
    image: "https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?q=80&w=800&auto=format&fit=crop", // 幾何積木
    description: "探險家在映霞樓前發現神祕石板！請問下列哪一種形狀具有「四條一樣長的邊」和「四個直角」？",
    options: ["正方形", "長方形", "三角形", "圓形"],
    answer: 0,
    hint: "四個邊長度一模一樣，看起來端端正正的形狀！"
  },
  {
    id: 4,
    title: "第 4 關：數學天才",
    tag: "生活數學算術",
    image: "https://images.unsplash.com/photo-1611125832047-1d7b420063fa?q=80&w=800&auto=format&fit=crop", // 金幣/寶藏
    description: "粉紅小海豚書包裡有 8 顆貝殼金幣，藍色小海豚給了她 5 顆，請問她現在一共有幾顆？",
    options: ["11 顆", "12 顆", "13 顆", "14 顆"],
    answer: 2,
    hint: "8 + 5 = 13 顆金幣喔！"
  },
  {
    id: 5,
    title: "第 5 關：安全小尖兵",
    tag: "校園安全生活",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop", // 學校走廊/明亮光線
    description: "在梧南校園尋寶走廊走動時，哪種行為才是真正的安全小尖兵？",
    options: ["在走廊快速奔跑追逐", "走廊不奔跑、靠右慢行輕聲走", "滑著滑板穿過教室", "爬到二樓走廊欄杆上探險"],
    answer: 1,
    hint: "上下樓梯靠右走，校園安全大家守！"
  },
  {
    id: 6,
    title: "第 6 關：清潔達人",
    tag: "環境與生活自理",
    image: "https://images.unsplash.com/photo-1528323273322-d81458248d40?q=80&w=800&auto=format&fit=crop", // 閃亮乾淨的自然
    description: "尋寶活動結束後，發現自己的座位底下有紙屑和小垃圾，應該怎麼做？",
    options: ["踢到隔壁同學桌底", "裝作沒看見直接離開", "主動撿起並丟入垃圾桶", "留在原地等老師來清"],
    answer: 2,
    hint: "隨手做環保、愛護梧南美麗校園！"
  }
];

// ==========================================
// 2. 老師專屬：座號評語對照表
// ==========================================
const FEEDBACK_DB = {
  "01": "沛均在幾何小勇士那一關表現得很棒喔！觀察力非常敏銳！",
  "02": "宸羽今天的拼寫非常正確
