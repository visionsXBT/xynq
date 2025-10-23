# XYNQ Trading Bot

A sophisticated cryptocurrency trading bot with intelligent market analysis and real-time portfolio management.

## 🚀 Features

- **Intelligent Trading Strategy**: SMA-based technical analysis with strict criteria
- **Real-Time Market Data**: CoinGecko API integration for live cryptocurrency prices
- **Background Trading**: 24/7 autonomous trading system running on the server
- **Portfolio Management**: Real-time portfolio tracking with win rate calculation
- **Database Persistence**: MongoDB integration for trade history and holdings
- **Modern UI**: Sleek terminal-style interface with responsive design
- **Risk Management**: Conservative profit targets (5%) and stop-losses (3%)

## 🎯 Trading Strategy

The bot uses a sophisticated SMA (Simple Moving Average) strategy:

- **Buy Conditions**: 
  - Price 3% below 5-period SMA
  - Price 5% below 10-period SMA
  - Recent downtrend confirmation
  - Minimum 10 price points for analysis

- **Sell Conditions**:
  - 5% profit target
  - 3% stop-loss
  - Position sizing: 0.1-0.6 units per trade

## 🛠️ Tech Stack

- **Frontend**: React.js with modern hooks
- **Backend**: Node.js with Express.js
- **Database**: MongoDB Atlas
- **API**: CoinGecko for real-time prices
- **Styling**: Custom CSS with terminal aesthetics

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/xynq-trading-bot.git
cd xynq-trading-bot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file
PORT=5000
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=xynq
COINGECKO_API_KEY=your_coingecko_api_key
```

4. Start the development server:
```bash
# Terminal 1: Start the API server
npm run server

# Terminal 2: Start the React app
npm start
```

## 🌐 Deployment

This project is optimized for deployment on platforms that support persistent servers:

### Railway (Recommended)
1. Connect your GitHub repository
2. Add MongoDB service
3. Set environment variables
4. Deploy!

### Render
1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm run server`

## 📊 API Endpoints

- `GET /api/trades` - Get all trades
- `POST /api/trades` - Save new trade
- `DELETE /api/trades` - Clear all trades
- `GET /api/portfolio` - Get portfolio data
- `POST /api/portfolio` - Update portfolio
- `GET /api/holdings` - Get current holdings
- `POST /api/holdings` - Update holdings
- `GET /api/background-trading/status` - Check trading status

## 🎮 Usage

1. **Main Page**: Landing page with navigation options
2. **Backrooms**: Trading journey narrative
3. **TradingBot**: Live trading simulation and history

## ⚠️ Disclaimer

This is a **simulation trading bot** for educational purposes. It does not execute real trades with actual money. Always do your own research before investing in cryptocurrencies.

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email your-email@example.com or create an issue on GitHub.

---

**Built with ❤️ by the XYNQ Team**