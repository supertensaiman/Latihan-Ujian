import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  LayoutDashboard, BookOpen, PlayCircle, History, Search, Clock,
  CheckCircle, XCircle, Award, TrendingUp, Target, AlertTriangle,
  ChevronLeft, ChevronRight, Shuffle, Eye, EyeOff, RotateCcw,
  CheckSquare, HelpCircle, Filter, Sparkles, Layers, Trash2,
  Sun, Moon, Menu, X, ArrowRight, Check, AlertCircle, Flag,
  Sliders, Smartphone, Grid, CheckCheck
} from 'lucide-react';
import {
  BANK_SOAL_KATEKUMEN_80,
  ALL_CATEGORIES,
  Question,
  ExamSession,
  ExamHistoryRecord
} from './data/questions';

type ActiveTab = 'dashboard' | 'bank-soal' | 'exam' | 'practice' | 'results' | 'history';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('cbt_theme') === 'dark';
  });

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);

  // History state
  const [history, setHistory] = useState<ExamHistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('cbt_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Exam session configuration states
  const [configQuestionCount, setConfigQuestionCount] = useState<number>(40);
  const [configDurationMinutes, setConfigDurationMinutes] = useState<number>(45);
  const [configShuffle, setConfigShuffle] = useState<boolean>(false);
  const [configCategory, setConfigCategory] = useState<string>('all');
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  // Exam session state
  const [examSession, setExamSession] = useState<ExamSession | null>(() => {
    try {
      const saved = localStorage.getItem('cbt_current_session_v2');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentExamIndex, setCurrentExamIndex] = useState<number>(0);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showExitExamConfirm, setShowExitExamConfirm] = useState<boolean>(false);
  const [pendingTabSwitch, setPendingTabSwitch] = useState<ActiveTab | null>(null);

  // Last completed exam result for results view
  const [lastExamResult, setLastExamResult] = useState<{
    answers: Record<string, number | number[]>;
    markedForReview: Record<string, boolean>;
    questions: Question[];
    mode: 'exam' | 'practice';
    timeSpentSeconds: number;
    score: number;
    correctCount: number;
    total: number;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('cbt_last_result_v2');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Practice Mode state
  const [practiceIndex, setPracticeIndex] = useState<number>(0);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, number | number[]>>({});
  const [revealedPractice, setRevealedPractice] = useState<Record<string, boolean>>({});
  const [practiceFilterCategory, setPracticeFilterCategory] = useState<string>('all');
  const [practiceLimitCount, setPracticeLimitCount] = useState<number>(80);
  const [isPracticeShuffled, setIsPracticeShuffled] = useState<boolean>(false);

  // Bank Soal View state
  const [bankSearch, setBankSearch] = useState<string>('');
  const [bankCategory, setBankCategory] = useState<string>('all');
  const [showAllBankAnswers, setShowAllBankAnswers] = useState<boolean>(false);
  const [expandedBankQuestions, setExpandedBankQuestions] = useState<Record<string, boolean>>({});

  // Result filter state (all, correct, wrong)
  const [resultFilter, setResultFilter] = useState<'all' | 'correct' | 'wrong'>('all');

  // Sync theme with DOM and localStorage
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('cbt_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('cbt_theme', 'light');
    }
  }, [isDark]);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('cbt_history', JSON.stringify(history));
  }, [history]);

  // Save exam session to localStorage
  useEffect(() => {
    if (examSession && !examSession.completed) {
      localStorage.setItem('cbt_current_session_v2', JSON.stringify(examSession));
    } else {
      localStorage.removeItem('cbt_current_session_v2');
    }
  }, [examSession]);

  // Save last exam result
  useEffect(() => {
    if (lastExamResult) {
      localStorage.setItem('cbt_last_result_v2', JSON.stringify(lastExamResult));
    }
  }, [lastExamResult]);

  // Countdown timer for Exam Mode
  useEffect(() => {
    if (activeTab !== 'exam' || !examSession || examSession.completed) return;

    const interval = setInterval(() => {
      setExamSession((prev) => {
        if (!prev || prev.completed) return prev;
        if (prev.timeRemainingSeconds <= 1) {
          clearInterval(interval);
          finishExam(prev);
          return { ...prev, timeRemainingSeconds: 0, completed: true };
        }
        return {
          ...prev,
          timeRemainingSeconds: prev.timeRemainingSeconds - 1
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTab, examSession?.completed]);

  // Map session question objects
  const activeExamQuestions: Question[] = useMemo(() => {
    if (!examSession) return [];
    const questionMap = new Map(BANK_SOAL_KATEKUMEN_80.map((q) => [q.id, q]));
    return examSession.questionIds.map((id) => questionMap.get(id)).filter(Boolean) as Question[];
  }, [examSession]);

  // Setup practice questions with optional category and count filter
  const activePracticeQuestions = useMemo(() => {
    let list = [...BANK_SOAL_KATEKUMEN_80];
    if (practiceFilterCategory !== 'all') {
      list = list.filter((q) => q.category === practiceFilterCategory);
    }
    if (isPracticeShuffled) {
      list.sort(() => Math.random() - 0.5);
    }
    return list.slice(0, practiceLimitCount);
  }, [practiceFilterCategory, isPracticeShuffled, practiceLimitCount]);

  // Update default duration when question count changes in settings
  const handleQuestionCountChange = (count: number) => {
    setConfigQuestionCount(count);
    // Standard rule: ~1.1 to 1.25 minutes per question
    if (count <= 10) setConfigDurationMinutes(15);
    else if (count <= 20) setConfigDurationMinutes(25);
    else if (count <= 40) setConfigDurationMinutes(45);
    else if (count <= 60) setConfigDurationMinutes(60);
    else setConfigDurationMinutes(75);
  };

  // Start new timed exam based on current configurations
  const startConfiguredExam = () => {
    let pool = [...BANK_SOAL_KATEKUMEN_80];
    if (configCategory !== 'all') {
      pool = pool.filter((q) => q.category === configCategory);
    }

    if (configShuffle) {
      pool.sort(() => Math.random() - 0.5);
    }

    const selectedQuestions = pool.slice(0, Math.min(configQuestionCount, pool.length));

    const session: ExamSession = {
      id: 'exam_' + Date.now(),
      mode: 'exam',
      startTime: Date.now(),
      durationMinutes: configDurationMinutes,
      timeRemainingSeconds: configDurationMinutes * 60,
      questionIds: selectedQuestions.map((q) => q.id),
      answers: {},
      markedForReview: {},
      completed: false,
      totalQuestions: selectedQuestions.length
    };

    setExamSession(session);
    setCurrentExamIndex(0);
    setShowConfigModal(false);
    setActiveTab('exam');
  };

  // Select option in Exam Mode (handles single select or multi select for Q75)
  const selectExamOption = (question: Question, optionIndex: number) => {
    if (!examSession || examSession.completed) return;

    setExamSession((prev) => {
      if (!prev) return prev;

      if (question.isMultiSelect) {
        const currentAns = Array.isArray(prev.answers[question.id])
          ? (prev.answers[question.id] as number[])
          : [];
        const exists = currentAns.includes(optionIndex);
        const nextAns = exists
          ? currentAns.filter((idx) => idx !== optionIndex)
          : [...currentAns, optionIndex].sort();

        return {
          ...prev,
          answers: {
            ...prev.answers,
            [question.id]: nextAns
          }
        };
      } else {
        return {
          ...prev,
          answers: {
            ...prev.answers,
            [question.id]: optionIndex
          }
        };
      }
    });
  };

  // Toggle marked for review (Ragu-ragu)
  const toggleMarkForReview = (questionId: string) => {
    if (!examSession || examSession.completed) return;
    setExamSession((prev) => {
      if (!prev) return prev;
      const current = !!prev.markedForReview[questionId];
      return {
        ...prev,
        markedForReview: {
          ...prev.markedForReview,
          [questionId]: !current
        }
      };
    });
  };

  // Finish exam calculations and record history
  const finishExam = (sessionToFinish?: ExamSession) => {
    const session = sessionToFinish || examSession;
    if (!session) return;

    const questionMap = new Map(BANK_SOAL_KATEKUMEN_80.map((q) => [q.id, q]));
    const questions = session.questionIds.map((id) => questionMap.get(id)).filter(Boolean) as Question[];

    let correctCount = 0;
    const categoryStats: Record<string, { total: number; correct: number }> = {};

    questions.forEach((q) => {
      if (!categoryStats[q.category]) {
        categoryStats[q.category] = { total: 0, correct: 0 };
      }
      categoryStats[q.category].total += 1;

      const userAns = session.answers[q.id];
      if (userAns !== undefined) {
        if (q.isMultiSelect && Array.isArray(userAns)) {
          // Check if arrays match
          const sortedUser = [...userAns].sort();
          const sortedKey = [...q.ans].sort();
          const isFullMatch = sortedUser.length === sortedKey.length && sortedUser.every((v, i) => v === sortedKey[i]);
          if (isFullMatch) {
            correctCount += 1;
            categoryStats[q.category].correct += 1;
          }
        } else if (typeof userAns === 'number' && q.ans.includes(userAns)) {
          correctCount += 1;
          categoryStats[q.category].correct += 1;
        }
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const timeSpent = Math.max(1, session.durationMinutes * 60 - session.timeRemainingSeconds);

    const historyRecord: ExamHistoryRecord = {
      id: session.id,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      mode: session.mode,
      score,
      correctCount,
      totalQuestions: questions.length,
      timeSpentSeconds: timeSpent,
      categoryBreakdown: categoryStats
    };

    setHistory((prev) => [historyRecord, ...prev.slice(0, 49)]);

    const resultData = {
      answers: session.answers,
      markedForReview: session.markedForReview,
      questions,
      mode: session.mode,
      timeSpentSeconds: timeSpent,
      score,
      correctCount,
      total: questions.length
    };

    setLastExamResult(resultData);
    setExamSession(null);
    setShowSubmitModal(false);
    setMobilePaletteOpen(false);
    setActiveTab('results');
  };

  // Handle safe navigation when an exam is in progress
  const requestTabChange = (tab: ActiveTab) => {
    if (activeTab === 'exam' && examSession && !examSession.completed && tab !== 'exam') {
      setPendingTabSwitch(tab);
      setShowExitExamConfirm(true);
    } else {
      setActiveTab(tab);
      setMobileMenuOpen(false);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filtered bank questions for Bank Soal view
  const filteredBankQuestions = useMemo(() => {
    return BANK_SOAL_KATEKUMEN_80.filter((item) => {
      const matchCategory = bankCategory === 'all' || item.category === bankCategory;
      const qText = item.q.toLowerCase();
      const optionsText = item.options.join(' ').toLowerCase();
      const search = bankSearch.toLowerCase().trim();
      const matchSearch = !search || qText.includes(search) || optionsText.includes(search);
      return matchCategory && matchSearch;
    });
  }, [bankSearch, bankCategory]);

  // Overall analytics stats
  const overallStats = useMemo(() => {
    if (history.length === 0) {
      return { totalTests: 0, avgScore: 0, highestScore: 0 };
    }
    const totalTests = history.length;
    const sumScore = history.reduce((acc, h) => acc + h.score, 0);
    const highestScore = Math.max(...history.map((h) => h.score));
    const avgScore = Math.round(sumScore / totalTests);
    return { totalTests, avgScore, highestScore };
  }, [history]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} pb-24 md:pb-12`}>
      {/* =========================================================================
          TOP BAR CONTRACT (Clean, single-line, mobile hamburger & responsive actions)
      ========================================================================= */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
        isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Mobile Toggle & Brand Title */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              aria-label="Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => requestTabChange('dashboard')}
              className="flex items-center gap-2 text-left group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-xs">
                80
              </div>
              <div>
                <span className="text-sm sm:text-base font-bold tracking-tight block leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  CBT Katekumen
                </span>
                <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 block truncate max-w-[140px] sm:max-w-none">
                  Quizizz Des 2021 · 80 Soal
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs sm:text-sm font-medium">
            <button
              onClick={() => requestTabChange('dashboard')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Beranda</span>
            </button>

            <button
              onClick={() => requestTabChange('bank-soal')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'bank-soal'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Bank Soal (80)</span>
            </button>

            <button
              onClick={() => {
                if (examSession && !examSession.completed) {
                  setActiveTab('exam');
                } else {
                  setShowConfigModal(true);
                }
              }}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'exam'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <PlayCircle className="w-4 h-4" />
              <span>Ujian CBT {examSession && !examSession.completed ? '(Aktif)' : ''}</span>
            </button>

            <button
              onClick={() => requestTabChange('practice')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'practice'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Latihan Santai</span>
            </button>

            <button
              onClick={() => requestTabChange('history')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'history'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Riwayat</span>
            </button>
          </nav>

          {/* Zone 3: Actions & Theme Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {activeTab === 'exam' && examSession && !examSession.completed && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-semibold tabular-nums">
                <Clock className="w-3.5 h-3.5 animate-pulse text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{formatTime(examSession.timeRemainingSeconds)}</span>
              </div>
            )}

            <button
              onClick={() => setShowConfigModal(true)}
              className="p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Pengaturan Jumlah Soal & Ujian"
              aria-label="Pengaturan Ujian"
            >
              <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </button>

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Ganti Tema"
              title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1 shadow-lg">
            <button
              onClick={() => requestTabChange('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'dashboard' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Beranda & Ringkasan</span>
            </button>
            <button
              onClick={() => requestTabChange('bank-soal')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'bank-soal' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Bank Soal (80 Soal Dokumen)</span>
            </button>
            <button
              onClick={() => {
                if (examSession && !examSession.completed) {
                  setActiveTab('exam');
                } else {
                  setShowConfigModal(true);
                }
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'exam' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              <PlayCircle className="w-4 h-4" />
              <span>Mulai Ujian CBT</span>
            </button>
            <button
              onClick={() => requestTabChange('practice')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'practice' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Mode Latihan Santai</span>
            </button>
            <button
              onClick={() => requestTabChange('history')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'history' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Riwayat & Nilai</span>
            </button>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  setShowConfigModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40"
              >
                <Sliders className="w-4 h-4" />
                <span>Atur Jumlah Soal & Durasi</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          MAIN VIEWPORT CONTENT
      ========================================================================= */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* VIEW 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Hero Banner with Quick Setup Pill Badges */}
            <div className={`p-5 sm:p-8 rounded-2xl border transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="max-w-3xl space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  <span>Dokumen Quizizz Katekumen</span>
                  <span aria-hidden="true">·</span>
                  <span>Lengkap 80 Butir Soal</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-500">Desember 2021</span>
                </div>
                <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Simulasi Pengerjaan Soal Ujian Katekumen Katolik
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Tersedia 80 soal lengkap sesuai naskah dokumen resmi Quizizz. Anda dapat bebas memilih
                  jumlah soal yang ingin dikerjakan (10, 20, 40, hingga seluruh 80 soal) dengan durasi waktu
                  otomatis dan antarmuka ramah perangkat mobile.
                </p>

                {/* Question Count Quick Preset Buttons */}
                <div className="pt-2">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Pilih Cepat Jumlah Soal yang Mau Dikerjakan:</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { count: 10, label: '10 Soal (Kilat)', time: '15 Menit' },
                      { count: 20, label: '20 Soal (Standar)', time: '25 Menit' },
                      { count: 40, label: '40 Soal (Setengah)', time: '45 Menit' },
                      { count: 80, label: '80 Soal (Lengkap)', time: '75 Menit' }
                    ].map((preset) => (
                      <button
                        key={preset.count}
                        onClick={() => {
                          handleQuestionCountChange(preset.count);
                          setShowConfigModal(true);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.01] ${
                          configQuestionCount === preset.count
                            ? 'bg-indigo-50 border-indigo-500 dark:bg-indigo-950/60 dark:border-indigo-500 text-indigo-950 dark:text-white'
                            : isDark
                            ? 'bg-slate-800/40 border-slate-700 text-slate-300'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="font-bold text-xs sm:text-sm flex items-center justify-between">
                          <span>{preset.label}</span>
                          {configQuestionCount === preset.count && (
                            <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Estimasi: {preset.time}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setShowConfigModal(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Mulai Ujian ({configQuestionCount} Soal · {configDurationMinutes} Mnt)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('practice')}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-xl border font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 ${
                      isDark
                        ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
                        : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Latihan Mandiri & Kunci Instan</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('bank-soal')}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Eksplorasi Semua 80 Soal Dokumen</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className={`p-4 sm:p-5 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1 sm:mb-2">
                  <span className="text-[11px] sm:text-xs font-medium">Bank Soal Dokumen</span>
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-xl sm:text-2xl font-bold tabular-nums">80</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Sesuai Naskah Quizizz</div>
              </div>

              <div className={`p-4 sm:p-5 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1 sm:mb-2">
                  <span className="text-[11px] sm:text-xs font-medium">Simulasi Dikerjakan</span>
                  <Award className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-xl sm:text-2xl font-bold tabular-nums">{overallStats.totalTests}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Sesi Ujian Selesai</div>
              </div>

              <div className={`p-4 sm:p-5 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1 sm:mb-2">
                  <span className="text-[11px] sm:text-xs font-medium">Rata-Rata Nilai</span>
                  <TrendingUp className="w-4 h-4 text-sky-500" />
                </div>
                <div className="text-xl sm:text-2xl font-bold tabular-nums">{overallStats.avgScore}%</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Dari Semua Percobaan</div>
              </div>

              <div className={`p-4 sm:p-5 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1 sm:mb-2">
                  <span className="text-[11px] sm:text-xs font-medium">Skor Tertinggi</span>
                  <Target className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-xl sm:text-2xl font-bold tabular-nums">{overallStats.highestScore}%</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Rekor Terbaik Anda</div>
              </div>
            </div>

            {/* Topic Distribution & Mobile Friendly Guides */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`lg:col-span-2 p-5 sm:p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Klasifikasi Topik Materi Dokumen</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Klik salah satu kategori untuk latihan fokus</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{ALL_CATEGORIES.length} Topik</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {ALL_CATEGORIES.map((cat) => {
                    const count = BANK_SOAL_KATEKUMEN_80.filter((q) => q.category === cat).length;
                    return (
                      <div
                        key={cat}
                        onClick={() => {
                          setPracticeFilterCategory(cat);
                          setActiveTab('practice');
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition-all hover:border-indigo-500 ${
                          isDark
                            ? 'bg-slate-800/50 border-slate-700/80'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">{cat}</span>
                          <span className="font-mono tabular-nums text-slate-500 shrink-0">{count} Soal</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full"
                            style={{ width: `${Math.min(100, (count / 10) * 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status & Mobile Exam Tips */}
              <div className={`p-5 sm:p-6 rounded-2xl border flex flex-col justify-between ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1">Status Sesi Ujian</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Sistem CBT mendukung pengerjaan nyaman di layar ponsel maupun laptop.
                  </p>

                  {examSession && !examSession.completed ? (
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-amber-800 dark:text-amber-200">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                          Ujian Aktif Berjalan
                        </span>
                        <span className="font-mono tabular-nums">{formatTime(examSession.timeRemainingSeconds)}</span>
                      </div>
                      <div className="text-xs text-amber-700 dark:text-amber-300">
                        Terjawab: {Object.keys(examSession.answers).length} dari {examSession.totalQuestions} butir soal
                      </div>
                      <button
                        onClick={() => setActiveTab('exam')}
                        className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Lanjutkan Sesi Ini</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                      <div className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-indigo-500" />
                        Desain Mobile-Friendly
                      </div>
                      <p>
                        Pada layar HP, gunakan tombol mengambang <strong>Lembar Soal</strong> di bagian bawah untuk
                        melihat seluruh nomor tanpa perlu scroll bolak-balik.
                      </p>
                      <button
                        onClick={() => setShowConfigModal(true)}
                        className="mt-2 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Mulai Simulasi Baru</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                  <div className="font-semibold text-slate-700 dark:text-slate-300">Keterangan Warna CBT:</div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-indigo-600" /> Terjawab</span>
                    <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-amber-500" /> Ragu-ragu</span>
                    <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-slate-300 dark:bg-slate-700" /> Belum</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: BANK SOAL EXPLORER (All 80 Questions) */}
        {activeTab === 'bank-soal' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Control Bar: Search & Category Filter */}
            <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 sm:space-y-4 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Bank Soal Dokumen (80 Butir)</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Menampilkan {filteredBankQuestions.length} dari {BANK_SOAL_KATEKUMEN_80.length} butir soal dokumen Quizizz
                  </p>
                </div>

                <button
                  onClick={() => setShowAllBankAnswers(!showAllBankAnswers)}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    showAllBankAnswers
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : isDark
                      ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {showAllBankAnswers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showAllBankAnswers ? 'Tutup Semua Kunci' : 'Tampilkan Semua Kunci'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                <div className="relative md:col-span-2">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                    placeholder="Cari pertanyaan, opsi, atau kata kunci liturgi..."
                    className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                      isDark
                        ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-400'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  {bankSearch && (
                    <button
                      onClick={() => setBankSearch('')}
                      className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div>
                  <select
                    value={bankCategory}
                    onChange={(e) => setBankCategory(e.target.value)}
                    className={`w-full py-2 px-3 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="all">Semua Topik ({BANK_SOAL_KATEKUMEN_80.length})</option>
                    {ALL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat} ({BANK_SOAL_KATEKUMEN_80.filter((q) => q.category === cat).length})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3 sm:space-y-4">
              {filteredBankQuestions.length === 0 ? (
                <div className={`p-8 sm:p-12 text-center rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <HelpCircle className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                  <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">Tidak ada soal yang sesuai</h3>
                  <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau ganti pilihan topik.</p>
                  <button
                    onClick={() => { setBankSearch(''); setBankCategory('all'); }}
                    className="mt-3 px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                filteredBankQuestions.map((item) => {
                  const isExpanded = showAllBankAnswers || !!expandedBankQuestions[item.id];
                  return (
                    <div
                      key={item.id}
                      className={`p-4 sm:p-6 rounded-2xl border transition-colors ${
                        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm font-mono">
                            No. {item.no}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{item.category}</span>
                          {item.isMultiSelect && (
                            <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded-sm font-semibold">
                              Multi-Pilihan
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            setExpandedBankQuestions((prev) => ({
                              ...prev,
                              [item.id]: !prev[item.id]
                            }));
                          }}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 shrink-0 ${
                            isExpanded
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800'
                              : 'text-slate-600 border-slate-200 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {isExpanded ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span className="hidden sm:inline">{isExpanded ? 'Tutup Kunci' : 'Lihat Kunci'}</span>
                        </button>
                      </div>

                      {/* Question Text */}
                      <p className="text-xs sm:text-sm sm:text-base font-medium text-slate-900 dark:text-white leading-relaxed mb-3">
                        {item.q}
                      </p>

                      {/* Visual Description if present */}
                      {item.imgHint && (
                        <div className="mb-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold">Deskripsi Gambar di Dokumen: </span>
                            {item.imgHint}
                          </div>
                        </div>
                      )}

                      {/* Options Grid */}
                      <div className="space-y-1.5 sm:space-y-2">
                        {item.options.map((opt, optIdx) => {
                          const optionLetter = String.fromCharCode(65 + optIdx);
                          const isCorrect = item.ans.includes(optIdx);

                          return (
                            <div
                              key={optIdx}
                              className={`p-2.5 sm:p-3 rounded-xl border text-xs sm:text-sm flex items-center gap-2.5 transition-colors ${
                                isExpanded && isCorrect
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-500 text-emerald-900 dark:text-emerald-100 font-medium'
                                  : isDark
                                  ? 'bg-slate-800/70 border-slate-700 text-white'
                                  : 'bg-slate-50 border-slate-200/80 text-slate-700'
                              }`}
                            >
                              <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                                isExpanded && isCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white'
                              }`}>
                                {optionLetter}
                              </span>
                              <span className="flex-1 leading-snug text-slate-900 dark:text-white">{opt}</span>
                              {isExpanded && isCorrect && (
                                <span className="text-[11px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                                  <Check className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Kunci Benar</span>
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation if Expanded */}
                      {isExpanded && (
                        <div className="mt-3 p-3.5 sm:p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-xs sm:text-sm text-indigo-950 dark:text-white space-y-1">
                          <div className="font-bold flex items-center gap-1.5 text-indigo-800 dark:text-indigo-300">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Pembahasan Teologis:</span>
                          </div>
                          <p className="leading-relaxed text-slate-700 dark:text-slate-100">
                            {item.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: CBT EXAM MODE */}
        {activeTab === 'exam' && (
          <div>
            {!examSession ? (
              <div className={`p-6 sm:p-10 text-center rounded-2xl border max-w-lg mx-auto space-y-4 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}>
                <PlayCircle className="w-12 h-12 mx-auto text-indigo-600" />
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Siap Mulai Ujian CBT?</h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Pilih jumlah butir soal dan durasi ujian yang Anda kehendaki sebelum memulai simulasi.
                </p>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-left space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Jumlah Soal:</span>
                    <strong className="font-mono">{configQuestionCount} Butir Soal</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Waktu Pengerjaan:</span>
                    <strong className="font-mono">{configDurationMinutes} Menit</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Urutan Soal:</span>
                    <strong>{configShuffle ? 'Diacak secara Random' : 'Sesuai Urutan Dokumen'}</strong>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  <button
                    onClick={startConfiguredExam}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs"
                  >
                    Mulai Ujian ({configQuestionCount} Soal)
                  </button>
                  <button
                    onClick={() => setShowConfigModal(true)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Ubah Pengaturan</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* Exam Sub-Header: Progress, Timer, and Mobile Palette Trigger */}
                <div className={`p-3 sm:p-4 rounded-xl border flex items-center justify-between gap-2 sticky top-14 sm:top-16 z-30 backdrop-blur-md ${
                  isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200 shadow-xs'
                }`}>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div>
                      <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 block leading-none">Soal</span>
                      <span className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
                        {currentExamIndex + 1}{' '}
                        <span className="text-xs font-normal text-slate-500">/ {examSession.totalQuestions}</span>
                      </span>
                    </div>

                    <div className="hidden sm:block h-7 w-px bg-slate-200 dark:bg-slate-800" />

                    <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <span>Terjawab: <strong className="text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">{Object.keys(examSession.answers).length}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Ragu: <strong className="text-amber-600 dark:text-amber-400 font-mono tabular-nums">{Object.values(examSession.markedForReview).filter(Boolean).length}</strong></span>
                    </div>
                  </div>

                  {/* Right side: Timer & Palette Drawer Trigger for Mobile */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMobilePaletteOpen(true)}
                      className="lg:hidden px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 text-slate-700 dark:text-slate-200"
                    >
                      <Grid className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Lembar Soal</span>
                    </button>

                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold font-mono tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse shrink-0" />
                      <span>{formatTime(examSession.timeRemainingSeconds)}</span>
                    </div>

                    <button
                      onClick={() => setShowSubmitModal(true)}
                      className="hidden sm:flex px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors items-center gap-1.5 whitespace-nowrap"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>Selesai</span>
                    </button>
                  </div>
                </div>

                {/* Main Exam Grid: Question Stage (Left) & Question Palette (Right on desktop) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* Left Column: Active Question Stage */}
                  <div className="lg:col-span-8 space-y-4">
                    {(() => {
                      const currentQ = activeExamQuestions[currentExamIndex];
                      if (!currentQ) return null;

                      const userAns = examSession.answers[currentQ.id];
                      const isMarked = !!examSession.markedForReview[currentQ.id];

                      return (
                        <div className={`p-4 sm:p-7 rounded-2xl border ${
                          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                        }`}>
                          <div className="flex items-center justify-between gap-2 mb-3 text-xs text-slate-500">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-bold text-indigo-600 dark:text-indigo-400">Nomor {currentExamIndex + 1}</span>
                              <span aria-hidden="true">·</span>
                              <span className="text-slate-600 dark:text-slate-300 truncate max-w-[150px] sm:max-w-none">{currentQ.category}</span>
                              {currentQ.isMultiSelect && (
                                <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded-xs font-semibold">
                                  Pilih 3 Jawaban
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => toggleMarkForReview(currentQ.id)}
                              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                                isMarked
                                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                                  : isDark
                                  ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <Flag className={`w-3.5 h-3.5 ${isMarked ? 'fill-current' : ''}`} />
                              <span className="hidden sm:inline">{isMarked ? 'Ragu-ragu (Ditandai)' : 'Tandai Ragu'}</span>
                              <span className="sm:hidden">{isMarked ? 'Ragu' : 'Ragu?'}</span>
                            </button>
                          </div>

                          <h3 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white leading-relaxed mb-4 sm:mb-6">
                            {currentQ.q}
                          </h3>

                          {currentQ.imgHint && (
                            <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold">Deskripsi Gambar di Dokumen: </span>
                                {currentQ.imgHint}
                              </div>
                            </div>
                          )}

                          {/* Options radio or checkbox list */}
                          <div className="space-y-2.5 sm:space-y-3">
                            {currentQ.options.map((opt, optIdx) => {
                              const letter = String.fromCharCode(65 + optIdx);
                              const isSelected = currentQ.isMultiSelect
                                ? Array.isArray(userAns) && userAns.includes(optIdx)
                                : userAns === optIdx;

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => selectExamOption(currentQ, optIdx)}
                                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-center gap-3 cursor-pointer min-h-[44px] ${
                                    isSelected
                                      ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-500/20 text-indigo-950 dark:text-white font-medium'
                                      : isDark
                                      ? 'bg-slate-900/90 border-slate-700 text-white hover:bg-slate-800'
                                      : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100/70'
                                  }`}
                                >
                                  <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white'
                                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white'
                                  }`}>
                                    {letter}
                                  </span>
                                  <span className="text-xs sm:text-sm leading-snug flex-1 text-slate-900 dark:text-white font-normal">{opt}</span>
                                  {isSelected && (
                                    <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Desktop Navigation buttons */}
                          <div className="hidden sm:flex mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 items-center justify-between gap-4">
                            <button
                              disabled={currentExamIndex === 0}
                              onClick={() => setCurrentExamIndex((prev) => Math.max(0, prev - 1))}
                              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              <span>Sebelumnya</span>
                            </button>

                            <button
                              onClick={() => setShowSubmitModal(true)}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                            >
                              <CheckSquare className="w-3.5 h-3.5" />
                              <span>Kumpulkan Ujian</span>
                            </button>

                            <button
                              disabled={currentExamIndex === examSession.totalQuestions - 1}
                              onClick={() => setCurrentExamIndex((prev) => Math.min(examSession.totalQuestions - 1, prev + 1))}
                              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                            >
                              <span>Selanjutnya</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Right Column: Desktop Question Palette Grid */}
                  <div className={`hidden lg:block lg:col-span-4 p-5 rounded-2xl border space-y-4 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Lembar Nomor Soal</h4>
                      <span className="text-xs font-mono text-slate-500">{examSession.totalQuestions} Butir</span>
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-3 gap-1.5 text-[11px] pb-3 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600" />
                        <span>Dijawab</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
                        <span>Ragu</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-xs bg-slate-200 dark:bg-slate-700" />
                        <span>Belum</span>
                      </div>
                    </div>

                    {/* Number Buttons Grid */}
                    <div className="grid grid-cols-5 gap-2 max-h-[380px] overflow-y-auto pr-1">
                      {activeExamQuestions.map((q, idx) => {
                        const isAnswered = examSession.answers[q.id] !== undefined;
                        const isMarked = !!examSession.markedForReview[q.id];
                        const isCurrent = currentExamIndex === idx;

                        let bgClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200';
                        if (isMarked) {
                          bgClass = 'bg-amber-500 text-white font-bold hover:bg-amber-600';
                        } else if (isAnswered) {
                          bgClass = 'bg-indigo-600 text-white font-bold hover:bg-indigo-700';
                        }

                        return (
                          <button
                            key={q.id}
                            onClick={() => setCurrentExamIndex(idx)}
                            className={`h-9 rounded-lg text-xs font-mono tabular-nums transition-all flex items-center justify-center relative ${bgClass} ${
                              isCurrent ? 'ring-2 ring-offset-2 ring-indigo-500 font-extrabold scale-105' : ''
                            }`}
                          >
                            <span>{idx + 1}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => setShowSubmitModal(true)}
                        className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckSquare className="w-4 h-4" />
                        <span>Kumpulkan Lembar Jawaban</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Sticky Bottom Action Dock */}
                <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 p-2.5 px-3 flex items-center justify-between gap-2 shadow-lg backdrop-blur-md">
                  <button
                    disabled={currentExamIndex === 0}
                    onClick={() => setCurrentExamIndex((prev) => Math.max(0, prev - 1))}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold disabled:opacity-30 flex items-center justify-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                  </button>

                  <button
                    onClick={() => {
                      const currentQ = activeExamQuestions[currentExamIndex];
                      if (currentQ) toggleMarkForReview(currentQ.id);
                    }}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 ${
                      activeExamQuestions[currentExamIndex] && examSession.markedForReview[activeExamQuestions[currentExamIndex].id]
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Ragu</span>
                  </button>

                  {currentExamIndex < examSession.totalQuestions - 1 ? (
                    <button
                      onClick={() => setCurrentExamIndex((prev) => Math.min(examSession.totalQuestions - 1, prev + 1))}
                      className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      <span>Selanjutnya</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowSubmitModal(true)}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      <CheckSquare className="w-4 h-4" />
                      <span>Kumpul</span>
                    </button>
                  )}
                </div>

                {/* Mobile Bottom Sheet Drawer for Palette Grid */}
                {mobilePaletteOpen && (
                  <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs">
                    <div className={`w-full max-h-[80vh] p-5 rounded-t-2xl border-t space-y-3 overflow-y-auto ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                        <div>
                          <h4 className="font-bold text-sm">Lembar Nomor Soal</h4>
                          <span className="text-[11px] text-slate-500">
                            Terjawab: {Object.keys(examSession.answers).length} / {examSession.totalQuestions}
                          </span>
                        </div>
                        <button
                          onClick={() => setMobilePaletteOpen(false)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Number Grid for Mobile */}
                      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 py-2">
                        {activeExamQuestions.map((q, idx) => {
                          const isAnswered = examSession.answers[q.id] !== undefined;
                          const isMarked = !!examSession.markedForReview[q.id];
                          const isCurrent = currentExamIndex === idx;

                          let bgClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
                          if (isMarked) {
                            bgClass = 'bg-amber-500 text-white font-bold';
                          } else if (isAnswered) {
                            bgClass = 'bg-indigo-600 text-white font-bold';
                          }

                          return (
                            <button
                              key={q.id}
                              onClick={() => {
                                setCurrentExamIndex(idx);
                                setMobilePaletteOpen(false);
                              }}
                              className={`h-10 rounded-lg text-xs font-mono tabular-nums transition-all flex items-center justify-center ${bgClass} ${
                                isCurrent ? 'ring-2 ring-indigo-500 font-extrabold' : ''
                              }`}
                            >
                              {idx + 1}
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setMobilePaletteOpen(false);
                            setShowSubmitModal(true);
                          }}
                          className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-2"
                        >
                          <CheckSquare className="w-4 h-4" />
                          <span>Kumpulkan Jawaban Sekarang</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: PRACTICE MODE (LATIHAN MANDIRI DENGAN KUNCI INSTAN) */}
        {activeTab === 'practice' && (
          <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
            {/* Header Toolbar */}
            <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Mode Latihan Mandiri</span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">Latihan Santai dengan Kunci</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pilih opsi jawaban lalu cek kebenaran secara langsung</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={practiceFilterCategory}
                  onChange={(e) => {
                    setPracticeFilterCategory(e.target.value);
                    setPracticeIndex(0);
                  }}
                  className={`text-xs py-2 px-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="all">Semua Topik ({BANK_SOAL_KATEKUMEN_80.length})</option>
                  {ALL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} ({BANK_SOAL_KATEKUMEN_80.filter((q) => q.category === cat).length})
                    </option>
                  ))}
                </select>

                <select
                  value={practiceLimitCount}
                  onChange={(e) => {
                    setPracticeLimitCount(Number(e.target.value));
                    setPracticeIndex(0);
                  }}
                  className={`text-xs py-2 px-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value={10}>10 Soal</option>
                  <option value={20}>20 Soal</option>
                  <option value={40}>40 Soal</option>
                  <option value={80}>Semua 80 Soal</option>
                </select>

                <button
                  onClick={() => {
                    setIsPracticeShuffled(!isPracticeShuffled);
                    setPracticeIndex(0);
                  }}
                  title="Acak urutan latihan"
                  className={`p-2 rounded-xl border transition-colors ${
                    isPracticeShuffled
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <Shuffle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Question Card */}
            {activePracticeQuestions.length === 0 ? (
              <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500">Tidak ada soal dalam kategori ini.</p>
              </div>
            ) : (
              (() => {
                const currentQ = activePracticeQuestions[practiceIndex] || activePracticeQuestions[0];
                const selectedOpt = practiceAnswers[currentQ.id];
                const isRevealed = !!revealedPractice[currentQ.id];

                return (
                  <div className={`p-4 sm:p-7 rounded-2xl border space-y-4 sm:space-y-6 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    {/* Meta bar */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono text-xs sm:text-sm">
                          Soal {practiceIndex + 1} dari {activePracticeQuestions.length}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{currentQ.category}</span>
                      </div>

                      <button
                        onClick={() => {
                          setRevealedPractice((prev) => ({
                            ...prev,
                            [currentQ.id]: !prev[currentQ.id]
                          }));
                        }}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          isRevealed
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{isRevealed ? 'Tutup Kunci' : 'Cek Kunci'}</span>
                      </button>
                    </div>

                    {/* Question text */}
                    <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-white leading-relaxed">
                      {currentQ.q}
                    </p>

                    {currentQ.imgHint && (
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Deskripsi Gambar: </span>
                          {currentQ.imgHint}
                        </div>
                      </div>
                    )}

                    {/* Practice Options */}
                    <div className="space-y-2.5">
                      {currentQ.options.map((opt, optIdx) => {
                        const letter = String.fromCharCode(65 + optIdx);
                        const isSelected = currentQ.isMultiSelect
                          ? Array.isArray(selectedOpt) && selectedOpt.includes(optIdx)
                          : selectedOpt === optIdx;
                        const isCorrect = currentQ.ans.includes(optIdx);

                        let optionStyle = isDark
                          ? 'bg-slate-900/90 border-slate-700 text-white hover:bg-slate-800'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';

                        if (isRevealed) {
                          if (isCorrect) {
                            optionStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-semibold ring-1 ring-emerald-500';
                          } else if (isSelected && !isCorrect) {
                            optionStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-950 dark:text-rose-100 font-semibold';
                          }
                        } else if (isSelected) {
                          optionStyle = 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-600 dark:border-indigo-400 text-indigo-950 dark:text-white font-medium ring-2 ring-indigo-500/20';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => {
                              if (currentQ.isMultiSelect) {
                                const currentArr = Array.isArray(selectedOpt) ? selectedOpt : [];
                                const exists = currentArr.includes(optIdx);
                                const nextArr = exists ? currentArr.filter((i) => i !== optIdx) : [...currentArr, optIdx];
                                setPracticeAnswers((prev) => ({ ...prev, [currentQ.id]: nextArr }));
                              } else {
                                setPracticeAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }));
                              }
                            }}
                            className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 cursor-pointer min-h-[44px] ${optionStyle}`}
                          >
                            <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                              isRevealed && isCorrect
                                ? 'bg-emerald-600 text-white'
                                : isRevealed && isSelected && !isCorrect
                                ? 'bg-rose-600 text-white'
                                : isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white'
                            }`}>
                              {letter}
                            </span>
                            <span className="text-xs sm:text-sm leading-snug flex-1 text-slate-900 dark:text-white font-normal">{opt}</span>
                            {isRevealed && isCorrect && (
                              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            )}
                            {isRevealed && isSelected && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation Box */}
                    {isRevealed && (
                      <div className="p-3.5 sm:p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 text-xs sm:text-sm text-indigo-950 dark:text-white space-y-1">
                        <div className="font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Penjelasan Teologis:</span>
                        </div>
                        <p className="leading-relaxed text-slate-700 dark:text-slate-100">
                          {currentQ.explanation}
                        </p>
                      </div>
                    )}

                    {/* Pagination Controls */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        disabled={practiceIndex === 0}
                        onClick={() => setPracticeIndex((prev) => Math.max(0, prev - 1))}
                        className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Sebelumnya</span>
                      </button>

                      <span className="text-xs font-mono tabular-nums text-slate-500">
                        {practiceIndex + 1} / {activePracticeQuestions.length}
                      </span>

                      <button
                        disabled={practiceIndex === activePracticeQuestions.length - 1}
                        onClick={() => setPracticeIndex((prev) => Math.min(activePracticeQuestions.length - 1, prev + 1))}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold disabled:opacity-40 transition-colors flex items-center gap-1"
                      >
                        <span>Berikutnya</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        )}

        {/* VIEW 5: RESULTS & DIAGNOSTICS */}
        {activeTab === 'results' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {!lastExamResult ? (
              <div className={`p-8 sm:p-12 text-center rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <HelpCircle className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Belum Ada Hasil Ujian</h3>
                <p className="text-xs text-slate-500 mt-1">Selesaikan simulasi ujian CBT terlebih dahulu untuk melihat analisis nilai.</p>
                <button
                  onClick={() => setShowConfigModal(true)}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors"
                >
                  Mulai Ujian CBT
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Result Hero Score Card */}
                <div className={`p-5 sm:p-8 rounded-2xl border text-center space-y-3 sm:space-y-4 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    <Award className="w-3.5 h-3.5" />
                    <span>Hasil Simulasi ({lastExamResult.total} Soal)</span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-4xl sm:text-6xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
                      {lastExamResult.score}
                      <span className="text-xl sm:text-2xl font-bold text-slate-500"> / 100</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {lastExamResult.score >= 75
                        ? 'Lulus dengan Sangat Baik! Pemahaman doktrin dan materi Katekumen sangat baik.'
                        : lastExamResult.score >= 60
                        ? 'Hasil Memuaskan. Evaluasi butir soal yang keliru untuk memperkuat konsep.'
                        : 'Perlu Pengulangan Belajar. Pelajari pembahasan di bawah ini secara teliti.'}
                    </p>
                  </div>

                  {/* Summary Metric Strip */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 max-w-md mx-auto">
                    <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                      <div className="text-[10px] sm:text-xs text-emerald-700 dark:text-emerald-300 font-medium">Benar</div>
                      <div className="text-lg sm:text-xl font-bold text-emerald-800 dark:text-emerald-200 font-mono tabular-nums">
                        {lastExamResult.correctCount}
                      </div>
                    </div>

                    <div className="p-2.5 sm:p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                      <div className="text-[10px] sm:text-xs text-rose-700 dark:text-rose-300 font-medium">Salah</div>
                      <div className="text-lg sm:text-xl font-bold text-rose-800 dark:text-rose-200 font-mono tabular-nums">
                        {lastExamResult.total - lastExamResult.correctCount}
                      </div>
                    </div>

                    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <div className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium">Waktu</div>
                      <div className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200 font-mono tabular-nums">
                        {formatTime(lastExamResult.timeSpentSeconds)}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
                    <button
                      onClick={() => setShowConfigModal(true)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Ujian Lagi</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('history')}
                      className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                        isDark ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>Semua Riwayat</span>
                    </button>
                  </div>
                </div>

                {/* Filter and Answer Review Header */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Pembahasan Tiap Nomor</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Evaluasi pilihan Anda dibandingkan kunci resmi dokumen
                    </p>
                  </div>

                  {/* Filter buttons */}
                  <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
                    <button
                      onClick={() => setResultFilter('all')}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                        resultFilter === 'all'
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      Semua ({lastExamResult.questions.length})
                    </button>
                    <button
                      onClick={() => setResultFilter('correct')}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                        resultFilter === 'correct'
                          ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      Benar ({lastExamResult.correctCount})
                    </button>
                    <button
                      onClick={() => setResultFilter('wrong')}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                        resultFilter === 'wrong'
                          ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      Salah ({lastExamResult.total - lastExamResult.correctCount})
                    </button>
                  </div>
                </div>

                {/* Question Review Cards */}
                <div className="space-y-3 sm:space-y-4">
                  {lastExamResult.questions
                    .filter((q) => {
                      const userAns = lastExamResult.answers[q.id];
                      let isCorrect = false;
                      if (q.isMultiSelect && Array.isArray(userAns)) {
                        const sortedUser = [...userAns].sort();
                        const sortedKey = [...q.ans].sort();
                        isCorrect = sortedUser.length === sortedKey.length && sortedUser.every((v, i) => v === sortedKey[i]);
                      } else if (typeof userAns === 'number') {
                        isCorrect = q.ans.includes(userAns);
                      }

                      if (resultFilter === 'correct') return isCorrect;
                      if (resultFilter === 'wrong') return !isCorrect;
                      return true;
                    })
                    .map((q) => {
                      const userAns = lastExamResult.answers[q.id];
                      let isCorrect = false;
                      if (q.isMultiSelect && Array.isArray(userAns)) {
                        const sortedUser = [...userAns].sort();
                        const sortedKey = [...q.ans].sort();
                        isCorrect = sortedUser.length === sortedKey.length && sortedUser.every((v, i) => v === sortedKey[i]);
                      } else if (typeof userAns === 'number') {
                        isCorrect = q.ans.includes(userAns);
                      }

                      const isUnanswered = userAns === undefined;

                      return (
                        <div
                          key={q.id}
                          className={`p-4 sm:p-6 rounded-2xl border transition-colors ${
                            isCorrect
                              ? isDark ? 'bg-slate-900 border-emerald-950/60' : 'bg-white border-emerald-200/80 shadow-xs'
                              : isDark ? 'bg-slate-900 border-rose-950/60' : 'bg-white border-rose-200/80 shadow-xs'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 mb-2 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800 dark:text-slate-200">Soal No. {q.no}</span>
                              <span aria-hidden="true">·</span>
                              <span className="text-slate-500">{q.category}</span>
                            </div>

                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 ${
                              isCorrect
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                                : isUnanswered
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                            }`}>
                              {isCorrect ? 'Benar' : isUnanswered ? 'Tidak Dijawab' : 'Salah'}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm sm:text-base font-medium text-slate-900 dark:text-white mb-3">
                            {q.q}
                          </p>

                          {/* Options breakdown */}
                          <div className="space-y-1.5 sm:space-y-2 mb-3">
                            {q.options.map((opt, optIdx) => {
                              const letter = String.fromCharCode(65 + optIdx);
                              const isKey = q.ans.includes(optIdx);
                              const isUserPick = q.isMultiSelect && Array.isArray(userAns)
                                ? userAns.includes(optIdx)
                                : userAns === optIdx;

                              let optBg = isDark ? 'bg-slate-900/80 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-600';
                              if (isKey) {
                                optBg = 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-400 dark:border-emerald-500 text-emerald-950 dark:text-emerald-100 font-semibold';
                              } else if (isUserPick && !isKey) {
                                optBg = 'bg-rose-50 dark:bg-rose-950/70 border-rose-400 dark:border-rose-500 text-rose-950 dark:text-rose-100 font-semibold';
                              }

                              return (
                                <div
                                  key={optIdx}
                                  className={`p-2.5 sm:p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-2.5 ${optBg}`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                                      isKey ? 'bg-emerald-600 text-white' : isUserPick ? 'bg-rose-600 text-white' : 'bg-slate-200 dark:bg-slate-700 dark:text-white'
                                    }`}>
                                      {letter}
                                    </span>
                                    <span className="leading-snug text-slate-900 dark:text-white">{opt}</span>
                                  </div>

                                  <div className="text-[11px] font-semibold flex items-center gap-1.5 shrink-0">
                                    {isUserPick && (
                                      <span className={isKey ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}>
                                        (Pilihan Anda)
                                      </span>
                                    )}
                                    {isKey && (
                                      <span className="text-emerald-700 dark:text-emerald-300 flex items-center gap-0.5">
                                        <Check className="w-3.5 h-3.5" />
                                        Kunci
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Explanation */}
                          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-white space-y-1">
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Ulasan Teologi:</span>
                            </div>
                            <p className="leading-relaxed text-slate-700 dark:text-slate-100">{q.explanation}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 6: HISTORY & PROGRESS */}
        {activeTab === 'history' && (
          <div className="space-y-5 max-w-4xl mx-auto">
            <div className={`p-4 sm:p-6 rounded-2xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Riwayat Pengerjaan & Evaluasi</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Catatan seluruh sesi simulasi ujian yang telah diselesaikan
                </p>
              </div>

              {history.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('Hapus seluruh riwayat pengerjaan?')) {
                      setHistory([]);
                      localStorage.removeItem('cbt_history');
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Riwayat</span>
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className={`p-8 sm:p-12 text-center rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <History className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">Belum Ada Riwayat Ujian</h3>
                <p className="text-xs text-slate-500 mt-1">Selesaikan simulasi ujian berwaktu untuk merekam rekor skor belajar Anda.</p>
                <button
                  onClick={() => setShowConfigModal(true)}
                  className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
                >
                  Mulai Ujian Pertama
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {history.map((record, index) => {
                  const isPassed = record.score >= 70;
                  return (
                    <div
                      key={record.id}
                      className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
                        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">Percobaan #{history.length - index}</span>
                          <span aria-hidden="true">·</span>
                          <span>{record.date}</span>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          Menjawab benar <strong>{record.correctCount}</strong> dari {record.totalQuestions} soal
                          {' '}(Durasi: {formatTime(record.timeSpentSeconds)})
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <div className="text-right">
                          <div className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${
                            isPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                          }`}>
                            {record.score}%
                          </div>
                          <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-xs ${
                            isPassed ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {isPassed ? 'Lulus' : 'Remedial'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* =========================================================================
          MODAL 1: PENGATURAN JUMLAH SOAL & DURASI UJIAN
      ========================================================================= */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-lg p-5 sm:p-6 rounded-2xl border space-y-4 shadow-xl max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold">Pengaturan Simulasi Ujian</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Question count selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Jumlah Soal yang Mau Dikerjakan:
              </label>

              <div className="grid grid-cols-4 gap-2">
                {[10, 20, 40, 80].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleQuestionCountChange(num)}
                    className={`py-2 rounded-xl border text-xs font-bold transition-colors ${
                      configQuestionCount === num
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : isDark
                        ? 'bg-slate-800 border-slate-700 text-slate-300'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {num === 80 ? 'Semua (80)' : `${num} Soal`}
                  </button>
                ))}
              </div>

              {/* Slider for custom question count */}
              <div className="pt-2 flex items-center gap-3">
                <input
                  type="range"
                  min={5}
                  max={80}
                  step={5}
                  value={configQuestionCount}
                  onChange={(e) => handleQuestionCountChange(Number(e.target.value))}
                  className="flex-1 accent-indigo-600 cursor-pointer"
                />
                <span className="font-mono text-xs font-bold tabular-nums w-14 text-right">
                  {configQuestionCount} Soal
                </span>
              </div>
            </div>

            {/* Duration setting */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Alokasi Waktu Ujian:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 25, 45, 75].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setConfigDurationMinutes(mins)}
                    className={`py-2 rounded-xl border text-xs font-bold transition-colors ${
                      configDurationMinutes === mins
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : isDark
                        ? 'bg-slate-800 border-slate-700 text-slate-300'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {mins} Menit
                  </button>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <input
                  type="range"
                  min={10}
                  max={120}
                  step={5}
                  value={configDurationMinutes}
                  onChange={(e) => setConfigDurationMinutes(Number(e.target.value))}
                  className="flex-1 accent-indigo-600 cursor-pointer"
                />
                <span className="font-mono text-xs font-bold tabular-nums w-14 text-right">
                  {configDurationMinutes} Mnt
                </span>
              </div>
            </div>

            {/* Shuffle option & Category filter */}
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Filter Berdasarkan Topik:
                </label>
                <select
                  value={configCategory}
                  onChange={(e) => setConfigCategory(e.target.value)}
                  className={`w-full py-2 px-3 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="all">Semua Kategori (80 Soal)</option>
                  {ALL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-xs">
                  <span className="font-semibold block">Acak Urutan Soal (Shuffle)</span>
                  <span className="text-slate-500">Kocok urutan nomor agar tidak sama setiap kali</span>
                </div>
                <button
                  type="button"
                  onClick={() => setConfigShuffle(!configShuffle)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    configShuffle ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    configShuffle ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                onClick={startConfiguredExam}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
              >
                Mulai Ujian ({configQuestionCount} Soal)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: CONFIRMATION SELESAI UJIAN
      ========================================================================= */}
      {showSubmitModal && examSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-md p-5 sm:p-6 rounded-2xl border space-y-4 shadow-xl ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Kumpulkan Lembar Jawaban?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pastikan seluruh nomor telah diteliti dengan cermat.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Total Soal Ujian:</span>
                <strong className="font-mono">{examSession.totalQuestions} Soal</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Sudah Terjawab:</span>
                <strong className="font-mono text-indigo-600 dark:text-indigo-400">{Object.keys(examSession.answers).length}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Masih Ragu-ragu:</span>
                <strong className="font-mono text-amber-600 dark:text-amber-400">
                  {Object.values(examSession.markedForReview).filter(Boolean).length}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Belum Dijawab:</span>
                <strong className="font-mono text-rose-600 dark:text-rose-400">
                  {examSession.totalQuestions - Object.keys(examSession.answers).length}
                </strong>
              </div>
            </div>

            {examSession.totalQuestions - Object.keys(examSession.answers).length > 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Masih ada soal yang belum Anda jawab. Tetap ingin mengumpulkan?
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Kembali Meneliti
              </button>
              <button
                onClick={() => finishExam()}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                Ya, Kumpulkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: WARNING TINGGALKAN UJIAN
      ========================================================================= */}
      {showExitExamConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-md p-5 sm:p-6 rounded-2xl border space-y-4 shadow-xl ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Tinggalkan Sesi Ujian?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Sesi ujian CBT Anda sedang berlangsung.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Jika Anda berpindah halaman, sesi pengerjaan akan tersimpan di perangkat ini tetapi timer ujian tetap berjalan.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowExitExamConfirm(false);
                  setPendingTabSwitch(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Tetap di Ujian
              </button>
              <button
                onClick={() => {
                  setShowExitExamConfirm(false);
                  if (pendingTabSwitch) {
                    setActiveTab(pendingTabSwitch);
                    setPendingTabSwitch(null);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
              >
                Tinggalkan Sementara
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
