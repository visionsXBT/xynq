import time
import random
import requests
from datetime import datetime, timedelta
from collections import deque
import statistics

class XYNQTrader:
    """
    XYNQ Trader v2 - Simulates crypto trades with real price data, 
    technical indicators, and intelligent trading strategies
    """
    GREEN = "\033[32m"
    RED = "\033[31m"
    YELLOW = "\033[33m"
    CYAN = "\033[36m"
    RESET = "\033[0m"
    
    def __init__(self, starting_capital=2000.0):
        self.cryptos = [
            {"symbol": "SOL", "name": "Solana", "coingecko_id": "solana"},
            {"symbol": "BTC", "name": "Bitcoin", "coingecko_id": "bitcoin"},
            {"symbol": "ETH", "name": "Ethereum", "coingecko_id": "ethereum"},
            {"symbol": "BNB", "name": "Binance Coin", "coingecko_id": "binancecoin"},
            {"symbol": "ADA", "name": "Cardano", "coingecko_id": "cardano"},
            {"symbol": "MATIC", "name": "Polygon", "coingecko_id": "matic-network"},
            {"symbol": "DOT", "name": "Polkadot", "coingecko_id": "polkadot"},
            {"symbol": "LINK", "name": "Chainlink", "coingecko_id": "chainlink"},
            {"symbol": "UNI", "name": "Uniswap", "coingecko_id": "uniswap"}
        ]
        
        self.cash = starting_capital
        self.starting_capital = starting_capital
        self.holdings = {}
        self.total_trades = 0
        self.winning_trades = 0
        self.price_history = {}  # Track price history per crypto
        self.max_history = 20
        
        # Risk management
        self.max_position_size = 0.15  # Max 15% of capital per position
        self.stop_loss_percent = 0.08  # 8% stop loss
        self.take_profit_percent = 0.05  # 5% take profit
        self.max_open_positions = 4
        
    def get_price_history(self, symbol, coingecko_id):
        """Initialize and maintain price history for technical analysis"""
        if symbol not in self.price_history:
            self.price_history[symbol] = deque(maxlen=self.max_history)
        
        price = self.get_crypto_price(coingecko_id)
        if price:
            self.price_history[symbol].append(price)
        return price
    
    def get_crypto_price(self, coingecko_id):
        """Fetch real-time price from CoinGecko API with improved routing"""
        try:
            # Use multiple endpoints for better reliability
            endpoints = [
                f"https://api.coingecko.com/api/v3/simple/price?ids={coingecko_id}&vs_currencies=usd",
                f"https://api.coingecko.com/api/v3/simple/price?ids={coingecko_id}&vs_currencies=usd&include_24hr_change=true"
            ]
            
            for url in endpoints:
                try:
                    response = requests.get(url, timeout=10, headers={
                        'User-Agent': 'XYNQ-Trading-Bot/2.0',
                        'Accept': 'application/json'
                    })
                    if response.status_code == 200:
                        data = response.json()
                        if coingecko_id in data and "usd" in data[coingecko_id]:
                            return data[coingecko_id]["usd"]
                except Exception as e:
                    print(f"{self.YELLOW}[WARNING]{self.RESET} API endpoint failed: {e}")
                    continue
            
            # Fallback to mock price if API fails
            print(f"{self.YELLOW}[WARNING]{self.RESET} Using mock price for {coingecko_id}")
            return random.uniform(10, 1000)
            
        except Exception as e:
            print(f"{self.RED}[ERROR]{self.RESET} Failed to fetch price: {e}")
            return None
    
    def calculate_sma(self, symbol, period=5):
        """Calculate Simple Moving Average"""
        if symbol not in self.price_history or len(self.price_history[symbol]) < period:
            return None
        prices = list(self.price_history[symbol])[-period:]
        return statistics.mean(prices)
    
    def calculate_rsi(self, symbol, period=14):
        """Calculate Relative Strength Index"""
        if symbol not in self.price_history or len(self.price_history[symbol]) < period:
            return None
        
        prices = list(self.price_history[symbol])
        deltas = [prices[i] - prices[i-1] for i in range(1, len(prices))]
        
        gains = [d if d > 0 else 0 for d in deltas[-period:]]
        losses = [-d if d < 0 else 0 for d in deltas[-period:]]
        
        avg_gain = statistics.mean(gains) if gains else 0
        avg_loss = statistics.mean(losses) if losses else 0
        
        if avg_loss == 0:
            return 100 if avg_gain > 0 else 50
        
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        return rsi
    
    def get_momentum(self, symbol):
        """Calculate price momentum (current vs 5-period average)"""
        if symbol not in self.price_history or len(self.price_history[symbol]) < 5:
            return None
        
        prices = list(self.price_history[symbol])
        current = prices[-1]
        sma = statistics.mean(prices[-5:])
        return (current - sma) / sma * 100
    
    def should_buy(self, crypto):
        """Intelligent buy signal based on technical indicators"""
        symbol = crypto["symbol"]
        price = self.get_price_history(symbol, crypto["coingecko_id"])
        
        if not price:
            return False
        
        # Don't buy if we already have too many positions
        open_positions = sum(1 for h in self.holdings.values() if h["amount"] > 0)
        if open_positions >= self.max_open_positions:
            return False
        
        # Check if already holding this crypto
        if symbol in self.holdings and self.holdings[symbol]["amount"] > 0:
            return False
        
        # Need enough history for analysis
        if len(self.price_history[symbol]) < 5:
            return False
        
        rsi = self.calculate_rsi(symbol)
        momentum = self.get_momentum(symbol)
        sma = self.calculate_sma(symbol, period=5)
        
        if not all([rsi, momentum, sma]):
            return False
        
        # Buy signals:
        # 1. RSI oversold (below 35) - potential reversal
        # 2. Positive momentum - price trending up
        # 3. Price above moving average - uptrend
        buy_signal_count = 0
        
        if rsi < 35:
            buy_signal_count += 1
        if momentum > 1.0:
            buy_signal_count += 1
        if price > sma * 0.995:  # Price above/near SMA
            buy_signal_count += 1
        
        # Require at least 2 signals
        return buy_signal_count >= 2
    
    def should_sell(self, crypto):
        """Intelligent sell signal based on technical indicators and risk management"""
        symbol = crypto["symbol"]
        
        if symbol not in self.holdings or self.holdings[symbol]["amount"] <= 0:
            return False
        
        price = self.get_price_history(symbol, crypto["coingecko_id"])
        if not price:
            return False
        
        holding_data = self.holdings[symbol]
        entry_price = holding_data["avg_price"]
        
        # Calculate unrealized P&L percentage
        pnl_percent = ((price - entry_price) / entry_price) * 100
        
        rsi = self.calculate_rsi(symbol)
        momentum = self.get_momentum(symbol)
        sma = self.calculate_sma(symbol, period=5)
        
        # Sell signals:
        # 1. Stop loss hit (negative P&L threshold)
        if pnl_percent < -self.stop_loss_percent:
            return True
        
        # 2. Take profit hit (positive P&L threshold)
        if pnl_percent > self.take_profit_percent:
            return True
        
        # 3. RSI overbought (above 70) - potential reversal
        if rsi and rsi > 70:
            return True
        
        # 4. Negative momentum + price below moving average
        if momentum is not None and sma and momentum < -1.0 and price < sma:
            return True
        
        return False
    
    def calculate_position_size(self):
        """Calculate optimal position size based on available capital"""
        available_cash = self.cash - 100  # Keep $100 buffer
        max_position = self.starting_capital * self.max_position_size
        return min(max_position, available_cash * 0.3)  # Use max 30% of available cash
    
    def calculate_portfolio_value(self):
        """Calculate total portfolio value"""
        total = self.cash
        for symbol, data in self.holdings.items():
            if data["amount"] > 0:
                crypto = next((c for c in self.cryptos if c["symbol"] == symbol), None)
                if crypto:
                    current_price = self.get_crypto_price(crypto["coingecko_id"])
                    if current_price:
                        total += data["amount"] * current_price
        return total
    
    def execute_buy(self, crypto):
        """Execute a buy trade with intelligent position sizing"""
        price = self.get_price_history(crypto["symbol"], crypto["coingecko_id"])
        
        if price is None:
            return False
        
        position_size = self.calculate_position_size()
        
        if position_size < 10 or self.cash < position_size:
            return False
        
        amount = round(position_size / price, 8)
        actual_cost = round(amount * price, 2)
        
        self.cash -= actual_cost
        
        if crypto["symbol"] not in self.holdings:
            self.holdings[crypto["symbol"]] = {"amount": 0, "avg_price": 0}
        
        old_amount = self.holdings[crypto["symbol"]]["amount"]
        old_avg = self.holdings[crypto["symbol"]]["avg_price"]
        
        new_amount = old_amount + amount
        new_avg = ((old_amount * old_avg) + (amount * price)) / new_amount if new_amount > 0 else price
        
        self.holdings[crypto["symbol"]]["amount"] = new_amount
        self.holdings[crypto["symbol"]]["avg_price"] = new_avg
        
        portfolio_value = self.calculate_portfolio_value()
        portfolio_pnl = ((portfolio_value - self.starting_capital) / self.starting_capital) * 100
        
        print(f"\n{self.YELLOW}[XYNQ BUY]{self.RESET} {crypto['symbol']} @ ${price:,.2f}")
        print(f"Amount: {amount:.8f} | Cost: ${actual_cost:,.2f}")
        print(f"Portfolio: ${portfolio_value:,.2f} ({portfolio_pnl:+.2f}%)\n")
        
        return True
    
    def execute_sell(self, crypto):
        """Execute a sell trade with intelligent exit logic"""
        if crypto["symbol"] not in self.holdings or self.holdings[crypto["symbol"]]["amount"] <= 0:
            return False
        
        price = self.get_price_history(crypto["symbol"], crypto["coingecko_id"])
        
        if price is None:
            return False
        
        holding_data = self.holdings[crypto["symbol"]]
        amount = holding_data["amount"]
        avg_price = holding_data["avg_price"]
        
        actual_proceeds = round(amount * price, 2)
        pnl = actual_proceeds - (amount * avg_price)
        pnl_percent = (pnl / (amount * avg_price)) * 100 if amount * avg_price > 0 else 0
        
        self.total_trades += 1
        if pnl > 0:
            self.winning_trades += 1
        
        self.holdings[crypto["symbol"]]["amount"] = 0
        self.cash += actual_proceeds
        
        portfolio_value = self.calculate_portfolio_value()
        portfolio_pnl = ((portfolio_value - self.starting_capital) / self.starting_capital) * 100
        winrate = (self.winning_trades / self.total_trades * 100) if self.total_trades > 0 else 0
        
        pnl_color = self.YELLOW if pnl > 0 else self.RED
        
        print(f"\n{self.YELLOW}[XYNQ SELL]{self.RESET} {crypto['symbol']} @ ${price:,.2f}")
        print(f"Entry: ${avg_price:,.2f} | {pnl_color}PNL: ${pnl:+,.2f} ({pnl_percent:+.2f}%){self.RESET}")
        print(f"Proceeds: ${actual_proceeds:,.2f}")
        print(f"Portfolio: ${portfolio_value:,.2f} ({portfolio_pnl:+.2f}%)")
        print(f"{self.YELLOW}Win Rate: {winrate:.1f}%{self.RESET}\n")
        
        return True
    
    def run(self, trade_interval_min=15, trade_interval_max=45):
        """Run the trading bot with intelligent strategy"""
        print(f"{self.YELLOW}[XYNQ v2]{self.RESET} Trading bot initialized.")
        print(f"Starting Capital: ${self.starting_capital:,.2f}")
        print(f"Strategy: Technical Analysis (RSI, SMA, Momentum)")
        print(f"Risk Management: {self.stop_loss_percent*100:.0f}% stop-loss, {self.take_profit_percent*100:.0f}% take-profit")
        print(f"Monitoring markets...\n")
        
        while True:
            try:
                # Check all cryptos for sell opportunities first
                for crypto in self.cryptos:
                    if self.should_sell(crypto):
                        self.execute_sell(crypto)
                        time.sleep(2)
                
                # Then check for buy opportunities
                for crypto in self.cryptos:
                    if self.should_buy(crypto):
                        self.execute_buy(crypto)
                        time.sleep(2)
                
                wait_time = random.randint(trade_interval_min, trade_interval_max)
                print(f"{self.YELLOW}[XYNQ]{self.RESET} Next evaluation in {wait_time}s...\n")
                time.sleep(wait_time)
                
            except KeyboardInterrupt:
                print(f"\n{self.YELLOW}[XYNQ]{self.RESET} Shutting down...")
                final_value = self.calculate_portfolio_value()
                final_pnl = final_value - self.starting_capital
                final_pnl_percent = (final_pnl / self.starting_capital) * 100
                winrate = (self.winning_trades / self.total_trades * 100) if self.total_trades > 0 else 0
                
                print(f"\n{self.YELLOW}=== FINAL REPORT ==={self.RESET}")
                print(f"Starting: ${self.starting_capital:,.2f}")
                print(f"Final: ${final_value:,.2f}")
                print(f"PNL: ${final_pnl:+,.2f} ({final_pnl_percent:+.2f}%)")
                print(f"Trades: {self.total_trades} | Win Rate: {winrate:.1f}%")
                print(f"Cash: ${self.cash:,.2f}\n")
                break
            except Exception as e:
                print(f"{self.RED}[ERROR]{self.RESET} {e}")
                time.sleep(30)

if __name__ == "__main__":
    trader = XYNQTrader(starting_capital=2000.0)
    trader.run(trade_interval_min=15, trade_interval_max=45)

