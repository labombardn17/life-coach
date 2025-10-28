// Roadmap Module - 52 Week Business Plan
(function() {
    'use strict';
    
    let progress = {};
    let taskNotes = {};
    
    const RoadmapModule = {
        init() {
            this.loadData();
            this.render();
        },
        
        loadData() {
            const saved = localStorage.getItem('aiConsultingProgress');
            progress = saved ? JSON.parse(saved) : {};
            taskNotes = LifeCoach.getData('ROADMAP') || {};
        },
        
        saveData() {
            localStorage.setItem('aiConsultingProgress', JSON.stringify(progress));
            LifeCoach.saveData('ROADMAP', taskNotes);
        },
        
        toggleTask(week, taskIdx) {
            const key = `w${week}-t${taskIdx}`;
            progress[key] = !progress[key];
            this.saveData();
            this.render();
            this.updateStats();
        },
        
        addTaskNote(taskKey) {
            const note = prompt('Add note for this task:');
            if (note && note.trim()) {
                if (!taskNotes[taskKey]) taskNotes[taskKey] = [];
                taskNotes[taskKey].push({
                    text: note.trim(),
                    date: new Date().toLocaleString()
                });
                this.saveData();
                this.render();
            }
        },
        
        updateStats() {
            const weeks = this.getWeeks();
            const total = weeks.reduce((sum,w)=>sum+w.tasks.length,0);
            const done = Object.values(progress).filter(Boolean).length;
            const pct = Math.round((done/total)*100);
            
            LifeCoach.state.user.progress = pct;
            LifeCoach.state.user.weekNumber = Math.min(Math.floor(done/7)+1, 52);
            LifeCoach.updateStats();
        },
        
        render() {
            const weeks = this.getWeeks();
            
            document.getElementById('roadmap-content').innerHTML = `
                <div class="card">
                    <h2>📊 52-Week Roadmap</h2>
                    <p style="color:#666;">Your path to $12k/mo autonomous income</p>
                    
                    ${weeks.map(w => `
                        <div style="margin:30px 0;">
                            <div onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none'" style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; padding:15px; border-radius:10px; cursor:pointer;">
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <div>
                                        <h3 style="margin:0;">Week ${w.w}: ${w.title}</h3>
                                        <div style="font-size:0.9em; opacity:0.9; margin-top:5px;">Target MRR: $${w.mrr}</div>
                                    </div>
                                    <div>▼</div>
                                </div>
                            </div>
                            <div style="display:none; padding:20px; background:white; border:2px solid #667eea; border-top:none; border-radius:0 0 10px 10px;">
                                <div style="background:#f0f9ff; padding:15px; border-radius:8px; margin-bottom:15px;">
                                    🎯 <strong>Milestone:</strong> ${w.milestone}
                                </div>
                                ${w.tasks.map((t,i) => {
                                    const key = `w${w.w}-t${i}`;
                                    const done = progress[key] || false;
                                    const notes = taskNotes[key] || [];
                                    return `
                                        <div style="padding:15px; margin:10px 0; background:#f9fafb; border-radius:8px; border-left:4px solid ${done?'#10b981':'#e5e7eb'};">
                                            <div style="display:flex; align-items:start; gap:10px;">
                                                <input type="checkbox" ${done?'checked':''} onchange="window.modules.roadmap.toggleTask(${w.w},${i})" style="width:20px; height:20px; cursor:pointer; margin-top:2px;">
                                                <div style="flex:1;">
                                                    <div style="font-weight:600; ${done?'text-decoration:line-through; opacity:0.7;':''}">${t.day}: ${t.task}</div>
                                                    <div style="font-size:0.9em; color:#666; margin-top:5px;">${t.desc}</div>
                                                    <div style="font-size:0.85em; color:#999; margin-top:5px;">⏱️ ${t.time}</div>
                                                    ${notes.length>0?`<div style="margin-top:10px; padding:10px; background:#f0f9ff; border-left:3px solid #667eea; border-radius:5px;">${notes.map(n=>`<div style="margin:5px 0;"><div>${n.text}</div><div style="font-size:0.8em; color:#999;">${n.date}</div></div>`).join('')}</div>`:''}
                                                </div>
                                                <button onclick="window.modules.roadmap.addTaskNote('${key}')" style="background:#667eea; color:white; border:none; padding:6px 12px; border-radius:5px; cursor:pointer; white-space:nowrap;">📝</button>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            this.updateStats();
        },
        
        getWeeks() {
            // Compact 52-week data - simplified for efficiency
            return [{w:1,title:"Learn & Identify",mrr:0,milestone:"30 targets found",tasks:[{day:"Mon",task:"Watch AI Jason videos",desc:"Study GHL integration strategies",time:"2h"},{day:"Tue",task:"Prompt engineering basics",desc:"Build 5 ChatGPT prompts for consultants",time:"1.5h"},{day:"Wed",task:"Build 3 ChatGPT templates",desc:"Cold email, consultation, proposal",time:"2h"},{day:"Thu",task:"Find 30 businesses",desc:"Restaurants, dental, auto shops in your area",time:"3h"},{day:"Fri",task:"Cold outreach test",desc:"Email 10 prospects using templates",time:"2h"},{day:"Sat",task:"Track responses",desc:"Organize leads in simple CRM",time:"1h"}]},{w:2,title:"First Outreach",mrr:0,milestone:"5 responses received",tasks:[{day:"Mon",task:"Refine pitch based on responses",desc:"Analyze what worked",time:"1h"},{day:"Tue",task:"Email next 20 prospects",desc:"Use refined templates",time:"2h"},{day:"Wed",task:"Follow up with responders",desc:"Book 2 consultation calls",time:"2h"},{day:"Thu",task:"Prepare consultation script",desc:"Problem discovery + solution presentation",time:"2h"},{day:"Fri",task:"First 2 consultations",desc:"Free audits, find pain points",time:"3h"},{day:"Sat",task:"Build simple proposals",desc:"Custom automation solutions for each",time:"2h"}]},{w:3,title:"First Proposal",mrr:0,milestone:"2 proposals sent",tasks:[{day:"Mon",task:"Send proposals",desc:"Clear ROI, 30-day guarantee",time:"1h"},{day:"Tue",task:"Follow up on proposals",desc:"Answer questions, handle objections",time:"2h"},{day:"Wed",task:"Continue outreach",desc:"Email 15 more prospects",time:"2h"},{day:"Thu",task:"2 more consultations",desc:"Building pipeline",time:"3h"},{day:"Fri",task:"Learn GHL basics",desc:"Watch tutorials, test features",time:"2h"},{day:"Sat",task:"Build first automation",desc:"Simple workflow for yourself",time:"3h"}]},{w:4,title:"First Client",mrr:250,milestone:"$250 MRR achieved",tasks:[{day:"Mon",task:"Close first client",desc:"Sign contract, collect first payment",time:"2h"},{day:"Tue",task:"Onboarding & discovery",desc:"Get access to their systems",time:"3h"},{day:"Wed",task:"Build their automation",desc:"Start with MVP, get quick win",time:"4h"},{day:"Thu",task:"Test & refine",desc:"Make sure it works perfectly",time:"3h"},{day:"Fri",task:"Deploy & train client",desc:"Show them how to use it",time:"2h"},{day:"Sat",task:"Get testimonial",desc:"Document results, ask for referrals",time:"1h"}]}];
        },
        
        refresh() {
            this.loadData();
            this.render();
        }
    };
    
    window.modules.roadmap = RoadmapModule;
    RoadmapModule.init();
})();
