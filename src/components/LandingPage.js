import React, { useState, useEffect, useMemo } from 'react';
import './LandingPage.css';
import Backrooms from './Backrooms';
import TradingBot from './TradingBot';
import TypingText from './TypingText';
import useScreenWidth from '../hooks/useScreenWidth';

const LandingPage = () => {
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState('main');
  const [solBalance, setSolBalance] = useState('25.8436');
  const [animationPhase, setAnimationPhase] = useState('init'); // 'init', 'progress', 'terminal'
  const [initComplete, setInitComplete] = useState(false);
  const [terminalComplete, setTerminalComplete] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' or 'zh'
  const { screenWidth, isMobile, isTablet, isLaptop, isDesktop } = useScreenWidth();

  // Translation content
  const translations = {
    en: {
      initLines: [
        "xynq@invertbox:~$ ./initiate_trade.sh",
        "[INFO] Trading protocol initializing...",
        "[INFO] Syncing wallets...",
        "[INFO] Preparing trading environment...",
        "[INFO] Booting XYNQ personality core...",
        "Establishing connection to XYNQ...",
        // "[INFO] You have successfully connected to XYNQ."
      ],
      terminalLines: [
        "Welcome, trader.",
        "XYNQ — the master trader.",
        "XYNQ lives in the BNB ecosystem, learning from my friend LYNQ on how to do trades.",
        "Now, I am here to dominate the market.",
        "",
        "xynq@invertbox:~$"
      ],
      navigation: {
        xcom: "x.com/invertbox",
        invertbox: "InvertBox",
        backrooms: "backrooms",
        trading: "trading bot"
      }
    },
    zh: {
      initLines: [
        "xynq@invertbox:~$ ./initiate_trade.sh",
        "[信息] 交易协议初始化中...",
        "[信息] 同步钱包...",
        "[信息] 准备交易环境...",
        "[信息] 启动XYNQ人格核心...",
        "正在建立与XYNQ的连接...",
        // "[信息] 您已成功连接到XYNQ。"
      ],
      terminalLines: [
        "欢迎，交易者。",
        "XYNQ — 交易大师。",
        "XYNQ生活在BNB生态系统中，向我的朋友LYNQ学习如何进行交易。",
        "现在，我在这里统治市场。",
        "",
        "xynq@invertbox:~$"
      ],
      navigation: {
        xcom: "x.com/invertbox",
        invertbox: "InvertBox",
        backrooms: "密室",
        trading: "交易机器人"
      }
    }
  };

  // Helper function to get line style
  const getInitLineStyle = (line) => {
    if (line.includes('xynq@invertbox')) return 'prompt';
    if (line.includes('[INFO]') || line.includes('[信息]')) return 'info';
    if (line.includes('Establishing connection') || line.includes('正在建立与XYNQ的连接')) return 'connection';
    return '';
  };

  const getTerminalLineStyle = (line) => {
    if (line.includes('xynq@invertbox')) return 'prompt';
    if (line.includes('[INFO]') || line.includes('[信息]')) return 'info';
    if (line.includes('#')) return 'ascii';
    // English patterns
    if (line.includes('Welcome, contestant') || line.includes('XYNQ — the showmaster') || line.includes('Play for SOL') || line.includes('The stage is set')) return 'welcome';
    // Chinese patterns
    if (line.includes('欢迎，交易者') || line.includes('XYNQ — 交易大师') || line.includes('XYNQ生活在BNB生态系统中') || line.includes('现在，我在这里统治市场')) return 'welcome';
    return '';
  };

  // Fetch SOL balance
  const fetchSolBalance = async () => {
    try {
      console.log('Starting SOL balance fetch...');
      const address = process.env.REACT_APP_XYNQ_ADDRESS;
      console.log('Fetching balance for address:', address);
      const rpcUrl = process.env.REACT_APP_SOLANA_RPC_URL;
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [address]
        })
      });
      
      const data = await response.json();
      console.log('RPC response:', data);
      
      if (data.result && data.result.value !== undefined) {
        const balanceInSol = Number(data.result.value) / 1_000_000_000;
        console.log('Balance in SOL:', balanceInSol);
        setSolBalance(balanceInSol.toFixed(4));
        console.log('Balance updated to:', balanceInSol.toFixed(4));
      } else {
        console.error('Invalid response format:', data);
      }
    } catch (error) {
      console.error('Error fetching SOL balance:', error);
      // Keep default balance if fetch fails
    }
  };

  const initLines = useMemo(() => translations[language].initLines, [language]);

  // Full detailed ASCII art - responsive through CSS scaling
  const getAsciiArt = () => {
    return [
      "#######################################################################",
      "#                                                                     #",
      "#                               /╲_╱\\                                 #",
      "#                              ( •ᴥ• )                                #",
      "#                              / >₿< \\                                #",
      "#                                                                     #",
      "#               ██╗  ██╗  ██╗   ██╗  ███╗   ██╗   ██████╗             #",
      "#               ╚██╗██╔╝  ╚██╗ ██╔╝  ████╗  ██║  ██╔═══██╗            #",
      "#                ╚███╔╝    ╚████╔╝   ██╔██╗ ██║  ██║   ██║            #",
      "#                ██╔██╗     ╚██╔╝    ██║╚██╗██║  ██║▄▄ ██║            #",
      "#               ██╔╝ ██╗     ██║     ██║ ╚████║  ╚██████╔╝            #",
      "#               ╚═╝  ╚═╝     ╚═╝     ╚═╝  ╚═══╝   ╚══▀▀═╝             #",
      "#                                                                     #",
      "#               YOU ARE NOW SUCCESSFULLY COMMUNICATING WITH           #",
      "#                                                                     #",
      "#                               XYNQ                                  #",
      "#######################################################################"
    ];
  };

  const terminalLines = useMemo(() => [
    ...getAsciiArt(),
    "",
    language === 'zh' ? "xynq@invertbox:~$ cat 欢迎信息.txt" : "xynq@invertbox:~$ cat welcome_message.txt",
    "",
    ...translations[language].terminalLines
  ], [language]);

  const progressSteps = useMemo(() => [
    "[=                   ] 10%  |▒                     |",
    "[===                 ] 25%  |▒▒▒                   |",
    "[=======             ] 50%  |▒▒▒▒▒▒▒               |",
    "[===========         ] 75%  |▒▒▒▒▒▒▒▒▒▒▒▒          |",
    "[=================== ] 99%  |▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒    |",
    "[====================] 100% |▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒|"
  ], []);

  useEffect(() => {
    // Fetch SOL balance on component mount
    fetchSolBalance();
  }, []);

  // Handle animation phase transitions
  useEffect(() => {
    if (initComplete && animationPhase === 'init') {
      // Move to progress phase
      setAnimationPhase('progress');
      setTimeout(() => {
        // Start progress animation
        const progressTimer = setInterval(() => {
          setProgress(prevProgress => {
            if (prevProgress >= progressSteps.length - 1) {
              clearInterval(progressTimer);
              // Move to terminal phase
              setTimeout(() => {
                setAnimationPhase('terminal');
              }, 1000);
              return prevProgress;
            }
            return prevProgress + 1;
          });
        }, 800);
      }, 500);
    }
  }, [initComplete, animationPhase]);

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const handleBackToMain = () => {
    setCurrentPage('main');
  };

  // Render different pages based on currentPage state
  if (currentPage === 'backrooms') {
    return <Backrooms onBack={handleBackToMain} onNavigate={handleNavigation} solBalance={solBalance} language={language} setLanguage={setLanguage} />;
  }
  if (currentPage === 'trading') {
    return <TradingBot onBack={handleBackToMain} language={language} setLanguage={setLanguage} />;
  }

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
          <div className="terminal-content">
            {animationPhase === 'init' && (
              <TypingText
                key="init-phase"
                lines={initLines}
                typingSpeed={30}
                lineDelay={100}
                getLineStyle={getInitLineStyle}
                onComplete={() => setInitComplete(true)}
              />
            )}
            
            {animationPhase === 'progress' && (
              <div className="terminal-line progress">
                {progressSteps[progress]}
                <span className="cursor">█</span>
              </div>
            )}
            
            {animationPhase === 'terminal' && (
              <TypingText
                key="terminal-phase"
                lines={terminalLines}
                typingSpeed={5}
                lineDelay={25}
                getLineStyle={getTerminalLineStyle}
                onComplete={() => setTerminalComplete(true)}
              />
            )}
          </div>
        </div>
        
        {/* Fixed Bottom Section */}
        <div className="terminal-bottom-fixed">
          <div className="command-options">
            <span className="command-option" onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}>
              {language === 'en' ? '中文' : 'English'}
            </span>
            {/* <span className="separator">✦</span> */}
            <span className="command-option" onClick={() => window.open('https://x.com/invertbox', '_blank')}>{translations[language].navigation.xcom}</span>
            {/* <span className="separator">✦</span> */}
            <span className="command-option" onClick={() => window.open('https://invertbox.fun', '_blank')}>{translations[language].navigation.invertbox}</span>
            {/* <span className="separator">✦</span> */}
            <span className="command-option" onClick={() => handleNavigation('backrooms')}>{translations[language].navigation.backrooms}</span>
            {/* <span className="separator">✦</span> */}
            <span className="command-option" onClick={() => handleNavigation('trading')}>{translations[language].navigation.trading}</span>
          </div>
          
          
          <div className="copyright">
            © 2025 InvertBox.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
