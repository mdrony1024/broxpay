import React, { useState, useEffect, useMemo } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  SafeAreaView, 
  useWindowDimensions 
} from 'react-native';

export default function App() {
  // ১. ডাইনামিক ডেক্সটপ বনাম মোবাইল লেআউট কন্ট্রোলার
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900; // ৯০০ পিক্সেলের বেশি হলে এটি ডেক্সটপ ড্যাশবোর্ডে রূপান্তরিত হবে

  // ২. ওয়ালেট স্টেইটস (শুধুমাত্র ডলার $)
  const [currentView, setCurrentView] = useState('home'); // home, swap, history, deposit
  const [balance, setBalance] = useState(1518.68);
  const [hideBalance, setHideBalance] = useState(false);

  // লাইভ ক্রিপ্টো মার্কেট রেটস
  const [marketTokens, setMarketTokens] = useState({
    USDT: { name: 'Tether US', icon: '₮', price: 1.00, change: 0.12, color: '#10B981' },
    BTC: { name: 'Bitcoin', icon: '₿', price: 92450.00, change: 1.45, color: '#F0B90B' },
    TON: { name: 'Toncoin', icon: '💎', price: 7.24, change: -0.12, color: '#0098EA' },
    ETH: { name: 'Ethereum', icon: 'Ξ', price: 3120.75, change: -0.52, color: '#6366F1' }
  });

  // সোয়াপ এক্সচেঞ্জার ক্যালকুলেটর স্টেইট
  const [swapFrom, setSwapFrom] = useState('USDT');
  const [swapTo, setSwapTo] = useState('TON');
  const [swapAmount, setSwapAmount] = useState('100');

  // লাইভ রেট রেন্ডারিং লুপ (useEffect)
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketTokens((prev) => {
        const updated = { ...prev };
        for (let key in updated) {
          const pct = (Math.random() * 0.2 - 0.1) / 100;
          updated[key as keyof typeof updated].price += updated[key as keyof typeof updated].price * pct;
          updated[key as keyof typeof updated].change += pct * 100;
        }
        return updated;
      });
      setBalance(prev => prev + prev * ((Math.random() * 0.05 - 0.025) / 100));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ওয়ান-ক্লিক সোয়াপ প্রসেসর সিমুলেশন
  const handleSwap = () => {
    const amountNum = parseFloat(swapAmount) || 0;
    if (amountNum <= 0) {
      alert("Please enter a valid amount!");
      return;
    }
    alert(`Success! Auto-routing transaction processed successfully!`);
    setCurrentView('history');
  };

  // লাইভ এক্সচেঞ্জ ক্যালকুলেটর ভ্যালু
  const swapResult = useMemo(() => {
    const amountNum = parseFloat(swapAmount) || 0;
    const fromPrice = marketTokens[swapFrom as keyof typeof marketTokens]?.price || 1.0;
    const toPrice = marketTokens[swapTo as keyof typeof marketTokens]?.price || 1.0;
    const value = (amountNum * fromPrice) / toPrice;
    return `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ${swapTo}`;
  }, [swapAmount, swapFrom, swapTo, marketTokens]);

  return (
    <SafeAreaView style={styles.container}>
      
      {/* App Main Shell */}
      <View style={[styles.shell, isDesktop && styles.desktopShell]}>
        
        {/* ক. ডেক্সটপ লাক্সারি সাইডবার (শুধুমাত্র কম্পিউটারে দেখা যাবে) */}
        {isDesktop && (
          <View style={styles.sidebar}>
            <View>
              {/* App Brand Logo */}
              <View style={styles.sidebarLogo}>
                <Text style={styles.logoIcon}>⚡</Text>
                <Text style={styles.logoText}>Broxpay</Text>
              </View>

              {/* Sidebar Menu Items */}
              <View style={styles.menuList}>
                <TouchableOpacity onPress={() => setCurrentView('home')} style={[styles.menuItem, currentView === 'home' && styles.menuItemActive]}>
                  <Text style={[styles.menuText, currentView === 'home' && {color: '#F0B90B'}]}>🏠 Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCurrentView('swap')} style={[styles.menuItem, currentView === 'swap' && styles.menuItemActive]}>
                  <Text style={[styles.menuText, currentView === 'swap' && {color: '#F0B90B'}]}>🔄 Auto Exchange</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCurrentView('history')} style={[styles.menuItem, currentView === 'history' && styles.menuItemActive]}>
                  <Text style={[styles.menuText, currentView === 'history' && {color: '#F0B90B'}]}>📊 Ledger History</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCurrentView('deposit')} style={[styles.menuItem, currentView === 'deposit' && styles.menuItemActive]}>
                  <Text style={[styles.menuText, currentView === 'deposit' && {color: '#F0B90B'}]}>📥 Deposit Funds</Text>
                </TouchableOpacity>
              </View>
            </div>

            <Text style={styles.sidebarFooter}>Broxpay v1.2.0</Text>
          </View>
        )}

        {/* খ. মূল ভিউপোর্ট এরিয়া */}
        <View style={styles.viewport}>
          
          {/* হেডার এরিয়া (Sleek Glassmorphic look) */}
          <View style={styles.header}>
            <View style={styles.profileBox}>
              <View style={styles.avatarBorder}>
                <View style={styles.avatar}><Text style={{ fontSize: 16 }}>👤</Text></View>
              </View>
              <View>
                <Text style={styles.userName}>MAC SAMUAL</Text>
                <TouchableOpacity onPress={() => setHideBalance(!hideBalance)} style={styles.balanceContainer}>
                  <Text style={styles.balanceValue}>
                    🪙 {hideBalance ? 'Tap for Balance' : `$ ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot}></View>
              <Text style={styles.liveText}>Live Router</Text>
            </View>
          </View>

          {/* স্ক্রিন রেন্ডারার (ডেক্সটপে ৩টি কলামে বিভক্ত হবে) */}
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={isDesktop ? styles.desktopGrid : styles.mobileGrid}>
              
              {/* বাম পাশের মূল প্যানেল (মডিউলসমূহ) */}
              <View style={isDesktop ? {flex: 7.2} : {width: '100%'}}>
                
                {/* ১. হোম স্ক্রিন ভিউ */}
                {currentView === 'home' && (
                  <View class="space-y-6">
                    {/* একটিভ টানেল নিয়ন ব্যানার */}
                    <View style={styles.neonBanner}>
                      <View style={styles.bannerGlowIcon}><Text style={{fontSize: 18}}>⚡</Text></View>
                      <View style={{ flex: 1, marginLeft: 14 }}>
                        <Text style={styles.bannerTag}>Secure Tunnel</Text>
                        <Text style={styles.bannerTitle}>Binance ⇄ XRocket Auto Channel</Text>
                      </View>
                    </View>

                    {/* ৪টি গ্লাস অ্যাকশন বাটন */}
                    <View style={styles.actionCard}>
                      <TouchableOpacity onPress={() => setCurrentView('deposit')} style={styles.actionBtn}>
                        <View style={styles.actionIcon}><Text style={{fontSize: 16}}>📥</Text></View>
                        <Text style={styles.actionLabel}>Deposit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setCurrentView('swap')} style={styles.actionBtn}>
                        <View style={[styles.actionIcon, {borderColor: '#F0B90B'}]}><Text style={{fontSize: 16}}>🔄</Text></View>
                        <Text style={styles.actionLabel}>Swap</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => alert("Verify NID on Broxpay Web to activate L2.")} style={styles.actionBtn}>
                        <View style={styles.actionIcon}><Text style={{fontSize: 16}}>🛡️</Text></View>
                        <Text style={styles.actionLabel}>KYC</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setCurrentView('history')} style={styles.actionBtn}>
                        <View style={styles.actionIcon}><Text style={{fontSize: 16}}>📊</Text></View>
                        <Text style={styles.actionLabel}>History</Text>
                      </TouchableOpacity>
                    </View>

                    {/* প্রোমোশনাল অফার ব্যানার */}
                    <View style={styles.promoCard}>
                      <View class="space-y-2">
                        <Text style={styles.promoTag}>Featured Deal</Text>
                        <Text style={styles.promoTitle}>Earn Up to 10% Cash Reward on first TON Swap</p>
                      </View>
                      <TouchableOpacity onPress={() => setCurrentView('swap')} style={styles.promoBtn}>
                        <Text style={styles.promoBtnText}>Trade</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* ২. সোয়াপ উইন্ডো */}
                {currentView === 'swap' && (
                  <View class="space-y-4">
                    <Text style={styles.viewTitle}>🔄 Instant Auto-Router</Text>
                    
                    <View style={styles.swapBox}>
                      <View style={styles.inputContainer}>
                        <View>
                          <Text style={styles.fieldLabel}>From Platform</Text>
                          <select value={swapFrom} onChange={(e) => setSwapFrom(e.target.value)} style={styles.selectStyle}>
                            <option value="USDT">Binance (USDT)</option>
                            <option value="TON">XRocket (TON)</option>
                            <option value="BTC">TrustWallet (BTC)</option>
                          </select>
                        </View>
                        <TextInput 
                          value={swapAmount}
                          onChangeText={setSwapAmount}
                          keyboardType="numeric"
                          style={styles.amountInput}
                        />
                      </View>

                      {/* অ্যারো আইকন */}
                      <View style={styles.routingArrow}>
                        <Text style={{fontSize: 12}}>⬇</Text>
                      </View>

                      <View style={styles.inputContainer}>
                        <View>
                          <Text style={styles.fieldLabel}>To Platform</Text>
                          <select value={swapTo} onChange={(e) => setSwapTo(e.target.value)} style={styles.selectStyle}>
                            <option value="TON">XRocket (TON)</option>
                            <option value="USDT">Binance (USDT)</option>
                            <option value="BTC">TrustWallet (BTC)</option>
                          </select>
                        </View>
                        <Text style={styles.resultValue}>{swapResult}</Text>
                      </View>

                      <TouchableOpacity onPress={handleSwap} style={styles.swapConfirmBtn}>
                        <Text style={styles.swapBtnText}>Execute Auto Exchange</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* ৩. ডিপোজিট উইন্ডো */}
                {currentView === 'deposit' && (
                  <View class="space-y-4">
                    <Text style={styles.viewTitle}>📥 Deposit Assets</Text>
                    <View style={styles.swapBox}>
                      <View style={styles.qrContainer}>
                        <Text style={{fontSize: 48}}>🏁</Text>
                      </View>
                      <Text style={styles.fieldLabel}>Your Deposit Address</Text>
                      <Text style={styles.addressText}>EQC384NfL829Df101vK02Mv9fL...</Text>
                      <TouchableOpacity onPress={() => alert("Copied to clipboard.")} style={styles.copyBtn}>
                        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 11}}>Copy Address</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* ৪. হিস্ট্রি উইন্ডো */}
                {currentView === 'history' && (
                  <View class="space-y-4">
                    <Text style={styles.viewTitle}>📊 Transaction History</Text>
                    <View style={styles.swapBox}>
                      <View style={styles.historyItem}>
                        <View>
                          <Text style={styles.historyTitle}>USDT ⇄ TON Swap</Text>
                          <Text style={styles.historySub}>Binance ⇄ XRocket Channel</Text>
                        </View>
                        <Text style={styles.historyStatus}>✓ Completed</Text>
                      </View>
                    </View>
                  </View>
                )}

              </View>

              {/* ডান পাশের প্যানেল (লাইভ মার্কেট ট্রেন্ডস - ডেক্সটপে ডানে এবং মোবাইলে নিচে দেখাবে) */}
              <View style={isDesktop ? {flex: 4.8, marginLeft: 26} : {width: '100%', marginTop: 24}}>
                <Text style={styles.sectionTitle}>Market Trends</Text>
                <View style={styles.marketCard}>
                  {Object.entries(marketTokens).map(([key, token]) => (
                    <View key={key} style={styles.marketItem}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <View style={[styles.marketIconBox, {borderColor: token.color + '30'}]}>
                          <Text style={{color: token.color, fontSize: 13}}>{token.icon}</Text>
                        </View>
                        <View style={{marginLeft: 12}}>
                          <Text style={styles.tokenName}>{key}</Text>
                          <Text style={styles.tokenSub}>{token.name}</Text>
                        </View>
                      </div>
                      <View style={{textAlign: 'right'}}>
                        <Text style={styles.tokenPrice}>${token.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                        <Text style={[styles.tokenChange, {color: token.change >= 0 ? '#10B981' : '#F43F5E'}]}>
                          {token.change >= 0 ? '+' : ''}{token.change.toFixed(2)}%
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

            </View>
          </ScrollView>

          {/* গ. বটম নেভিগেশন ট্যাব বার (ডেক্সটপে অটোমেটিক্যালি হাইড হয়ে যাবে) */}
          {!isDesktop && (
            <View style={styles.navBar}>
              <TouchableOpacity onPress={() => setCurrentView('home')} style={styles.navItem}>
                <Text style={{ fontSize: 18, color: currentView === 'home' ? '#F0B90B' : '#475569' }}>🏠</Text>
                <Text style={[styles.navLabel, { color: currentView === 'home' ? '#F0B90B' : '#475569' }]}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCurrentView('swap')} style={styles.navItem}>
                <Text style={{ fontSize: 18, color: currentView === 'swap' ? '#F0B90B' : '#475569' }}>🔄</Text>
                <Text style={[styles.navLabel, { color: currentView === 'swap' ? '#F0B90B' : '#475569' }]}>Swap</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCurrentView('history')} style={styles.navItem}>
                <Text style={{ fontSize: 18, color: currentView === 'history' ? '#F0B90B' : '#475569' }}>📊</Text>
                <Text style={[styles.navLabel, { color: currentView === 'history' ? '#F0B90B' : '#475569' }]}>History</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>

      </View>
    </SafeAreaView>
  );
}

// ৫. প্রিমিয়াম ডার্ক নিয়ন স্টাইলশীট (StyleSheet)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shell: {
    width: '100%',
    height: '100%',
    backgroundColor: '#070b19',
  },
  desktopShell: {
    flexDirection: 'row',
  },
  sidebar: {
    width: 250,
    backgroundColor: '#030712',
    borderRightWidth: 1,
    borderRightColor: '#1e293b',
    padding: 24,
    justifyContent: 'space-between',
  },
  sidebarLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    columnGap: 10,
  },
  logoIcon: {
    textShadowColor: 'rgba(240, 185, 11, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  logoText: {
    color: '#F0B90B',
    fontWeight: '800',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  menuList: {
    rowGap: 8,
  },
  menuItem: {
    padding: 12,
    borderRadius: 12,
  },
  menuItemActive: {
    backgroundColor: 'rgba(240, 185, 11, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(240, 185, 11, 0.15)',
  },
  menuText: {
    color: '#64748b',
    fontWeight: '700',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  sidebarFooter: {
    textAlign: 'center',
    fontSize: 8,
    color: '#334155',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  viewport: {
    flex: 1,
    height: '100%',
    justifyContent: 'between',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBorder: {
    padding: 2,
    borderRadius: 22,
    backgroundColor: '#070b19',
    borderWidth: 1.5,
    borderColor: '#F0B90B',
    marginRight: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  balanceContainer: {
    marginTop: 2,
  },
  balanceValue: {
    color: '#F0B90B',
    fontSize: 10,
    fontWeight: 'bold',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  liveText: {
    fontSize: 9,
    color: '#10B981',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  desktopGrid: {
    flexDirection: 'row',
    paddingVertical: 20,
  },
  mobileGrid: {
    flexDirection: 'column',
    paddingVertical: 15,
  },
  viewPane: {
    rowGap: 15,
  },
  viewTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  neonBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 152, 234, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 152, 234, 0.15)',
    borderRadius: 20,
    padding: 14,
  },
  bannerGlowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 152, 234, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTag: {
    fontSize: 8,
    color: '#0098EA',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  bannerTitle: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: 'bold',
  },
  actionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#070b19',
    borderWidth: 1,
    borderColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  promoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111726',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 20,
    padding: 15,
  },
  promoTag: {
    fontSize: 8,
    color: '#10B981',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  promoTitle: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    maxWidth: 180,
  },
  promoBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  promoBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  marketCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 15,
  },
  marketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  marketIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenName: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 11,
  },
  tokenSub: {
    color: '#475569',
    fontSize: 9,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  tokenPrice: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 11,
  },
  tokenChange: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 2,
  },
  swapBox: {
    backgroundColor: '#0F1624',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#020408',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.02)',
  },
  fieldLabel: {
    fontSize: 8,
    color: '#475569',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  selectStyle: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
    outline: 'none',
    cursor: 'pointer',
  },
  amountInput: {
    width: 100,
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  routingArrow: {
    width: 28,
    height: 28,
    backgroundColor: '#F0B90B',
    borderRadius: 14,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  resultValue: {
    color: '#F0B90B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  swapConfirmBtn: {
    backgroundColor: '#F0B90B',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 15,
  },
  swapBtnText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  qrContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  addressText: {
    color: '#94a3b8',
    fontSize: 9,
    fontFamily: 'monospace',
    textAlign: 'center',
    backgroundColor: '#020408',
    padding: 10,
    borderRadius: 10,
    marginTop: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.02)',
  },
  copyBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  historySub: {
    color: '#475569',
    fontSize: 9,
  },
  historyStatus: {
    color: '#10B981',
    fontWeight: '800',
    fontSize: 11,
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: '#030712',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 10,
  },
  navItem: {
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 8,
    fontWeight: '850',
    marginTop: 4,
  }
});
