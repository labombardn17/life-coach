// Learn Module - AI Learning Resources & Books
(function() {
    'use strict';
    
    let learningProgress = {};
    
    const LearnModule = {
        init() {
            this.loadData();
            this.render();
        },
        
        loadData() {
            learningProgress = LifeCoach.getData('LEARN') || {};
        },
        
        saveData() {
            LifeCoach.saveData('LEARN', learningProgress);
        },
        
        toggleComplete(id) {
            learningProgress[id] = !learningProgress[id];
            this.saveData();
            this.render();
        },
        
        render() {
            const aiResources = [
                {id:'ai1',title:'AI Jason - GHL Basics',url:'https://youtube.com/@AIJason',category:'Beginner'},
                {id:'ai2',title:'ChatGPT Prompt Engineering',url:'#',category:'Beginner'},
                {id:'ai3',title:'Building AI Workflows',url:'#',category:'Intermediate'},
                {id:'ai4',title:'Custom GPTs Tutorial',url:'#',category:'Intermediate'},
                {id:'ai5',title:'AI Automation Scaling',url:'#',category:'Advanced'}
            ];
            
            const marketingResources = [
                {id:'m1',title:'HubSpot Marketing Course (Free)',url:'https://academy.hubspot.com/courses/content-marketing',category:'Marketing',desc:'Complete content marketing certification'},
                {id:'m2',title:'Moz SEO Beginner Guide',url:'https://moz.com/beginners-guide-to-seo',category:'Marketing',desc:'Everything about SEO from basics to advanced'},
                {id:'m3',title:'Gary Vee - Social Media Strategy',url:'https://www.youtube.com/@garyvee',category:'Marketing',desc:'Master social media for business growth'},
                {id:'m4',title:'Email Marketing Masterclass - HubSpot',url:'https://academy.hubspot.com/courses/email-marketing',category:'Marketing',desc:'Build email campaigns that convert'},
                {id:'m5',title:'LinkedIn B2B Marketing - LinkedIn Learning',url:'https://www.linkedin.com/learning/topics/b2b-marketing',category:'Marketing',desc:'Leverage LinkedIn for B2B client acquisition'},
                {id:'m6',title:'Google Business Profile Setup Guide',url:'https://www.google.com/business/',category:'Marketing',desc:'Optimize for local search visibility'},
                {id:'m7',title:'Think Media - YouTube Growth',url:'https://www.youtube.com/@THiNKmediaTV',category:'Marketing',desc:'Video marketing and YouTube strategy'},
                {id:'m8',title:'Neil Patel - Digital Marketing',url:'https://neilpatel.com/blog/',category:'Marketing',desc:'SEO, content, and growth strategies'},
                {id:'m9',title:'Alex Berman - Cold Email',url:'https://www.youtube.com/@AlexBerman',category:'Marketing',desc:'Cold email strategies that get responses'},
                {id:'m10',title:'Referral Marketing Guide - Referral Rock',url:'https://referralrock.com/blog/',category:'Marketing',desc:'Build referral programs that scale'},
                {id:'m11',title:'Facebook Ads Library',url:'https://www.facebook.com/ads/library/',category:'Marketing',desc:'See what successful ads look like'},
                {id:'m12',title:'Copyblogger - Copywriting',url:'https://copyblogger.com/',category:'Marketing',desc:'Write copy that sells and converts'},
                {id:'m13',title:'Marketing Examples by Harry Dry',url:'https://marketingexamples.com/',category:'Marketing',desc:'Real marketing case studies and tactics'},
                {id:'m14',title:'ConvertKit Email Course',url:'https://convertkit.com/resources',category:'Marketing',desc:'Build and monetize email list'},
                {id:'m15',title:'Local SEO Checklist - Whitespark',url:'https://whitespark.ca/local-seo-guide/',category:'Marketing',desc:'Rank #1 in local search results'}
            ];
            
            const books = [
                {id:'b1',title:'$100M Offers',author:'Alex Hormozi',category:'Business'},
                {id:'b2',title:'$100M Leads',author:'Alex Hormozi',category:'Business'},
                {id:'b3',title:'Zero to One',author:'Peter Thiel',category:'Business'},
                {id:'b4',title:'The Lean Startup',author:'Eric Ries',category:'Business'},
                {id:'b5',title:'This Is Marketing',author:'Seth Godin',category:'Marketing'},
                {id:'b6',title:'Influence',author:'Robert Cialdini',category:'Marketing'},
                {id:'b7',title:'Contagious',author:'Jonah Berger',category:'Marketing'},
                {id:'b8',title:'Building a StoryBrand',author:'Donald Miller',category:'Marketing'},
                {id:'b9',title:'Traction',author:'Gabriel Weinberg',category:'Marketing'},
                {id:'b10',title:'The 1-Page Marketing Plan',author:'Allan Dib',category:'Marketing'},
                {id:'b11',title:'Atomic Habits',author:'James Clear',category:'Personal'},
                {id:'b12',title:'Deep Work',author:'Cal Newport',category:'Personal'},
                {id:'b13',title:'Can\'t Hurt Me',author:'David Goggins',category:'Personal'}
            ];
            
            document.getElementById('learn-content').innerHTML = `
                <div class="card">
                    <h2>📚 Learning Center</h2>
                    
                    <h3 style="margin:30px 0 15px 0;">🤖 AI & Automation</h3>
                    ${aiResources.map(r => `
                        <div style="background:white; padding:15px; margin:10px 0; border-radius:8px; border:2px solid ${learningProgress[r.id]?'#10b981':'#e5e7eb'};">
                            <div style="display:flex; align-items:center; gap:15px;">
                                <input type="checkbox" ${learningProgress[r.id]?'checked':''} onchange="window.modules.learn.toggleComplete('${r.id}')" style="width:20px; height:20px; cursor:pointer;">
                                <div style="flex:1;">
                                    <div style="font-weight:600; ${learningProgress[r.id]?'text-decoration:line-through; opacity:0.7;':''}">${r.title}</div>
                                    <div style="font-size:0.85em; color:#666; margin-top:5px;">
                                        <span style="background:#667eea; color:white; padding:2px 8px; border-radius:12px; font-size:0.8em;">${r.category}</span>
                                    </div>
                                </div>
                                <a href="${r.url}" target="_blank" style="background:#667eea; color:white; padding:8px 16px; border-radius:5px; text-decoration:none; white-space:nowrap;">▶️ Watch</a>
                            </div>
                        </div>
                    `).join('')}
                    
                    <h3 style="margin:30px 0 15px 0;">📈 Marketing & Online Presence</h3>
                    <div style="background:#fef3c7; padding:15px; border-radius:10px; margin-bottom:15px; border:2px solid #f59e0b;">
                        <strong>🎯 Critical for Growing Companies</strong>
                        <div style="font-size:0.9em; color:#666; margin-top:5px;">Master these to significantly increase any company's online presence</div>
                    </div>
                    ${marketingResources.map(r => `
                        <div style="background:white; padding:15px; margin:10px 0; border-radius:8px; border:2px solid ${learningProgress[r.id]?'#10b981':'#e5e7eb'};">
                            <div style="display:flex; align-items:start; gap:15px;">
                                <input type="checkbox" ${learningProgress[r.id]?'checked':''} onchange="window.modules.learn.toggleComplete('${r.id}')" style="width:20px; height:20px; cursor:pointer; margin-top:2px; flex-shrink:0;">
                                <div style="flex:1;">
                                    <div style="font-weight:600; ${learningProgress[r.id]?'text-decoration:line-through; opacity:0.7;':''}">${r.title}</div>
                                    <div style="font-size:0.9em; color:#666; margin-top:5px; line-height:1.5;">${r.desc}</div>
                                    <div style="font-size:0.85em; margin-top:8px;">
                                        <span style="background:#f59e0b; color:white; padding:2px 8px; border-radius:12px; font-size:0.8em;">📈 ${r.category}</span>
                                    </div>
                                </div>
                                <a href="${r.url}" target="_blank" style="background:#f59e0b; color:white; padding:8px 16px; border-radius:5px; text-decoration:none; white-space:nowrap; flex-shrink:0;">→ Learn</a>
                            </div>
                        </div>
                    `).join('')}
                    
                    <h3 style="margin:30px 0 15px 0;">📖 Reading List</h3>
                    ${books.map(b => `
                        <div style="background:white; padding:15px; margin:10px 0; border-radius:8px; border:2px solid ${learningProgress[b.id]?'#10b981':'#e5e7eb'};">
                            <div style="display:flex; align-items:center; gap:15px;">
                                <input type="checkbox" ${learningProgress[b.id]?'checked':''} onchange="window.modules.learn.toggleComplete('${b.id}')" style="width:20px; height:20px; cursor:pointer;">
                                <div style="flex:1;">
                                    <div style="font-weight:600; ${learningProgress[b.id]?'text-decoration:line-through; opacity:0.7;':''}">${b.title}</div>
                                    <div style="font-size:0.85em; color:#666; margin-top:5px;">
                                        by ${b.author} • <span style="background:#f59e0b; color:white; padding:2px 8px; border-radius:12px; font-size:0.8em;">${b.category}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                    
                    <div style="background:#f0f9ff; padding:20px; border-radius:10px; margin-top:30px; border:2px solid #0ea5e9;">
                        <h3 style="margin:0 0 10px 0;">💡 Quick Stats</h3>
                        <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:15px;">
                            <div style="text-align:center; padding:15px; background:white; border-radius:8px;">
                                <div style="font-size:2em; font-weight:bold; color:#667eea;">${Object.values(learningProgress).filter(Boolean).length}</div>
                                <div style="font-size:0.9em; color:#666;">Completed</div>
                            </div>
                            <div style="text-align:center; padding:15px; background:white; border-radius:8px;">
                                <div style="font-size:2em; font-weight:bold; color:#f59e0b;">${aiResources.length + books.length - Object.values(learningProgress).filter(Boolean).length}</div>
                                <div style="font-size:0.9em; color:#666;">Remaining</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        refresh() {
            this.loadData();
            this.render();
        }
    };
    
    window.modules.learn = LearnModule;
    LearnModule.init();
})();
