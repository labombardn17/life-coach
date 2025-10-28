// Daily Overview Module - Your Dashboard
(function() {
    'use strict';
    
    const OverviewModule = {
        init() {
            this.render();
        },
        
        getDailyQuote() {
            const quotes = [
                {text:"The only way out is through.",author:"Robert Frost"},
                {text:"You're not going to get rich renting out your time.",author:"Naval Ravikant"},
                {text:"Discipline equals freedom.",author:"Jocko Willink"},
                {text:"The obstacle is the way.",author:"Marcus Aurelius"},
                {text:"Success is not final, failure is not fatal.",author:"Winston Churchill"},
                {text:"Don't wish it were easier. Wish you were better.",author:"Jim Rohn"},
                {text:"The best time to plant a tree was 20 years ago. The second best time is now.",author:"Chinese Proverb"},
                {text:"Stay hungry. Stay foolish.",author:"Steve Jobs"},
                {text:"The hard days are what make you stronger.",author:"Aly Raisman"},
                {text:"Every action compounds.",author:"James Clear"}
            ];
            const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
            return quotes[dayOfYear % quotes.length];
        },
        
        getDailyVideo() {
            const videos = [
                {title:"Alex Hormozi - How to Get Rich",url:"https://youtube.com/watch?v=example1"},
                {title:"David Goggins - Stay Hard",url:"https://youtube.com/watch?v=example2"},
                {title:"Naval Ravikant - Wealth Creation",url:"https://youtube.com/watch?v=example3"}
            ];
            const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
            return videos[dayOfYear % videos.length];
        },
        
        render() {
            const today = new Date();
            const todayStr = today.toDateString();
            const todayFormatted = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
            
            // Get today's data
            const habits = LifeCoach.getData('HABITS') || [];
            const todayHabits = habits.filter(h => !h.completions || !h.completions.includes(todayStr));
            const completedHabits = habits.filter(h => h.completions && h.completions.includes(todayStr));
            
            const calendarEvents = LifeCoach.getData('CALENDAR') || [];
            const todayEvents = calendarEvents.filter(e => new Date(e.date).toDateString() === todayStr);
            
            const workouts = LifeCoach.getData('WORKOUTS') || [];
            const todayWorkout = workouts.filter(w => w.date === today.toISOString().split('T')[0]);
            const nextWorkout = workouts.find(w => w.status !== 'Completed' && w.date);
            
            const goals = LifeCoach.getData('GOALS') || [];
            const activeGoals = goals.filter(g => !g.completed);
            
            const ibProjects = LifeCoach.getData('IBWORK') || [];
            const allIBTasks = ibProjects
                .filter(p => !p.archived)
                .flatMap(p => p.tasks.filter(t => !t.completed).map(t => ({...t, project: p.name})));
            const totalIBTasks = allIBTasks.length;
            
            // Get roadmap tasks for today (DATE-AWARE!)
            const roadmapProgress = JSON.parse(localStorage.getItem('aiConsultingProgress') || '{}');
            const dateInfo = LifeCoach.getCurrentWeekAndDay();
            const currentWeek = dateInfo.week;
            const currentDayName = dateInfo.dayName;
            const roadmapWeeks = this.getRoadmapWeeks();
            const thisWeek = roadmapWeeks.find(w => w.w === currentWeek);
            const todayTasks = thisWeek ? thisWeek.tasks.filter(t => t.day.includes(currentDayName)) : [];
            
            // Calculate past due tasks
            const pastDueTasks = [];
            for (let w = 1; w < currentWeek; w++) {
                const week = roadmapWeeks.find(wk => wk.w === w);
                if (week) {
                    week.tasks.forEach((t, i) => {
                        const key = `w${w}-t${i}`;
                        if (!roadmapProgress[key]) {
                            pastDueTasks.push({
                                week: w,
                                task: t,
                                key: key,
                                daysLate: (dateInfo.totalDays - ((w-1)*7 + ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].indexOf(t.day)))
                            });
                        }
                    });
                }
            }
            // Add incomplete tasks from earlier in current week
            if (thisWeek) {
                const dayIndex = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(currentDayName);
                thisWeek.tasks.forEach((t, i) => {
                    const taskDayIndex = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(t.day);
                    const key = `w${currentWeek}-t${i}`;
                    if (taskDayIndex < dayIndex && !roadmapProgress[key]) {
                        pastDueTasks.push({
                            week: currentWeek,
                            task: t,
                            key: key,
                            daysLate: (dayIndex - taskDayIndex)
                        });
                    }
                });
            }
            
            const quote = this.getDailyQuote();
            const video = this.getDailyVideo();
            
            document.getElementById('overview-content').innerHTML = `
                <div class="card">
                    <h2>☀️ Daily Overview</h2>
                    <p style="color:#666; margin-bottom:20px;">${todayFormatted}</p>
                    
                    <!-- Daily Quote & Video -->
                    <div style="background:linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color:white; padding:25px; border-radius:15px; margin-bottom:20px; text-align:center;">
                        <div style="font-size:1.5em; font-weight:bold; line-height:1.4; margin-bottom:15px;">
                            "${quote.text}"
                        </div>
                        <div style="font-size:1em; opacity:0.9; margin-bottom:15px;">
                            — ${quote.author}
                        </div>
                        <a href="${video.url}" target="_blank" style="display:inline-block; background:rgba(255,255,255,0.2); color:white; padding:10px 20px; border-radius:8px; text-decoration:none; font-weight:600; border:2px solid white;">
                            ▶️ ${video.title}
                        </a>
                    </div>
                    
                    <!-- Quick Actions -->
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap:10px; margin-bottom:30px;">
                        <button onclick="LifeCoach.switchModule('habits')" class="btn" style="padding:15px; font-size:0.9em;">✅ Habits</button>
                        <button onclick="LifeCoach.switchModule('workout')" class="btn" style="padding:15px; font-size:0.9em;">💪 Workout</button>
                        <button onclick="LifeCoach.switchModule('calendar')" class="btn" style="padding:15px; font-size:0.9em;">📅 Calendar</button>
                        <button onclick="LifeCoach.switchModule('ibwork')" class="btn" style="padding:15px; font-size:0.9em;">💼 IB Work</button>
                    </div>
                    
                    <!-- Today's Summary -->
                    <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; padding:20px; border-radius:15px; margin-bottom:20px;">
                        <h3 style="margin:0 0 15px 0;">📊 Today's Summary - Week ${currentWeek} ${currentDayName}</h3>
                        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap:15px;">
                            <div style="background:rgba(255,255,255,0.2); padding:15px; border-radius:10px; text-align:center;">
                                <div style="font-size:2em; font-weight:bold;">${completedHabits.length}/${habits.length}</div>
                                <div style="font-size:0.9em; opacity:0.9;">Habits Done</div>
                            </div>
                            <div style="background:rgba(255,255,255,0.2); padding:15px; border-radius:10px; text-align:center;">
                                <div style="font-size:2em; font-weight:bold;">${todayEvents.length}</div>
                                <div style="font-size:0.9em; opacity:0.9;">Events Today</div>
                            </div>
                            <div style="background:rgba(255,255,255,0.2); padding:15px; border-radius:10px; text-align:center;">
                                <div style="font-size:2em; font-weight:bold;">${activeGoals.length}</div>
                                <div style="font-size:0.9em; opacity:0.9;">Active Goals</div>
                            </div>
                            <div style="background:rgba(255,255,255,0.2); padding:15px; border-radius:10px; text-align:center;">
                                <div style="font-size:2em; font-weight:bold;">${totalIBTasks}</div>
                                <div style="font-size:0.9em; opacity:0.9;">IB Tasks</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Past Due Tasks -->
                    ${pastDueTasks.length > 0 ? `
                        <div style="background:#fee; padding:20px; border-radius:10px; margin-bottom:20px; border:2px solid #ef4444;">
                            <h3 style="margin:0 0 15px 0; color:#ef4444;">⚠️ Past Due Tasks (${pastDueTasks.length})</h3>
                            ${pastDueTasks.slice(0, 5).map(pd => `
                                <div style="background:white; padding:12px; margin:8px 0; border-radius:8px; border-left:4px solid #ef4444;">
                                    <div style="font-weight:600;">Week ${pd.week} - ${pd.task.day}: ${pd.task.task}</div>
                                    <div style="font-size:0.85em; color:#666; margin-top:5px;">${pd.task.desc}</div>
                                    <div style="font-size:0.8em; color:#ef4444; margin-top:5px;">⏰ ${pd.daysLate} day${pd.daysLate !== 1 ? 's' : ''} late</div>
                                </div>
                            `).join('')}
                            ${pastDueTasks.length > 5 ? `<div style="text-align:center; margin-top:10px; color:#666;">+${pastDueTasks.length - 5} more overdue</div>` : ''}
                            <button onclick="LifeCoach.switchModule('roadmap')" class="btn" style="width:100%; margin-top:10px; background:#ef4444;">View All & Catch Up →</button>
                        </div>
                    ` : ''}
                    
                    <!-- Roadmap Tasks for Today -->
                    ${todayTasks.length > 0 ? `
                        <div style="background:#dbeafe; padding:20px; border-radius:10px; margin-bottom:20px; border:2px solid #3b82f6;">
                            <h3 style="margin:0 0 15px 0;">📊 Today's Roadmap Tasks (Week ${currentWeek})</h3>
                            ${todayTasks.map((t, i) => {
                                const key = `w${currentWeek}-t${i}`;
                                const done = roadmapProgress[key] || false;
                                return `
                                    <div style="padding:12px; background:white; border-radius:8px; margin:8px 0; border-left:4px solid ${done ? '#10b981' : '#3b82f6'}; ${done ? 'opacity:0.6;' : ''}">
                                        <div style="font-weight:600; ${done ? 'text-decoration:line-through;' : ''}">${t.day}: ${t.task}</div>
                                        <div style="font-size:0.85em; color:#666; margin-top:5px;">${t.desc}</div>
                                        <div style="font-size:0.8em; color:#999; margin-top:5px;">⏱️ ${t.time}</div>
                                    </div>
                                `;
                            }).join('')}
                            <button onclick="LifeCoach.switchModule('roadmap')" class="btn" style="width:100%; margin-top:10px;">Complete Tasks →</button>
                        </div>
                    ` : `
                        <div style="background:#dbeafe; padding:20px; border-radius:10px; margin-bottom:20px; border:2px solid #3b82f6;">
                            <h3 style="margin:0 0 10px 0;">📊 Week ${currentWeek} Roadmap</h3>
                            <div style="font-size:0.9em; color:#666;">No specific tasks for today - check your weekly roadmap</div>
                            <button onclick="LifeCoach.switchModule('roadmap')" class="btn" style="width:100%; margin-top:10px;">View This Week →</button>
                        </div>
                    `}
                    
                    <!-- Habits Due Today -->
                    ${todayHabits.length > 0 ? `
                        <div style="background:#d1fae5; padding:20px; border-radius:10px; margin-bottom:20px; border:2px solid #10b981;">
                            <h3 style="margin:0 0 15px 0;">✅ Habits Due Today (${todayHabits.length})</h3>
                            ${todayHabits.slice(0, 3).map(h => `
                                <div style="padding:10px; background:white; border-radius:8px; margin:8px 0; font-weight:600;">
                                    • ${h.name}
                                </div>
                            `).join('')}
                            ${todayHabits.length > 3 ? `<div style="text-align:center; margin-top:10px; color:#666;">+${todayHabits.length - 3} more</div>` : ''}
                            <button onclick="LifeCoach.switchModule('habits')" class="btn" style="width:100%; margin-top:10px;">Complete Habits →</button>
                        </div>
                    ` : `
                        <div style="background:#f0fdf4; padding:20px; border-radius:10px; margin-bottom:20px; border:2px solid #10b981; text-align:center;">
                            <div style="font-size:2em; margin-bottom:10px;">🎉</div>
                            <div style="font-weight:600;">All habits complete for today!</div>
                        </div>
                    `}
                    
                    <!-- IB Work Tasks Due -->
                    ${allIBTasks.length > 0 ? `
                        <div style="background:#fef3c7; padding:20px; border-radius:10px; margin-bottom:20px; border:2px solid #f59e0b;">
                            <h3 style="margin:0 0 15px 0;">💼 IB Tasks (${allIBTasks.length} active)</h3>
                            ${allIBTasks.slice(0, 3).map(t => {
                                const priorityColor = t.priority === 'High' ? '#ef4444' : t.priority === 'Low' ? '#10b981' : '#f59e0b';
                                return `
                                    <div style="padding:12px; background:white; border-radius:8px; margin:8px 0; border-left:4px solid ${priorityColor};">
                                        <div style="font-weight:600;">${t.text}</div>
                                        <div style="font-size:0.85em; color:#666; margin-top:5px;">
                                            📊 ${t.project} • 👤 ${t.assignedTo} ${t.deadline ? `• 📅 ${t.deadline}` : ''}
                                        </div>
                                        <div style="font-size:0.8em; margin-top:5px;">
                                            <span style="background:${priorityColor}; color:white; padding:2px 6px; border-radius:10px;">${t.priority}</span>
                                            <span style="background:#3b82f6; color:white; padding:2px 6px; border-radius:10px; margin-left:5px;">${t.status}</span>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                            ${allIBTasks.length > 3 ? `<div style="text-align:center; margin-top:10px; color:#666;">+${allIBTasks.length - 3} more tasks</div>` : ''}
                            <button onclick="LifeCoach.switchModule('ibwork')" class="btn" style="width:100%; margin-top:10px;">Manage IB Work →</button>
                        </div>
                    ` : `
                        <div style="background:#f9fafb; padding:20px; border-radius:10px; margin-bottom:20px; border:2px solid #e5e7eb; text-align:center;">
                            <div style="color:#666;">💼 No active IB tasks</div>
                            <button onclick="LifeCoach.switchModule('ibwork')" class="btn btn-secondary" style="margin-top:10px;">Add IB Project</button>
                        </div>
                    `}
                    
                    <!-- Today's Events -->
                    ${todayEvents.length > 0 ? `
                        <div style="background:#e0f2fe; padding:20px; border-radius:10px; margin-bottom:20px; border:2px solid #0ea5e9;">
                            <h3 style="margin:0 0 15px 0;">📅 Today's Events (${todayEvents.length})</h3>
                            ${todayEvents.map(e => `
                                <div style="padding:12px; background:white; border-radius:8px; margin:8px 0; border-left:4px solid #0ea5e9;">
                                    <div style="font-weight:600;">${e.title}</div>
                                    <div style="font-size:0.85em; color:#666; margin-top:5px;">
                                        ${e.time ? `🕐 ${e.time}` : '🕐 All day'}
                                        ${e.notes ? ` • ${e.notes}` : ''}
                                    </div>
                                </div>
                            `).join('')}
                            <button onclick="LifeCoach.switchModule('calendar')" class="btn" style="width:100%; margin-top:10px;">View Calendar →</button>
                        </div>
                    ` : `
                        <div style="background:#f9fafb; padding:20px; border-radius:10px; margin-bottom:20px; border:2px solid #e5e7eb; text-align:center;">
                            <div style="color:#666;">📅 No events scheduled today</div>
                            <button onclick="LifeCoach.switchModule('calendar')" class="btn btn-secondary" style="margin-top:10px;">Add Event</button>
                        </div>
                    `}
                    
                    <!-- Today's Workout -->
                    ${todayWorkout.length > 0 ? `
                        <div style="background:#fef3c7; padding:20px; border-radius:10px; margin-bottom:20px; border:2px solid #f59e0b;">
                            <h3 style="margin:0 0 15px 0;">💪 Today's Workout</h3>
                            <div style="font-weight:600; font-size:1.1em; margin-bottom:15px;">Workout ${todayWorkout[0].workoutNum} - ${todayWorkout[0].day}</div>
                            ${todayWorkout.map(w => {
                                const lastLog = w.completions && w.completions.length > 0 ? w.completions[w.completions.length - 1] : null;
                                return `
                                    <div style="background:white; padding:12px; margin:8px 0; border-radius:8px; border-left:4px solid #f59e0b;">
                                        <div style="font-weight:600;">${w.name}</div>
                                        <div style="font-size:0.9em; color:#666; margin-top:5px;">
                                            Target: ${w.sets}×${w.reps} @ ${w.tempo} tempo
                                            ${lastLog ? ` • Last: ${lastLog.weight} lbs` : ''}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                            <button onclick="LifeCoach.switchModule('workout')" class="btn" style="width:100%; margin-top:10px;">Start Workout →</button>
                        </div>
                    ` : nextWorkout ? `
                        <div style="background:#fef3c7; padding:20px; border-radius:10px; margin-bottom:20px; border:2px solid #f59e0b;">
                            <h3 style="margin:0 0 10px 0;">💪 Next Workout</h3>
                            <div style="font-weight:600; font-size:1.1em;">Workout ${nextWorkout.workoutNum} - ${nextWorkout.day}</div>
                            <div style="font-size:0.9em; color:#666; margin-top:5px;">
                                ${new Date(nextWorkout.date).toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'})}
                            </div>
                            <button onclick="LifeCoach.switchModule('workout')" class="btn" style="width:100%; margin-top:10px;">View Workout →</button>
                        </div>
                    ` : ''}
                    
                    <!-- Active Goals -->
                    ${activeGoals.length > 0 ? `
                        <div style="background:#fce7f3; padding:20px; border-radius:10px; margin-bottom:20px; border:2px solid #ec4899;">
                            <h3 style="margin:0 0 15px 0;">🎯 Active Goals (${activeGoals.length})</h3>
                            ${activeGoals.slice(0, 3).map(g => `
                                <div style="padding:12px; background:white; border-radius:8px; margin:8px 0;">
                                    <div style="font-weight:600;">${g.title}</div>
                                    <div style="background:#f3f4f6; border-radius:8px; height:8px; margin-top:8px; overflow:hidden;">
                                        <div style="background:#ec4899; height:100%; width:${g.progress}%;"></div>
                                    </div>
                                    <div style="font-size:0.85em; color:#666; margin-top:5px;">${g.progress}% complete</div>
                                </div>
                            `).join('')}
                            ${activeGoals.length > 3 ? `<div style="text-align:center; margin-top:10px; color:#666;">+${activeGoals.length - 3} more</div>` : ''}
                            <button onclick="LifeCoach.switchModule('goals')" class="btn" style="width:100%; margin-top:10px;">Manage Goals →</button>
                        </div>
                    ` : ''}
                    
                    <!-- Quick Links -->
                    <div style="background:#f9fafb; padding:20px; border-radius:10px; border:2px solid #e5e7eb;">
                        <h3 style="margin:0 0 15px 0;">🔗 Quick Links</h3>
                        <div style="display:grid; gap:10px;">
                            <button onclick="LifeCoach.switchModule('roadmap')" class="btn btn-secondary" style="width:100%; text-align:left; padding:12px;">📊 52-Week Roadmap</button>
                            <button onclick="LifeCoach.switchModule('crm')" class="btn btn-secondary" style="width:100%; text-align:left; padding:12px;">👥 CRM & Clients</button>
                            <button onclick="LifeCoach.switchModule('learn')" class="btn btn-secondary" style="width:100%; text-align:left; padding:12px;">📚 Learning Resources</button>
                            <button onclick="LifeCoach.switchModule('manifestation')" class="btn btn-secondary" style="width:100%; text-align:left; padding:12px;">✨ Manifestation</button>
                            <button onclick="LifeCoach.switchModule('motivation')" class="btn btn-secondary" style="width:100%; text-align:left; padding:12px;">💪 Daily Motivation</button>
                        </div>
                        
                        <div style="margin-top:20px; padding-top:20px; border-top:2px solid #e5e7eb;">
                            <h4 style="margin:0 0 10px 0; font-size:0.9em; color:#666;">⚙️ Roadmap Management</h4>
                            <button onclick="LifeCoach.resetRoadmap()" class="btn" style="width:100%; background:#ef4444; text-align:left; padding:12px;">🔄 Reset Roadmap (Start Over)</button>
                            <div style="font-size:0.8em; color:#999; margin-top:8px;">
                                Current: Week ${currentWeek}, Day ${dateInfo.totalDays + 1} • Started ${LifeCoach.getStartDate().toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        getRoadmapWeeks() {
            // Simplified roadmap data - just first 4 weeks for now
            return [{w:1,title:"Learn & Identify",mrr:0,milestone:"30 targets found",tasks:[{day:"Mon",task:"Watch AI Jason videos",desc:"Study GHL integration strategies",time:"2h"},{day:"Tue",task:"Prompt engineering basics",desc:"Build 5 ChatGPT prompts",time:"1.5h"},{day:"Wed",task:"Build 3 ChatGPT templates",desc:"Cold email, consultation, proposal",time:"2h"},{day:"Thu",task:"Find 30 businesses",desc:"Restaurants, dental, auto shops in your area",time:"3h"},{day:"Fri",task:"Cold outreach test",desc:"Email 10 prospects using templates",time:"2h"},{day:"Sat",task:"Track responses",desc:"Organize leads in simple CRM",time:"1h"}]},{w:2,title:"First Outreach",mrr:0,milestone:"5 responses received",tasks:[{day:"Mon",task:"Refine pitch",desc:"Analyze what worked",time:"1h"},{day:"Tue",task:"Email 20 prospects",desc:"Use refined templates",time:"2h"},{day:"Wed",task:"Follow up",desc:"Book 2 consultation calls",time:"2h"},{day:"Thu",task:"Prepare script",desc:"Problem discovery + solution presentation",time:"2h"},{day:"Fri",task:"2 consultations",desc:"Free audits, find pain points",time:"3h"},{day:"Sat",task:"Build proposals",desc:"Custom automation solutions",time:"2h"}]},{w:3,title:"First Proposal",mrr:0,milestone:"2 proposals sent",tasks:[{day:"Mon",task:"Send proposals",desc:"Clear ROI, 30-day guarantee",time:"1h"},{day:"Tue",task:"Follow up",desc:"Answer questions, handle objections",time:"2h"},{day:"Wed",task:"Continue outreach",desc:"Email 15 more prospects",time:"2h"},{day:"Thu",task:"2 more consultations",desc:"Building pipeline",time:"3h"},{day:"Fri",task:"Learn GHL basics",desc:"Watch tutorials, test features",time:"2h"},{day:"Sat",task:"Build automation",desc:"Simple workflow for yourself",time:"3h"}]},{w:4,title:"First Client",mrr:250,milestone:"$250 MRR achieved",tasks:[{day:"Mon",task:"Close first client",desc:"Sign contract, collect payment",time:"2h"},{day:"Tue",task:"Onboarding",desc:"Get access to their systems",time:"3h"},{day:"Wed",task:"Build automation",desc:"Start with MVP, get quick win",time:"4h"},{day:"Thu",task:"Test & refine",desc:"Make sure it works perfectly",time:"3h"},{day:"Fri",task:"Deploy & train",desc:"Show them how to use it",time:"2h"},{day:"Sat",task:"Get testimonial",desc:"Document results, ask for referrals",time:"1h"}]}];
        },
        
        refresh() {
            this.render();
        }
    };
    
    window.modules.overview = OverviewModule;
    OverviewModule.init();
})();
