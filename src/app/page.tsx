'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { currencies } from './currencies';

export default function BroxpayWallet() {
  // ১. অলরেডি এস্টাবলিশড গ্লোবাল স্টেইটস (React States)
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [rawUsdBalance, setRawUsdBalance] = useState(1518.68);
  const [hideBalanceState, setHideBalanceState] = useState(false); // starts false (Tap to show balance)
  
  // ড্রয়ার ও মোডাল কন্ট্রোলারস
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currencyModalOpen, setCurrencyModalOpen] = useState(false);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');

  // লাইভ ক্রিপ্টো রেট ডেটা (হুবহু একই ভ্যালু)
  const [marketTokens, setMarketTokens] = useState({
    USDT: { price: 1.00, change: 0.12 },
    BTC: { price: 92450.00, change: 1.45 },
    TON: { price: 7.24, change: -0.12 },
    ETH: { price: 3120.75, change: -0.52 }
  });

  // সোয়াপ এপিআই ক্যালকুলেটর স্টেইট
  const [swapFrom, setSwapFrom] = useState('bsc-usdt');
  const [swapTo, setSwapTo] = useState('xrocket-ton');
  const [swapAmountFrom, setSwapAmountFrom] = useState<number>(100);

  // ট্রানজেকশন ব্রডকাস্ট এনিমেশন সিমুলেশন
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [txText, setTxText] = useState('');
  const [txCompleted, setTxCompleted] = useState(false);

  // ২. লাইভ ক্রিপ্টো রেট আপডেটার লুপ
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
      setRawUsdBalance(prev => prev + prev * ((Math.random() * 0.05 - 0.025) / 100));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // ৩. ফ্লাগ জেনারেটর
  const getFlag = (code: string) => {
    const overrides: Record<string, string> = {
      'EUR': 'EU', 'GBP': 'GB', 'USD': 'US'
    };
    const countryCode = overrides[code] || code.substring(0, 2);
    try {
      const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
      return String.fromCodePoint(...codePoints);
    } catch {
      return '🏳️';
    }
  };

  const activeCurrency = useMemo(() => {
    return currencies.find(c => c.code === currentCurrency) || currencies[0];
  }, [currentCurrency]);

  // ৪. সোয়াপ ফলাফল ক্যালকুলেটর
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

  const handleSwapSimulation = () => {
    setExchangeModalOpen(false);
    setTxModalOpen(true);
    setTxCompleted(false);
    setTxText("Re-routing transaction safely (1/3)...");

    setTimeout(() => {
      setTxText("Blockchain confirmation processing (2/3)...");
    }, 1500);

    setTimeout(() => {
      setTxText("Finalizing inter-wallet swap (3/3)...");
    }, 3000);

    setTimeout(() => {
      setTxCompleted(true);
      setTxText("Assets delivered directly to the target wallet address.");
    }, 4500);
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-4 w-full">
      
      {/* App Main Container (Transforms from a Mobile Frame on Desktop to full-width Dashboard) */}
      <div className="w-full max-w-md md:max-w-5xl bg-white dark:bg-[#0f1624] h-[100dvh] md:h-[780px] flex flex-col justify-between relative shadow-2xl overflow-hidden md:rounded-[32px] md:border md:border-gray-100 dark:md:border-slate-800 transition-colors duration-300">
        
        {/* Success Toast Notification */}
        <div id="toast" className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-2xl shadow-lg z-50 flex items-center space-x-2 text-xs font-bold transition-all duration-300 opacity-0 -translate-y-4 pointer-events-none border border-emerald-400/20">
          <i className="fa-solid fa-circle-check text-sm text-white"></i>
          <span id="toast-message">Converted successfully!</span>
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto flex-1 pb-24 md:pb-6 scrollbar-none">
            
            {/* Header Section */}
            <div className="flex items-center justify-between px-5 pt-6 pb-2.5 border-b border-gray-100/10 dark:border-slate-800/50">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Profile" className="w-11 h-11 rounded-full border-2 border-[#F0B90B] object-cover shadow-md" />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#0f1624] rounded-full"></span>
                    </div>
                    <div>
                        <h2 className="font-extrabold text-gray-900 dark:text-white text-xs tracking-wider flex items-center gap-1">
                            MAC SAMUAL 
                            <i className="fa-solid fa-circle-check text-blue-500 text-[10px]" title="Verified"></i>
                        </h2>
                        
                        {/* Interactive Balance Display */}
                        <div id="balance-btn" onClick={() => setHideBalanceState(!hideBalanceState)} className="inline-flex items-center bg-gray-100 dark:bg-slate-800 text-gray-750 dark:text-slate-300 px-3 py-1 rounded-full text-[10px] font-bold mt-1 shadow-2xs cursor-pointer select-none border border-gray-200/50 dark:border-slate-700/50 transition-all hover:scale-102">
                          {hideBalanceState ? (
                            <>
                              <i className="fa-solid fa-coins mr-1.5 text-amber-500"></i>
                              {activeCurrency.symbol} {(rawUsdBalance * activeCurrency.rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </>
                          ) : (
                            <>
                              <i className="fa-solid fa-circle-dollar-to-slot mr-1.5 text-blue-500"></i>
                              Tap for Balance
                            </>
                          )}
                        </div>
                    </div>
                </div>
                {/* Controls Header */}
                <div className="flex items-center space-x-2">
                    <div className="text-gray-600 dark:text-gray-300 text-sm cursor-pointer p-2 bg-gray-100 dark:bg-slate-800/80 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <div onClick={() => setSidebarOpen(true)} className="text-gray-600 dark:text-gray-300 text-sm cursor-pointer p-2 bg-gray-100 dark:bg-slate-800/80 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <i className="fa-solid fa-bars"></i>
                    </div>
                </div>
            </div>

            {/* Responsive Widescreen Split Layout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 px-5 mt-4">
                
                {/* LEFT PANEL */}
                <div className="col-span-1 md:col-span-7 space-y-5">
                    
                    {/* Auto-Exchange Active Status Banner */}
                    <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-3.5 flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                            <span className="text-base text-amber-500">⚡</span>
                            <div>
                                <span className="text-[9px] text-amber-500 dark:text-[#F0B90B] font-extrabold uppercase tracking-wider">Router Channel Online</span>
                                <p className="text-[10px] text-gray-550 dark:text-slate-400 font-medium">Binance &harr; XRocket &harr; TrustWallet Active</p>
                            </div>
                        </div>
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-500 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live
                        </span>
                    </div>

                    {/* Services Grid Layout */}
                    <div>
                        <h3 className="font-extrabold text-gray-800 dark:text-slate-400 text-[10px] tracking-wider uppercase mb-2.5">Quick Actions</h3>
                        <div className="grid grid-cols-4 gap-3 bg-gray-55/40 dark:bg-slate-950/40 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-800/85">
                            {/* Send Money */}
                            <div className="flex flex-col items-center cursor-pointer group">
                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-500 dark:text-blue-400 rounded-2xl flex items-center justify-center text-sm mb-1.5 shadow-sm group-hover:scale-105 transition-transform border border-blue-100 dark:border-blue-900/30">
                                    <i className="fa-solid fa-paper-plane"></i>
                                </div>
                                <span className="text-[10px] text-gray-700 dark:text-gray-300 font-extrabold text-center leading-tight">Send</span>
                            </div>
                            {/* Recharge */}
                            <div className="flex flex-col items-center cursor-pointer group">
                                <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/40 text-teal-500 dark:text-teal-400 rounded-2xl flex items-center justify-center text-sm mb-1.5 shadow-sm group-hover:scale-105 transition-transform border border-teal-100 dark:border-teal-900/30">
                                    <i class="fa-solid fa-mobile-screen"></i>
                                </div>
                                <span className="text-[10px] text-gray-700 dark:text-gray-300 font-extrabold text-center leading-tight">Recharge</span>
                            </div>
                            {/* Add Money */}
                            <div className="flex flex-col items-center cursor-pointer group">
                                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 dark:text-emerald-400 rounded-2xl flex items-center justify-center text-sm mb-1.5 shadow-sm group-hover:scale-105 transition-transform border border-emerald-100 dark:border-emerald-900/30">
                                    <i className="fa-solid fa-wallet"></i>
                                </div>
                                <span className="text-[10px] text-gray-700 dark:text-gray-300 font-extrabold text-center leading-tight">Add</span>
                            </div>
                            {/* Exchange Trigger Button */}
                            <div onClick={() => setExchangeModalOpen(true)} className="flex flex-col items-center cursor-pointer group">
                                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/40 text-amber-500 dark:text-amber-400 rounded-2xl flex items-center justify-center text-sm mb-1.5 shadow-sm group-hover:scale-105 transition-transform border border-amber-100 dark:border-amber-900/30">
                                    <i className="fa-solid fa-arrow-right-arrow-left"></i>
                                </div>
                                <span className="text-[10px] text-gray-700 dark:text-gray-300 font-extrabold text-center leading-tight">Exchange</span>
                            </div>
                        </div>
                    </div>

                    {/* Promo & Campaigns Slider */}
                    <div>
                        <h3 className="font-extrabold text-gray-800 dark:text-slate-400 text-[10px] tracking-wider uppercase mb-2.5">Promos & Deals</h3>
                        <div className="overflow-x-auto flex space-x-4 snap-x snap-mandatory scrollbar-none cursor-grab" id="promo-carousel" style={{ scrollBehavior: 'smooth' }}>
                            
                            {/* Slide 1 */}
                            <div className="promo-slide w-full flex-shrink-0 snap-center bg-gradient-to-br from-[#12161F] via-[#1E232F] to-[#12161F] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden shadow-md text-white h-[135px]">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl"></div>
                                <div className="flex justify-between items-start z-10">
                                    <div>
                                        <span className="bg-[#F0B90B]/10 border border-[#F0B90B]/30 text-[#F0B90B] text-[8px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Broxpay Router</span>
                                        <h3 className="text-sm font-extrabold mt-1 leading-tight text-white">Binance &harr; XRocket Channel</h3>
                                    </div>
                                    <i className="fa-solid fa-bolt text-lg text-yellow-300 animate-bounce"></i>
                                </div>
                                <div class="flex justify-between items-center z-10 mt-2">
                                    <p className="text-[9px] text-slate-400">Zero fee routing with high-speed execution pools</p>
                                    <button onClick={() => setExchangeModalOpen(true)} className="bg-[#F0B90B] text-slate-950 text-[10px] font-black px-4 py-1.5 rounded-xl hover:bg-yellow-500 transition-colors shadow-sm">Swap Now</button>
                                </div>
                            </div>

                            {/* Slide 2 */}
                            <div className="promo-slide w-full flex-shrink-0 snap-center bg-gradient-to-br from-emerald-600 via-teal-650 to-teal-700 border border-emerald-500/20 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden shadow-md text-white h-[135px]">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                                <div className="flex justify-between items-start z-10">
                                    <div>
                                        <span class="bg-white/20 text-[8px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">TrustWallet Gift</span>
                                        <h3 className="text-sm font-extrabold mt-1 leading-tight text-white">Claim Your 10% Crypto Bonus</h3>
                                    </div>
                                    <i className="fa-solid fa-gift text-lg text-yellow-200"></i>
                                </div>
                                <div className="flex justify-between items-center z-10 mt-2">
                                    <p class="text-[9px] text-teal-100">Valid on all first-time Add Money inputs</p>
                                    <button className="bg-white text-emerald-650 text-[10px] font-black px-4 py-1.5 rounded-xl hover:bg-teal-50 transition-colors shadow-sm">Claim</button>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                {/* RIGHT PANEL */}
                <div className="col-span-1 md:col-span-5 flex flex-col justify-between">
                    
                    <div>
                        <div className="flex justify-between items-center mb-2.5">
                            <h3 className="font-extrabold text-gray-800 dark:text-slate-300 text-[10px] tracking-wider uppercase">Market Trends</h3>
                        </div>
                        
                        {/* List of Cryptocurrencies */}
                        <div className="space-y-3 bg-gray-50/50 dark:bg-slate-950/30 p-4 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-2xs">
                            
                            {/* USDT */}
                            <div className="flex justify-between items-center p-1 rounded-xl transition-all hover:bg-white dark:hover:bg-slate-900/60">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-100 dark:border-emerald-900/30 shadow-xs relative">
                                        <span className="text-xs font-bold">$</span>
                                        <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0f1624]"></span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-xs">USDT</h4>
                                        <span className="text-[9px] text-gray-400 dark:text-slate-550 block font-semibold uppercase">Tether US</span>
                                    </div>
                                </div>
                                <div>
                                    <svg className="w-14 h-7 filter drop-shadow-[0_2px_4px_rgba(16,185,129,0.25)]" viewBox="0 0 50 20">
                                        <path d="M0 15 Q12 10 25 12 T50 5" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div className="text-right">
                                    <span id="ticker-USDT" className="text-xs font-black text-gray-900 dark:text-white">
                                      {activeCurrency.symbol}{(marketTokens.USDT.price * activeCurrency.rate).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-500 block mt-0.5">+{marketTokens.USDT.change.toFixed(2)}%</span>
                                </div>
                            </div>

                            {/* BTC */}
                            <div className="flex justify-between items-center p-1 rounded-xl transition-all hover:bg-white dark:hover:bg-slate-900/60">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-9 h-9 bg-amber-50 dark:bg-amber-950/40 text-[#F0B90B] rounded-full flex items-center justify-center border border-amber-100 dark:border-amber-900/30 shadow-xs relative">
                                        <span className="text-xs font-bold">B</span>
                                        <span className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full border-2 border-white dark:border-[#0f1624]"></span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-xs">BTC</h4>
                                        <span className="text-[9px] text-gray-400 dark:text-slate-550 block font-semibold uppercase">Bitcoin</span>
                                    </div>
                                </div>
                                <div>
                                    <svg className="w-14 h-7 filter drop-shadow-[0_2px_4px_rgba(16,185,129,0.25)]" viewBox="0 0 50 20">
                                        <path d="M0 18 Q12 12 25 5 T50 2" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div class="text-right">
                                    <span id="ticker-BTC" className="text-xs font-black text-gray-900 dark:text-white">
                                      {activeCurrency.symbol}{(marketTokens.BTC.price * activeCurrency.rate).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-500 block mt-0.5">+{marketTokens.BTC.change.toFixed(2)}%</span>
                                </div>
                            </div>

                            {/* ETH */}
                            <div className="flex justify-between items-center p-1 rounded-xl transition-all hover:bg-white dark:hover:bg-slate-900/60">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-9 h-9 bg-[#1E232F] text-indigo-400 rounded-full flex items-center justify-center border border-slate-750 shadow-xs relative">
                                        <span className="text-xs font-bold">E</span>
                                        <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-[#0f1624]"></span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-xs">ETH</h4>
                                        <span className="text-[9px] text-gray-400 dark:text-slate-550 block font-semibold uppercase">Ethereum</span>
                                    </div>
                                </div>
                                <div>
                                    <svg className="w-14 h-7 filter drop-shadow-[0_2px_4px_rgba(244,63,94,0.3)]" viewBox="0 0 50 20">
                                        <path d="M0 4 Q12 16 25 10 T50 18" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div className="text-right">
                                    <span id="ticker-ETH" className="text-xs font-black text-gray-900 dark:text-white">
                                      {activeCurrency.symbol}{(marketTokens.ETH.price * activeCurrency.rate).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                    <span className="text-[10px] font-bold text-rose-500 block mt-0.5">{marketTokens.ETH.change.toFixed(2)}%</span>
                                </div>
                            </div>

                            {/* TON */}
                            <div className="flex justify-between items-center p-1 rounded-xl transition-all hover:bg-white dark:hover:bg-slate-900/60">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-9 h-9 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-full flex items-center justify-center border border-blue-100 dark:border-blue-900/30 shadow-xs relative">
                                        <span className="text-xs font-bold">T</span>
                                        <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-[#0f1624]"></span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-xs">TON</h4>
                                        <span className="text-[9px] text-gray-400 dark:text-slate-550 block font-semibold uppercase">Toncoin</span>
                                    </div>
                                </div>
                                <div>
                                    <svg className="w-14 h-7 filter drop-shadow-[0_2px_4px_rgba(244,63,94,0.3)]" viewBox="0 0 50 20">
                                        <path d="M0 15 Q12 5 25 9 T50 14" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div className="text-right">
                                    <span id="ticker-TON" className="text-xs font-black text-gray-900 dark:text-white">
                                      {activeCurrency.symbol}{(marketTokens.TON.price * activeCurrency.rate).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                    <span className="text-[10px] font-bold text-rose-500 block mt-0.5">{marketTokens.TON.change.toFixed(2)}%</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

            </div>

        </div>

        {/* Fixed Bottom Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 md:hidden bg-[#030712]/95 backdrop-blur-md border-t border-slate-800 px-8 py-3.5 pb-4 flex justify-between items-center z-20 shadow-lg">
            {/* Home */}
            <div className="flex flex-col items-center text-amber-500 cursor-pointer">
                <span className="text-[10px] font-extrabold uppercase">Home</span>
            </div>
            
            {/* Floating QR Scanner Button */}
            <div className="absolute left-1/2 -top-5 transform -translate-x-1/2">
                <div onClick={() => setExchangeModalOpen(true)} className="w-12 h-12 bg-white dark:bg-[#0f1624] rounded-full p-1 shadow-md border border-gray-100 dark:border-slate-800 flex items-center justify-center cursor-pointer">
                    <div className="w-full h-full bg-amber-50 dark:bg-slate-800 text-[#F0B90B] rounded-full flex items-center justify-center text-base shadow-inner">
                        <span className="text-xs font-extrabold">SWAP</span>
                    </div>
                </div>
            </div>

            {/* History */}
            <div className="flex flex-col items-center text-gray-400 dark:text-slate-500 cursor-pointer">
                <span className="text-[10px] font-extrabold uppercase">History</span>
            </div>
        </div>

        {/* INTERACTIVE DRAWER SIDEBAR */}
        {sidebarOpen && (
          <>
            <div onClick={() => setSidebarOpen(false)} className="absolute inset-0 bg-black/60 z-30 transition-opacity duration-300 md:rounded-[32px]"></div>
            <div className="absolute top-0 right-0 h-full w-72 bg-white dark:bg-[#0f1624] z-40 shadow-2xl border-l border-gray-100 dark:border-slate-800/80 flex flex-col justify-between transition-transform duration-300">
                <div className="p-5">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-amber-500 dark:text-[#F0B90B] font-extrabold tracking-widest text-xs uppercase">Broxpay Hub</span>
                        <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 p-1">
                            <span className="text-xs font-bold">CLOSE</span>
                        </button>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-950 p-4 rounded-xl border border-gray-100 dark:border-slate-850 mb-5">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-700">
                              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-800 dark:text-white">MAC SAMUAL</h4>
                                <span className="text-[8px] bg-emerald-500/10 text-emerald-500 font-bold px-1.5 py-0.5 rounded">Verified Tier-2</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h5 className="text-[9px] font-bold text-gray-400 tracking-wider uppercase">System Config</h5>
                        
                        {/* Global Currency Selector Launcher */}
                        <div onClick={() => { setSidebarOpen(false); setCurrencyModalOpen(true); }} className="flex justify-between items-center p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-950 cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-slate-800 transition-all">
                            <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-gray-700 dark:text-slate-300">Currency</span>
                            </div>
                            <span id="current-currency-display-sidebar" className="text-[10px] font-extrabold text-amber-500 dark:text-[#F0B90B] bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                {getFlag(activeCurrency.code)} {activeCurrency.code} ({activeCurrency.symbol})
                            </span>
                        </div>
                    </div>
                </div>
                <div className="p-5 border-t border-gray-100 dark:border-slate-800 text-center">
                    <span className="text-[9px] text-gray-400 font-semibold uppercase">Broxpay Version 1.2.0</span>
                </div>
            </div>
          </>
        )}

        {/* SEARCHABLE CURRENCY SELECTOR BOTTOM SHEET */}
        {currencyModalOpen && (
          <>
            <div onClick={() => setCurrencyModalOpen(false)} className="absolute inset-0 bg-black/60 z-50 transition-opacity duration-300 md:rounded-[32px]"></div>
            <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#0f1624] h-[85%] rounded-t-[32px] p-5 shadow-2xl z-50 flex flex-col transition-transform duration-300">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">Select Currency</h4>
                    <button onClick={() => setCurrencyModalOpen(false)} className="text-gray-400">
                        <span className="text-xs font-bold">CLOSE</span>
                    </button>
                </div>
                
                <div className="relative mb-4">
                    <input 
                      type="text" 
                      placeholder="Search currency..." 
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none" 
                    />
                </div>
                
                <div id="currency-list-container" className="flex-1 overflow-y-auto space-y-1.5 scrollbar-none pr-0.5">
                    {currencies
                      .filter(c => c.code.toLowerCase().includes(searchQuery.toLowerCase()) || c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(c => (
                        <div 
                          key={c.code} 
                          onClick={() => { setCurrentCurrency(c.code); setCurrencyModalOpen(false); }}
                          className={`flex justify-between items-center p-3 rounded-xl cursor-pointer ${currentCurrency === c.code ? 'bg-amber-500/10' : ''}`}
                        >
                          <span className="text-xs font-bold text-white">{getFlag(c.code)} {c.code} - {c.name}</span>
                          <span className="text-xs text-slate-500">{c.symbol}</span>
                        </div>
                      ))}
                </div>
            </div>
          </>
        )}

        {/* PRESET EXCHANGE MODAL SHEET */}
        {exchangeModalOpen && (
          <>
            <div onClick={() => setExchangeModalOpen(false)} className="absolute inset-0 bg-black/60 z-40 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#0f1624] h-[80%] rounded-t-[32px] p-5 shadow-2xl z-45 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-center mb-5">
                        <h4 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            Broxpay Auto-Router
                        </h4>
                        <button onClick={() => setExchangeModalOpen(false)} className="text-gray-400">
                            <span className="text-xs font-bold">CLOSE</span>
                        </button>
                    </div>

                    <form className="space-y-4">
                        <div className="bg-gray-50 dark:bg-slate-900 p-3.5 rounded-xl border border-gray-100 dark:border-slate-800 flex justify-between items-center">
                            <div>
                                <label className="block text-[8px] font-bold text-gray-400 dark:text-slate-500 uppercase">From Platform</label>
                                <select value={swapFrom} onChange={(e) => setSwapFrom(e.target.value)} className="bg-transparent text-xs font-bold text-gray-800 dark:text-slate-200 outline-none mt-1">
                                    <option value="bsc-usdt" className="dark:bg-slate-900">Binance - USDT (BEP20)</option>
                                    <option value="trust-btc" className="dark:bg-slate-900">TrustWallet - BTC</option>
                                    <option value="xrocket-ton" className="dark:bg-slate-900">XRocket - TON</option>
                                </select>
                            </div>
                            <input 
                              type="number" 
                              value={swapAmountFrom} 
                              onChange={(e) => setSwapAmountFrom(parseFloat(e.target.value) || 0)}
                              className="w-24 bg-transparent text-right text-gray-800 dark:text-slate-200 font-extrabold text-sm outline-none" 
                            />
                        </div>

                        <div className="flex justify-center -my-3.5">
                            <div className="w-8 h-8 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center text-xs shadow-md border-2 border-white dark:border-slate-950 z-10">
                                <span className="text-xs font-bold">V</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-slate-900 p-3.5 rounded-xl border border-gray-100 dark:border-slate-800 flex justify-between items-center">
                            <div>
                                <label className="block text-[8px] font-bold text-gray-400 dark:text-slate-500 uppercase">To Platform</label>
                                <select value={swapTo} onChange={(e) => setSwapTo(e.target.value)} className="bg-transparent text-xs font-bold text-gray-800 dark:text-slate-200 outline-none mt-1">
                                    <option value="xrocket-ton" className="dark:bg-slate-900">XRocket - TON</option>
                                    <option value="trust-usdt" className="dark:bg-slate-900">TrustWallet - USDT (TRC20)</option>
                                    <option value="bsc-usdt" className="dark:bg-slate-900">Binance - USDT</option>
                                </select>
                            </div>
                            <span className="text-right text-amber-600 dark:text-amber-400 font-extrabold text-sm">{swapAmountToValue}</span>
                        </div>
                    </form>
                </div>

                <button type="button" onClick={handleSwapSimulation} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider mt-4">
                    Confirm Auto Exchange
                </button>
            </div>
        </div>

        {/* Simulated Crypto Transaction Processing Screen (Overlay) */}
        {txModalOpen && (
          <div className="absolute inset-0 bg-black/70 z-50 flex flex-col justify-center items-center p-6 md:rounded-[32px]">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-xs text-center space-y-4 shadow-2xl border border-slate-800/80">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-slate-800"></div>
                {!txCompleted && <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>}
                <span className="text-xs font-bold text-amber-500">ROUTING</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800 dark:text-white">{txCompleted ? 'Exchange Success!' : 'Connecting Broxpay Pools'}</h4>
                <p className="text-[11px] text-gray-450 dark:text-slate-400 mt-1">{txText}</p>
              </div>
              {txCompleted && (
                <button onClick={() => setTxModalOpen(false)} className="w-full bg-amber-500 text-slate-950 font-extrabold py-2 rounded-xl text-xs hover:bg-amber-600">
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
