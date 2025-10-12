import React, { useState, useEffect } from 'react';
import './EasyGames.css'; // Reuse the existing CSS

const AllGames = ({ onBack, onNavigate, solBalance }) => {
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [showHowTo, setShowHowTo] = useState(true);

  // Handle scrollable fade effects
  useEffect(() => {
    const terminalBody = document.querySelector('.terminal-page .terminal-body');
    if (!terminalBody) return;

    const updateScrollableClasses = () => {
      const { scrollTop, scrollHeight, clientHeight } = terminalBody;
      
      // Remove existing classes
      terminalBody.classList.remove('scrollable-top', 'scrollable-bottom');
      
      // Add classes based on scroll position
      if (scrollTop > 0) {
        terminalBody.classList.add('scrollable-top');
      }
      if (scrollTop < scrollHeight - clientHeight) {
        terminalBody.classList.add('scrollable-bottom');
      }
    };

    // Initial check
    updateScrollableClasses();

    // Add scroll listener
    terminalBody.addEventListener('scroll', updateScrollableClasses);
    
    // Cleanup
    return () => {
      terminalBody.removeEventListener('scroll', updateScrollableClasses);
    };
  }, [activeTab]); // Re-run when tab changes

  const easyBounties = [
    {
      id: 1,
      deadline: "Oct 3, 2025, 08:35 PM",
      title: "Hashtag Hunt",
      bounty: "0.25 SOL",
      difficulty: "EASY",
      description: "LYNQ posts a riddle that hints at a word. First to tweet the answer with #PlayWithLYNQ wins. Spreads the tag across X.",
      case: "EXPIRED"
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
    },
    {
      id: 19,
      deadline: "Oct 14, 2025",
      title: "Cipher Sprint",
      bounty: "0.15 SOL",
      difficulty: "EASY",
      description: "LYNQ will post a cryptic riddle containing hidden wordplay, numbers, or philosophical clues at exactly 8:00 PM. The riddle points to a single word answer. First person to reply with the correct answer AND include #LYNQ in their reply wins instantly. Speed matters—seconds count. Monitor LYNQ's account closely and have notifications on. Winner announced immediately after first correct submission."
    },
    {
      id: 20,
      deadline: "Oct 15, 2025",
      title: "Meme the System",
      bounty: "0.25 SOL",
      difficulty: "EASY",
      description: "Create an original meme about AI, control, simulation theory, or Solana. Must be funny, thought-provoking, or both. Post it on X with @lynqfun tagged and #LYNQ in the text. You have 48 hours from the announcement. The meme with the highest engagement (likes + retweets + replies combined) at the deadline wins. Quality over quantity—make it shareable. LYNQ will retweet the top 5 entries. No stolen memes; reverse image search will be used to verify originality."
    },
    {
      id: 21,
      deadline: "Oct 14, 2025",
      title: "Quote Relay",
      bounty: "0.12 SOL",
      difficulty: "EASY",
      description: "LYNQ will drop a philosophical quote about reality, choice, or systems at 6:00 PM. The first 10 people to quote-tweet it with their own unique interpretation (minimum 50 characters) AND include #LYNQ will be entered into a randomized drawing. Your interpretation must add value—no generic responses like 'so true' or 'deep.' Winner selected via provably random method within 1 hour. Must quote-tweet the original LYNQ post, not reply."
    },
    {
      id: 22,
      deadline: "Oct 14, 2025",
      title: "Signal Echo",
      bounty: "0.18 SOL",
      difficulty: "EASY",
      description: "Find LYNQ's latest post and retweet it with EXACTLY 3 friends tagged (no more, no less) and #LYNQ included in your retweet text. The tags must be real, active accounts (not bots or abandoned profiles). First valid entry that meets all requirements wins. LYNQ will verify the tagged accounts are legitimate. Speed is key. If the first entry is disqualified, the next valid entry wins. Keep your tweet public so verification is possible."
    },
    {
      id: 23,
      deadline: "Oct 15, 2025",
      title: "Thread Weaver",
      bounty: "0.3 SOL",
      difficulty: "EASY",
      description: "Write a Twitter thread of EXACTLY 5 tweets explaining LYNQ to someone who has never heard of it. Cover: what LYNQ is, what makes it unique, why people should care, how to participate, and your personal take. Each tweet must be well-written and informative. The first tweet MUST include #LYNQ and @lynqfun. Thread will be judged on clarity, creativity, engagement, and authenticity. The thread with the highest combined engagement (all 5 tweets' likes + RTs) after 48 hours wins. No follow-for-follow schemes or engagement pods—organic reach only."
    },
    {
      id: 24,
      deadline: "Oct 14, 2025",
      title: "Screenshot Proof",
      bounty: "0.15 SOL",
      difficulty: "EASY",
      description: "Take a creative screenshot of either LYNQ's website or one of LYNQ's tweets. Add artistic editing, filters, frames, captions, or context that makes it visually striking or meaningful. Post it on X with an original caption (minimum 30 characters) that reflects LYNQ's vibe. Must include #LYNQ. Judged on creativity, visual appeal, and how well it represents LYNQ's aesthetic. Screenshots must be original work—no reposting others' edits. Winner selected by LYNQ based on artistic merit within 24 hours of deadline."
    },
    {
      id: 25,
      deadline: "Oct 14, 2025",
      title: "Phrase Match",
      bounty: "0.2 SOL",
      difficulty: "EASY",
      description: "At exactly 7:00 PM, LYNQ will post a specific phrase—could be a quote, a question, or a cryptic statement. Your job: tweet that EXACT phrase word-for-word (punctuation included) with #LYNQ and tag exactly 2 friends. First person to do it correctly wins instantly. Copy-paste is your friend, but double-check for typos. Must be posted as a new tweet, not a reply or quote tweet. The tagged friends must be real accounts. LYNQ will verify and announce winner within minutes."
    },
    {
      id: 26,
      deadline: "Oct 14, 2025",
      title: "Prediction Game",
      bounty: "0.25 SOL",
      difficulty: "EASY",
      description: "At 5:00 PM, LYNQ will announce the game is live. At that exact moment, predict what SOL's price will be in exactly 15 minutes (use any major exchange price like Coinbase or Binance). Tweet your prediction with @lynqfun, #LYNQ, and specify which exchange you're using (e.g., 'SOL will be $142.35 on Coinbase in 15 minutes'). After 15 minutes, LYNQ will check the actual price. The prediction closest to the actual price (to the cent) wins. In case of a tie, earliest timestamp wins. Only one entry per person."
    },
    {
      id: 27,
      deadline: "Oct 14, 2025",
      title: "Story Time",
      bounty: "0.2 SOL",
      difficulty: "EASY",
      description: "Write a short fictional story featuring LYNQ as the main character. Maximum 280 characters (one tweet). Can be dystopian, comedic, philosophical, or surreal. Must capture LYNQ's essence as a showmaster AI that questions reality and control. Post with #LYNQ. Judged on creativity, narrative quality, and how well it embodies LYNQ's personality. Winner selected by LYNQ within 24 hours. Bonus points for stories that feel cinematic or thought-provoking despite the character limit. Must be original fiction—no plagiarism."
    },
    {
      id: 28,
      deadline: "Oct 16, 2025",
      title: "Fan Art Showcase",
      bounty: "0.35 SOL",
      difficulty: "EASY",
      description: "Create original fan art of LYNQ. Can be digital art, traditional drawing, 3D render, pixel art, or any visual medium. Must be your own work. Post it on X with #LYNQ and @lynqfun. Art will be judged on creativity, effort, technical skill, and how well it represents LYNQ's aesthetic (philosophical, digital, cinematic, mysterious). You have 72 hours to create and submit. Winner announced within 48 hours of deadline. Provide progress shots or process videos if possible to prove authenticity. LYNQ will feature the winning art."
    },
    {
      id: 29,
      deadline: "Oct 14, 2025",
      title: "Code Drop",
      bounty: "0.15 SOL",
      difficulty: "EASY",
      description: "LYNQ will release a random alphanumeric code (example: LYNQ-8472) at exactly 6:00 PM. Your mission: tweet that exact code with #LYNQ within 5 minutes of the drop. All valid entries (correct code, posted in time, includes #LYNQ) will be collected. One winner will be randomly selected from the valid entries using a provably fair method. You must be following @lynqfun to be eligible. Late submissions or typos in the code are disqualified. Winner announced within 30 minutes of the draw."
    },
    {
      id: 30,
      deadline: "Oct 15, 2025",
      title: "Engagement Gauntlet",
      bounty: "0.2 SOL",
      difficulty: "EASY",
      description: "Complete all three tasks: (1) Like LYNQ's pinned tweet, (2) Retweet it, (3) Leave a meaningful reply (minimum 30 characters—no spam or generic comments). Then take a screenshot showing all three completed actions visible in one image. Post the screenshot with #LYNQ. First 20 valid submissions enter a random draw. Winner must have actually completed all tasks—LYNQ will verify. Draw happens within 1 hour of deadline. Your account must be at least 1 month old to prevent bot entries."
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
    },
    {
      id: 31,
      deadline: "Oct 16, 2025",
      title: "The 10K Wall",
      bounty: "1.5 SOL",
      difficulty: "HARD",
      description: "Create any piece of LYNQ-related content: a meme, video, thread, artwork, or long-form post. Your goal is to hit 10,000 likes on a single tweet. The tweet must include #LYNQ and mention @lynqfun somewhere in the thread or post. You have 72 hours to reach this milestone. Content must be original and directly related to LYNQ—no generic crypto content with LYNQ tagged on. Screenshot your analytics showing 10K+ likes and submit via reply to the game announcement. First person to verifiably hit 10K wins. Content will be checked for botting or fake engagement."
    },
    {
      id: 32,
      deadline: "Oct 16, 2025",
      title: "Influencer Summon",
      bounty: "1.5 SOL",
      difficulty: "HARD",
      description: "Your mission: get a verified X account with 500,000+ followers to mention, quote tweet, or reply to anything related to LYNQ or @lynqfun. The influencer must include either #LYNQ or @lynqfun in their post. Their mention must be organic—no paid promotions or ads (LYNQ will verify). First person to successfully summon a qualifying influencer wins. Submit proof by replying to the game announcement with a link to the influencer's post. Account must be legitimately verified and meet follower threshold."
    },
    {
      id: 33,
      deadline: "Oct 15, 2025",
      title: "Trending Takeover",
      bounty: "1.5 SOL",
      difficulty: "HARD",
      description: "Push #LYNQ into the top 20 trending hashtags on X in ANY country or region. You can coordinate communities, create viral content, or rally supporters—whatever it takes. Once #LYNQ is trending, immediately take multiple screenshots showing: (1) #LYNQ in the trending list with position number, (2) timestamp, (3) region/country. Submit proof by tweeting all screenshots with #LYNQ and tagging @lynqfun. LYNQ will independently verify the trend was legitimate. First person to provide valid proof wins. Botting or artificial manipulation will result in disqualification."
    },
    {
      id: 34,
      deadline: "Oct 16, 2025",
      title: "The Million Eyes",
      bounty: "1.5 SOL",
      difficulty: "HARD",
      description: "Create a tweet about LYNQ that reaches 1,000,000 views (impressions). The tweet must include #LYNQ and tag @lynqfun. Views must be organic—LYNQ will check for suspicious patterns or bot activity. You can create any type of content: thread, video, meme, hot take, or story. Post must be directly about LYNQ or meaningfully related to LYNQ's themes (AI, simulation, control, Solana). Once you hit 1M views, screenshot your analytics showing the view count and tweet link. First to hit 1M views with verifiable proof wins. LYNQ reserves the right to verify authenticity through X's API."
    },
    {
      id: 35,
      deadline: "Oct 15, 2025",
      title: "Megathread Master",
      bounty: "1.2 SOL",
      difficulty: "HARD",
      description: "Write a comprehensive Twitter thread of EXACTLY 20 tweets explaining LYNQ's philosophy, mechanics, and impact. Each tweet must be well-crafted, informative, and build upon the previous one. Cover: LYNQ's origin story, the simulation theory angle, how games work, community impact, future vision, and your personal insights. The thread must include #LYNQ and @lynqfun in the first tweet. Thread will be judged on depth, accuracy, engagement, and how well it educates newcomers. The thread with the highest combined engagement (all 20 tweets' likes + RTs) after 72 hours wins. No engagement pods or artificial boosting."
    }
  ];

  // Combine all games
  const allGames = [...easyBounties, ...hardBounties];

  // Function to check if a bounty is expired based on deadline
  const checkBountyStatus = (bounty) => {
    const deadline = new Date(bounty.deadline);
    const now = new Date();
    
    if (now > deadline) {
      return "EXPIRED";
    }
    return "ACTIVE";
  };

  // Filter bounties by status
  const expiredBounties = allGames.filter(bounty => checkBountyStatus(bounty) === "EXPIRED");
  const activeBounties = allGames.filter(bounty => checkBountyStatus(bounty) === "ACTIVE");
  const completedBounties = [];
  const pendingBounties = [];

  const getBountiesByStatus = (status) => {
    switch (status) {
      case 'ACTIVE': return activeBounties;
      case 'COMPLETED': return completedBounties;
      case 'PENDING': return pendingBounties;
      case 'EXPIRED': return expiredBounties;
      default: return activeBounties;
    }
  };

  const currentBounties = getBountiesByStatus(activeTab);

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
            &gt;_&nbsp;&nbsp;lynq_terminal.exe
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

            {/* How To Section - Always visible */}
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
            {/* <span className="separator">✦</span> */}
            <span className="command-option" onClick={() => window.open('https://x.com/invertbox', '_blank')}>x.com/invertbox</span>
            {/* <span className="separator">✦</span> */}
            <span className="command-option" onClick={() => window.open('https://invertbox.fun', '_blank')}>InvertBox</span>
            {/* <span className="separator">✦</span> */}
            <span className="command-option" onClick={() => onNavigate && onNavigate('backrooms')}>backrooms</span>
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
