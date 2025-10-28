// Today Module - Quick Daily Tasks (Resets Every Day)
(function() {
    'use strict';
    
    let todayTasks = [];
    let lastResetDate = '';
    
    const TodayModule = {
        init() {
            this.loadData();
            this.checkReset();
            this.render();
        },
        
        loadData() {
            const saved = LifeCoach.getData('TODAY') || {};
            todayTasks = saved.tasks || [];
            lastResetDate = saved.lastResetDate || new Date().toDateString();
        },
        
        saveData() {
            LifeCoach.saveData('TODAY', {
                tasks: todayTasks,
                lastResetDate: lastResetDate
            });
        },
        
        checkReset() {
            const today = new Date().toDateString();
            if (lastResetDate !== today) {
                // New day! Reset tasks
                todayTasks = [];
                lastResetDate = today;
                this.saveData();
            }
        },
        
        addTask() {
            const text = document.getElementById('today-task-input').value.trim();
            if (!text) {
                alert('Please enter a task');
                return;
            }
            
            todayTasks.push({
                id: Date.now(),
                text: text,
                done: false,
                added: new Date().toLocaleTimeString()
            });
            
            this.saveData();
            this.render();
            document.getElementById('today-task-input').value = '';
        },
        
        toggleTask(id) {
            const task = todayTasks.find(t => t.id === id);
            if (task) {
                task.done = !task.done;
                this.saveData();
                this.render();
            }
        },
        
        deleteTask(id) {
            todayTasks = todayTasks.filter(t => t.id !== id);
            this.saveData();
            this.render();
        },
        
        render() {
            const today = new Date();
            const todayFormatted = today.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
            });
            
            const completed = todayTasks.filter(t => t.done).length;
            const total = todayTasks.length;
            const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;
            
            document.getElementById('today-content').innerHTML = `
                <div class="card">
                    <h2>📋 Today's Quick Tasks</h2>
                    <p style="color:#666; margin-bottom:20px;">${todayFormatted}</p>
                    
                    <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; padding:20px; border-radius:15px; margin-bottom:20px;">
                        <div style="font-size:1.5em; font-weight:bold; margin-bottom:10px;">
                            ${completed} / ${total} Complete
                        </div>
                        <div style="background:rgba(255,255,255,0.3); border-radius:8px; height:12px; overflow:hidden;">
                            <div style="background:white; height:100%; width:${progressPct}%; transition:width 0.3s;"></div>
                        </div>
                        <div style="margin-top:10px; font-size:0.9em; opacity:0.9;">
                            ⏰ These tasks reset at midnight
                        </div>
                    </div>
                    
                    <div style="background:#f9fafb; padding:20px; border-radius:10px; margin-bottom:20px;">
                        <h3 style="margin:0 0 15px 0; font-size:1em;">➕ Add Quick Task</h3>
                        <div style="display:flex; gap:10px;">
                            <input type="text" id="today-task-input" placeholder="Get groceries, call mom, pick up dry cleaning..." style="flex:1; padding:12px; border:2px solid #e0e0e0; border-radius:8px; font-size:1em;" onkeypress="if(event.key==='Enter') window.modules.today.addTask()">
                            <button class="btn" onclick="window.modules.today.addTask()" style="padding:12px 24px; white-space:nowrap;">Add</button>
                        </div>
                        <div style="margin-top:10px; font-size:0.85em; color:#666;">
                            💡 Press Enter or click Add
                        </div>
                    </div>
                    
                    ${todayTasks.length === 0 ? `
                        <div style="text-align:center; padding:60px 20px; background:#f9fafb; border-radius:10px;">
                            <div style="font-size:3em; margin-bottom:15px;">✨</div>
                            <div style="font-size:1.2em; font-weight:600; margin-bottom:10px;">No tasks yet</div>
                            <div style="color:#666;">Add your quick to-dos above</div>
                        </div>
                    ` : `
                        <div>
                            <h3 style="margin:0 0 15px 0;">Today's List</h3>
                            ${todayTasks.map(task => `
                                <div style="background:${task.done ? '#f0fdf4' : 'white'}; padding:15px; margin:10px 0; border-radius:10px; border:2px solid ${task.done ? '#10b981' : '#e5e7eb'}; display:flex; align-items:center; gap:15px;">
                                    <input type="checkbox" ${task.done ? 'checked' : ''} onchange="window.modules.today.toggleTask(${task.id})" style="width:24px; height:24px; cursor:pointer; flex-shrink:0;">
                                    <div style="flex:1;">
                                        <div style="font-size:1.05em; ${task.done ? 'text-decoration:line-through; opacity:0.6;' : 'font-weight:500;'}">${task.text}</div>
                                        <div style="font-size:0.8em; color:#999; margin-top:4px;">Added at ${task.added}</div>
                                    </div>
                                    <button onclick="window.modules.today.deleteTask(${task.id})" style="background:none; border:2px solid #ef4444; color:#ef4444; padding:8px 12px; border-radius:5px; cursor:pointer; flex-shrink:0;">🗑️</button>
                                </div>
                            `).join('')}
                        </div>
                    `}
                    
                    <div style="background:#f0f9ff; padding:20px; border-radius:10px; margin-top:30px; border:2px solid #0ea5e9;">
                        <h3 style="margin:0 0 10px 0;">💡 How It Works</h3>
                        <div style="line-height:1.8; color:#666; font-size:0.95em;">
                            • <strong>Quick Tasks:</strong> Add anything you need to do TODAY<br>
                            • <strong>Auto-Reset:</strong> Tasks clear at midnight automatically<br>
                            • <strong>Examples:</strong> Get groceries, call mom, email client<br>
                            • <strong>Different from Habits:</strong> These are one-time today tasks<br>
                            • <strong>Pro Tip:</strong> Check this first thing in the morning!
                        </div>
                    </div>
                </div>
            `;
        },
        
        refresh() {
            this.checkReset();
            this.loadData();
            this.render();
        }
    };
    
    window.modules.today = TodayModule;
    TodayModule.init();
})();
