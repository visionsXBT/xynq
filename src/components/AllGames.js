import React, { useState } from 'react';
import './EasyGames.css'; // Reuse the existing CSS

const AllGames = ({ onBack, onNavigate, solBalance }) => {
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [showHowTo, setShowHowTo] = useState(false);

  const easyBounties = [
    {
      id: 1,
      deadline: "Oct 3, 2025, 08:35 PM",
      title: "Hashtag Hunt",
      bounty: "0.25 SOL",
       difficulty: "EASY",
      description: "LYNQ posts a riddle that hints at a word. First to tweet the answer with #PlayWithLYNQ wins. Spreads the tag across X."
    },
    {
      id: 2,
      deadline: "Oct 3, 2025, 02:56 AM",
      title: "Meme Arena",
      bounty: "0.3 SOL",
       difficulty: "EASY",
      description: "LYNQ challenges contestants to make a meme about trading, AI, or Solana. Post it on X with @lynqfun tagged. Medium difficulty — creativity required. Funniest/most viral gets the prize."
    },
    {
      id: 3,
      deadline: "Oct 3, 2025, 02:56 AM",
      title: "Retweet to Survive",
      bounty: "0.2 SOL",
       difficulty: "EASY",
      description: "LYNQ says: 'I only live while connected to Solana. Keep me alive.' Retweet to keep LYNQ's 'energy' above 50%. Random retweeter is picked."
    },
    {
      id: 4,
      deadline: "Oct 3, 2025, 02:11 PM",
      title: "Signal Boost Speedrun",
      bounty: "0.25 SOL",
       difficulty: "EASY",
      description: "LYNQ posts a challenge. First 5 people to quote-tweet with the exact phrase (e.g. 'Everything in motion is parallel — LYNQ') get entered. Winner drawn from the 5."
    },
    {
      id: 5,
      deadline: "Oct 4, 2025, 12:00 PM",
      title: "Viral Cipher",
      bounty: "0.3 SOL",
       difficulty: "EASY",
      description: "LYNQ posts a cryptic string. Decode it → post the solution as a reply & tag 2 friends. First correct + tagged reply gets the prize."
    },
    {
      id: 6,
      deadline: "Oct 4, 2025, 06:00 PM",
      title: "Clip It, Win It",
      bounty: "0.25 SOL",
       difficulty: "EASY",
      description: "Players must post a screenshot or screen-recording of LYNQ's bash-prompt website with a caption. Share on X with #LYNQShowtime. Best post wins."
    },
    {
      id: 7,
      deadline: "Oct 5, 2025, 03:00 PM",
      title: "Parallel Prediction",
      bounty: "0.3 SOL",
       difficulty: "EASY",
      description: "Predict SOL's price in exactly 10 minutes. Post predictions publicly on X with @lynqfun. Closest gets the prize."
    },
    {
      id: 8,
      deadline: "Oct 5, 2025, 09:00 PM",
      title: "LYNQ Lottery",
      bounty: "0.25 SOL",
       difficulty: "EASY",
      description: "LYNQ gives a random code (like LYNQ-742). Players must tweet the code with #LYNQLottery. LYNQ picks one tweet at random."
    },
    {
      id: 9,
      deadline: "Oct 6, 2025, 01:00 PM",
      title: "Shill Showdown",
      bounty: "0.3 SOL",
       difficulty: "EASY",
      description: "Who can make the best promo thread about LYNQ being 'the first AI showmaster on Solana'? Post a thread, tag LYNQ. Most engaging one (likes/RTs) after 24h wins."
    },
    {
      id: 10,
      deadline: "Oct 6, 2025, 07:00 PM",
      title: "Word of Mouth War",
      bounty: "0.25 SOL",
       difficulty: "EASY",
      description: "LYNQ drops a secret phrase. First to get 5 different friends to reply that phrase under the game tweet wins."
    }
  ];

  const hardBounties = [
    {
      id: 11,
      deadline: "Oct 3, 2025, 08:35 PM",
      title: "The Mega Retweet Quest",
      bounty: "3 SOL",
       difficulty: "HARD",
      description: "LYNQ posts: 'Keep me alive. I need 2M retweets.' A contestant must organize, rally, or network until one of their quote-tweets of LYNQ breaks 2 million impressions."
    },
    {
      id: 12,
      deadline: "Oct 3, 2025, 02:56 AM",
      title: "The 5K Wall",
      bounty: "2.5 SOL",
       difficulty: "HARD",
      description: "Post anything about LYNQ (meme, thread, story) and hit 5,000 likes on a single tweet. "
    },
    {
      id: 13,
      deadline: "Oct 3, 2025, 02:56 AM",
      title: "Summon an Influencer",
      bounty: "3 SOL",
       difficulty: "HARD",
      description: "LYNQ dares players: 'Prove my existence to the giants.' Get a verified account with 1M+ followers to reply to or quote-tweet LYNQ."
    },
    {
      id: 14,
      deadline: "Oct 3, 2025, 02:11 PM",
      title: "The Trending Trial",
      bounty: "3 SOL",
       difficulty: "HARD",
      description: "Push #LYNQShowtime into the top 10 trending tags in a region."
    },
    {
      id: 15,
      deadline: "Oct 4, 2025, 12:00 PM",
      title: "Shill Thread Gauntlet",
      bounty: "2.5 SOL",
       difficulty: "HARD",
      description: "Write a LYNQ megathread (20 tweets) that passes 10,000 total engagement (likes + retweets + comments) in 48 hours."
    },
    {
      id: 16,
      deadline: "Oct 4, 2025, 06:00 PM",
      title: "The Million Eyes",
      bounty: "3 SOL",
       difficulty: "HARD",
      description: "Any single LYNQ-related tweet must reach 1,000,000 views."
    },
    {
      id: 17,
      deadline: "Oct 5, 2025, 03:00 PM",
      title: "Recruit the Legion",
      bounty: "2 SOL",
       difficulty: "HARD",
      description: "Bring 100 unique accounts to tweet about LYNQ in 24 hours, all tagged with #PlayWithLYNQ."
    },
    {
      id: 18,
      deadline: "Oct 5, 2025, 09:00 PM",
      title: "The Crossfire",
      bounty: "3 SOL",
       difficulty: "HARD",
      description: "Convince 3 different crypto influencers (50k+ followers each) to mention/tag LYNQ in one day."
    }
  ];

  // Combine all games
  const allGames = [...easyBounties, ...hardBounties];

  const completedBounties = [];
  const pendingBounties = [];
  const expiredBounties = [];

  const getBountiesByStatus = (status) => {
    switch (status) {
      case 'ACTIVE': return allGames;
      case 'COMPLETED': return completedBounties;
      case 'PENDING': return pendingBounties;
      case 'EXPIRED': return expiredBounties;
      default: return allGames;
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
          <div className="terminal-title">
            <img src="/typeface-transparent.png" alt="InvertBox" onClick={() => window.open('https://invertbox.fun', '_blank')} style={{cursor: 'pointer'}} />
          </div>
        </div>
        
        <div className="terminal-body">
          <div className="terminal-content">
            {/* Command Prompt */}
            <div className="terminal-line prompt">
              lynq@invertbox:~$ man all-games
            </div>

            {/* Rules Update Box */}
            <div className="rules-update-box">
              <div className="rules-title">All Games Rules Update</div>
              <div className="rules-text">
                Easy games are quick, fun contests with lower rewards but higher chances of winning. 
                Hard games are challenging contests with higher rewards but require significant effort and creativity. 
                Games include hashtag hunts, meme contests, viral mechanics, influencer networking, and mass coordination skills. 
                PENDING indicates a game is no longer active and is waiting on human verification, judgement, and payout.
              </div>
            </div>

            {/* How To Section */}
            <div className="how-to-section">
              <div className="how-to-header" onClick={() => setShowHowTo(!showHowTo)}>
                <span className="warning-icon">⚠</span>
                HOW TO PLAY GAMES ({showHowTo ? 'hide' : 'show'})
              </div>
              {showHowTo && (
                <div className="how-to-content">
                  <div className="how-to-step">Games are open for a limited time. When a game closes, submissions are reviewed, verified, and rewarded based on completion and authenticity. Entries submitted after a game's status changes to PENDING will not be considered. PENDING indicates that verification and payout are in progress.</div>
                  <div className="how-to-step">AI-generated submissions are strictly prohibited. If a participant cannot verify that their submission was created or performed manually, it will be disqualified.</div>
                  <div className="how-to-step">Proof of completion must always link directly to the wallet used to participate. Submissions that cannot be verified as belonging to the same participant will be rejected.</div>
                  <div className="how-to-step">All successful entries will be publicly announced, including proof of completion and associated wallet addresses. By participating, you consent to having your submission displayed as part of the game's record.</div>
                  <div className="how-to-step">To keep the system fair and participatory, a single wallet cannot win more than one game in a 24-hour cycle.</div>
                  <div className="how-to-step">Do not attempt challenges that involve illegal, dangerous, or unethical activities. Any game found to violate these conditions may be immediately removed by the development team.</div>
                  <div className="how-to-step">Rewards and payouts are subject to available funds. LYNQ must retain at least 1 SOL to remain operational. If LYNQ's balance falls below this threshold, payouts may be delayed until sufficient funds are restored.</div>
                  <div className="how-to-step">Games and bounties are not promises and all rewards are distributed at the system's sole discretion. LYNQ is an ongoing experiment, and the program may change or shut down at any time without notice.</div>
                  <div className="how-to-step">Submit your entry via sending email to lynq@invertbox.fun</div>
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
                 <div className="bounty-column">DIFFICULTY</div>
               </div>
               
               {currentBounties.map(bounty => (
                 <div key={bounty.id} className="bounty-row">
                   <div className="bounty-cell deadline">{bounty.deadline}</div>
                   <div className="bounty-cell title">
                     <div className="bounty-title">{bounty.title}</div>
                     <div className="bounty-description">{bounty.description}</div>
                   </div>
                   <div className="bounty-cell bounty">{bounty.bounty}</div>
                   <div className="bounty-cell difficulty">
                     <span className={`difficulty-badge ${bounty.difficulty.toLowerCase()}`}>
                       {bounty.difficulty}
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
            <span className="command-option" onClick={() => window.open('https://x.com/invertbox', '_blank')}>x.com/invertbox</span>
            <span className="separator">✦</span>
            <span className="command-option" onClick={() => window.open('https://invertbox.fun', '_blank')}>InvertBox</span>
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

export default AllGames;
