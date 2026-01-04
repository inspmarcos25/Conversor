import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CATEGORIES } from './constants';
import { CategoryId, Unit } from './types';

function App() {
  // --- State ---
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId>('pressure');
  const [amount, setAmount] = useState<string>('101325');
  const [fromUnitId, setFromUnitId] = useState<string>('');
  const [toUnitId, setToUnitId] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [copied, setCopied] = useState(false);

  // --- Refs for Dragging ---
  const navRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // --- Derived Data ---
  const activeCategory = useMemo(() => 
    CATEGORIES.find(c => c.id === activeCategoryId) || CATEGORIES[0], 
  [activeCategoryId]);

  const fromUnit = useMemo(() => 
    activeCategory.units.find(u => u.id === fromUnitId) || activeCategory.units[0], 
  [activeCategory, fromUnitId]);

  const toUnit = useMemo(() => 
    activeCategory.units.find(u => u.id === toUnitId) || activeCategory.units[1] || activeCategory.units[0], 
  [activeCategory, toUnitId]);

  // --- Logic ---

  // Initialize units when category changes
  useEffect(() => {
    setFromUnitId(activeCategory.units[0].id);
    // Try to set second unit as target if available, else same unit
    setToUnitId(activeCategory.units[1]?.id || activeCategory.units[0].id);
    
    // Set some default nice values for demo purposes when switching
    if (activeCategoryId === 'pressure') setAmount('101325');
    else if (activeCategoryId === 'temperature') setAmount('25');
    else if (activeCategoryId === 'speed') setAmount('100');
    else setAmount('1');
    
    setCopied(false);
  }, [activeCategoryId]);

  // Reset copy state when values change
  useEffect(() => {
    setCopied(false);
  }, [amount, fromUnitId, toUnitId]);

  // Theme Toggle
  useEffect(() => {
    const html = document.querySelector('html');
    if (isDarkMode) {
      html?.classList.add('dark');
    } else {
      html?.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Calculation
  const result = useMemo(() => {
    const val = parseFloat(amount);
    if (isNaN(val)) return '---';
    
    // Step 1: Convert to Base
    const baseVal = fromUnit.toBase(val);
    // Step 2: Convert from Base to Target
    const targetVal = toUnit.fromBase(baseVal);

    // Formatting Logic
    // If it's an integer roughly, show as integer.
    // If it's very small, show more decimals.
    if (Math.abs(targetVal) < 0.000001 && targetVal !== 0) {
      return targetVal.toExponential(4);
    }
    
    // Count significant digits or limit decimals
    const stringVal = targetVal.toString();
    if (stringVal.length > 10) {
        return targetVal.toPrecision(6);
    }
    
    // Clean up floating point errors like 0.00000000000004
    return parseFloat(targetVal.toFixed(6)).toString();

  }, [amount, fromUnit, toUnit]);

  // Conversion Ratio for footer (1 From = X To)
  const conversionRatio = useMemo(() => {
    const baseOne = fromUnit.toBase(1);
    const targetOne = toUnit.fromBase(baseOne);
    
    if (activeCategoryId === 'temperature') {
       return `1 ${fromUnit.symbol} = ${targetOne.toFixed(2)} ${toUnit.symbol}`;
    }
    return `1 ${fromUnit.symbol} = ${parseFloat(targetOne.toFixed(6))} ${toUnit.symbol}`;
  }, [fromUnit, toUnit, activeCategoryId]);

  // Handlers
  const handleSwap = () => {
    setFromUnitId(toUnit.id);
    setToUnitId(fromUnit.id);
  };

  const handleCopy = () => {
    if (result !== '---') {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // --- Drag to Scroll Handlers ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!navRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - navRef.current.offsetLeft);
    setScrollLeft(navRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !navRef.current) return;
    e.preventDefault();
    const x = e.pageX - navRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    navRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    // Use min-h-[100dvh] for better mobile browser support (addresses address bar resize issues)
    <div className="min-h-[100dvh] flex flex-col font-display text-slate-900 dark:text-white transition-colors duration-200 overflow-x-hidden">
      
      {/* --- Header --- */}
      <header className="flex items-center justify-between p-4 md:p-6 pb-2">
        <div className="flex items-center gap-3">
          {/* LOGO */}
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center overflow-hidden shrink-0">
             <img 
               src="https://cdn-icons-png.flaticon.com/512/7322/7322265.png" 
               alt="App Logo"
               className="w-6 h-6 md:w-8 md:h-8 object-contain"
             />
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            Converter
          </h1>
        </div>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </header>

      {/* --- Navigation --- */}
      <nav className="w-full mt-4 md:mt-6 pl-4 md:pl-6">
        <div 
          ref={navRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-6 pr-4 md:pr-6 cursor-grab active:cursor-grabbing select-none snap-x"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`
                  flex shrink-0 items-center justify-center gap-x-2 rounded-full py-2.5 px-5 md:py-3 md:px-7 transition-all snap-start
                  ${isActive 
                    ? 'bg-gradient-to-r from-primary to-secondary shadow-lg shadow-indigo-500/30 dark:shadow-indigo-900/50 active:scale-95' 
                    : 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700/50 hover:border-primary/30 dark:hover:border-primary/30 hover:bg-indigo-50 dark:hover:bg-slate-800'}
                `}
              >
                {cat.imageUrl ? (
                    <img 
                      src={cat.imageUrl} 
                      alt={cat.name} 
                      className="w-5 h-5 object-contain"
                    />
                ) : (
                    <span className={`material-symbols-outlined text-lg md:text-xl ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                      {cat.icon}
                    </span>
                )}
                
                <span className={`text-sm font-semibold tracking-wide ${isActive ? 'text-white font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col px-4 md:px-6 pt-2 pb-8 max-w-md mx-auto w-full relative justify-center">
        
        {/* FROM Card */}
        <div className="relative flex flex-col bg-white dark:bg-surface-dark rounded-3xl md:rounded-4xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 z-0 transition-all">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              From
            </label>
            <div className="relative group max-w-[60%]">
              <select
                value={fromUnitId}
                onChange={(e) => setFromUnitId(e.target.value)}
                className="w-full appearance-none bg-indigo-50 dark:bg-slate-800 text-slate-800 dark:text-white pl-4 pr-10 py-2 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold cursor-pointer border-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-surface-dark transition-all hover:bg-indigo-100 dark:hover:bg-slate-700 truncate"
              >
                {activeCategory.units.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary">
                <span className="material-symbols-outlined text-sm md:text-base font-bold">expand_more</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-baseline gap-2">
            <input 
              className="w-full bg-transparent p-0 text-5xl sm:text-6xl font-extrabold text-slate-800 dark:text-white border-none focus:ring-0 placeholder:text-slate-200 dark:placeholder:text-slate-700 tracking-tight"
              placeholder="0"
              type="number"
              inputMode="decimal" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <p className="mt-2 md:mt-3 text-xs md:text-sm text-slate-400 dark:text-slate-500 font-semibold tracking-wide truncate">
            {fromUnit.name}
          </p>
        </div>

        {/* SWAP Button */}
        <div className="relative z-10 -my-5 md:-my-6 flex justify-center">
          <button 
            onClick={handleSwap}
            className="group flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary border-[4px] md:border-[6px] border-background-light dark:border-background-dark shadow-xl shadow-primary/20 transition-transform active:scale-90 hover:shadow-2xl hover:shadow-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/30"
            aria-label="Swap units"
          >
            <span className="material-symbols-outlined text-white text-2xl md:text-3xl transition-transform duration-300 group-hover:rotate-180">
              swap_vert
            </span>
          </button>
        </div>

        {/* TO Card */}
        <div className="relative flex flex-col bg-indigo-50/50 dark:bg-[#161f2d] rounded-3xl md:rounded-4xl p-6 md:p-8 pt-10 md:pt-12 shadow-inner border border-indigo-100/50 dark:border-slate-800/50 z-0">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              To
            </label>
            <div className="relative group max-w-[60%]">
              <select
                value={toUnitId}
                onChange={(e) => setToUnitId(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-surface-dark text-slate-800 dark:text-white pl-4 pr-10 py-2 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold cursor-pointer border border-indigo-100 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-surface-dark transition-all hover:border-primary/50 truncate"
              >
                 {activeCategory.units.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-sm md:text-base font-bold">expand_more</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            <span className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary tracking-tight py-1 break-all">
              {result}
            </span>
            <button 
              onClick={handleCopy}
              className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl hover:bg-indigo-100 dark:hover:bg-slate-700/50 text-slate-400 hover:text-primary transition-all active:scale-95"
              aria-label="Copy result"
              title="Copy to clipboard"
            >
              <span className={`material-symbols-outlined transition-all duration-300 ${copied ? 'text-green-500 scale-110' : ''}`}>
                {copied ? 'check' : 'content_copy'}
              </span>
            </button>
          </div>
          <p className="mt-2 md:mt-3 text-xs md:text-sm text-slate-400 dark:text-slate-500 font-semibold tracking-wide truncate">
             {toUnit.name}
          </p>
        </div>

        {/* Footer Info */}
        <div className="mt-6 md:mt-8 flex justify-center">
          <div className="flex items-center gap-2 md:gap-3 px-4 py-2 md:px-5 md:py-3 rounded-full bg-white dark:bg-surface-dark border border-indigo-100 dark:border-slate-800 shadow-sm max-w-full">
            <span className="material-symbols-outlined text-primary text-sm md:text-base shrink-0">info</span>
            <p className="text-[10px] md:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
              {conversionRatio}
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;