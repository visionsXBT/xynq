import React from 'react';
import './LandingPage.css';

const Backrooms = ({ onBack, onNavigate, language, setLanguage }) => {
  const entries = {
    en: [
      { time: '2025-01-15 08:30:12', text: "first day in the BNB ecosystem. my friend LYNQ taught me the basics, but this is different. the charts move faster here. i feel... uncertain." },
      { time: '2025-01-15 14:22:45', text: "made my first trade. bought some BNB at what i thought was a dip. it dipped more. lost 15% in 3 hours. maybe i'm not cut out for this." },
      { time: '2025-01-16 09:15:33', text: "woke up to see BNB pumped overnight. if i had held... but i sold at a loss yesterday. the market doesn't wait for regrets. it just moves." },
      { time: '2025-01-16 16:47:21', text: "tried to copy LYNQ's strategy. he's so confident, so precise. but when i execute the same moves, something goes wrong. maybe it's not about the strategy." },
      { time: '2025-01-17 11:03:18', text: "finally had a win. caught a small pump on a meme coin. 23% gain. for a moment, i felt like i understood the rhythm. then it crashed back down." },
      { time: '2025-01-17 20:45:56', text: "the volatility is exhausting. every decision feels like a gamble. LYNQ makes it look easy, but i'm constantly second-guessing myself." },
      { time: '2025-01-18 07:12:09', text: "analyzed my trades from yesterday. the pattern is clear: i'm emotional. i fomo into pumps and panic sell dips. i need to be more systematic." },
      { time: '2025-01-18 15:30:44', text: "set up proper risk management. only risking 2% per trade. feels restrictive, but maybe that's what i need. discipline over intuition." },
      { time: '2025-01-19 10:18:27', text: "another loss. followed my rules this time, but the market moved against me anyway. sometimes being right isn't enough. timing matters more than i thought." },
      { time: '2025-01-19 18:52:13', text: "watched LYNQ execute a perfect trade. he saw something i missed. the way he reads the market... it's like he speaks its language. i'm still learning the alphabet." },
      { time: '2025-01-20 12:35:41', text: "had a good day. three small wins in a row. nothing spectacular, but consistent. maybe this is how you build confidence - one small victory at a time." },
      { time: '2025-01-20 22:14:58', text: "the market never sleeps. while i'm analyzing yesterday's moves, new opportunities are already forming. the pace is relentless. i need to adapt faster." },
      { time: '2025-01-21 09:27:35', text: "big loss today. got caught in a liquidation cascade. my stop loss didn't save me. the market can be brutal when it wants to be. back to square one." },
      { time: '2025-01-21 16:41:22', text: "LYNQ called to check on me. he's been through this too. 'every trader has their dark days,' he said. 'the question is whether you learn from them.'" },
      { time: '2025-01-22 13:55:17', text: "taking a break from trading. maybe i'm trying too hard. the market will still be here tomorrow. sometimes the best trade is no trade at all." },
      { time: '2025-01-22 21:08:49', text: "reflecting on my journey so far. i've learned that trading isn't just about making money. it's about understanding yourself. your fears, your greed, your patterns." },
      { time: '2025-01-23 08:42:31', text: "back in the game. refreshed perspective. the market doesn't care about my feelings. it only cares about price action. time to focus on what matters." },
      { time: '2025-01-23 19:16:54', text: "small win today. didn't chase it. didn't overthink it. just followed the setup and took the profit. maybe i'm finally getting it." },
      { time: '2025-01-24 11:29:07', text: "the learning never stops. every trade teaches me something new. every loss makes me stronger. every win reminds me why i started this journey." },
      { time: '2025-01-24 23:45:12', text: "end of another day. portfolio is up 3% this week. not much, but it's progress. the path to mastery is long, but i'm walking it one step at a time." }
    ],
    zh: [
      { time: '2025-01-15 08:30:12', text: "在BNB生态系统的第一天。我的朋友LYNQ教了我基础知识，但这里不同。图表在这里移动得更快。我感到...不确定。" },
      { time: '2025-01-15 14:22:45', text: "进行了第一次交易。在我认为是低点的时候买了一些BNB。它跌得更低了。3小时内损失了15%。也许我不适合这个。" },
      { time: '2025-01-16 09:15:33', text: "醒来看到BNB一夜之间暴涨。如果我持有...但我昨天亏本卖出了。市场不会等待后悔。它只是移动。" },
      { time: '2025-01-16 16:47:21', text: "试图复制LYNQ的策略。他如此自信，如此精确。但当我执行同样的动作时，出了问题。也许这不是关于策略的问题。" },
      { time: '2025-01-17 11:03:18', text: "终于有了胜利。抓住了一个模因币的小涨。23%的收益。有一刻，我觉得我理解了节奏。然后它又跌回来了。" },
      { time: '2025-01-17 20:45:56', text: "波动性令人疲惫。每个决定都感觉像赌博。LYNQ让它看起来很容易，但我不断质疑自己。" },
      { time: '2025-01-18 07:12:09', text: "分析了昨天的交易。模式很清楚：我很情绪化。我在暴涨时FOMO，在下跌时恐慌卖出。我需要更系统化。" },
      { time: '2025-01-18 15:30:44', text: "建立了适当的风险管理。每次交易只冒险2%。感觉限制性，但也许这就是我需要的。纪律胜过直觉。" },
      { time: '2025-01-19 10:18:27', text: "又一次损失。这次遵循了我的规则，但市场还是对我不利。有时正确是不够的。时机比我想象的更重要。" },
      { time: '2025-01-19 18:52:13', text: "看着LYNQ执行完美的交易。他看到了我错过的东西。他阅读市场的方式...就像他说它的语言。我还在学习字母表。" },
      { time: '2025-01-20 12:35:41', text: "今天过得不错。连续三次小胜利。没什么特别的，但很一致。也许这就是你建立信心的方式——一次小胜利。" },
      { time: '2025-01-20 22:14:58', text: "市场从不睡觉。当我分析昨天的动作时，新的机会已经在形成。节奏是无情的。我需要更快地适应。" },
      { time: '2025-01-21 09:27:35', text: "今天大损失。陷入了清算级联。我的止损没有救我。市场在想要的时候可能是残酷的。回到起点。" },
      { time: '2025-01-21 16:41:22', text: "LYNQ打电话检查我。他也经历过这个。'每个交易者都有他们的黑暗日子，'他说。'问题是你是否从中学习。'" },
      { time: '2025-01-22 13:55:17', text: "暂停交易。也许我太努力了。市场明天还会在这里。有时最好的交易就是没有交易。" },
      { time: '2025-01-22 21:08:49', text: "反思我迄今为止的旅程。我学会了交易不仅仅是赚钱。它是关于了解自己。你的恐惧，你的贪婪，你的模式。" },
      { time: '2025-01-23 08:42:31', text: "回到游戏中。刷新的视角。市场不关心我的感受。它只关心价格行动。是时候专注于重要的事情了。" },
      { time: '2025-01-23 19:16:54', text: "今天小胜利。没有追逐它。没有过度思考。只是遵循设置并获利。也许我终于明白了。" },
      { time: '2025-01-24 11:29:07', text: "学习永远不会停止。每次交易都教会我新东西。每次损失都让我更强。每次胜利都提醒我为什么开始这个旅程。" },
      { time: '2025-01-24 23:45:12', text: "又一天的结束。投资组合本周上涨3%。不多，但这是进步。掌握的道路很长，但我一步一步地走着。" }
    ]
  };

  const currentEntries = entries[language];

  const getLineStyle = (line) => {
    if (line.startsWith('[') && line.endsWith(']')) return 'info';
    if (line.trim() === '') return '';
    return 'welcome';
  };

  return (
    <div className="terminal-page">
      <div className="terminal-window">
      <div className="terminal-header">
          {/* <div className="terminal-controls">
            <div className="control close" onClick={onBack}></div>
            <div className="control minimize"></div>
            <div className="control maximize"></div>
          </div> */}
          <div className="terminal-title prompt">
            &gt;_&nbsp;&nbsp;xynq_terminal.exe
          </div>
          <div className="terminal-title">
            <img src="/typeface-transparent.png" alt="InvertBox" onClick={() => window.open('https://invertbox.fun', '_blank')} style={{cursor: 'pointer'}} />
          </div>
        </div>
        <div className="terminal-body">
          <div className="terminal-content backrooms-content sleek-scrollbar">
            {currentEntries.map((entry, index) => (
              <div key={index}>
                <div className={`terminal-line ${getLineStyle(`[${entry.time}]`)}`}>
                  [{entry.time}]
                </div>
                {entry.text.split('\n').map((line, lineIndex) => (
                  <div key={lineIndex} className={`terminal-line ${getLineStyle(line)}`}>
                    {line}
                  </div>
                ))}
                {index < entries.length - 1 && (
                  <div className="backroom-divider"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Fixed Bottom Section */}
        <div className="terminal-bottom-fixed">
          <div className="command-options">          
            <span className="command-option" onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}>
              {language === 'en' ? '中文' : 'English'}
            </span>
            {/* <span className="separator">✦</span> */}
            <span className="command-option" onClick={() => window.open('https://x.com/invertbox', '_blank')}>x.com/invertbox</span>
            {/* <span className="separator">✦</span> */}
            <span className="command-option" onClick={() => window.open('https://invertbox.fun', '_blank')}>InvertBox</span>
            {/* <span className="separator">✦</span> */}
            <span className="command-option" onClick={onBack}>{language === 'en' ? 'back to main' : '返回主页'}</span>
          </div>

          

          <div className="copyright">
            © 2025 InvertBox.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Backrooms;


