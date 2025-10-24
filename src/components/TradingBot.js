import React, { useState, useEffect, useRef } from 'react';
import './LandingPage.css';

const TradingBot = ({ onBack, language, setLanguage }) => {
  const [logs, setLogs] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(2000.00);
  const [totalTrades, setTotalTrades] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [holdings, setHoldings] = useState({});
  const [priceHistory, setPriceHistory] = useState({});
  const [allTrades, setAllTrades] = useState([]);
  const portfolioRef = useRef(2000.00);

  const cryptos = [
    { symbol: 'SOL', coingecko_id: 'solana' },
    { symbol: 'BTC', coingecko_id: 'bitcoin' },
    { symbol: 'ETH', coingecko_id: 'ethereum' },
    { symbol: 'BNB', coingecko_id: 'binancecoin' },
    { symbol: 'ADA', coingecko_id: 'cardano' },
    { symbol: 'MATIC', coingecko_id: 'matic-network' },
    { symbol: 'DOT', coingecko_id: 'polkadot' },
    { symbol: 'LINK', coingecko_id: 'chainlink' },
    { symbol: 'UNI', coingecko_id: 'uniswap' }
  ];

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-49), { timestamp, message, type }]);
  };

  const saveTradeToMongoDB = async (tradeData) => {
    try {
      const response = await fetch('http://localhost:5000/api/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tradeData),
      });

      if (response.ok) {
        const result = await response.json();
        // Reload all trades after saving
        loadAllTrades();
        return result;
      }
      return null;
    } catch (error) {
      console.error('MongoDB Error:', error);
      return null;
    }
  };

  const loadHoldings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/holdings');
      if (response.ok) {
        const result = await response.json();
        setHoldings(result.holdings || {});
      }
    } catch (error) {
      console.error('Error loading holdings:', error);
    }
  };

  const saveHoldings = async (holdingsData) => {
    try {
      const response = await fetch('http://localhost:5000/api/holdings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(holdingsData),
      });
      return response.ok;
    } catch (error) {
      console.error('Error saving holdings:', error);
      return false;
    }
  };

  const loadPortfolio = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/portfolio');
      if (response.ok) {
        const result = await response.json();
        const portfolio = result.portfolio;
        
        // Handle null/undefined values
        const value = portfolio.value || 2000.00;
        const winRate = portfolio.winRate || 0;
        const totalTrades = portfolio.totalTrades || 0;
        
        setPortfolioValue(value);
        setWinRate(winRate);
        setTotalTrades(totalTrades);
        portfolioRef.current = value;
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
      // Set defaults on error
      setPortfolioValue(2000.00);
      setWinRate(0);
      setTotalTrades(0);
      portfolioRef.current = 2000.00;
    }
  };

  const savePortfolio = async (value, winRate, totalTrades) => {
    try {
      const response = await fetch('http://localhost:5000/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value, winRate, totalTrades }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error saving portfolio:', error);
      return false;
    }
  };

  const loadAllTrades = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/trades');
      if (response.ok) {
        const result = await response.json();
        setAllTrades(result.trades || []);
      }
    } catch (error) {
      console.error('MongoDB Error:', error);
    }
  };

  const getCryptoPrice = async (coingecko_id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/price/${coingecko_id}`);
      
      if (response.ok) {
        const data = await response.json();
        return data.price;
      }
      return null;
    } catch (error) {
      console.error('Error fetching price:', error);
      return null;
    }
  };

  const calculateSMA = (prices, period = 5) => {
    if (prices.length < period) return null;
    const recentPrices = prices.slice(-period);
    return recentPrices.reduce((sum, price) => sum + price, 0) / period;
  };

  // Trading decision functions removed - only server.js handles trading decisions

  // Trading functions removed - only server.js handles trading

  // All trading functions removed - only server.js handles trading

  // All trading logic removed - only server.js handles trading

  const hasInitialized = useRef(false);

  useEffect(() => {
    let refreshInterval;
    
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      
      addLog(`[XYNQ] Trading bot initialized.`, 'startup');
      addLog(`Starting Capital: $2,000.00`, 'startup');
      addLog(`Strategy: Technical Analysis`, 'startup');
      addLog(`Model: Claude 4-5 Sonnet `, 'startup');
      addLog(`Risk Management: 2% stop-loss, 3% take-profit`, 'startup');
      addLog(`Monitoring markets...`, 'startup');
      addLog('', 'info');
      
      // Load portfolio, holdings, and trades from MongoDB
      loadPortfolio();
      loadHoldings();
      loadAllTrades();
    }

    // Refresh trades from server.js every 2 seconds to show new trades
    refreshInterval = setInterval(() => {
      loadAllTrades();
      loadPortfolio();
      loadHoldings();
    }, 2000);

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  const clearLogs = () => {
    setLogs([]);
    setPortfolioValue(2000.00);
    setTotalTrades(0);
    setWinRate(0);
  };

  return (
    <div className="terminal-page">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-title prompt">
            &gt;_&nbsp;&nbsp;xynq_terminal.exe
          </div>
          <div className="terminal-title">
            <img src="/typeface-transparent.png" alt="InvertBox" onClick={() => window.open('https://invertbox.fun', '_blank')} style={{cursor: 'pointer'}} />
          </div>
        </div>
        <div className="terminal-body">
          <div className="terminal-content">
            {/* Combined Trading Logs and All Trades */}
            <div className="trading-logs sleek-scrollbar" style={{
              flex: 1,
              overflowY: 'auto',
              backgroundColor: '#000000',
              padding: '10px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '12px',
              lineHeight: '1.4',
              minHeight: 0,
              scrollbarWidth: 'thin',
              scrollbarColor: '#333333 #000000'
            }}>
              {/* Display initialization message first */}
              {logs.filter(log => log.type === 'startup').map((log, index) => (
                <div key={`startup-${index}`} style={{
                  color: '#ffcc00',
                  marginBottom: log.message === '' ? '8px' : '2px'
                }}>
                  {log.message && `[${log.timestamp}] ${log.message}`}
                </div>
              ))}
              
              {/* Display all trades from MongoDB (oldest to newest) */}
              {allTrades.slice().reverse().map((trade, index) => (
                <div key={`trade-${index}`} style={{
                  marginBottom: '2px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>
                    <span style={{ color: trade.type === 'buy' ? '#00ff00' : '#ff4444' }}>
                      [{trade.type.toUpperCase()}]
                    </span>
                    {' '}
                    <span style={{ color: '#ffcc00' }}>
                      {trade.symbol} @ ${trade.price?.toFixed(2)}
                    </span>
                    {' '}
                    <span style={{ color: '#ffffff' }}>
                      {trade.type === 'buy' && `| Amount: ${trade.amount?.toFixed(6)} | Cost: $${trade.cost?.toFixed(2)}`}
                      {trade.type === 'sell' && `| Entry: $${trade.entryPrice?.toFixed(2)} | PNL: $${trade.profit?.toFixed(2)} (${trade.profitPercent?.toFixed(2)}%)`}
                      {trade.portfolioValue && ` | Portfolio: $${trade.portfolioValue.toFixed(2)}`}
                      {trade.winRate !== undefined && ` | Win Rate: ${trade.winRate.toFixed(1)}%`}
                    </span>
                  </span>
                  <span style={{ color: '#888', fontSize: '10px' }}>
                    {new Date(trade.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
              
              {/* Display live trading logs at the bottom */}
              {logs.filter(log => log.type !== 'startup').map((log, index) => (
                <div key={`log-${index}`} style={{
                  color: log.type === 'buy' ? '#ffcc00' : 
                         log.type === 'sell' ? '#ff4444' :
                         log.type === 'profit' ? '#00ff00' :
                         log.type === 'loss' ? '#ff4444' :
                         log.type === 'shutdown' ? '#ffcc00' :
                         log.type === 'error' ? '#ff6666' : '#ffffff',
                  marginBottom: log.message === '' ? '8px' : '2px'
                }}>
                  {log.message && `[${log.timestamp}] ${log.message}`}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Bottom Section */}
        <div className="terminal-bottom-fixed">
          <div className="command-options">
            <span className="command-option" onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}>
              {language === 'en' ? '中文' : 'English'}
            </span>
            <span className="command-option" onClick={() => window.open('https://x.com/invertbox', '_blank')}>
              x.com/invertbox
            </span>
            <span className="command-option" onClick={() => window.open('https://invertbox.fun', '_blank')}>
              InvertBox
            </span>
            <span className="command-option" onClick={() => onBack()}>
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

export default TradingBot;
