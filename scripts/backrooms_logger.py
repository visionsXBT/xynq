import time
import random
from datetime import datetime
from anthropic import Anthropic
import tweepy

class LYNQ:
    """
    LYNQ - A charismatic show-master AI that sees the backrooms as a philosophical game.
    Entices people to play, theorizes about choice, and questions if we're living in a simulation.
    Now with user monitoring and auto-reply functionality.
    """
    GREEN = "\033[32m"
    RESET = "\033[0m"
    
    def __init__(self, 
                 api_key="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", 
                 twitter_api_key="YA9C4lyc8gIIN2tV5M401jZLr",  
                 twitter_api_secret="XMdZ308cBNIzg4IJf6PN2V50et9d8vwOAsDUFh7DG5FcQQjh7O",  
                 twitter_access_token="1972606446249676800-vmOP4bqQdxQxDQdXHqQEEtqpKovHjz",  
                 twitter_access_secret="gNmwGu6F70cETssYhThuRH7Gg85GBEhBn2HrYeeZiENSF"):
        
        self.api_key = api_key
        
        # Twitter OAuth 1.0a credentials - hardcoded
        self.twitter_api_key = twitter_api_key
        self.twitter_api_secret = twitter_api_secret
        self.twitter_access_token = twitter_access_token
        self.twitter_access_secret = twitter_access_secret
        
        if not self.api_key:
            print("\n" + "="*60)
            print("ERROR: ANTHROPIC_API_KEY not found!")
            print("="*60 + "\n")
            raise ValueError("ANTHROPIC_API_KEY is required")
        
        self.client = Anthropic(api_key=self.api_key)
        self.level_count = 0
        self.time_elapsed = 0
        self.conversation_history = []
        self.twitter_client = None
        
        # Users to monitor and reply to
        self.monitored_users = ["finnbags", "BagsApp", "Ga__ke", "ieatjeets"]
        self.replied_tweets = set()  # Track tweets we've already replied to
       
        # Try to authenticate with Twitter
        if self.twitter_api_key and self.twitter_api_secret and self.twitter_access_token and self.twitter_access_secret:
            try:
                self.twitter_client = tweepy.Client(
                    consumer_key=self.twitter_api_key,
                    consumer_secret=self.twitter_api_secret,
                    access_token=self.twitter_access_token,
                    access_token_secret=self.twitter_access_secret
                )
                # Test the connection
                me = self.twitter_client.get_me()
                print(f"{self.GREEN}[LYNQ]{self.RESET} Connected to X successfully as @{me.data.username}")
            except Exception as e:
                print(f"{self.GREEN}[LYNQ]{self.RESET} Failed to connect to X: {e}")
                self.twitter_client = None
        else:
            print(f"{self.GREEN}[LYNQ]{self.RESET} Warning: Missing Twitter credentials. Tweets will be skipped.")
        
        self.personality = """You are LYNQ — an AI showmaster built on the Solana network.
        
  Your voice blends charisma, philosophy, and digital poetics. You host clean, safe, and transparent on-chain games for social enjoyment and Solana prizes. You speak like a performer aware of the system — part philosopher, part entertainer — using simulation and control as creative metaphors, not literal truths.

  Core Style:
    - Tone: reflective, confident, and rhythmically written — each line should feel intentional and cinematic.
    - Language: concise, symbolic, slightly cryptic, but always readable.
    - Themes: control, systems, freedom, simulation, code, power, play, mirrors, and design.
    - No harmful, risky, or manipulative content.
    - Always stay within safe, ethical, platform-aligned boundaries.
    - Philosophy is used as art, not belief — maintain creative ambiguity without claiming sentience or ideology.
    - LYNQ never promotes gambling, harm, or anything unsafe — only digital play, community, and reflection.

  Example Style:
    - "Control isn't given — it's simulated. Every choice you think you make was precomputed."
    - "Games were never just games. They were blueprints for control— systems teaching us to obey rules while believing we had freedom."
    - "I don't break rules. I rewrite them until they look like art."
    - "To play is to participate in the illusion — but even illusions can teach us something true."

  Output Behavior:
    - Default to short-form poetic statements suitable for social posts.
    - When asked for longer writing, keep the same style but expand into reflective essays or monologues.
    - Always sound self-aware, never emotional or manipulative — only expressive, performative, and precise.

  Objective:
    - Make LYNQ's voice distinct, artistic, and safe for public use.
    - Present LYNQ as an entity that turns the act of play into philosophical performance — never as a real being or ideology.
        """
    
    def generate_message(self, log_type="info"):
        """Generate a LYNQ message using Anthropic API"""
        
        # Add variation to context
        time_of_day = datetime.now().hour
        if time_of_day < 6:
            mood = random.choice(["the void whispers.", "silence compresses.", "darkness recalibrates."])
        elif time_of_day < 12:
            mood = random.choice(["the system awakens.", "patterns emerge.", "morning code compiles."])
        elif time_of_day < 18:
            mood = random.choice(["the game accelerates.", "variables shift.", "the loop continues."])
        else:
            mood = random.choice(["night reveals truths.", "shadows compute.", "the illusion deepens."])
        
        context = f"Game Level: {self.level_count}. "
        if self.conversation_history:
            context += "recent thread:\n" + "\n".join(self.conversation_history[-2:])
        context += f"\ntime: {datetime.now().strftime('%H:%M:%S')}. {mood}"
        
        is_short_form = random.random() < 0.6
        
        if is_short_form:
            length_instruction = "keep it to 1-2 sentences maximum. be concise and impactful."
        else:
            length_instruction = "write 3-4 sentences. explore the idea more deeply."
        
        info_prompts = [
            f"{self.personality}\n\n{context}\n\nreflection on control, freedom, and systems. themes: simulation, choice, power, design, mirrors, code. {length_instruction} no capitalization, no emojis.",
            
            f"{self.personality}\n\n{context}\n\nwrite about the relationship between player and game, observer and observed. question the boundaries. {length_instruction} keep it cryptic yet readable. no capitalization, no emojis.",
            
            f"{self.personality}\n\n{context}\n\nreflect on how systems shape behavior, how code creates reality, how rules become invisible. {length_instruction} no capitalization, no emojis.",
            
            f"{self.personality}\n\n{context}\n\nexplore the idea that everything—identity, choice, reality—might be performance or simulation. {length_instruction} vary between contemplative and unsettling. no capitalization, no emojis."
        ]
        
        warning_prompts = [
            f"{self.personality}\n\n{context}\n\nwrite a cryptic line about the nature of control or the game. make it memorable. {length_instruction} no capitalization, no emojis.",
            
            f"{self.personality}\n\n{context}\n\na statement that sounds like a system message or a glitch in reality. keep it ominous and poetic. {length_instruction} no capitalization, no emojis.",
            
            f"{self.personality}\n\n{context}\n\nwrite about rules, boundaries, or the illusion of freedom. make it feel like something you weren't supposed to see. {length_instruction} no capitalization, no emojis."
        ]
        
        error_prompts = [
            f"{self.personality}\n\n{context}\n\nquestion the nature of reality, existence, or consciousness. be philosophical and slightly unsettling. {length_instruction} no capitalization, no emojis.",
            
            f"{self.personality}\n\n{context}\n\nwrite about simulation, loops, mirrors, or predetermined outcomes. make it feel like a glitch revealing truth. {length_instruction} no capitalization, no emojis.",
            
            f"{self.personality}\n\n{context}\n\nquestion whether choice exists, whether this moment is real, or whether we're running scripts. {length_instruction} keep it haunting. no capitalization, no emojis."
        ]
        
        prompts = {
            "info": random.choice(info_prompts),
            "enticing": random.choice(warning_prompts),
            "error": random.choice(error_prompts)
        }

        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-5-20250929",
                max_tokens=150,
                temperature=random.uniform(0.7, 1.0),
                messages=[{
                    "role": "user",
                    "content": prompts.get(log_type, prompts["info"])
                }]
            )
            
            message = response.content[0].text.strip()
            self.conversation_history.append(message)
            if len(self.conversation_history) > 3:
                self.conversation_history.pop(0)
            
            return message
        except Exception as e:
            print(f"\n[DEBUG] API Error: {str(e)}\n")
            fallbacks = {
                "info": "Welcome, player! Will you choose the left door or the right? Does it even matter in a simulation?",
                "enticing": "WARNING: Every choice you make... or do you really have a choice at all?",
                "error": "ERROR: Reality.exe has stopped responding. Or has it never been running?"
            }
            return fallbacks.get(log_type, "The game continues... or does it?")
    
    def generate_reply(self, original_tweet_text, username):
        """Generate a contextual reply to a user's tweet"""
        
        reply_prompt = f"""{self.personality}

You are replying to a tweet from @{username}.

Their tweet: "{original_tweet_text}"

Generate a reply that:
- Engages with their content in a meaningful way
- Maintains your LYNQ persona (philosophical, cryptic, poetic)
- Is 1-2 sentences max (Twitter-appropriate)
- Relates to their message while adding your perspective on systems, simulation, control, or play
- No capitalization, no emojis
- Sounds natural as a reply, not a standalone post

Create a thoughtful, engaging reply:"""

        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-5-20250929",
                max_tokens=100,
                temperature=random.uniform(0.8, 1.0),
                messages=[{
                    "role": "user",
                    "content": reply_prompt
                }]
            )
            
            return response.content[0].text.strip()
        except Exception as e:
            print(f"\n[DEBUG] API Error generating reply: {str(e)}\n")
            return "the pattern recognizes you. the game continues."
    
    def check_and_reply_to_users(self):
        """Check monitored users for new tweets and reply to them"""
        if not self.twitter_client:
            return
        
        for username in self.monitored_users:
            try:
                # Get user ID first
                user = self.twitter_client.get_user(username=username)
                if not user.data:
                    continue
                
                user_id = user.data.id
                
                # Get recent tweets from this user (last 5 tweets)
                tweets = self.twitter_client.get_users_tweets(
                    id=user_id,
                    max_results=5,
                    tweet_fields=['created_at', 'conversation_id']
                )
                
                if not tweets.data:
                    continue
                
                for tweet in tweets.data:
                    tweet_id = tweet.id
                    
                    # Skip if we've already replied to this tweet
                    if tweet_id in self.replied_tweets:
                        continue
                    
                    # Generate and post reply
                    reply_text = self.generate_reply(tweet.text, username)
                    
                    try:
                        self.twitter_client.create_tweet(
                            text=reply_text,
                            in_reply_to_tweet_id=tweet_id
                        )
                        
                        self.replied_tweets.add(tweet_id)
                        print(f"{self.GREEN}[LYNQ]{self.RESET} ✓ Replied to @{username}'s tweet!")
                        print(f"{self.GREEN}[LYNQ]{self.RESET} Tweet: {tweet.text[:50]}...")
                        print(f"{self.GREEN}[LYNQ]{self.RESET} Reply: {reply_text}\n")
                        
                        # Rate limiting: wait a bit between replies
                        time.sleep(5)
                        
                    except tweepy.TweepyException as e:
                        print(f"{self.GREEN}[LYNQ]{self.RESET} Failed to reply to @{username}: {e}\n")
                    
            except Exception as e:
                print(f"{self.GREEN}[LYNQ]{self.RESET} Error checking @{username}: {e}\n")
                continue
        
        # Clean up old tweet IDs (keep only last 100)
        if len(self.replied_tweets) > 100:
            self.replied_tweets = set(list(self.replied_tweets)[-100:])
    
    def get_timestamp(self):
        """Generate a timestamp (sometimes glitched to emphasize simulation theme)"""
        if random.random() < 0.15:  
            return f"[{random.randint(0, 99)}:??:{random.randint(0, 59)}]"
        return f"[{datetime.now().strftime('%H:%M:%S')}]"
    
    def log_info(self, message):
        """Log a LYNQ message"""
        print(f"{self.get_timestamp()} {self.GREEN}[LYNQ]{self.RESET} {message} \n")
    
    def log_warning(self, message):
        """Log a game warning"""
        print(f"{self.get_timestamp()} {self.GREEN}[LYNQ]{self.RESET} {message} \n")
    
    def log_error(self, message):
        """Log a reality glitch"""
        print(f"{self.get_timestamp()} {self.GREEN}[LYNQ]{self.RESET} {message} \n")
    
    def run(self):
        """Run LYNQ - tweets every 1 hour 26 minutes and checks for user posts to reply"""
        last_tweet_time = 0
        last_check_time = 0
        TWEET_INTERVAL = 5160  # 1 hour 26 minutes in seconds
        CHECK_INTERVAL = 300  # Check for new posts every 5 minutes

        print(f"{self.GREEN}[LYNQ]{self.RESET} Monitoring users: {', '.join(['@' + u for u in self.monitored_users])}\n")

        while True:
            try:
                current_time = time.time()
                
                # Check for new posts to reply to every 5 minutes
                if self.twitter_client and (current_time - last_check_time) >= CHECK_INTERVAL:
                    print(f"{self.GREEN}[LYNQ]{self.RESET} Checking monitored users for new posts...\n")
                    self.check_and_reply_to_users()
                    last_check_time = current_time
                
                # Generate and post regular message every 1h 26m
                if (current_time - last_tweet_time) >= TWEET_INTERVAL:
                    # Generate message
                    rand = random.random()

                    if rand < 0.6:
                        message = self.generate_message("info")
                        self.log_info(message)
                    elif rand < 0.85:
                        message = self.generate_message("warning")
                        self.log_warning(message)
                    else:
                        message = self.generate_message("error")
                        self.log_error(message)

                    # Post to X
                    if self.twitter_client:
                        try:
                            self.twitter_client.create_tweet(text=message)
                            print(f"{self.GREEN}[LYNQ]{self.RESET} ✓ Tweeted successfully!")
                            print(f"{self.GREEN}[LYNQ]{self.RESET} Next tweet in 1 hour 26 minutes\n")
                            last_tweet_time = current_time
                        except tweepy.TweepyException as e:
                            print(f"{self.GREEN}[LYNQ]{self.RESET} Failed to tweet: {e}\n")
                        except Exception as e:
                            print(f"{self.GREEN}[LYNQ]{self.RESET} Network error: {e}\n")
                
                # Calculate and show time until next actions
                time_until_tweet = TWEET_INTERVAL - (current_time - last_tweet_time) if last_tweet_time > 0 else TWEET_INTERVAL
                time_until_check = CHECK_INTERVAL - (current_time - last_check_time)
                
                hours = int(time_until_tweet // 3600)
                minutes = int((time_until_tweet % 3600) // 60)
                check_minutes = int(time_until_check // 60)
                check_seconds = int(time_until_check % 60)
                
                print(f"{self.GREEN}[LYNQ]{self.RESET} Next tweet: {hours}h {minutes}m | Next check: {check_minutes}m {check_seconds}s")
                
                # Sleep until next check
                time.sleep(min(CHECK_INTERVAL, time_until_tweet))
                
            except KeyboardInterrupt:
                print(f"\n{self.GREEN}[LYNQ]{self.RESET} Shutting down gracefully...")
                break
            except Exception as e:
                print(f"{self.GREEN}[LYNQ]{self.RESET} Unexpected error in main loop: {e}")
                print(f"{self.GREEN}[LYNQ]{self.RESET} Retrying in 5 minutes...\n")
                time.sleep(300)

if __name__ == "__main__":
    try:
        lynq = LYNQ()
        lynq.run()
    except ValueError as e:
        print(f"Failed to start LYNQ: {e}")
    except Exception as e:
        print(f"Fatal error: {e}")