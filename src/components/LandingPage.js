import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import EasyGames from './EasyGames';
import HardGames from './HardGames';

const LandingPage = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [progressComplete, setProgressComplete] = useState(false);
  const [showInitLines, setShowInitLines] = useState(true);
  const [currentPage, setCurrentPage] = useState('main');
  const [solBalance, setSolBalance] = useState('25.8436');

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

  const initLines = [
    "lynq@invertbox:~$ ./initiate_showtime.sh",
    "[INFO] Showtime protocol initializing...",
    "[INFO] Syncing wallets...",
    "[INFO] Preparing game environment...",
    "[INFO] Booting LYNQ personality core...",
    "Establishing connection to LYNQ...",
    // "[INFO] You have successfully connected to LYNQ."
  ];

  const terminalLines = [
    "#######################################################################",
    "#                                                                     #",
    // "#                             .-^-.                                   #",
    // "#                            ( •_• )                                  #",
    // "#                            / >⌬< \\                                  #",
    // "#                            |______|                                 #",
    // "#                                                                     #",
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
    "#######################################################################",
    "",
    "lynq@invertbox:~$ cat welcome_message.txt",
    "",
    "Welcome, contestant.",
    "LYNQ — the showmaster, trader, and game host — is live.",
    "Play for SOL, win $LYNQ, and witness autonomous trades + challenges unfold.",
    "The stage is set. The prizes are real. The games are yours.",
    "",
    "lynq@invertbox:~$"
  ];

  const progressSteps = [
    "[=                   ] 10%  |▒                     |",
    "[===                 ] 25%  |▒▒▒                   |",
    "[=======             ] 50%  |▒▒▒▒▒▒▒               |",
    "[===========         ] 75%  |▒▒▒▒▒▒▒▒▒▒▒▒          |",
    "[=================== ] 99%  |▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒    |",
    "[====================] 100% |▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒|"
  ];

  useEffect(() => {
    // Fetch SOL balance on component mount
    fetchSolBalance();

    // Show initialization lines first
    const initTimer = setInterval(() => {
      setCurrentLine(prev => {
        if (prev < initLines.length - 1) {
          return prev + 1;
        } else {
          clearInterval(initTimer);
          // Start progress animation after init lines complete
          setTimeout(() => {
            setShowProgress(true);
            const progressTimer = setInterval(() => {
              setProgress(prevProgress => {
                if (prevProgress >= progressSteps.length - 1) {
                  clearInterval(progressTimer);
                  // Hide progress line and init lines after reaching 100%
                  setTimeout(() => {
                    setShowProgress(false);
                    setShowInitLines(false);
                    setProgressComplete(true);
                    // Start showing ASCII art after progress completes
                    const timer = setInterval(() => {
                      setCurrentLine(prev => {
                        if (prev < terminalLines.length - 1) {
                          return prev + 1;
                        } else {
                          setIsTyping(false);
                          return prev;
                        }
                      });
                    }, 200);
                    return () => clearInterval(timer);
                  }, 1000);
                  return prevProgress;
                }
                return prevProgress + 1;
              });
            }, 800);
          }, 500);
          return prev;
        }
      });
    }, 300);

    return () => clearInterval(initTimer);
  }, []);

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const handleBackToMain = () => {
    setCurrentPage('main');
  };

  // Render different pages based on currentPage state
  if (currentPage === 'easy-games') {
    return <EasyGames onBack={handleBackToMain} onNavigate={handleNavigation} solBalance={solBalance} />;
  }

  if (currentPage === 'hard-games') {
    return <HardGames onBack={handleBackToMain} onNavigate={handleNavigation} solBalance={solBalance} />;
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
            {showInitLines && initLines.slice(0, currentLine + 1).map((line, index) => {
              let className = 'terminal-line';
              
              if (line.includes('lynq@invertbox')) {
                className += ' prompt';
              } else if (line.includes('[INFO]')) {
                className += ' info';
              } else if (line.includes('Establishing connection')) {
                className += ' connection';
              }
              
              return (
                <div key={index} className={className}>
                  {line}
                  {index === currentLine && isTyping && <span className="cursor">█</span>}
                </div>
              );
            })}
            
            {showProgress && (
              <div className="terminal-line progress">
                {progressSteps[progress]}
                <span className="cursor">█</span>
              </div>
            )}
            
            {progressComplete && terminalLines.slice(0, currentLine + 1).map((line, index) => {
              let className = 'terminal-line';
              
              if (line.includes('lynq@invertbox')) {
                className += ' prompt';
              } else if (line.includes('[INFO]')) {
                className += ' info';
              } else if (line.includes('#')) {
                className += ' ascii';
              } else if (line.includes('Welcome, contestant') || line.includes('LYNQ — the showmaster') || line.includes('Play for SOL') || line.includes('The stage is set')) {
                className += ' welcome';
              }
              
              // Special handling for the cat command line
              if (line === "lynq@invertbox:~$ cat welcome_message.txt") {
                return (
                  <div key={index} className={className}>
                    lynq@invertbox:~$ cat <span style={{color: '#888888'}}>welcome_message.txt</span>
                    {index === currentLine && isTyping && <span className="cursor">█</span>}
                  </div>
                );
              }
              
              return (
                <div key={index} className={className}>
                  {line}
                  {index === currentLine && isTyping && <span className="cursor">█</span>}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Fixed Bottom Section */}
        <div className="terminal-bottom-fixed">
          <div className="command-options">
            <span className="command-option" onClick={() => handleNavigation('easy-games')}>easy games</span>
            <span className="separator">✦</span>
            <span className="command-option" onClick={() => handleNavigation('hard-games')}>hard games</span>
            <span className="separator">✦</span>
            <span className="command-option">curl x.com/invertbox</span>
            <span className="separator">✦</span>
            <span className="command-option">whatis InvertBox</span>
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
