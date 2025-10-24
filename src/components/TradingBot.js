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

  const shouldBuy = (crypto, currentPrice, prices) => {
    // Need at least 5 price points for SMA calculation
    if (prices.length < 5) return false;
    
    // Calculate Simple Moving Average 
    const sma = prices.slice(-5).reduce((sum, price) => sum + price, 0) / 5;
    
    // Buy if price is below SMA (oversold condition)
    return currentPrice < sma * 0.98; // 2% below SMA
  };

  const shouldSell = (crypto, currentPrice) => {
    if (!holdings[crypto.symbol] || holdings[crypto.symbol].amount === 0) return false;
    
    const entryPrice = holdings[crypto.symbol].entryPrice;
    const profitPercent = ((currentPrice - entryPrice) / entryPrice) * 100;
    
    // Sell on 3% profit or 2% loss (risk management)
    return profitPercent > 3 || profitPercent < -2;
  };

  const executeBuy = async (crypto) => {
    await loadPortfolio();
    
    const price = await getCryptoPrice(crypto.coingecko_id);
    if (!price) return false;

    const amount = Math.random() * 0.5 + 0.1; // Random amount between 0.1 and 0.6
    const cost = amount * price;

    if (cost > portfolioRef.current * 0.1) return false; // Don't spend more than 10% of portfolio

    const tradeData = {
      type: 'buy',
      symbol: crypto.symbol,
      coingecko_id: crypto.coingecko_id,
      amount: amount,
      price: price,
      cost: cost,
      portfolioValue: portfolioRef.current - cost,
      winRate: winRate,
      timestamp: new Date().toISOString()
    };

    // Save to MongoDB
    await saveTradeToMongoDB(tradeData);

    setHoldings(prev => {
      const existing = prev[crypto.symbol];
      if (existing && existing.amount > 0) {
        // Accumulate holdings - calculate weighted average entry price
        const totalAmount = existing.amount + amount;
        const totalCost = existing.cost + cost;
        const avgEntryPrice = totalCost / totalAmount;
        
        return {
          ...prev,
          [crypto.symbol]: {
            amount: totalAmount,
            entryPrice: avgEntryPrice,
            cost: totalCost
          }
        };
      } else {
        // First purchase of this crypto
        return {
          ...prev,
          [crypto.symbol]: {
            amount: amount,
            entryPrice: price,
            cost: cost
          }
        };
      }
    });

    const newPortfolioValue = portfolioRef.current - cost;
    setPortfolioValue(newPortfolioValue);
    portfolioRef.current = newPortfolioValue;
    
    // Save updated portfolio and holdings to database
    await savePortfolio(newPortfolioValue, winRate, totalTrades);
    
    // Get the updated holdings for database save
    const updatedHoldings = holdings[crypto.symbol] && holdings[crypto.symbol].amount > 0 
      ? {
          ...holdings,
          [crypto.symbol]: {
            amount: holdings[crypto.symbol].amount + amount,
            entryPrice: (holdings[crypto.symbol].cost + cost) / (holdings[crypto.symbol].amount + amount),
            cost: holdings[crypto.symbol].cost + cost
          }
        }
      : {
          ...holdings,
          [crypto.symbol]: {
            amount: amount,
            entryPrice: price,
            cost: cost
          }
        };
    
    await saveHoldings(updatedHoldings);
    
    addLog(`[XYNQ BUY] ${crypto.symbol} @ $${price.toFixed(2)} | Amount: ${amount.toFixed(6)} | Cost: $${cost.toFixed(2)}`, 'buy');
    addLog(`Portfolio: $${newPortfolioValue.toFixed(2)} | Win Rate: ${winRate.toFixed(1)}%`, 'info');
    addLog('', 'info');
    return true;
  };

  const executeSell = async (crypto) => {
    // Load current portfolio from database
    await loadPortfolio();
    
    const price = await getCryptoPrice(crypto.coingecko_id);
    if (!price) return false;

    const holding = holdings[crypto.symbol];
    const proceeds = holding.amount * price;
    const profit = proceeds - holding.cost;
    const profitPercent = (profit / holding.cost) * 100;

    const tradeData = {
      type: 'sell',
      symbol: crypto.symbol,
      coingecko_id: crypto.coingecko_id,
      amount: holding.amount,
      price: price,
      entryPrice: holding.entryPrice,
      cost: holding.cost,
      proceeds: proceeds,
      profit: profit,
      profitPercent: profitPercent,
      portfolioValue: portfolioRef.current + proceeds,
      winRate: winRate,
      timestamp: new Date().toISOString()
    };

    // Save to MongoDB
    await saveTradeToMongoDB(tradeData);

    setHoldings(prev => ({
      ...prev,
      [crypto.symbol]: { amount: 0, entryPrice: 0, cost: 0 }
    }));

    const newPortfolioValue = portfolioRef.current + proceeds;
    setPortfolioValue(newPortfolioValue);
    portfolioRef.current = newPortfolioValue;
    setTotalTrades(prev => prev + 1);
    
    if (profit > 0) {
      setWinRate(prev => {
        const newTrades = totalTrades + 1;
        const newWins = Math.floor(prev * totalTrades / 100) + 1;
        return (newWins / newTrades) * 100;
      });
    } else {
      setWinRate(prev => {
        const newTrades = totalTrades + 1;
        const newWins = Math.floor(prev * totalTrades / 100);
        return (newWins / newTrades) * 100;
      });
    }

    // Save updated portfolio and holdings to database
    await savePortfolio(newPortfolioValue, winRate, totalTrades + 1);
    await saveHoldings({
      ...holdings,
      [crypto.symbol]: { amount: 0, entryPrice: 0, cost: 0 }
    });

    const profitColor = profit > 0 ? 'profit' : 'loss';
    addLog(`[XYNQ SELL] ${crypto.symbol} @ $${price.toFixed(2)}`, 'sell');
    addLog(`Entry: $${holding.entryPrice.toFixed(2)} | PNL: $${profit.toFixed(2)} (${profitPercent.toFixed(2)}%)`, profitColor);
    addLog(`Portfolio: $${newPortfolioValue.toFixed(2)} | Win Rate: ${winRate.toFixed(1)}%`, 'info');
    addLog('', 'info');
    return true;
  };

  const simulateTrading = async () => {
    // Update price history for all cryptos (silently)
    for (const crypto of cryptos) {
      const price = await getCryptoPrice(crypto.coingecko_id);
      if (price) {
        setPriceHistory(prev => ({
          ...prev,
          [crypto.symbol]: [...(prev[crypto.symbol] || []).slice(-19), price]
        }));
      }
    }

    // Check for sell opportunities first
    for (const crypto of cryptos) {
      const price = await getCryptoPrice(crypto.coingecko_id);
      if (price && shouldSell(crypto, price)) {
        await executeSell(crypto);
        return; // Exit after executing one trade
      }
    }

    // Check for buy opportunities
    for (const crypto of cryptos) {
      const price = await getCryptoPrice(crypto.coingecko_id);
      const prices = priceHistory[crypto.symbol] || [];
      
      if (price && shouldBuy(crypto, price, prices)) {
        await executeBuy(crypto);
        return; // Exit after executing one trade
      }
    }

    // Fallback: Random trade if no technical signals (50% chance)
    if (Math.random() < 0.5) {
      const randomCrypto = cryptos[Math.floor(Math.random() * cryptos.length)];
      const price = await getCryptoPrice(randomCrypto.coingecko_id);
      if (price) {
        const hasHolding = holdings[randomCrypto.symbol] && holdings[randomCrypto.symbol].amount > 0;
        
        if (hasHolding) {
          await executeSell(randomCrypto);
        } else {
          await executeBuy(randomCrypto);
        }
      }
    }
  };

  const hasInitialized = useRef(false);

  useEffect(() => {
    let interval;
    
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      
      addLog(`[XYNQ] Trading bot initialized.`, 'startup');
      addLog(`Starting Capital: $2,000.00`, 'startup');
      addLog(`Strategy: Technical Analysis (SMA-based)`, 'startup');
      addLog(`Risk Management: 2% stop-loss, 3% take-profit`, 'startup');
      addLog(`Monitoring markets...`, 'startup');
      addLog('', 'info');
      
      // Load portfolio, holdings, and trades from MongoDB
      loadPortfolio();
      loadHoldings();
      loadAllTrades();
    }

    // Simulate trading every 12 seconds for proper analysis
    interval = setInterval(() => {
      simulateTrading();
    }, 12000);

    return () => {
      if (interval) clearInterval(interval);
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
