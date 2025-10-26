import React, { useState } from 'react';
import './LandingPage.css';

const BotBuilder = ({ onBack, language, setLanguage }) => {
  const [step, setStep] = useState(1);
  const [botConfig, setBotConfig] = useState({
    cryptos: ['SOL', 'BTC', 'ETH'],
    takeProfit: 3,
    stopLoss: -2,
    tradeSize: 2,
    cooldown: 30
  });
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle', 'checking', 'paid', 'generating', 'ready'
  const [paymentRequired, setPaymentRequired] = useState(null);
  const [codeReady, setCodeReady] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const translations = {
    en: {
      title: 'XYNQ Bot Builder',
      step1: 'Configure Your Bot',
      step2: 'Pay & Generate',
      step3: 'Download',
      cryptos: 'Cryptocurrencies to Trade',
      takeProfit: 'Take Profit (%)',
      stopLoss: 'Stop Loss (%)',
      tradeSize: 'Trade Size (% of capital)',
      cooldown: 'Cooldown (seconds)',
      continue: 'Continue',
      back: 'Back',
      pay: 'Pay $2 & Generate Bot',
      checkingPayment: 'Checking payment...',
      paymentRequired: 'Payment Required',
      generatingBot: 'Generating your custom bot codebase...',
      downloadBot: 'Download Bot Code',
      selectCryptos: 'Select which cryptocurrencies to trade:',
      x402Info: 'Powered by x402 Protocol - Direct blockchain payments'
    },
    zh: {
      title: 'XYNQ 机器人构建器',
      step1: '配置您的机器人',
      step2: '支付并生成',
      step3: '下载',
      cryptos: '要交易的加密货币',
      takeProfit: '止盈 (%)',
      stopLoss: '止损 (%)',
      tradeSize: '交易规模 (资本的%)',
      cooldown: '冷却时间 (秒)',
      continue: '继续',
      back: '返回',
      pay: '支付 $2 并生成机器人',
      checkingPayment: '正在检查支付...',
      paymentRequired: '需要支付',
      generatingBot: '正在生成您的自定义机器人代码库...',
      downloadBot: '下载机器人代码',
      selectCryptos: '选择要交易的加密货币:',
      x402Info: '由 x402 协议提供支持 - 直接区块链支付'
    }
  };

  const t = translations[language];

  const availableCryptos = [
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'SOL', name: 'Solana' },
    { symbol: 'BNB', name: 'Binance Coin' },
    { symbol: 'ADA', name: 'Cardano' },
    { symbol: 'MATIC', name: 'Polygon' },
    { symbol: 'DOT', name: 'Polkadot' },
    { symbol: 'AVAX', name: 'Avalanche' },
    { symbol: 'LINK', name: 'Chainlink' },
    { symbol: 'UNI', name: 'Uniswap' }
  ];

  const handleCryptoToggle = (symbol) => {
    setBotConfig(prev => ({
      ...prev,
      cryptos: prev.cryptos.includes(symbol)
        ? prev.cryptos.filter(c => c !== symbol)
        : [...prev.cryptos, symbol]
    }));
  };

  const handlePaymentCheck = async () => {
    setPaymentStatus('checking');
    
    try {
      // Request payment requirements from x402 protocol
      const response = await fetch('/api/bot-builder/payment-requirements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: 2, description: 'Custom Trading Bot Generation' })
      });

      if (response.status === 402) {
        const paymentRequirements = await response.json();
        setPaymentRequired(paymentRequirements);
        setPaymentStatus('checking');
        // In real implementation, user would connect wallet and pay using x402 protocol
        // For now, simulate payment
        setTimeout(() => {
          simulateX402Payment();
        }, 2000);
      } else if (response.ok) {
        setPaymentStatus('paid');
        setStep(3);
      }
    } catch (error) {
      console.error('Payment check error:', error);
      // For demo, simulate successful payment and generation
      setPaymentStatus('generating');
      setTimeout(() => {
        simulateX402Payment();
      }, 1000);
    }
  };

  const simulateX402Payment = async () => {
    // Real x402 payment implementation
    try {
      // Check if user has a wallet (MetaMask, Coinbase Wallet, etc.)
      if (!window.ethereum) {
        alert('Please install a Web3 wallet (MetaMask or Coinbase Wallet) to proceed with payment.');
        setPaymentStatus('checking');
        return;
      }

      // Request account access
      // This triggers a wallet popup (MetaMask/Coinbase Wallet/etc.)
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAddress = accounts[0];
      
      console.log('User connected wallet:', userAddress);

      // Get payment requirements
      const paymentResponse = await fetch('/api/bot-builder/payment-requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 2, description: 'Custom Trading Bot Generation' })
      });

      if (paymentResponse.status === 402) {
        const paymentRequirements = await paymentResponse.json();
        const paymentReq = paymentRequirements.accepts[0];

        // Create payment payload for x402 protocol
        // For Base/Ethereum, use EIP-3009 meta-transaction approach
        const paymentPayload = {
          x402Version: 1,
          scheme: paymentReq.scheme,
          network: paymentReq.network,
          payload: {
            // EIP-3009 meta-transaction data
            domain: {
              name: 'XYNQ Bot Builder',
              version: '1'
            },
            message: {
              from: userAddress,
              to: paymentReq.payTo,
              value: paymentReq.maxAmountRequired,
              asset: paymentReq.asset,
              resource: paymentReq.resource,
              timestamp: Date.now()
            }
          }
        };

        // Sign the payment message
        // This triggers another wallet popup asking user to sign the payment
        console.log('Requesting signature for payment...');
        const signature = await window.ethereum.request({
          method: 'eth_signTypedData_v4',
          params: [userAddress, JSON.stringify({
            types: {
              EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' }
              ],
              Message: [
                { name: 'from', type: 'address' },
                { name: 'to', type: 'address' },
                { name: 'value', type: 'uint256' },
                { name: 'asset', type: 'address' },
                { name: 'resource', type: 'string' },
                { name: 'timestamp', type: 'uint256' }
              ]
            },
            primaryType: 'Message',
            domain: paymentPayload.payload.domain,
            message: paymentPayload.payload.message
          })]
        });
        
        console.log('Payment signed:', signature);

        // Add signature to payload
        paymentPayload.payload.signature = signature;

        // Send payment to server
        const response = await fetch('/api/bot-builder/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-PAYMENT': btoa(JSON.stringify(paymentPayload))
          },
          body: JSON.stringify(botConfig)
        });

        if (response.ok) {
          const result = await response.json();
          setPaymentStatus('generating');
          setGeneratedCode(result.code);
          
          setTimeout(() => {
            setPaymentStatus('ready');
            setCodeReady(true);
            setStep(3);
          }, 2000);
        } else {
          alert('Payment verification failed. Please try again.');
          setPaymentStatus('checking');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + error.message);
      setPaymentStatus('checking');
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode).then(() => {
      alert('Code copied to clipboard!');
    });
  };

  const generateBotCode = (config) => {
    return `// XYNQ Custom Trading Bot
// Generated for you with x402 payment integration

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

// Configuration
const config = {
  cryptos: ${JSON.stringify(config.cryptos)},
  takeProfit: ${config.takeProfit},
  stopLoss: ${config.stopLoss},
  tradeSize: ${config.tradeSize},
  cooldown: ${config.cooldown}
};

// Trading function
const shouldSell = async (crypto, currentPrice, holding) => {
  if (!holding || holding.amount === 0) return false;
  
  const entryPrice = holding.entryPrice;
  const profitPercent = ((currentPrice - entryPrice) / entryPrice) * 100;
  
  // Check cooldown
  const now = Date.now();
  const lastSellTime = lastSellTimes[crypto.symbol] || 0;
  if (now - lastSellTime < config.cooldown * 1000) return false;
  
  return profitPercent > config.takeProfit || profitPercent < config.stopLoss;
};

const executeBuy = async (crypto, price, portfolio) => {
  const amount = Math.random() * 0.1 + 0.02;
  const cost = amount * price;
  
  if (cost > portfolio.cash * (config.tradeSize / 100)) return false;
  
  const tradeData = {
    type: 'buy',
    symbol: crypto.symbol,
    amount: amount,
    price: price,
    cost: cost,
    timestamp: new Date().toISOString()
  };
  
  // Save trade to MongoDB
  // Update portfolio and holdings
  // Return success
};

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('XYNQ Trading Bot running on port', PORT);
  console.log('Configuration:', config);
});

module.exports = { app, config };
`;
  };

  return (
    <div className="terminal-page">
      <style>{`
        /* Yellow slider with white thumb styling */
        .terminal-content input[type="range"] {
          -webkit-appearance: none !important;
          appearance: none !important;
        }
        
        .terminal-content input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none !important;
          appearance: none !important;
          width: 18px !important;
          height: 18px !important;
          border-radius: 50% !important;
          background: #ffffff !important;
          cursor: pointer !important;
          box-shadow: 0 2px 4px rgba(255, 255, 255, 0.3) !important;
          margin-top: -6px !important;
          border: 2px solid #ffcc00 !important;
        }
        
        .terminal-content input[type="range"]::-moz-range-thumb {
          width: 18px !important;
          height: 18px !important;
          border-radius: 50% !important;
          background: #ffffff !important;
          cursor: pointer !important;
          border: 2px solid #ffcc00 !important;
          box-shadow: 0 2px 4px rgba(255, 255, 255, 0.3) !important;
        }
        
        .terminal-content input[type="range"]::-webkit-slider-runnable-track {
          background: #ffcc00 !important;
          height: 6px !important;
          border-radius: 3px !important;
        }
        
        .terminal-content input[type="range"]::-moz-range-track {
          background: #ffcc00 !important;
          height: 6px !important;
          border-radius: 3px !important;
        }
        
        /* Sleek scrollbar styling */
        * ::-webkit-scrollbar {
          width: 8px !important;
          height: 8px !important;
        }
        
        * ::-webkit-scrollbar-track {
          background: #1a1a1a !important;
          border-radius: 4px !important;
        }
        
        * ::-webkit-scrollbar-thumb {
          background: #ffcc00 !important;
          border-radius: 4px !important;
          transition: background 0.2s ease !important;
        }
        
        * ::-webkit-scrollbar-thumb:hover {
          background: #ffdd33 !important;
        }
        
        /* Firefox scrollbar */
        * {
          scrollbar-width: thin !important;
          scrollbar-color: #ffcc00 #1a1a1a !important;
        }
      `}</style>
      
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-title prompt">
            &gt;_&nbsp;&nbsp;xynq_bot_builder.exe
          </div>
          <div className="terminal-title">
            <img src="/typeface-transparent.png" alt="InvertBox" onClick={() => window.open('https://invertbox.fun', '_blank')} style={{cursor: 'pointer'}} />
          </div>
        </div>
        
        <div className="terminal-body">
          <div className="terminal-content" style={{
            padding: '20px', 
            color: '#ffffff',
            fontFamily: language === 'zh' 
              ? "'Microsoft YaHei', 'PingFang SC', 'STHeiti', 'SimHei', sans-serif"
              : "'VT220', 'Courier New', monospace"
          }}>
            
            {/* Step 1: Configuration */}
            {step === 1 && (
              <div>
                <h2 style={{color: '#ffcc00', marginBottom: '20px'}}>{t.step1}</h2>
                
                <div style={{marginBottom: '30px'}}>
                  <h3 style={{color: '#ffcc00', marginBottom: '10px'}}>{t.selectCryptos}</h3>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px'}}>
                    {availableCryptos.map(crypto => (
                      <div
                        key={crypto.symbol}
                        onClick={() => handleCryptoToggle(crypto.symbol)}
                        style={{
                          padding: '10px',
                          border: botConfig.cryptos.includes(crypto.symbol) ? '2px solid #00ff00' : '2px solid #333',
                          backgroundColor: botConfig.cryptos.includes(crypto.symbol) ? '#002200' : '#000',
                          cursor: 'pointer',
                          borderRadius: '4px'
                        }}
                      >
                        <div style={{color: botConfig.cryptos.includes(crypto.symbol) ? '#00ff00' : '#888'}}>
                          {crypto.symbol}
                        </div>
                        <div style={{fontSize: '10px', color: '#888'}}>
                          {crypto.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{marginBottom: '25px'}}>
                  <label style={{display: 'block', marginBottom: '10px', color: '#ffcc00', fontSize: '14px', fontWeight: '400'}}>
                    {t.takeProfit}: {botConfig.takeProfit}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={botConfig.takeProfit}
                    onChange={(e) => setBotConfig(prev => ({...prev, takeProfit: parseInt(e.target.value)}))}
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      background: '#ffcc00',
                      outline: 'none',
                      cursor: 'pointer',
                      display: 'block',
                      margin: 0
                    }}
                  />
                </div>

                <div style={{marginBottom: '25px'}}>
                  <label style={{display: 'block', marginBottom: '10px', color: '#ffcc00', fontSize: '14px', fontWeight: '400'}}>
                    {t.stopLoss}: {botConfig.stopLoss}%
                  </label>
                  <input
                    type="range"
                    min="-5"
                    max="-1"
                    value={botConfig.stopLoss}
                    onChange={(e) => setBotConfig(prev => ({...prev, stopLoss: parseInt(e.target.value)}))}
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      background: '#ffcc00',
                      outline: 'none',
                      cursor: 'pointer',
                      display: 'block',
                      margin: 0
                    }}
                  />
                </div>

                <div style={{marginBottom: '25px'}}>
                  <label style={{display: 'block', marginBottom: '10px', color: '#ffcc00', fontSize: '14px', fontWeight: '400'}}>
                    {t.tradeSize}: {botConfig.tradeSize}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={botConfig.tradeSize}
                    onChange={(e) => setBotConfig(prev => ({...prev, tradeSize: parseInt(e.target.value)}))}
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      background: '#ffcc00',
                      outline: 'none',
                      cursor: 'pointer',
                      display: 'block',
                      margin: 0
                    }}
                  />
                </div>

                <div style={{marginBottom: '25px'}}>
                  <label style={{display: 'block', marginBottom: '10px', color: '#ffcc00', fontSize: '14px', fontWeight: '400'}}>
                    {t.cooldown}: {botConfig.cooldown}s
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="300"
                    value={botConfig.cooldown}
                    onChange={(e) => setBotConfig(prev => ({...prev, cooldown: parseInt(e.target.value)}))}
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      background: '#ffcc00',
                      outline: 'none',
                      cursor: 'pointer',
                      display: 'block',
                      margin: 0
                    }}
                  />
                </div>

                <button
                  onClick={() => setStep(2)}
                  style={{
                    padding: '15px 30px',
                    backgroundColor: '#ffcc00',
                    color: '#000',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '20px'
                  }}
                  disabled={botConfig.cryptos.length === 0}
                >
                  {t.continue} →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div>
                <h2 style={{color: '#ffcc00', marginBottom: '20px'}}>{t.step2}</h2>
                
                <div style={{
                  padding: '20px',
                  backgroundColor: '#002200',
                  border: '2px solid #00ff00',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <h3 style={{color: '#00ff00'}}>{t.x402Info}</h3>
                  <p style={{color: '#888', fontSize: '14px'}}>
                    Pay directly on blockchain using x402 protocol
                  </p>
                  <div style={{marginTop: '20px', color: '#fff'}}>
                    <strong>Price: $2.00</strong>
                  </div>
                  <div style={{color: '#888', fontSize: '12px'}}>
                    What you'll get:
                    <ul style={{marginTop: '10px', paddingLeft: '20px'}}>
                      <li>Complete bot source code</li>
                      <li>Customized with your parameters</li>
                      <li>Database setup & API integration</li>
                      <li>Simple dashboard</li>
                      <li>Full documentation</li>
                    </ul>
                  </div>
                </div>

                {paymentStatus === 'checking' && (
                  <div style={{color: '#ffcc00'}}>
                    {t.checkingPayment}
                  </div>
                )}

                <button
                  onClick={handlePaymentCheck}
                  disabled={paymentStatus === 'checking'}
                  style={{
                    padding: '15px 30px',
                    backgroundColor: paymentStatus === 'checking' ? '#666' : '#ffcc00',
                    color: '#000',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: paymentStatus === 'checking' ? 'not-allowed' : 'pointer'
                  }}
                >
                  {t.pay}
                </button>
              </div>
            )}

            {/* Step 3: Download */}
            {step === 3 && (
              <div>
                <h2 style={{color: '#ffcc00', marginBottom: '20px'}}>{t.step3}</h2>
                
                {paymentStatus === 'generating' && (
                  <div style={{color: '#ffcc00'}}>
                    {t.generatingBot}
                  </div>
                )}

                {paymentStatus === 'ready' && (
                  <div>
                    <div style={{
                      padding: '20px',
                      backgroundColor: '#002200',
                      border: '2px solid #00ff00',
                      borderRadius: '8px',
                      marginBottom: '20px'
                    }}>
                      <h3 style={{color: '#00ff00'}}>Your bot is ready!</h3>
                      <div style={{color: '#888', marginTop: '10px'}}>
                        <strong>Configuration:</strong>
                        <ul style={{marginTop: '10px', paddingLeft: '20px'}}>
                          <li>Cryptos: {botConfig.cryptos.join(', ')}</li>
                          <li>Take Profit: {botConfig.takeProfit}%</li>
                          <li>Stop Loss: {botConfig.stopLoss}%</li>
                          <li>Trade Size: {botConfig.tradeSize}%</li>
                          <li>Cooldown: {botConfig.cooldown}s</li>
                        </ul>
                      </div>
                    </div>

                    <div style={{
                      backgroundColor: '#000',
                      border: '1px solid #333',
                      borderRadius: '4px',
                      padding: '15px',
                      marginBottom: '20px',
                      maxHeight: '400px',
                      overflowY: 'auto'
                    }}>
                      <pre style={{
                        color: '#00ff00',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all'
                      }}>
                        {generatedCode}
                      </pre>
                    </div>

                    <button
                      onClick={copyCode}
                  style={{
                    padding: '15px 30px',
                    backgroundColor: '#ffcc00',
                    color: '#000',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                    >
                      Copy Code to Clipboard
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Fixed Bottom Section */}
        <div className="terminal-bottom-fixed">
          <div className="command-options">
            <span className="command-option" onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}>
              {language === 'en' ? '中文' : 'English'}
            </span>
            {step > 1 && (
              <span className="command-option" onClick={() => setStep(step - 1)}>
                {t.back}
              </span>
            )}
            <span className="command-option" onClick={onBack}>
              {language === 'en' ? 'back to main' : '返回主页'}
            </span>
          </div>
          <div className="copyright">
            © 2025 InvertBox.
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotBuilder;

