import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, SafeAreaView } from 'react-native';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [balance, setBalance] = useState(1518.68);
  const [hideBalance, setHideBalance] = useState(false);
  const [usdtPrice, setUsdtPrice] = useState(1.00);
  const [tonPrice, setTonPrice] = useState(7.24);
  const [swapAmount, setSwapAmount] = useState('100');
  const [swapFrom, setSwapFrom] = useState('USDT');
  const [swapTo, setSwapTo] = useState('TON');

  useEffect(() => {
    const interval = setInterval(() => {
      const pct = (Math.random() * 0.2 - 0.1) / 100;
      setTonPrice((prev) => prev + prev * pct);
      setBalance((prev) => prev + prev * (pct * 0.1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSwap = () => {
    const amountNum = parseFloat(swapAmount) || 0;
    if (amountNum <= 0) {
      alert("Please enter a valid amount!");
      return;
    }
    alert(`Success! Auto-routing transaction processed successfully!`);
    setCurrentView('history');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileBox}>
          <View style={styles.avatar}><Text style={{ fontSize: 18 }}>👤</Text></View>
          <View>
            <Text style={styles.userName}>MAC SAMUAL</Text>
            <TouchableOpacity onPress={() => setHideBalance(!hideBalance)} style={styles.balanceBtn}>
              <Text style={styles.balanceText}>
                🪙 {hideBalance ? 'Tap for Balance' : `$ ${balance.toFixed(2)}`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.liveBadge}>🟢 Live</Text>
      </View>

      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        {currentView === 'home' && (
          <View style={styles.viewPane}>
            <View style={styles.tunnelBanner}>
              <Text style={styles.bannerEmoji}>⚡</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.bannerTag}>Router Active</Text>
                <Text style={styles.bannerTitle}>Binance ⇄ XRocket Auto Channel</Text>
              </View>
            </View>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '15px', backgroundColor: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '20px', border: '1px solid #1e293b' }}>
              <div onClick={() => setCurrentView('deposit')} style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}><Text style={{fontSize: 18}}>📥</Text></div>
                <Text style={styles.actionLabel}>Deposit</Text>
              </div>
              <div onClick={() => setCurrentView('swap')} style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#0f172a', border: '1px solid #F0B90B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}><Text style={{fontSize: 18}}>🔄</Text></div>
                <Text style={styles.actionLabel}>Swap</Text>
              </div>
              <div onClick={() => alert("Please upload NID on Broxpay Web to verify L2.")} style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}><Text style={{fontSize: 18}}>🛡️</Text></div>
                <Text style={styles.actionLabel}>KYC</Text>
              </div>
              <div onClick={() => setCurrentView('history')} style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}><Text style={{fontSize: 18}}>📊</Text></div>
                <Text style={styles.actionLabel}>History</Text>
              </div>
            </div>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Market Trends</Text>
              <View style={styles.marketList}>
                <View style={styles.marketItem}>
                  <Text>🪙 USDT (Tether)</Text>
                  <Text style={styles.marketPrice}>${usdtPrice.toFixed(2)}</Text>
                </View>
                <View style={styles.marketItem}>
                  <Text>💎 TON (Toncoin)</Text>
                  <Text style={[styles.marketPrice, {color: '#10B981'}]}>${tonPrice.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {currentView === 'swap' && (
          <View style={styles.viewPane}>
            <Text style={styles.viewTitle}>🔄 Broxpay Auto-Router</Text>
            <View style={styles.swapCard}>
              <View style={styles.swapInputRow}>
                <View>
                  <Text style={styles.inputLabel}>From Platform</Text>
                  <Text style={styles.tokenText}>{swapFrom}</Text>
                </View>
                <TextInput value={swapAmount} onChangeText={setSwapAmount} keyboardType="numeric" style={styles.textInput} />
              </View>
              <View style={styles.swapArrow}><Text style={{color: '#000'}}>⬇</Text></View>
              <View style={styles.swapInputRow}>
                <View>
                  <Text style={styles.inputLabel}>To Platform</Text>
                  <Text style={styles.tokenText}>{swapTo}</Text>
                </View>
                <Text style={styles.outputValue}>
                  {((parseFloat(swapAmount) || 0) * (swapFrom === 'USDT' ? (1/tonPrice) : tonPrice)).toFixed(3)} {swapTo}
                </Text>
              </View>
              <TouchableOpacity onPress={handleSwap} style={styles.primaryButton}>
                <Text style={styles.buttonText}>Confirm Auto Exchange</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentView === 'deposit' && (
          <View style={styles.viewPane}>
            <Text style={styles.viewTitle}>📥 Deposit Assets</Text>
            <View style={styles.swapCard}>
              <View style={styles.qrMock}><Text style={{fontSize: 48}}>🏁</Text></View>
              <Text style={styles.inputLabel}>Your Deposit Wallet Address</Text>
              <Text style={styles.monoAddress}>EQC384NfL829Df101vK02Mv9fL...</Text>
              <TouchableOpacity onPress={() => alert("Address copied to clipboard.")} style={styles.secondaryButton}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>Copy Address</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentView === 'history' && (
          <View style={styles.viewPane}>
            <Text style={styles.viewTitle}>📊 Transaction Ledger</Text>
            <View style={styles.swapCard}>
              <View style={styles.historyItem}>
                <View>
                  <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 13}}>USDT ⇄ TON Swap</Text>
                  <Text style={{color: '#555', fontSize: 10}}>Binance to XRocket Channel</Text>
                </View>
                <Text style={{color: '#10B981', fontWeight: 'bold', fontSize: 12}}>Completed</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => setCurrentView('home')} style={styles.navItem}>
          <Text style={{ fontSize: 18, color: currentView === 'home' ? '#F0B90B' : '#555' }}>🏠</Text>
          <Text style={[styles.navLabel, { color: currentView === 'home' ? '#F0B90B' : '#555' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentView('swap')} style={styles.navItem}>
          <Text style={{ fontSize: 18, color: currentView === 'swap' ? '#F0B90B' : '#555' }}>🔄</Text>
          <Text style={[styles.navLabel, { color: currentView === 'swap' ? '#F0B90B' : '#555' }]}>Swap</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentView('history')} style={styles.navItem}>
          <Text style={{ fontSize: 18, color: currentView === 'history' ? '#F0B90B' : '#555' }}>📊</Text>
          <Text style={[styles.navLabel, { color: currentView === 'history' ? '#F0B90B' : '#555' }]}>History</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030712' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 45, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  profileBox: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  userName: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  balanceBtn: { marginTop: 4 },
  balanceText: { color: '#F0B90B', fontSize: 10, fontWeight: 'bold' },
  liveBadge: { fontSize: 10, color: '#10B981', fontWeight: 'bold', backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  mainContent: { flex: 1, paddingHorizontal: 20 },
  viewPane: { paddingVertical: 15 },
  viewTitle: { fontSize: 14, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  tunnelBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(240, 185, 11, 0.05)', borderWidth: 1, borderColor: 'rgba(240, 185, 11, 0.15)', borderRadius: 16, padding: 12 },
  bannerEmoji: { fontSize: 20 },
  bannerTag: { fontSize: 8, color: '#F0B90B', fontWeight: 'bold', textTransform: 'uppercase' },
  bannerTitle: { fontSize: 10, color: '#94a3b8', fontWeight: 'bold' },
  actionLabel: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold' },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: 8 },
  marketList: { backgroundColor: 'rgba(255, 255, 255, 0.01)', borderRadius: 16, borderWidth: 1, borderColor: '#1e293b', padding: 15 },
  marketItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  marketPrice: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  swapCard: { backgroundColor: '#0F1624', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#1e293b' },
  swapInputRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#020408', padding: 12, borderRadius: 16 },
  inputLabel: { fontSize: 8, color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' },
  tokenText: { color: '#fff', fontWeight: 'bold', fontSize: 11, marginTop: 4 },
  textInput: { width: 100, color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'right' },
  swapArrow: { width: 28, height: 28, backgroundColor: '#F0B90B', borderRadius: 14, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
  outputValue: { color: '#F0B90B', fontSize: 14, fontWeight: 'bold' },
  primaryButton: { backgroundColor: '#F0B90B', paddingVertical: 14, borderRadius: 16, alignItems: 'center', marginTop: 15 },
  buttonText: { color: '#000', fontWeight: 'bold', fontSize: 11, textTransform: 'uppercase' },
  qrMock: { width: 120, height: 120, backgroundColor: '#fff', borderRadius: 16, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  monoAddress: { color: '#94a3b8', fontSize: 10, fontFamily: 'monospace', textAlign: 'center', backgroundColor: '#020408', padding: 10, borderRadius: 10, marginTop: 6, marginBottom: 12 },
  secondaryButton: { backgroundColor: 'rgba(255,255,255,0.05)', paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  navBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 65, backgroundColor: '#070b19', borderTopWidth: 1, borderTopColor: '#1e293b', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 10 },
  navItem: { alignItems: 'center' },
  navLabel: { fontSize: 8, fontWeight: 'bold', marginTop: 4 }
});
