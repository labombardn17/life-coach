// IB Work Module - Professional Investment Banking Task Management
(function() {
    'use strict';
    
    let projects = [];
    let showArchived = false;
    
    const IBWorkModule = {
        init() {
            this.loadData();
            this.render();
        },
        
        loadData() {
            projects = LifeCoach.getData('IBWORK') || [];
        },
        
        saveData() {
            LifeCoach.saveData('IBWORK', projects);
        },
        
        addProject() {
            const name = prompt('Deal/Project Name (e.g., "ABC Corp - Sell-Side M&A"):');
            if (!name) return;
            
            const client = prompt('Client Name:') || '';
            const type = prompt('Deal Type (M&A, ECM, DCM, Restructuring, etc.):') || 'M&A';
            
            projects.push({
                id: Date.now(),
                name: name.trim(),
                client: client.trim(),
                type: type.trim(),
                status: 'Active',
                tasks: [],
                archived: false,
                created: new Date().toISOString()
            });
            this.saveData();
            this.render();
        },
        
        addTask(projectId) {
            const project = projects.find(p => p.id === projectId);
            
            const taskText = prompt('Task Description:');
            if (!taskText) return;
            
            const assignedTo = prompt('Assigned To (Analyst, Associate, VP, MD, Your Name):') || 'Me';
            const deadline = prompt('Deadline (MM/DD or leave blank):') || '';
            const priority = prompt('Priority (High, Medium, Low):') || 'Medium';
            
            project.tasks.push({
                id: Date.now(),
                text: taskText.trim(),
                assignedTo: assignedTo.trim(),
                deadline: deadline.trim(),
                priority: priority.trim(),
                status: 'To Do',
                completed: false,
                completedDate: null,
                notes: '',
                created: new Date().toISOString()
            });
            this.saveData();
            this.render();
        },
        
        editTask(projectId, taskId) {
            const project = projects.find(p => p.id === projectId);
            const task = project.tasks.find(t => t.id === taskId);
            
            const newText = prompt('Edit Task:', task.text);
            if (newText !== null && newText.trim()) {
                task.text = newText.trim();
                this.saveData();
                this.render();
            }
        },
        
        updateTaskStatus(projectId, taskId, newStatus) {
            const project = projects.find(p => p.id === projectId);
            const task = project.tasks.find(t => t.id === taskId);
            
            task.status = newStatus;
            
            if (newStatus === 'Done') {
                task.completed = true;
                task.completedDate = new Date().toISOString();
            } else {
                task.completed = false;
                task.completedDate = null;
            }
            
            this.saveData();
            this.render();
        },
        
        deleteTask(projectId, taskId) {
            if (confirm('Delete this task?')) {
                const project = projects.find(p => p.id === projectId);
                project.tasks = project.tasks.filter(t => t.id !== taskId);
                this.saveData();
                this.render();
            }
        },
        
        archiveProject(id) {
            if (confirm('Archive this project? (You can view it later in Archived Projects)')) {
                const project = projects.find(p => p.id === id);
                project.archived = true;
                project.archivedDate = new Date().toISOString();
                this.saveData();
                this.render();
            }
        },
        
        unarchiveProject(id) {
            const project = projects.find(p => p.id === id);
            project.archived = false;
            project.archivedDate = null;
            this.saveData();
            this.render();
        },
        
        deleteProject(id) {
            if (confirm('Permanently delete project and all tasks? Consider archiving instead.')) {
                projects = projects.filter(p => p.id !== id);
                this.saveData();
                this.render();
            }
        },
        
        toggleArchived() {
            showArchived = !showArchived;
            this.render();
        },
        
        render() {
            const activeProjects = projects.filter(p => !p.archived);
            const archivedProjects = projects.filter(p => p.archived);
            const displayProjects = showArchived ? archivedProjects : activeProjects;
            
            const priorityColors = {
                'High': '#ef4444',
                'Medium': '#f59e0b',
                'Low': '#10b981'
            };
            
            const statusColors = {
                'To Do': '#6b7280',
                'In Progress': '#3b82f6',
                'Review': '#8b5cf6',
                'Done': '#10b981'
            };
            
            document.getElementById('ibwork-content').innerHTML = `
                <div class="card">
                    <h2>💼 IB Work Tracker</h2>
                    <p style="color:#666;">Professional deal & task management</p>
                    
                    <div style="display:flex; gap:10px; margin:20px 0;">
                        <button class="btn" onclick="window.modules.ibwork.addProject()" style="flex:1;">➕ New Project</button>
                        <button class="btn btn-secondary" onclick="window.modules.ibwork.toggleArchived()" style="flex:1;">
                            ${showArchived ? '📂 Show Active' : '📁 Show Archived'} (${archivedProjects.length})
                        </button>
                    </div>
                    
                    ${displayProjects.length === 0 ? `
                        <p style="color:#999; text-align:center; padding:40px;">
                            ${showArchived ? 'No archived projects' : 'No active projects. Click above to add one!'}
                        </p>
                    ` :
                    displayProjects.map(p => {
                        const totalTasks = p.tasks.length;
                        const completedTasks = p.tasks.filter(t => t.completed).length;
                        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                        const activeTasks = p.tasks.filter(t => !t.completed);
                        const completedTasksList = p.tasks.filter(t => t.completed);
                        
                        return `
                            <div style="background:${p.archived ? '#f3f4f6' : 'white'}; padding:20px; margin:20px 0; border-radius:10px; border:2px solid ${p.archived ? '#9ca3af' : '#667eea'};">
                                <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:15px;">
                                    <div style="flex:1;">
                                        <div style="display:flex; align-items:center; gap:10px; margin-bottom:5px;">
                                            <h3 style="margin:0;">${p.name}</h3>
                                            ${p.archived ? '<span style="background:#9ca3af; color:white; padding:4px 8px; border-radius:12px; font-size:0.75em;">Archived</span>' : ''}
                                        </div>
                                        <div style="font-size:0.9em; color:#666; margin-top:5px;">
                                            ${p.client ? `📊 ${p.client} • ` : ''}${p.type} • Created ${new Date(p.created).toLocaleDateString()}
                                        </div>
                                        <div style="margin-top:10px; background:#f3f4f6; border-radius:8px; height:10px; overflow:hidden;">
                                            <div style="background:#10b981; height:100%; width:${progress}%; transition:width 0.3s;"></div>
                                        </div>
                                        <div style="font-size:0.85em; color:#666; margin-top:5px;">${completedTasks}/${totalTasks} tasks complete (${progress}%)</div>
                                    </div>
                                    <div style="display:flex; flex-direction:column; gap:5px; margin-left:10px;">
                                        ${!p.archived ? `<button onclick="window.modules.ibwork.archiveProject(${p.id})" style="background:none; border:2px solid #f59e0b; color:#f59e0b; padding:6px 10px; border-radius:5px; cursor:pointer; white-space:nowrap; font-size:0.85em;">📁 Archive</button>` : `<button onclick="window.modules.ibwork.unarchiveProject(${p.id})" style="background:none; border:2px solid #10b981; color:#10b981; padding:6px 10px; border-radius:5px; cursor:pointer; white-space:nowrap; font-size:0.85em;">📂 Restore</button>`}
                                        <button onclick="window.modules.ibwork.deleteProject(${p.id})" style="background:none; border:2px solid #ef4444; color:#ef4444; padding:6px 10px; border-radius:5px; cursor:pointer; font-size:0.85em;">🗑️</button>
                                    </div>
                                </div>
                                
                                ${!p.archived ? `<button class="btn btn-secondary" onclick="window.modules.ibwork.addTask(${p.id})" style="width:100%; margin-bottom:15px;">➕ Add Task</button>` : ''}
                                
                                ${p.tasks.length === 0 ? '<p style="color:#999; text-align:center; padding:20px; font-size:0.9em;">No tasks yet</p>' : `
                                    ${activeTasks.length > 0 ? `
                                        <div style="margin-bottom:20px;">
                                            <h4 style="margin:0 0 10px 0; font-size:0.95em; color:#666;">Active Tasks (${activeTasks.length})</h4>
                                            ${activeTasks.map(t => `
                                                <div style="background:#fff; padding:15px; margin:8px 0; border-radius:8px; border:2px solid ${priorityColors[t.priority] || '#e5e7eb'};">
                                                    <div style="display:flex; justify-content:space-between; align-items:start; gap:10px; margin-bottom:10px;">
                                                        <div style="flex:1;">
                                                            <div style="font-weight:600; margin-bottom:5px;">${t.text}</div>
                                                            <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:8px;">
                                                                <span style="background:#667eea; color:white; padding:3px 8px; border-radius:12px; font-size:0.8em;">👤 ${t.assignedTo}</span>
                                                                ${t.deadline ? `<span style="background:#f59e0b; color:white; padding:3px 8px; border-radius:12px; font-size:0.8em;">📅 ${t.deadline}</span>` : ''}
                                                                <span style="background:${priorityColors[t.priority]}; color:white; padding:3px 8px; border-radius:12px; font-size:0.8em;">🔥 ${t.priority}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style="display:flex; gap:5px; flex-wrap:wrap;">
                                                        <select onchange="window.modules.ibwork.updateTaskStatus(${p.id}, ${t.id}, this.value)" style="flex:1; padding:8px; border:2px solid #e5e7eb; border-radius:5px; font-size:0.85em; cursor:pointer;">
                                                            <option value="To Do" ${t.status === 'To Do' ? 'selected' : ''}>📋 To Do</option>
                                                            <option value="In Progress" ${t.status === 'In Progress' ? 'selected' : ''}>🔄 In Progress</option>
                                                            <option value="Review" ${t.status === 'Review' ? 'selected' : ''}>👀 Review</option>
                                                            <option value="Done" ${t.status === 'Done' ? 'selected' : ''}>✅ Done</option>
                                                        </select>
                                                        <button onclick="window.modules.ibwork.editTask(${p.id}, ${t.id})" style="background:none; border:2px solid #3b82f6; color:#3b82f6; padding:6px 10px; border-radius:5px; cursor:pointer; font-size:0.85em;">✏️</button>
                                                        <button onclick="window.modules.ibwork.deleteTask(${p.id}, ${t.id})" style="background:none; border:2px solid #ef4444; color:#ef4444; padding:6px 10px; border-radius:5px; cursor:pointer; font-size:0.85em;">🗑️</button>
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    ` : ''}
                                    
                                    ${completedTasksList.length > 0 ? `
                                        <div>
                                            <h4 style="margin:0 0 10px 0; font-size:0.95em; color:#666;">Completed Tasks (${completedTasksList.length})</h4>
                                            ${completedTasksList.map(t => `
                                                <div style="background:#f0fdf4; padding:12px; margin:8px 0; border-radius:8px; border:2px solid #10b981; opacity:0.7;">
                                                    <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
                                                        <div style="flex:1;">
                                                            <div style="font-weight:500; text-decoration:line-through; margin-bottom:5px;">${t.text}</div>
                                                            <div style="font-size:0.8em; color:#666;">
                                                                ✅ Completed ${new Date(t.completedDate).toLocaleDateString()} • ${t.assignedTo}
                                                            </div>
                                                        </div>
                                                        <button onclick="window.modules.ibwork.updateTaskStatus(${p.id}, ${t.id}, 'To Do')" style="background:none; border:2px solid #3b82f6; color:#3b82f6; padding:4px 8px; border-radius:5px; cursor:pointer; font-size:0.8em; white-space:nowrap;">↩️ Reopen</button>
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    ` : ''}
                                `}
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        },
        
        refresh() {
            this.loadData();
            this.render();
        }
    };
    
    window.modules.ibwork = IBWorkModule;
    IBWorkModule.init();
})();
