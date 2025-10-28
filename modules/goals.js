// Goals Module - Personal & Business Goals
(function() {
    'use strict';
    
    let goals = [];
    
    const GoalsModule = {
        init() {
            this.loadData();
            this.render();
        },
        
        loadData() {
            goals = LifeCoach.getData('GOALS') || [];
        },
        
        saveData() {
            LifeCoach.saveData('GOALS', goals);
        },
        
        addGoal() {
            const title = document.getElementById('goal-title').value.trim();
            const category = document.getElementById('goal-category').value;
            const target = document.getElementById('goal-target').value;
            const why = document.getElementById('goal-why').value.trim();
            
            if (!title) {
                alert('Goal title required');
                return;
            }
            
            goals.push({
                id: Date.now(),
                title,
                category,
                target,
                why,
                progress: 0,
                completed: false,
                created: new Date().toISOString(),
                milestones: []
            });
            
            this.saveData();
            this.render();
            
            document.getElementById('goal-title').value = '';
            document.getElementById('goal-why').value = '';
            document.getElementById('goal-target').value = '';
        },
        
        updateProgress(id, progress) {
            const goal = goals.find(g => g.id === id);
            goal.progress = Math.min(100, Math.max(0, parseInt(progress)));
            if (goal.progress === 100 && !goal.completed) {
                goal.completed = true;
                goal.completedDate = new Date().toISOString();
                alert(`🎉 Goal Completed: ${goal.title}!`);
            }
            this.saveData();
            this.render();
        },
        
        deleteGoal(id) {
            if (confirm('Delete this goal?')) {
                goals = goals.filter(g => g.id !== id);
                this.saveData();
                this.render();
            }
        },
        
        render() {
            const activeGoals = goals.filter(g => !g.completed);
            const completedGoals = goals.filter(g => g.completed);
            
            document.getElementById('goals-content').innerHTML = `
                <div class="card">
                    <h2>🎯 Goals & Targets</h2>
                    <p style="color:#666;">Set ambitious goals and track your progress</p>
                    
                    <div style="background:#f9fafb; padding:20px; border-radius:10px; margin:20px 0;">
                        <h3 style="margin:0 0 15px 0; font-size:1em;">Add New Goal</h3>
                        <input type="text" id="goal-title" placeholder="Goal (e.g., 'Reach $12k MRR')" style="width:100%; padding:12px; margin:5px 0; border:2px solid #e0e0e0; border-radius:8px;">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin:5px 0;">
                            <select id="goal-category" style="padding:12px; border:2px solid #e0e0e0; border-radius:8px;">
                                <option>💼 Business</option>
                                <option>💰 Financial</option>
                                <option>🏋️ Fitness</option>
                                <option>📚 Learning</option>
                                <option>❤️ Relationship</option>
                                <option>🏠 Personal</option>
                            </select>
                            <input type="date" id="goal-target" style="padding:12px; border:2px solid #e0e0e0; border-radius:8px;">
                        </div>
                        <textarea id="goal-why" placeholder="Why is this important to you?" style="width:100%; height:60px; padding:12px; margin:5px 0; border:2px solid #e0e0e0; border-radius:8px;"></textarea>
                        <button class="btn" onclick="window.modules.goals.addGoal()" style="width:100%;">➕ Add Goal</button>
                    </div>
                    
                    <h3 style="margin:30px 0 15px 0;">🎯 Active Goals (${activeGoals.length})</h3>
                    ${activeGoals.length === 0 ? '<p style="color:#999; text-align:center; padding:40px;">No active goals. Add one above!</p>' :
                    activeGoals.map(g => {
                        const daysLeft = g.target ? Math.ceil((new Date(g.target) - new Date()) / 86400000) : null;
                        return `
                            <div style="background:white; padding:20px; margin:15px 0; border-radius:10px; border:2px solid #667eea;">
                                <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:15px;">
                                    <div style="flex:1;">
                                        <div style="font-size:1.2em; font-weight:600; margin-bottom:5px;">${g.title}</div>
                                        <div style="font-size:0.9em; color:#666;">
                                            ${g.category} ${g.target ? `• Target: ${new Date(g.target).toLocaleDateString()}` : ''}
                                            ${daysLeft !== null ? `• ${daysLeft > 0 ? daysLeft + ' days left' : 'Overdue'}` : ''}
                                        </div>
                                        ${g.why ? `<div style="margin-top:10px; padding:10px; background:#f0f9ff; border-radius:5px; font-size:0.9em;"><strong>Why:</strong> ${g.why}</div>` : ''}
                                    </div>
                                    <button onclick="window.modules.goals.deleteGoal(${g.id})" style="background:none; border:2px solid #ef4444; color:#ef4444; padding:6px 10px; border-radius:5px; cursor:pointer; margin-left:10px;">🗑️</button>
                                </div>
                                
                                <div style="margin-top:15px;">
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                        <div style="font-size:0.9em; color:#666;">Progress</div>
                                        <div style="font-size:1.2em; font-weight:bold; color:#667eea;">${g.progress}%</div>
                                    </div>
                                    <div style="background:#f3f4f6; border-radius:8px; height:12px; overflow:hidden;">
                                        <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); height:100%; width:${g.progress}%; transition:width 0.3s;"></div>
                                    </div>
                                    <input type="range" min="0" max="100" value="${g.progress}" onchange="window.modules.goals.updateProgress(${g.id}, this.value)" style="width:100%; margin-top:10px; cursor:pointer;">
                                </div>
                            </div>
                        `;
                    }).join('')}
                    
                    ${completedGoals.length > 0 ? `
                        <h3 style="margin:30px 0 15px 0;">✅ Completed Goals (${completedGoals.length})</h3>
                        ${completedGoals.map(g => `
                            <div style="background:#f0fdf4; padding:15px; margin:10px 0; border-radius:10px; border:2px solid #10b981; opacity:0.8;">
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <div>
                                        <div style="font-weight:600;">✅ ${g.title}</div>
                                        <div style="font-size:0.85em; color:#666; margin-top:5px;">Completed ${new Date(g.completedDate).toLocaleDateString()}</div>
                                    </div>
                                    <button onclick="window.modules.goals.deleteGoal(${g.id})" style="background:none; border:2px solid #ef4444; color:#ef4444; padding:6px 10px; border-radius:5px; cursor:pointer;">🗑️</button>
                                </div>
                            </div>
                        `).join('')}
                    ` : ''}
                </div>
            `;
        },
        
        refresh() {
            this.loadData();
            this.render();
        }
    };
    
    window.modules.goals = GoalsModule;
    GoalsModule.init();
})();
