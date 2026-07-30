'use client';

import React, { useState, useEffect, useMemo } from 'react';

// কারেন্সি ডাটা সোর্স
import { currencies } from '@/lib/currencies';

export default function BroxpayWallet() {
  // ১. সমস্ত প্রয়োজনীয় রিঅ্যাক্ট স্টেইটস (States)
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [rawUsdBalance, setRawUsdBalance] = useState(1518.68);
  const [hideBalance, setHideBalance] = useState(false);
  
  // ড্রয়ার ও মোডাল কন্ট্রোলার্স
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currencyModalOpen, setCurrencyModalOpen] = useState(false);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  
  // কারেন্সি সার্চ স্টেইট
  const [searchQuery, setSearchQuery] = useState('');

  // লাইভ ক্রিপ্টো রেট স্টেইট
  const [marketTokens, setMarketTokens] = useState({
    USDT: { price: 1.00, change: 0.12 },
    BTC: { price: 92450.00, change: 1.45 },
    TON: { price: 7.24, change: -0.12 },
    ETH: { price: 3120.75, change: -0.52 }
  });

  // সোয়াপ ক্যালকুলেটর স্টেইট
  const [swapFrom, setSwapFrom] = useState('bsc-usdt');
  const [swapTo, setSwapTo] = useState('xrocket-ton');
  const [swapAmountFrom, setSwapAmountFrom] = useState<number>(100);

  // লাইভ ব্রডকাস্ট মোডাল কন্ট্রোল
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [txStep, setTxStep] = useState(1);
  const [txText, setTxText] = useState('');
  const [txCompleted, setTxCompleted] = useState(false);

  // ২. লাইভ ক্রিপ্টো রেট চেঞ্জার ইঞ্জিন (useEffect)
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketTokens((prev) => {
        const updated = { ...prev };
        for (let key in updated) {
          const pct = (Math.random() * 0.3 - 0.15) / 100;
          updated[key as keyof typeof updated].price += updated[key as keyof typeof updated].price * pct;
          updated[key as keyof typeof updated].change += pct * 100;
        }
        return updated;
      });
      // লাইভ মার্কেট ফ্লাকচুয়েশনের সাথে ব্যালেন্স হালকা আপডেট হবে
      setRawUsdBalance(prev => prev + prev * ((Math.random() * 0.05 - 0.025) / 100));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // ৩. কারেন্সি ফ্ল্যাগ জেনারেটর
  const getFlag = (code: string) => {
    const overrides: Record<string, string> = {
      'EUR': 'EU', 'GBP': 'GB', 'BTC': '🪙', 'USDT': '🪙', 'TON': '💎', 'ETH': '🪙', 'BNB': '🪙', 'USD': 'US'
    };
    const countryCode = overrides[code] || code.substring(0, 2);
    if (countryCode === '🪙') return '🪙';
    if (countryCode === '💎') return '💎';
    try {
      const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
      return String.fromCodePoint(...codePoints);
    } catch {
      return '🏳️';
    }
  };

  // ৪. ডাইনামিক কারেন্সি এবং ব্যালেন্স ক্যালকুলেটর
  const activeCurrency = useMemo(() => {
    return currencies.find(c => c.code === currentCurrency) || currencies[0];
  }, [currentCurrency]);

  const displayedBalance = useMemo(() => {
    if (hideBalance) return 'Tap for Balance';
    const converted = rawUsdBalance * activeCurrency.rate;
    return `${activeCurrency.symbol} ${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [hideBalance, rawUsdBalance, activeCurrency]);

  // ৫. ইনস্ট্যান্ট সোয়াপ আউটপুট ক্যালকুলেটর
  const swapAmountToValue = useMemo(() => {
    const baseUsdPrices: Record<string, number> = {
      'bsc-usdt': 1.0,
      'trust-usdt': 1.0,
      'trust-btc': marketTokens.BTC.price,
      'xrocket-ton': marketTokens.TON.price
    };
    const inputUsd = swapAmountFrom * (baseUsdPrices[swapFrom] || 1.0);
    const result = inputUsd / (baseUsdPrices[swapTo] || 1.0);
    
    let displayLabel = 'TON';
    if (swapTo.includes('usdt')) displayLabel = 'USDT';
    if (swapTo.includes('btc')) displayLabel = 'BTC';

    return `${result.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ${displayLabel}`;
  }, [swapAmountFrom, swapFrom, swapTo, marketTokens]);

  // ৬. ওটিপি সোয়াপ ব্রডকাস্ট এনিমেশন সিমুলেশন
  const handleSwapSimulation = () => {
    setExchangeModalOpen(false);
    setTxModalOpen(true);
    setTxCompleted(false);
    setTxStep(1);
    setTxText("Re-routing transaction safely (1/3)...");

    setTimeout(() => {
      setTxStep(2);
      setTxText("Blockchain confirmation processing (2/3)...");
    }, 1500);

    setTimeout(() => {
      setTxStep(3);
      setTxText("Finalizing inter-wallet swap (3/3)...");
    }, 3000);

    setTimeout(() => {
      setTxCompleted(true);
      setTxText("Assets delivered directly to the target wallet address.");
    }, 4500);
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-4">
      {/* App Main Container */}
      <div className="w-full max-w-md md:max-w-5xl bg-white dark:bg-[#0f1624] h-[100dvh] md:h-[780px] flex flex-col justify-between relative shadow-2xl overflow-hidden md:rounded-[32px] md:border md:border-gray-100 dark:md:border-slate-800 transition-colors duration-300">
        
        {/* Scrollable Content Area */}
        <div class="overflow-y-auto flex-1 pb-24 md:pb-6 scrollbar-none">
          
          {/* Header Section */}
          <div class="flex items-center justify-between px-5 pt-6 pb-2.5 border-b border-gray-100/10 dark:border-slate-800/50">
            <div class="flex items-center space-x-3">
              <div class="relative">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Profile" class="w-11 h-11 rounded-full border-2 border-[#F0B90B] object-cover shadow-md" />
                <span class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#0f1624] rounded-full"></span>
              </div>
              <div>
                <h2 class="font-extrabold text-gray-900 dark:text-white text-xs tracking-wider flex items-center gap-1">
                  MAC SAMUAL <i class="fa-solid fa-circle-check text-blue-500 text-[10px]" title="Verified"></i>
                </h2>
                <div onClick={() => setHideBalance(!hideBalance)} class="inline-flex items-center bg-gray-100 dark:bg-slate-800 text-gray-750 dark:text-slate-300 px-3 py-1 rounded-full text-[10px] font-bold mt-1 shadow-2xs cursor-pointer select-none border border-gray-200/50 dark:border-slate-700/50 transition-all hover:scale-102">
                  <i class="fa-solid fa-coins mr-1.5 text-amber-500"></i> {displayedBalance}
                </div>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <div class="text-gray-600 dark:text-gray-300 text-sm cursor-pointer p-2 bg-gray-100 dark:bg-slate-800/80 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                <i class="fa-solid fa-magnifying-glass"></i>
              </div>
              <div onClick={() => setSidebarOpen(true)} class="text-gray-600 dark:text-gray-300 text-sm cursor-pointer p-2 bg-gray-100 dark:bg-slate-800/80 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                <i class="fa-solid fa-bars"></i>
              </div>
            </div>
          </div>

          {/* Grid Layout (Left vs Right Panel on desktop) */}
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 px-5 mt-4">
            
            {/* LEFT PANEL */}
            <div class="col-span-1 md:col-span-7 space-y-5">
              
              {/* Tunnel Status */}
              <div class="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-3.5 flex items-center justify-between">
                <div class="flex items-center space-x-2.5">
                  <span class="text-base">⚡</span>
                  <div>
                    <span class="text-[9px] text-amber-500 dark:text-[#F0B90B] font-extrabold uppercase tracking-wider">Router Channel Online</span>
                    <p class="text-[10px] text-gray-550 dark:text-slate-400 font-medium">Binance &harr; XRocket &harr; TrustWallet Active</p>
                  </div>
                </div>
                <span class="text-[9px] bg-emerald-500/10 text-emerald-500 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <span class="w-1 h-1 rounded-full bg-emerald-500 animate-ping"></span> Live
                </span>
              </div>

              {/* Services Grid */}
              <div>
                <h3 class="font-extrabold text-gray-800 dark:text-slate-400 text-[10px] tracking-wider uppercase mb-2.5">Quick Actions</h3>
                <div class="grid grid-cols-4 gap-3 bg-gray-55/40 dark:bg-slate-950/40 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-800/85">
                  <div class="flex flex-col items-center cursor-pointer group">
                    <div class="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-500 dark:text-blue-400 rounded-2xl flex items-center justify-center text-sm mb-1.5 border border-blue-100 dark:border-blue-900/30 group-hover:scale-105 transition-transform">
                      <i class="fa-solid fa-paper-plane"></i>
                    </div>
                    <span class="text-[10px] text-gray-700 dark:text-gray-300 font-extrabold text-center">Send</span>
                  </div>
                  <div class="flex flex-col items-center cursor-pointer group">
                    <div class="w-12 h-12 bg-teal-50 dark:bg-teal-950/40 text-teal-500 dark:text-teal-400 rounded-2xl flex items-center justify-center text-sm mb-1.5 border border-teal-100 dark:border-teal-900/30 group-hover:scale-105 transition-transform">
                      <i class="fa-solid fa-mobile-screen"></i>
                    </div>
                    <span class="text-[10px] text-gray-700 dark:text-gray-300 font-extrabold text-center">Recharge</span>
                  </div>
                  <div class="flex flex-col items-center cursor-pointer group">
                    <div class="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 dark:text-emerald-400 rounded-2xl flex items-center justify-center text-sm mb-1.5 border border-emerald-100 dark:border-emerald-900/30 group-hover:scale-105 transition-transform">
                      <i class="fa-solid fa-wallet"></i>
                    </div>
                    <span class="text-[10px] text-gray-700 dark:text-gray-300 font-extrabold text-center">Add</span>
                  </div>
                  <div onClick={() => setExchangeModalOpen(true)} class="flex flex-col items-center cursor-pointer group">
                    <div class="w-12 h-12 bg-amber-50 dark:bg-amber-950/40 text-amber-500 dark:text-amber-400 rounded-2xl flex items-center justify-center text-sm mb-1.5 border border-amber-100 dark:border-amber-900/30 group-hover:scale-105 transition-transform">
                      <i class="fa-solid fa-arrow-right-arrow-left"></i>
                    </div>
                    <span class="text-[10px] text-gray-700 dark:text-gray-300 font-extrabold text-center">Exchange</span>
                  </div>
                </div>
              </div>

              {/* Slider */}
              <div>
                <h3 class="font-extrabold text-gray-800 dark:text-slate-400 text-[10px] tracking-wider uppercase mb-2.5">Promos & Deals</h3>
                <div class="overflow-x-auto flex space-x-4 snap-x snap-mandatory scrollbar-none cursor-grab" id="promo-carousel">
                  <div class="promo-slide w-full flex-shrink-0 snap-center bg-gradient-to-br from-[#12161F] via-[#1E232F] to-[#12161F] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden h-[135px]">
                    <div class="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl"></div>
                    <div class="flex justify-between items-start z-10 text-white">
                      <div>
                        <span class="bg-[#F0B90B]/10 border border-[#F0B90B]/30 text-[#F0B90B] text-[8px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Broxpay Router</span>
                        <h3 class="text-sm font-extrabold mt-1 leading-tight">Binance ⇄ XRocket Tunnel</h3>
                      </div>
                      <i class="fa-solid fa-bolt text-lg text-[#F0B90B] animate-pulse"></i>
                    </div>
                    <div class="flex justify-between items-center z-10 mt-2 text-white">
                      <p class="text-[9px] text-slate-400">Zero fee routing with high-speed execution pools</p>
                      <button onClick={() => setExchangeModalOpen(true)} class="bg-amber-500 text-slate-950 text-[10px] font-black px-4 py-1.5 rounded-xl">Swap Now</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT PANEL */}
            <div class="col-span-1 md:col-span-5 flex flex-col justify-between">
              <div>
                <h3 class="font-extrabold text-gray-800 dark:text-slate-300 text-[10px] tracking-wider uppercase mb-2.5">Market Trends</h3>
                <div class="space-y-3 bg-gray-50/50 dark:bg-slate-950/30 p-4 rounded-2xl border border-gray-100 dark:border-slate-800/80">
                  {Object.entries(marketTokens).map(([key, token]) => {
                    const mappedPrice = key === 'USDT' ? activeCurrency.rate : token.price * activeCurrency.rate;
                    return (
                      <div key={key} class="flex justify-between items-center p-1 rounded-xl">
                        <div class="flex items-center space-x-3.5">
                          <span class="text-lg">{getFlag(key)}</span>
                          <div>
                            <h4 class="font-bold text-gray-900 dark:text-white text-xs">{key}</h4>
                          </div>
                        </div>
                        <div class="text-right">
                          <span class="text-xs font-black text-gray-900 dark:text-white">
                            {activeCurrency.symbol}{mappedPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span class={`text-[10px] font-bold block mt-0.5 ${token.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {token.change >= 0 ? '+' : ''}{token.change.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Nav */}
        <div class="absolute bottom-0 left-0 right-0 md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-gray-100 dark:border-slate-850 px-8 py-3.5 pb-4 flex justify-between items-center z-20 shadow-lg">
          <div class="flex flex-col items-center text-amber-500 dark:text-[#F0B90B] cursor-pointer">
            <i class="fa-solid fa-house text-lg"></i>
            <span class="text-[10px] font-extrabold mt-0.5">Home</span>
          </div>
          <div class="absolute left-1/2 -top-5 transform -translate-x-1/2">
            <div onClick={() => setExchangeModalOpen(true)} class="w-12 h-12 bg-white dark:bg-[#0f1624] rounded-full p-1 shadow-md border border-gray-100 dark:border-slate-800 flex items-center justify-center cursor-pointer">
              <div class="w-full h-full bg-amber-50 dark:bg-slate-800 text-[#F0B90B] rounded-full flex items-center justify-center text-base shadow-inner">
                <i class="fa-solid fa-qrcode"></i>
              </div>
            </div>
          </div>
          <div class="flex flex-col items-center text-gray-400 dark:text-slate-500 cursor-pointer">
            <i class="fa-solid fa-file-lines text-lg"></i>
            <span class="text-[10px] font-extrabold mt-0.5">History</span>
          </div>
        </div>

        {/* SIDEBAR HUB */}
        {sidebarOpen && (
          <>
            <div onClick={() => setSidebarOpen(false)} class="absolute inset-0 bg-black/60 z-30 transition-opacity duration-300 md:rounded-[32px]" />
            <div class="absolute top-0 right-0 h-full w-72 bg-white dark:bg-[#0f1624] z-40 shadow-2xl border-l border-gray-100 dark:border-slate-800/80 flex flex-col justify-between transition-transform duration-300">
              <div class="p-5">
                <div class="flex justify-between items-center mb-6">
                  <span class="text-amber-500 dark:text-[#F0B90B] font-extrabold tracking-widest text-xs uppercase">Broxpay Hub</span>
                  <button onClick={() => setSidebarOpen(false)} class="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200">
                    <i class="fa-solid fa-xmark text-lg"></i>
                  </button>
                </div>

                <div class="space-y-4">
                  <div onClick={() => { setSidebarOpen(false); setCurrencyModalOpen(true); }} class="flex justify-between items-center p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-950 cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-slate-800 transition-all">
                    <div class="flex items-center space-x-2">
                      <i class="fa-solid fa-earth-americas text-slate-500 dark:text-slate-400 text-xs"></i>
                      <span class="text-xs font-bold text-gray-700 dark:text-slate-300">Currency</span>
                    </div>
                    <span class="text-[10px] font-extrabold text-amber-500 dark:text-[#F0B90B] bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      {getFlag(activeCurrency.code)} {activeCurrency.code} ({activeCurrency.symbol})
                    </span>
                  </div>
                </div>
              </div>
              <div class="p-5 border-t border-gray-100 dark:border-slate-800 text-center">
                <span class="text-[9px] text-gray-400 font-semibold uppercase">Broxpay Version 1.2.0</span>
              </div>
            </div>
          </>
        )}

        {/* CURRENCY SELECTOR MODAL */}
        {currencyModalOpen && (
          <>
            <div onClick={() => setCurrencyModalOpen(false)} class="absolute inset-0 bg-black/60 z-50 transition-opacity duration-300 md:rounded-[32px]" />
            <div class="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#0f1624] h-[85%] rounded-t-[32px] p-5 shadow-2xl z-50 flex flex-col transition-transform duration-300">
              <div class="flex justify-between items-center mb-4">
                <h4 class="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">Select Currency</h4>
                <button onClick={() => setCurrencyModalOpen(false)} class="text-gray-400">
                  <i class="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>
              <input 
                type="text" 
                placeholder="Search currency..." 
                onChange={(e) => setSearchQuery(e.target.value)}
                class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl px-4 py-2 text-xs mb-4 text-white outline-none" 
              />
              <div class="flex-1 overflow-y-auto space-y-1.5 scrollbar-none">
                {currencies
                  .filter(c => c.code.toLowerCase().includes(searchQuery.toLowerCase()) || c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(c => (
                    <div 
                      key={c.code} 
                      onClick={() => { setCurrentCurrency(c.code); setCurrencyModalOpen(false); }}
                      class={`flex justify-between items-center p-3 rounded-xl cursor-pointer ${currentCurrency === c.code ? 'bg-amber-500/10' : ''}`}
                    >
                      <span class="text-xs font-bold text-white">{getFlag(c.code)} {c.code} - {c.name}</span>
                      <span class="text-xs text-slate-500">{c.symbol}</span>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {/* PRESET EXCHANGE MODAL SHEET */}
        {exchangeModalOpen && (
          <>
            <div onClick={() => setExchangeModalOpen(false)} class="absolute inset-0 bg-black/60 z-40 transition-opacity" />
            <div class="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#0f1624] h-[80%] rounded-t-[32px] p-5 shadow-2xl z-45 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center mb-5">
                  <h4 class="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <i class="fa-solid fa-shuffle text-amber-500 animate-spin-slow"></i> Broxpay Auto-Router
                  </h4>
                  <button onClick={() => setExchangeModalOpen(false)} class="text-gray-400">
                    <i class="fa-solid fa-xmark text-lg"></i>
                  </button>
                </div>

                <div class="space-y-4">
                  <div class="bg-gray-50 dark:bg-slate-900 p-3.5 rounded-xl border border-gray-100 dark:border-slate-800 flex justify-between items-center">
                    <div>
                      <label class="block text-[8px] font-bold text-gray-400 dark:text-slate-500 uppercase">From Platform</label>
                      <select value={swapFrom} onChange={(e) => setSwapFrom(e.target.value)} class="bg-transparent text-xs font-bold text-gray-800 dark:text-slate-200 outline-none mt-1">
                        <option value="bsc-usdt" class="dark:bg-slate-900">Binance - USDT (BEP20)</option>
                        <option value="trust-btc" class="dark:bg-slate-900">TrustWallet - BTC</option>
                        <option value="xrocket-ton" class="dark:bg-slate-900">XRocket - TON</option>
                      </select>
                    </div>
                    <input 
                      type="number" 
                      value={swapAmountFrom} 
                      onChange={(e) => setSwapAmountFrom(parseFloat(e.target.value) || 0)}
                      class="w-24 bg-transparent text-right text-gray-800 dark:text-slate-200 font-extrabold text-sm outline-none" 
                    />
                  </div>

                  <div class="flex justify-center -my-3.5">
                    <div class="w-8 h-8 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center text-xs shadow-md border-2 border-white dark:border-slate-950 z-10">
                      <i class="fa-solid fa-arrow-down-long"></i>
                    </div>
                  </div>

                  <div class="bg-gray-50 dark:bg-slate-900 p-3.5 rounded-xl border border-gray-100 dark:border-slate-800 flex justify-between items-center">
                    <div>
                      <label class="block text-[8px] font-bold text-gray-400 dark:text-slate-500 uppercase">To Platform</label>
                      <select value={swapTo} onChange={(e) => setSwapTo(e.target.value)} class="bg-transparent text-xs font-bold text-gray-800 dark:text-slate-200 outline-none mt-1">
                        <option value="xrocket-ton" class="dark:bg-slate-900">XRocket - TON</option>
                        <option value="trust-usdt" class="dark:bg-slate-900">TrustWallet - USDT</option>
                        <option value="bsc-usdt" class="dark:bg-slate-900">Binance - USDT</option>
                      </select>
                    </div>
                    <span class="text-right text-amber-600 dark:text-amber-400 font-extrabold text-sm">{swapAmountToValue}</span>
                  </div>
                </div>
              </div>

              <button onClick={handleSwapSimulation} class="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider mt-4">
                Confirm Auto Exchange
              </button>
            </div>
          </>
        )}

        {/* Simulated Crypto Transaction Processing Screen (Overlay) */}
        {txModalOpen && (
          <div class="absolute inset-0 bg-black/70 z-50 flex flex-col justify-center items-center p-6 md:rounded-[32px]">
            <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-xs text-center space-y-4 shadow-2xl border border-slate-800/80">
              <div class="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div class="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-slate-800"></div>
                {!txCompleted && <div class="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>}
                <i class={`fa-solid text-xl text-amber-500 ${txCompleted ? 'fa-circle-check text-emerald-500 text-2xl' : 'fa-arrow-right-arrow-left animate-pulse'}`}></i>
              </div>
              <div>
                <h4 class="text-sm font-bold text-gray-800 dark:text-white">{txCompleted ? 'Exchange Success!' : 'Connecting Broxpay Pools'}</h4>
                <p class="text-[11px] text-gray-450 dark:text-slate-400 mt-1">{txText}</p>
              </div>
              {txCompleted && (
                <button onClick={() => setTxModalOpen(false)} class="w-full bg-amber-500 text-slate-950 font-extrabold py-2 rounded-xl text-xs hover:bg-amber-600">
                  Done
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
