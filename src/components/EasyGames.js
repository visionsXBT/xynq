import React, { useState } from 'react';
import './EasyGames.css';

const EasyGames = ({ onBack, onNavigate, solBalance }) => {
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [showHowTo, setShowHowTo] = useState(false);

  const easyBounties = [
    {
      id: 1,
      deadline: "Oct 3, 2025, 08:35 PM",
      title: "Hashtag Hunt",
      bounty: "0.25 SOL",
      status: "ACTIVE",
      description: "LYNQ posts a riddle that hints at a word. First to tweet the answer with #PlayWithLYNQ wins. Spreads the tag across X."
    },
    {
      id: 2,
      deadline: "Oct 3, 2025, 02:56 AM",
      title: "Meme Arena",
      bounty: "0.3 SOL",
      status: "ACTIVE",
      description: "LYNQ challenges contestants to make a meme about trading, AI, or Solana. Post it on X with @lynqfun tagged. Medium difficulty — creativity required. Funniest/most viral gets the prize."
    },
    {
      id: 3,
      deadline: "Oct 3, 2025, 02:56 AM",
      title: "Retweet to Survive",
      bounty: "0.2 SOL",
      status: "ACTIVE",
      description: "LYNQ says: 'I only live while connected to Solana. Keep me alive.' Retweet to keep LYNQ's 'energy' above 50%. Random retweeter is picked."
    },
    {
      id: 4,
      deadline: "Oct 3, 2025, 02:11 PM",
      title: "Signal Boost Speedrun",
      bounty: "0.25 SOL",
      status: "ACTIVE",
      description: "LYNQ posts a challenge. First 5 people to quote-tweet with the exact phrase (e.g. 'Everything in motion is parallel — LYNQ') get entered. Winner drawn from the 5."
    },
    {
      id: 5,
      deadline: "Oct 4, 2025, 12:00 PM",
      title: "Viral Cipher",
      bounty: "0.3 SOL",
      status: "ACTIVE",
      description: "LYNQ posts a cryptic string. Decode it → post the solution as a reply & tag 2 friends. First correct + tagged reply gets the prize."
    },
    {
      id: 6,
      deadline: "Oct 4, 2025, 06:00 PM",
      title: "Clip It, Win It",
      bounty: "0.25 SOL",
      status: "ACTIVE",
      description: "Players must post a screenshot or screen-recording of LYNQ's bash-prompt website with a caption. Share on X with #LYNQShowtime. Best post wins."
    },
    {
      id: 7,
      deadline: "Oct 5, 2025, 03:00 PM",
      title: "Parallel Prediction",
      bounty: "0.3 SOL",
      status: "ACTIVE",
      description: "Predict SOL's price in exactly 10 minutes. Post predictions publicly on X with @lynqfun. Closest gets the prize."
    },
    {
      id: 8,
      deadline: "Oct 5, 2025, 09:00 PM",
      title: "LYNQ Lottery",
      bounty: "0.25 SOL",
      status: "ACTIVE",
      description: "LYNQ gives a random code (like LYNQ-742). Players must tweet the code with #LYNQLottery. LYNQ picks one tweet at random."
    },
    {
      id: 9,
      deadline: "Oct 6, 2025, 01:00 PM",
      title: "Shill Showdown",
      bounty: "0.3 SOL",
      status: "ACTIVE",
      description: "Who can make the best promo thread about LYNQ being 'the first AI showmaster on Solana'? Post a thread, tag LYNQ. Most engaging one (likes/RTs) after 24h wins."
    },
    {
      id: 10,
      deadline: "Oct 6, 2025, 07:00 PM",
      title: "Word of Mouth War",
      bounty: "0.25 SOL",
      status: "ACTIVE",
      description: "LYNQ drops a secret phrase. First to get 5 different friends to reply that phrase under the game tweet wins."
    }
  ];

  const completedBounties = [];

  const pendingBounties = [];

  const expiredBounties = [];

  const getBountiesByStatus = (status) => {
    switch (status) {
      case 'ACTIVE': return easyBounties;
      case 'COMPLETED': return completedBounties;
      case 'PENDING': return pendingBounties;
      case 'EXPIRED': return expiredBounties;
      default: return easyBounties;
    }
  };

  const currentBounties = getBountiesByStatus(activeTab);

  return (
    <div className="terminal-page">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-controls">
            <div className="control close" onClick={onBack}></div>
            <div className="control minimize"></div>
            <div className="control maximize"></div>
          </div>
          <div className="terminal-title">LYNQ - EASY GAMES</div>
        </div>
        
        <div className="terminal-body">
          <div className="terminal-content">
            {/* Command Prompt */}
            <div className="terminal-line prompt">
              lynq@invertbox:~$ man easy-games
            </div>

            {/* Rules Update Box */}
            <div className="rules-update-box">
              <div className="rules-title">Easy Games Rules Update</div>
              <div className="rules-text">
                Easy games are quick, fun contests with lower rewards but higher chances of winning. 
                Most games are first-come-first-served or randomly selected winners. 
                Games include hashtag hunts, meme contests, retweet challenges, and viral ciphers. 
                PENDING indicates a game is no longer active and is waiting on human verification, judgement, and payout.
              </div>
            </div>

            {/* How To Section */}
            <div className="how-to-section">
              <div className="how-to-header" onClick={() => setShowHowTo(!showHowTo)}>
                <span className="warning-icon">⚠</span>
                HOW TO PLAY EASY GAMES ({showHowTo ? 'hide' : 'show'})
              </div>
              {showHowTo && (
                <div className="how-to-content">
                  <div className="how-to-step">1. Choose an active game from the list below</div>
                  <div className="how-to-step">2. Complete the requirements exactly as specified</div>
                  <div className="how-to-step">3. Submit your entry via sending email to lynq@invertbox.fun</div>
                  <div className="how-to-step">4. First valid submission wins the SOL reward</div>
                  <div className="how-to-step">5. Winners are announced within 24 hours</div>
                </div>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
              {['ACTIVE', 'COMPLETED', 'PENDING', 'EXPIRED'].map(tab => (
                <button
                  key={tab}
                  className={`filter-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Bounty Board */}
            <div className="bounty-board">
              <div className="bounty-header">
                <div className="bounty-column">DEADLINE</div>
                <div className="bounty-column">TITLE</div>
                <div className="bounty-column">BOUNTY</div>
                <div className="bounty-column">STATUS</div>
              </div>
              
              {currentBounties.map(bounty => (
                <div key={bounty.id} className="bounty-row">
                  <div className="bounty-cell deadline">{bounty.deadline}</div>
                  <div className="bounty-cell title">
                    <div className="bounty-title">{bounty.title}</div>
                    <div className="bounty-description">{bounty.description}</div>
                  </div>
                  <div className="bounty-cell bounty">{bounty.bounty}</div>
                  <div className="bounty-cell status">
                    <span className={`status-badge ${bounty.status.toLowerCase()}`}>
                      {bounty.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Fixed Bottom Section */}
        <div className="terminal-bottom-fixed">
          <div className="command-options">
            <span className="command-option" onClick={onBack}>back to main</span>
            <span className="separator">✦</span>
            <span className="command-option" onClick={() => onNavigate && onNavigate('hard-games')}>hard games</span>
            <span className="separator">✦</span>
            <span className="command-option" onClick={() => window.open('https://x.com/invertbox', '_blank')}>x.com/invertbox</span>
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

export default EasyGames;
