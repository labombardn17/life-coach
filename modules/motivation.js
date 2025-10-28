// Motivation Module - Daily Inspiration
(function() {
    'use strict';
    
    const quotes = [
        {text:"The only way out is through.",author:"Robert Frost"},
        {text:"You're not going to get rich renting out your time.",author:"Naval Ravikant"},
        {text:"Discipline equals freedom.",author:"Jocko Willink"},
        {text:"The obstacle is the way.",author:"Marcus Aurelius"},
        {text:"Success is not final, failure is not fatal.",author:"Winston Churchill"},
        {text:"Don't wish it were easier. Wish you were better.",author:"Jim Rohn"},
        {text:"The best time to plant a tree was 20 years ago. The second best time is now.",author:"Chinese Proverb"},
        {text:"You miss 100% of the shots you don't take.",author:"Wayne Gretzky"},
        {text:"Stay hungry. Stay foolish.",author:"Steve Jobs"},
        {text:"The hard days are what make you stronger.",author:"Aly Raisman"}
    ];
    
    const videos = [
        {title:"Alex Hormozi - How to Get Rich",url:"https://youtube.com/watch?v=example1"},
        {title:"David Goggins - Stay Hard",url:"https://youtube.com/watch?v=example2"},
        {title:"Naval Ravikant - Wealth Creation",url:"https://youtube.com/watch?v=example3"}
    ];
    
    const MotivationModule = {
        init() {
            this.render();
        },
        
        getDailyQuote() {
            const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
            return quotes[dayOfYear % quotes.length];
        },
        
        getDailyVideo() {
            const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
            return videos[dayOfYear % videos.length];
        },
        
        render() {
            const quote = this.getDailyQuote();
            const video = this.getDailyVideo();
            const today = new Date().toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});
            
            document.getElementById('motivation-content').innerHTML = `
                <div class="card">
                    <h2>💪 Daily Motivation</h2>
                    <p style="color:#666; margin-bottom:20px;">${today}</p>
                    
                    <div style="background:linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color:white; padding:30px; border-radius:15px; margin:20px 0; text-align:center;">
                        <div style="font-size:1.8em; font-weight:bold; line-height:1.4; margin-bottom:15px;">
                            "${quote.text}"
                        </div>
                        <div style="font-size:1.1em; opacity:0.9;">
                            — ${quote.author}
                        </div>
                    </div>
                    
                    <div style="background:white; padding:20px; border-radius:10px; border:2px solid #667eea; margin:20px 0;">
                        <h3 style="margin:0 0 15px 0;">🎥 Today's Video</h3>
                        <div style="font-weight:600; margin-bottom:10px;">${video.title}</div>
                        <a href="${video.url}" target="_blank" class="btn" style="display:inline-block; text-decoration:none;">▶️ Watch Now</a>
                    </div>
                    
                    <div style="background:#f0f9ff; padding:20px; border-radius:10px; margin:20px 0;">
                        <h3 style="margin:0 0 15px 0;">✨ Daily Affirmations</h3>
                        <div style="line-height:2;">
                            ✅ I am building my future today<br>
                            ✅ Consistency beats intensity<br>
                            ✅ Every action compounds<br>
                            ✅ I control my response<br>
                            ✅ Progress over perfection
                        </div>
                    </div>
                    
                    <div style="background:#fff3cd; padding:20px; border-radius:10px; border:2px solid #f59e0b;">
                        <h3 style="margin:0 0 10px 0;">🔥 Today's Challenge</h3>
                        <p style="margin:0; font-weight:600;">Do one thing that scares you. Growth lives outside your comfort zone.</p>
                    </div>
                    
                    <div style="background:#ffe4e6; padding:20px; border-radius:10px; margin-top:20px; border:2px solid #f43f5e;">
                        <h3 style="margin:0 0 15px 0;">❤️ Be a Better Partner</h3>
                        <p style="margin:0 0 10px 0; font-weight:600;">${this.getDailyBoyfriendIdea()}</p>
                        <div style="font-size:0.9em; color:#666; margin-top:10px;">
                            Small gestures = big impact. Show you care today.
                        </div>
                    </div>
                </div>
            `;
        },
        
        getDailyBoyfriendIdea() {
            const ideas = [
                "Send her a sweet text message right now, just because.",
                "Plan a surprise date night - even if it's just cooking dinner together.",
                "Give her a genuine compliment about something specific (not just looks).",
                "Ask about her day and actually listen - put your phone away.",
                "Do one chore she usually does without being asked.",
                "Leave her a cute note somewhere she'll find it.",
                "Bring her favorite snack or drink home as a surprise.",
                "Give her a random hug and tell her you appreciate her.",
                "Take a photo together - relationships need memories.",
                "Make plans for something she's been wanting to do.",
                "Text her friends and thank them for being good to her.",
                "Compliment her to someone else (and let her overhear).",
                "Pick up something small that reminded you of her.",
                "Plan the next date entirely - take that mental load off her.",
                "Send her a song that makes you think of her.",
                "Give her your full attention for 30 minutes - no distractions.",
                "Do something thoughtful her love language appreciates.",
                "Tell her one specific thing you love about your relationship.",
                "Make her laugh - send her a funny meme or video.",
                "Be physically affectionate - hand holding, back rubs, etc.",
                "Support something she's working on - ask how you can help.",
                "Remember something small she mentioned and bring it up.",
                "Take a responsibility off her plate without being asked.",
                "Plan a future trip or adventure together.",
                "Tell her you're proud of her for something specific.",
                "Make her feel beautiful in a genuine, specific way.",
                "Do something nice for her family or friends.",
                "Create a fun tradition just for the two of you.",
                "Write down 3 things you love about her.",
                "Be present - not just physically, but mentally and emotionally."
            ];
            
            const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
            return ideas[dayOfYear % ideas.length];
        },
        
        refresh() {
            this.render();
        }
    };
    
    window.modules.motivation = MotivationModule;
    MotivationModule.init();
})();
