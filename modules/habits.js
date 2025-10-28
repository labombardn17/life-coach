// Habits Module - Daily habit tracking with streaks
(function() {
    'use strict';
    
    let habits = [];
    
    const HabitsModule = {
        init() {
            this.loadData();
            this.render();
        },
        
        loadData() {
            habits = LifeCoach.getData('HABITS') || [];
        },
        
        saveData() {
            LifeCoach.saveData('HABITS', habits);
        },
        
        render() {
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            const todayStr = new Date().toDateString();
            
            document.getElementById('habits-content').innerHTML = `
                <div class="card">
                    <h2>✅ Daily Habits Tracker</h2>
                    <p style="color:#666; margin-bottom:20px;">Build consistency. Track streaks. Stay accountable.</p>
                    
                    <div style="background:#f0f9ff; padding:15px; border-radius:10px; margin-bottom:20px;">
                        <h3 style="margin:0 0 10px 0; font-size:1em;">Add New Habit</h3>
                        <input type="text" id="habit-name" placeholder="Habit name (e.g., '🏋️ Gym workout')" style="width:100%; padding:12px; margin:5px 0; border:2px solid #e0e0e0; border-radius:8px; font-size:1em;">
                        <select id="habit-frequency" style="width:100%; padding:12px; margin:5px 0; border:2px solid #e0e0e0; border-radius:8px; font-size:1em;">
                            <option>Daily</option>
                            <option>Weekdays</option>
                            <option>Weekends</option>
                        </select>
                        <button class="btn" onclick="window.modules.habits.addHabit()" style="width:100%; margin-top:10px;">➕ Add Habit</button>
                    </div>
                    
                    <h3 style="margin:20px 0 10px 0;">📅 Today - ${today}</h3>
                    <div id="today-habits">${this.renderTodayHabits(todayStr)}</div>
                    
                    <h3 style="margin:30px 0 15px 0;">📊 All Habits</h3>
                    <div id="all-habits">${this.renderAllHabits()}</div>
                </div>
            `;
        },
        
        renderTodayHabits(todayStr) {
            if (habits.length === 0) {
                return '<p style="color:#999; text-align:center; padding:20px;">No habits yet. Add your first one above!</p>';
            }
            
            return habits.map(h => {
                const isDone = h.completions && h.completions.includes(todayStr);
                return `
                    <div style="background:white; padding:15px; margin:10px 0; border-radius:10px; border:2px solid ${isDone ? '#10b981' : '#e5e7eb'}; display:flex; align-items:center; gap:15px;">
                        <input type="checkbox" ${isDone ? 'checked' : ''} onchange="window.modules.habits.toggleHabit(${h.id}, '${todayStr}')" style="width:24px; height:24px; cursor:pointer;">
                        <div style="flex:1;">
                            <div style="font-size:1.1em; font-weight:600; ${isDone ? 'text-decoration:line-through; color:#999;' : ''}">${h.name}</div>
                            <div style="font-size:0.85em; color:#666; margin-top:4px;">
                                🔥 ${this.calculateStreak(h)} day streak • ${h.frequency}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        },
        
        renderAllHabits() {
            if (habits.length === 0) return '';
            
            return habits.map(h => {
                const streak = this.calculateStreak(h);
                const longestStreak = h.longestStreak || 0;
                const completionRate = this.getCompletionRate(h);
                const last7Days = this.getLast7Days(h);
                
                return `
                    <div style="background:#f9fafb; padding:20px; margin:15px 0; border-radius:10px; border:1px solid #e5e7eb;">
                        <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:15px;">
                            <div style="flex:1;">
                                <div style="font-size:1.2em; font-weight:600; margin-bottom:5px;">${h.name}</div>
                                <div style="font-size:0.9em; color:#666;">${h.frequency}</div>
                            </div>
                            <button onclick="window.modules.habits.deleteHabit(${h.id})" style="background:none; border:2px solid #ef4444; color:#ef4444; padding:8px 12px; border-radius:8px; cursor:pointer; font-size:0.9em;">🗑️</button>
                        </div>
                        
                        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; margin-bottom:15px;">
                            <div style="text-align:center; padding:10px; background:white; border-radius:8px;">
                                <div style="font-size:1.5em; font-weight:bold; color:#f59e0b;">🔥 ${streak}</div>
                                <div style="font-size:0.8em; color:#666;">Current</div>
                            </div>
                            <div style="text-align:center; padding:10px; background:white; border-radius:8px;">
                                <div style="font-size:1.5em; font-weight:bold; color:#8b5cf6;">🏆 ${longestStreak}</div>
                                <div style="font-size:0.8em; color:#666;">Best</div>
                            </div>
                            <div style="text-align:center; padding:10px; background:white; border-radius:8px;">
                                <div style="font-size:1.5em; font-weight:bold; color:#10b981;">✅ ${completionRate}%</div>
                                <div style="font-size:0.8em; color:#666;">Rate</div>
                            </div>
                        </div>
                        
                        <div style="margin-top:15px;">
                            <div style="font-size:0.9em; color:#666; margin-bottom:8px;">Last 7 Days:</div>
                            <div style="display:flex; gap:8px;">
                                ${last7Days.map(day => `
                                    <div style="flex:1; text-align:center;">
                                        <div style="width:100%; padding:12px; background:${day.done ? '#10b981' : '#e5e7eb'}; border-radius:8px; color:${day.done ? 'white' : '#999'}; font-size:1.2em;">
                                            ${day.done ? '✅' : '⬜'}
                                        </div>
                                        <div style="font-size:0.7em; color:#999; margin-top:4px;">${day.label}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        },
        
        addHabit() {
            const name = document.getElementById('habit-name').value.trim();
            const frequency = document.getElementById('habit-frequency').value;
            
            if (!name) {
                alert('Please enter a habit name');
                return;
            }
            
            habits.push({
                id: Date.now(),
                name: name,
                frequency: frequency,
                completions: [],
                longestStreak: 0,
                createdAt: new Date().toISOString()
            });
            
            this.saveData();
            this.render();
            
            document.getElementById('habit-name').value = '';
        },
        
        toggleHabit(id, dateStr) {
            const habit = habits.find(h => h.id === id);
            if (!habit) return;
            
            if (!habit.completions) habit.completions = [];
            
            const index = habit.completions.indexOf(dateStr);
            if (index > -1) {
                habit.completions.splice(index, 1);
            } else {
                habit.completions.push(dateStr);
            }
            
            const currentStreak = this.calculateStreak(habit);
            if (currentStreak > (habit.longestStreak || 0)) {
                habit.longestStreak = currentStreak;
            }
            
            this.saveData();
            this.render();
            
            // Update top stats
            LifeCoach.state.user.streak = Math.max(...habits.map(h => this.calculateStreak(h)), 0);
            LifeCoach.updateStats();
        },
        
        deleteHabit(id) {
            if (confirm('Delete this habit?')) {
                habits = habits.filter(h => h.id !== id);
                this.saveData();
                this.render();
            }
        },
        
        calculateStreak(habit) {
            if (!habit.completions || habit.completions.length === 0) return 0;
            
            let streak = 0;
            let checkDate = new Date();
            const today = new Date().toDateString();
            
            for (let i = 0; i < 365; i++) {
                const dateStr = checkDate.toDateString();
                if (habit.completions.includes(dateStr)) {
                    streak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                } else if (dateStr !== today) {
                    break;
                } else {
                    checkDate.setDate(checkDate.getDate() - 1);
                }
            }
            
            return streak;
        },
        
        getCompletionRate(habit) {
            if (!habit.completions || habit.completions.length === 0) return 0;
            const daysTracked = Math.ceil((new Date() - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24)) || 1;
            return Math.round((habit.completions.length / daysTracked) * 100);
        },
        
        getLast7Days(habit) {
            const days = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toDateString();
                days.push({
                    label: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    done: habit.completions && habit.completions.includes(dateStr)
                });
            }
            return days;
        },
        
        refresh() {
            this.loadData();
            this.render();
        }
    };
    
    window.modules.habits = HabitsModule;
    HabitsModule.init();
})();
