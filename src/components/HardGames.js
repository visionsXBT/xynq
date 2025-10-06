import React, { useState } from 'react';
import './HardGames.css';

const HardGames = ({ onBack, onNavigate, solBalance }) => {
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [showHowTo, setShowHowTo] = useState(false);

  const hardBounties = [
    {
      id: 1,
      deadline: "Oct 3, 2025, 08:35 PM",
      title: "The Mega Retweet Quest",
      bounty: "3 SOL",
      status: "ACTIVE",
      description: "LYNQ posts: 'Keep me alive. I need 2M retweets.' A contestant must organize, rally, or network until one of their quote-tweets of LYNQ breaks 2 million impressions. Requires mass coordination, viral spread, or reaching influencer tiers."
    },
    {
      id: 2,
      deadline: "Oct 3, 2025, 02:56 AM",
      title: "The 5K Wall",
      bounty: "2.5 SOL",
      status: "ACTIVE",
      description: "Post anything about LYNQ (meme, thread, story) and hit 5,000 likes on a single tweet. "
    },
    {
      id: 3,
      deadline: "Oct 3, 2025, 02:56 AM",
      title: "Summon an Influencer",
      bounty: "3 SOL",
      status: "ACTIVE",
      description: "LYNQ dares players: 'Prove my existence to the giants.' Get a verified account with 1M+ followers to reply to or quote-tweet LYNQ. Requires network clout, DM'ing, campaigning, or sheer luck."
    },
    {
      id: 4,
      deadline: "Oct 3, 2025, 02:11 PM",
      title: "The Trending Trial",
      bounty: "3 SOL",
      status: "ACTIVE",
      description: "Push #LYNQShowtime into the top 10 trending tags in a region. Needs mass player recruitment + timing, like a digital flash mob."
    },
    {
      id: 5,
      deadline: "Oct 4, 2025, 12:00 PM",
      title: "Shill Thread Gauntlet",
      bounty: "2.5 SOL",
      status: "ACTIVE",
      description: "Write a LYNQ megathread (20 tweets) that passes 10,000 total engagement (likes + retweets + comments) in 48 hours. Content quality + viral mechanics + marketing skill all required."
    },
    {
      id: 6,
      deadline: "Oct 4, 2025, 06:00 PM",
      title: "The Million Eyes",
      bounty: "3 SOL",
      status: "ACTIVE",
      description: "Any single LYNQ-related tweet must reach 1,000,000 views. Brutal reach requirement — only truly viral posts will work."
    },
    {
      id: 7,
      deadline: "Oct 5, 2025, 03:00 PM",
      title: "Recruit the Legion",
      bounty: "2 SOL",
      status: "ACTIVE",
      description: "Bring 100 unique accounts to tweet about LYNQ in 24 hours, all tagged with #PlayWithLYNQ. Requires building a movement, not just posting."
    },
    {
      id: 8,
      deadline: "Oct 5, 2025, 09:00 PM",
      title: "The Crossfire",
      bounty: "3 SOL",
      status: "ACTIVE",
      description: "Convince 3 different crypto influencers (50k+ followers each) to mention/tag LYNQ in one day. You're basically running PR for LYNQ, live."
    }
  ];

  const completedBounties = [];

  const pendingBounties = [];

  const expiredBounties = [];

  const getBountiesByStatus = (status) => {
    switch (status) {
      case 'ACTIVE': return hardBounties;
      case 'COMPLETED': return completedBounties;
      case 'PENDING': return pendingBounties;
      case 'EXPIRED': return expiredBounties;
      default: return hardBounties;
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
          <div className="terminal-title">LYNQ - HARD GAMES</div>
        </div>
        
        <div className="terminal-body">
          <div className="terminal-content">
            {/* Command Prompt */}
            <div className="terminal-line prompt">
              lynq@invertbox:~$ man hard-games
            </div>

            {/* Rules Update Box */}
            <div className="rules-update-box">
              <div className="rules-title">Hard Games Rules Update</div>
              <div className="rules-text">
                Hard games are challenging contests with higher rewards but require significant effort and creativity. 
                These games test viral mechanics, influencer networking, and mass coordination skills. 
                Games include mega retweet quests, trending trials, and influencer summoning challenges. 
                PENDING indicates a game is no longer active and is waiting on human verification, judgement, and payout.
              </div>
            </div>

            {/* How To Section */}
            <div className="how-to-section">
              <div className="how-to-header" onClick={() => setShowHowTo(!showHowTo)}>
                <span className="warning-icon">⚠</span>
                HOW TO PLAY HARD GAMES ({showHowTo ? 'hide' : 'show'})
              </div>
              {showHowTo && (
                <div className="how-to-content">
                  <div className="how-to-step">1. Choose an active hard game from the list below</div>
                  <div className="how-to-step">2. Complete the challenging requirements exactly as specified</div>
                  <div className="how-to-step">3. Submit your entry via sending email to lynq@invertbox.fun</div>
                  <div className="how-to-step">4. First valid submission wins the SOL reward</div>
                  <div className="how-to-step">5. Winners are announced within 24 hours</div>
                  <div className="how-to-step">6. Hard games require creativity, effort, and sometimes luck</div>
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
            <span className="command-option" onClick={() => onNavigate && onNavigate('easy-games')}>easy games</span>
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

export default HardGames;
