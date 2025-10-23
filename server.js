const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');
const https = require('https');

// Load environment variables from .env file
require('dotenv').config();

// Debug: Log all environment variables
console.log('All environment variables:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('MONGODB_DB:', process.env.MONGODB_DB);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'build')));

// API Routes

// MongoDB connection - hardcoded for testing
const MONGODB_URI = "mongodb+srv://yuannkendrickhernando_db_user:yuann020202@cluster0.geiy0aq.mongodb.net/xynq?retryWrites=true&w=majority";
const MONGODB_DB = "xynq";

let db;

async function connectToMongoDB() {
  try {
    console.log('Environment variables check:');
    console.log('MONGODB_URI exists:', !!MONGODB_URI);
    console.log('MONGODB_DB exists:', !!MONGODB_DB);
    console.log('MONGODB_URI length:', MONGODB_URI ? MONGODB_URI.length : 0);
    console.log('MONGODB_DB value:', MONGODB_DB);
    
    if (!MONGODB_URI || !MONGODB_DB) {
      console.error('MongoDB environment variables not found. Please check your .env.local file.');
      console.error('Required: MONGODB_URI and MONGODB_DB');
      console.error('Current working directory:', process.cwd());
      console.error('Looking for .env.local at:', path.join(__dirname, '.env.local'));
      return;
    }
    
    console.log('Attempting to connect to MongoDB...');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(MONGODB_DB);
    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
}

// API Routes

// Save a trade to MongoDB
app.post('/api/trades', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, error: 'MongoDB not connected' });
    }

    const trade = {
      ...req.body,
      timestamp: new Date(),
      createdAt: new Date()
    };

    const result = await db.collection('trades').insertOne(trade);
    res.json({ success: true, tradeId: result.insertedId });
  } catch (error) {
    console.error('Error saving trade:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all trades
app.get('/api/trades', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, error: 'MongoDB not connected' });
    }

    const trades = await db.collection('trades').find({}).sort({ timestamp: -1 }).toArray();
    res.json({ success: true, trades });
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get portfolio summary
app.get('/api/portfolio-summary', async (req, res) => {
  try {
    const trades = await db.collection('trades').find({}).sort({ timestamp: -1 }).toArray();
    
    // Calculate portfolio metrics
    let totalTrades = 0;
    let winningTrades = 0;
    let totalProfit = 0;
    let currentHoldings = {};

    trades.forEach(trade => {
      if (trade.type === 'buy') {
        currentHoldings[trade.symbol] = {
          amount: trade.amount,
          entryPrice: trade.price,
          cost: trade.cost
        };
      } else if (trade.type === 'sell') {
        totalTrades++;
        const profit = trade.proceeds - trade.cost;
        totalProfit += profit;
        if (profit > 0) winningTrades++;
        currentHoldings[trade.symbol] = null;
      }
    });

    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    res.json({
      success: true,
      portfolio: {
        totalTrades,
        winningTrades,
        winRate,
        totalProfit,
        currentHoldings: Object.keys(currentHoldings).filter(key => currentHoldings[key])
      }
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// CoinGecko API proxy endpoint with API key
app.get('/api/price/:coingecko_id', async (req, res) => {
  try {
    const { coingecko_id } = req.params;
    
    const coinGeckoUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coingecko_id}&vs_currencies=usd&include_24hr_change=false&x_cg_demo_api_key=CG-q2ignizEJ8JtUBySUe1wtU1K`;
    
    const response = await new Promise((resolve, reject) => {
      const request = https.get(coinGeckoUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; goPort/1.0)',
          'Accept': 'application/json',
        }
      }, (response) => {
        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve({
              ok: response.statusCode >= 200 && response.statusCode < 300,
              status: response.statusCode,
              statusText: response.statusMessage,
              data: jsonData
            });
          } catch (parseError) {
            reject(new Error(`Failed to parse JSON: ${parseError.message}`));
          }
        });
      });
      
      request.on('error', (error) => {
        reject(error);
      });
      
      request.setTimeout(10000, () => {
        request.destroy();
        reject(new Error('Request timeout'));
      });
    });
    
    if (response.ok && response.data[coingecko_id]?.usd) {
      const price = response.data[coingecko_id].usd;
      res.json({ success: true, price: price });
    } else {
      res.status(response.status).json({ success: false, error: 'Failed to fetch price' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Holdings endpoints
app.get('/api/holdings', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, error: 'MongoDB not connected' });
    }
    
    const holdingsCollection = db.collection('holdings');
    const holdings = await holdingsCollection.findOne({});
    
    res.json({ 
      success: true, 
      holdings: holdings || {}
    });
  } catch (error) {
    console.error('Error fetching holdings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/holdings', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, error: 'MongoDB not connected' });
    }
    
    const holdingsCollection = db.collection('holdings');
    const holdings = req.body;
    
    await holdingsCollection.replaceOne(
      {}, 
      holdings,
      { upsert: true }
    );
    
    res.json({ success: true, message: 'Holdings updated' });
  } catch (error) {
    console.error('Error updating holdings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clear holdings endpoint
app.delete('/api/holdings', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, error: 'MongoDB not connected' });
    }
    
    const holdingsCollection = db.collection('holdings');
    
    const result = await holdingsCollection.deleteMany({});
    
    res.json({ 
      success: true, 
      message: `Cleared ${result.deletedCount} holdings from database` 
    });
  } catch (error) {
    console.error('Error clearing holdings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clear portfolio endpoint
app.delete('/api/portfolio', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, error: 'MongoDB not connected' });
    }
    
    const portfolioCollection = db.collection('portfolio');
    
    const result = await portfolioCollection.deleteMany({});
    
    res.json({ 
      success: true, 
      message: `Cleared ${result.deletedCount} portfolio records from database` 
    });
  } catch (error) {
    console.error('Error clearing portfolio:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Portfolio endpoints
app.get('/api/portfolio', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, error: 'MongoDB not connected' });
    }
    
    const portfolioCollection = db.collection('portfolio');
    const portfolio = await portfolioCollection.findOne({});
    
    res.json({ 
      success: true, 
      portfolio: portfolio || { value: 2000.00, winRate: 0, totalTrades: 0 }
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/portfolio', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, error: 'MongoDB not connected' });
    }
    
    const portfolioCollection = db.collection('portfolio');
    const { value, winRate, totalTrades } = req.body;
    
    await portfolioCollection.replaceOne(
      {}, 
      { value, winRate, totalTrades, updatedAt: new Date() },
      { upsert: true }
    );
    
    res.json({ success: true, message: 'Portfolio updated' });
  } catch (error) {
    console.error('Error updating portfolio:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clear all trades endpoint
app.delete('/api/trades', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, error: 'MongoDB not connected' });
    }
    
    const tradesCollection = db.collection('trades');
    
    const result = await tradesCollection.deleteMany({});
    
    res.json({ 
      success: true, 
      message: `Cleared ${result.deletedCount} trades from database` 
    });
  } catch (error) {
    console.error('Error clearing trades:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'XYNQ Trading Bot API is running' });
});

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Background Trading System
let backgroundTradingInterval = null;
let isBackgroundTradingActive = false;

const cryptos = [
  { symbol: 'BTC', coingecko_id: 'bitcoin' },
  { symbol: 'ETH', coingecko_id: 'ethereum' },
  { symbol: 'SOL', coingecko_id: 'solana' },
  { symbol: 'BNB', coingecko_id: 'binancecoin' },
  { symbol: 'ADA', coingecko_id: 'cardano' },
  { symbol: 'DOT', coingecko_id: 'polkadot' },
  { symbol: 'MATIC', coingecko_id: 'matic-network' },
  { symbol: 'AVAX', coingecko_id: 'avalanche-2' }
];

let priceHistory = {};
let holdings = {};

// Load holdings from database
const loadHoldings = async () => {
  try {
    if (!db) return {};
    const holdingsCollection = db.collection('holdings');
    const result = await holdingsCollection.findOne({});
    return result || {};
  } catch (error) {
    console.error('Error loading holdings:', error);
    return {};
  }
};

// Save holdings to database
const saveHoldings = async (holdingsData) => {
  try {
    if (!db) return false;
    const holdingsCollection = db.collection('holdings');
    await holdingsCollection.replaceOne({}, holdingsData, { upsert: true });
    return true;
  } catch (error) {
    console.error('Error saving holdings:', error);
    return false;
  }
};

// Load portfolio from database
const loadPortfolio = async () => {
  try {
    if (!db) return { value: 2000.00, winRate: 0, totalTrades: 0 };
    const portfolioCollection = db.collection('portfolio');
    const result = await portfolioCollection.findOne({});
    return result || { value: 2000.00, winRate: 0, totalTrades: 0 };
  } catch (error) {
    console.error('Error loading portfolio:', error);
    return { value: 2000.00, winRate: 0, totalTrades: 0 };
  }
};

// Save portfolio to database
const savePortfolio = async (value, winRate, totalTrades) => {
  try {
    if (!db) return false;
    const portfolioCollection = db.collection('portfolio');
    await portfolioCollection.replaceOne(
      {},
      { value, winRate, totalTrades, updatedAt: new Date() },
      { upsert: true }
    );
    return true;
  } catch (error) {
    console.error('Error saving portfolio:', error);
    return false;
  }
};

// Save trade to database
const saveTradeToMongoDB = async (tradeData) => {
  try {
    if (!db) return false;
    const tradesCollection = db.collection('trades');
    await tradesCollection.insertOne(tradeData);
    return true;
  } catch (error) {
    console.error('Error saving trade:', error);
    return false;
  }
};

// Get crypto price from CoinGecko
const getCryptoPrice = async (coingeckoId) => {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`, {
      headers: {
        'x-cg-demo-api-key': 'CG-q2ignizEJ8JtUBySUe1wtU1K'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data[coingeckoId]?.usd || null;
  } catch (error) {
    console.error(`Error fetching price for ${coingeckoId}:`, error);
    return null;
  }
};

// Background trading logic - only trades when criteria are met
const backgroundTrading = async () => {
  try {
    // Load current state
    const portfolio = await loadPortfolio();
    holdings = await loadHoldings();
    
    let tradesExecuted = 0;
    
    // Update price history and check for trading opportunities
    for (const crypto of cryptos) {
      const price = await getCryptoPrice(crypto.coingecko_id);
      if (!price) continue;
      
      // Update price history
      if (!priceHistory[crypto.symbol]) {
        priceHistory[crypto.symbol] = [];
      }
      priceHistory[crypto.symbol].push(price);
      if (priceHistory[crypto.symbol].length > 20) {
        priceHistory[crypto.symbol] = priceHistory[crypto.symbol].slice(-20);
      }
      
      const prices = priceHistory[crypto.symbol] || [];
      
      // Check for sell signal first (exit existing positions)
      if (shouldSell(crypto, price)) {
        await executeSell(crypto, price, portfolio);
        tradesExecuted++;
        continue; // Skip buy check after selling
      }
      
      // Check for buy signal only if we have enough price history
      if (shouldBuy(crypto, price, prices)) {
        await executeBuy(crypto, price, portfolio);
        tradesExecuted++;
      }
    }
    
    // Only log if no trades were executed
    if (tradesExecuted === 0) {
      console.log(`[MARKET SCAN] No trading opportunities found at ${new Date().toLocaleTimeString()}`);
    }
  } catch (error) {
    console.error('Background trading error:', error);
  }
};

// Trading decision functions - more realistic criteria
const shouldBuy = (crypto, currentPrice, prices) => {
  // Need at least 10 price points for reliable analysis
  if (prices.length < 10) return false;
  
  // Calculate 5-period and 10-period SMAs
  const sma5 = prices.slice(-5).reduce((sum, price) => sum + price, 0) / 5;
  const sma10 = prices.slice(-10).reduce((sum, price) => sum + price, 0) / 10;
  
  // Buy when price is moderately below both SMAs (oversold)
  const belowSMA5 = currentPrice < sma5 * 0.98; // 2% below 5-period SMA
  const belowSMA10 = currentPrice < sma10 * 0.97; // 3% below 10-period SMA
  
  // Additional check: price should be trending down (recent prices declining)
  const recentTrend = prices.slice(-3).every((price, i) => 
    i === 0 || price < prices.slice(-3)[i-1]
  );
  
  return belowSMA5 && belowSMA10 && recentTrend;
};

const shouldSell = (crypto, currentPrice) => {
  if (!holdings[crypto.symbol] || holdings[crypto.symbol].amount === 0) return false;
  
  const entryPrice = holdings[crypto.symbol].entryPrice;
  const profitPercent = ((currentPrice - entryPrice) / entryPrice) * 100;
  
  // Conservative sell criteria - smaller risk/reward
  return profitPercent > 2 || profitPercent < -2; // Sell on 2% profit or 2% loss
};

// Execute buy trade
const executeBuy = async (crypto, price, portfolio) => {
  const amount = Math.random() * 0.2 + 0.05; // Smaller trade amounts
  const cost = amount * price;
  
  if (cost > portfolio.value * 0.05) return false; // Don't spend more than 5% of portfolio
  
  const tradeData = {
    type: 'buy',
    symbol: crypto.symbol,
    coingecko_id: crypto.coingecko_id,
    amount: amount,
    price: price,
    cost: cost,
    portfolioValue: portfolio.value - cost,
    winRate: portfolio.winRate,
    timestamp: new Date().toISOString()
  };
  
  await saveTradeToMongoDB(tradeData);
  
  // Update holdings
  const existing = holdings[crypto.symbol];
  if (existing && existing.amount > 0) {
    const totalAmount = existing.amount + amount;
    const totalCost = existing.cost + cost;
    holdings[crypto.symbol] = {
      amount: totalAmount,
      entryPrice: totalCost / totalAmount,
      cost: totalCost
    };
  } else {
    holdings[crypto.symbol] = {
      amount: amount,
      entryPrice: price,
      cost: cost
    };
  }
  
  // Update portfolio
  const newPortfolioValue = portfolio.value - cost;
  await savePortfolio(newPortfolioValue, portfolio.winRate, portfolio.totalTrades);
  await saveHoldings(holdings);
  
  console.log(`[BACKGROUND BUY] ${crypto.symbol} @ $${price.toFixed(2)} | Amount: ${amount.toFixed(6)} | Cost: $${cost.toFixed(2)}`);
  return true;
};

// Execute sell trade
const executeSell = async (crypto, price, portfolio) => {
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
    portfolioValue: portfolio.value + proceeds,
    winRate: portfolio.winRate,
    timestamp: new Date().toISOString()
  };
  
  await saveTradeToMongoDB(tradeData);
  
  // Update holdings
  holdings[crypto.symbol] = { amount: 0, entryPrice: 0, cost: 0 };
  
  // Update portfolio
  const newPortfolioValue = portfolio.value + proceeds;
  const newTotalTrades = portfolio.totalTrades + 1;
  const newWins = Math.floor(portfolio.winRate * portfolio.totalTrades / 100) + (profit > 0 ? 1 : 0);
  const newWinRate = (newWins / newTotalTrades) * 100;
  
  await savePortfolio(newPortfolioValue, newWinRate, newTotalTrades);
  await saveHoldings(holdings);
  
  console.log(`[BACKGROUND SELL] ${crypto.symbol} @ $${price.toFixed(2)} | Entry: $${holding.entryPrice.toFixed(2)} | PNL: $${profit.toFixed(2)} (${profitPercent.toFixed(2)}%)`);
  return true;
};

// Start background trading - intelligent monitoring
const startBackgroundTrading = () => {
  if (isBackgroundTradingActive) return;
  
  isBackgroundTradingActive = true;
  console.log('Starting intelligent background trading system...');
  console.log('Bot will only trade when market conditions meet strict criteria');
  
  // Initial market scan
  backgroundTrading();
  
  // Set up intelligent monitoring - check every 30 seconds for opportunities
  backgroundTradingInterval = setInterval(() => {
    backgroundTrading();
  }, 30000); // Check every 30 seconds for trading opportunities
};

// Stop background trading
const stopBackgroundTrading = () => {
  if (!isBackgroundTradingActive) return;
  
  isBackgroundTradingActive = false;
  if (backgroundTradingInterval) {
    clearInterval(backgroundTradingInterval);
    backgroundTradingInterval = null;
  }
  console.log('Background trading system stopped.');
};

// API endpoints for background trading control
app.post('/api/background-trading/start', (req, res) => {
  startBackgroundTrading();
  res.json({ success: true, message: 'Background trading started' });
});

app.post('/api/background-trading/stop', (req, res) => {
  stopBackgroundTrading();
  res.json({ success: true, message: 'Background trading stopped' });
});

app.get('/api/background-trading/status', (req, res) => {
  res.json({ 
    success: true, 
    isActive: isBackgroundTradingActive,
    message: isBackgroundTradingActive ? 'Background trading is active' : 'Background trading is inactive'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`XYNQ Trading Bot API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  connectToMongoDB();
  
  // Start background trading automatically
  setTimeout(() => {
    startBackgroundTrading();
  }, 5000); // Start 5 seconds after server starts
});
