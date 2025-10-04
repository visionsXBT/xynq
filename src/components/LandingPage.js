import React, { useState, useEffect, useMemo } from 'react';
import './LandingPage.css';
import AllGames from './AllGames';
import TypingText from './TypingText';
import useScreenWidth from '../hooks/useScreenWidth';

const LandingPage = () => {
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState('main');
  const [solBalance, setSolBalance] = useState('25.8436');
  const [animationPhase, setAnimationPhase] = useState('init'); // 'init', 'progress', 'terminal'
  const [initComplete, setInitComplete] = useState(false);
  const [terminalComplete, setTerminalComplete] = useState(false);
  const { screenWidth, isMobile, isTablet, isLaptop, isDesktop } = useScreenWidth();

  // Helper function to get line style
  const getInitLineStyle = (line) => {
    if (line.includes('lynq@invertbox')) return 'prompt';
    if (line.includes('[INFO]')) return 'info';
    if (line.includes('Establishing connection')) return 'connection';
    return '';
  };

  const getTerminalLineStyle = (line) => {
    if (line.includes('lynq@invertbox')) return 'prompt';
    if (line.includes('[INFO]')) return 'info';
    if (line.includes('#')) return 'ascii';
    if (line.includes('Welcome, contestant') || line.includes('LYNQ — the showmaster') || line.includes('Play for SOL') || line.includes('The stage is set')) return 'welcome';
    return '';
  };

  // Fetch SOL balance
  const fetchSolBalance = async () => {
    try {
      console.log('Starting SOL balance fetch...');
      const address = process.env.REACT_APP_LYNQ_ADDRESS;
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

  const initLines = useMemo(() => [
    "lynq@invertbox:~$ ./initiate_showtime.sh",
    "[INFO] Showtime protocol initializing...",
    "[INFO] Syncing wallets...",
    "[INFO] Preparing game environment...",
    "[INFO] Booting LYNQ personality core...",
    "Establishing connection to LYNQ...",
    // "[INFO] You have successfully connected to LYNQ."
  ], []);

  // Full detailed ASCII art - responsive through CSS scaling
  const getAsciiArt = () => {
    return [
      "#######################################################################",
      "#                                                                     #",
      "#                             .-^-.                                   #",
      "#                            ( ✦‿✦)                                  #",
      "#                            / >⌬< \\                                  #",
      "#                            |______|                                 #",
      "#                                                                     #",
      "#   		██      ██    ██ ██     ██     ██████                 #",
      "#   		██       ██  ██  ████    ██  ██      ██               #",
      "#   		██       ██  ██  ██  ██  ██  ██      ██               #",
      "#  		██       ██  ██  ██  ██  ██  ██      ██               #",
      "#   		██         ██    ██  ██  ██  ██      ██               #",
      "#   		██         ██    ██    ████  ██     ██		      #",
      "#    	 	 ██████    ██    ██      ██    ██████ ██              #",
      "#                                                                     #",
      "#               YOU ARE NOW SUCCESSFULLY COMMUNICATING WITH           #",
      "#                                                                     #",
      "#                               LYNQ                                  #",
      "#######################################################################"
    ];
  };

  const terminalLines = useMemo(() => [
    ...getAsciiArt(),
    "",
    "lynq@invertbox:~$ cat welcome_message.txt",
    "",
    "Welcome, contestant.",
    "LYNQ — the showmaster, trader, and game host — is live.",
    "Play for SOL, win $LYNQ, and a random holder receives 1$ every 10 minutes + challenges unfold.",
    "The stage is set. The prizes are real. The games are yours.",
    "",
    "lynq@invertbox:~$"
  ], []);

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
  if (currentPage === 'games') {
    return <AllGames onBack={handleBackToMain} onNavigate={handleNavigation} solBalance={solBalance} />;
  }

  return (
    <div className="terminal-page">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-controls">
            <div className="control close"></div>
            <div className="control minimize"></div>
            <div className="control maximize"></div>
          </div>
          <div className="terminal-title">LYNQ</div>
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
            <span className="command-option" onClick={() => handleNavigation('games')}>games</span>
            <span className="separator">✦</span>
            <span className="command-option">x.com/invertbox</span>
            <span className="separator">✦</span>
            <span className="command-option">InvertBox</span>
          </div>
          
          <div className="balance-display">
            Current Sol Balance: <span className="balance-amount">{solBalance} SOL</span>
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
