// Notes Module - Capture Your Journey to Millions
(function() {
    'use strict';
    
    let notes = [];
    let filterTag = 'all';
    let filterDate = 'all';
    let searchTerm = '';
    
    const NotesModule = {
        init() {
            this.loadData();
            this.render();
        },
        
        loadData() {
            notes = LifeCoach.getData('NOTES') || [];
            // Sort by date (newest first)
            notes.sort((a, b) => new Date(b.created) - new Date(a.created));
        },
        
        saveData() {
            LifeCoach.saveData('NOTES', notes);
        },
        
        addNote() {
            const title = document.getElementById('note-title').value.trim();
            const content = document.getElementById('note-content').value.trim();
            const category = document.getElementById('note-category').value;
            const tagsInput = document.getElementById('note-tags').value.trim();
            
            if (!title || !content) {
                alert('Title and content required');
                return;
            }
            
            const tags = tagsInput ? tagsInput.split(',').map(t => t.trim().toLowerCase()) : [];
            
            notes.unshift({
                id: Date.now(),
                title,
                content,
                category,
                tags,
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            });
            
            this.saveData();
            this.render();
            
            // Clear form
            document.getElementById('note-title').value = '';
            document.getElementById('note-content').value = '';
            document.getElementById('note-tags').value = '';
        },
        
        editNote(id) {
            const note = notes.find(n => n.id === id);
            if (!note) return;
            
            const title = prompt('Edit title:', note.title);
            if (title === null) return;
            
            const content = prompt('Edit content:', note.content);
            if (content === null) return;
            
            const tagsInput = prompt('Edit tags (comma-separated):', note.tags.join(', '));
            if (tagsInput === null) return;
            
            note.title = title.trim();
            note.content = content.trim();
            note.tags = tagsInput ? tagsInput.split(',').map(t => t.trim().toLowerCase()) : [];
            note.modified = new Date().toISOString();
            
            this.saveData();
            this.render();
        },
        
        deleteNote(id) {
            if (confirm('Delete this note permanently?')) {
                notes = notes.filter(n => n.id !== id);
                this.saveData();
                this.render();
            }
        },
        
        setFilter(tag) {
            filterTag = tag;
            this.render();
        },
        
        setDateFilter(period) {
            filterDate = period;
            this.render();
        },
        
        search(term) {
            searchTerm = term.toLowerCase();
            this.render();
        },
        
        getFilteredNotes() {
            let filtered = [...notes];
            
            // Filter by tag
            if (filterTag !== 'all') {
                filtered = filtered.filter(n => 
                    n.category.toLowerCase() === filterTag.toLowerCase() || 
                    n.tags.includes(filterTag.toLowerCase())
                );
            }
            
            // Filter by date
            if (filterDate !== 'all') {
                const now = new Date();
                filtered = filtered.filter(n => {
                    const noteDate = new Date(n.created);
                    const daysDiff = Math.floor((now - noteDate) / (1000 * 60 * 60 * 24));
                    
                    switch(filterDate) {
                        case 'today': return daysDiff === 0;
                        case 'week': return daysDiff <= 7;
                        case 'month': return daysDiff <= 30;
                        case '3months': return daysDiff <= 90;
                        default: return true;
                    }
                });
            }
            
            // Search
            if (searchTerm) {
                filtered = filtered.filter(n => 
                    n.title.toLowerCase().includes(searchTerm) ||
                    n.content.toLowerCase().includes(searchTerm) ||
                    n.tags.some(t => t.includes(searchTerm))
                );
            }
            
            return filtered;
        },
        
        getAllTags() {
            const tagSet = new Set();
            notes.forEach(n => {
                tagSet.add(n.category);
                n.tags.forEach(t => tagSet.add(t));
            });
            return Array.from(tagSet).sort();
        },
        
        render() {
            const filtered = this.getFilteredNotes();
            const allTags = this.getAllTags();
            
            const categoryIcons = {
                'Book Notes': '📚',
                'Ideas': '💡',
                'Reflections': '🤔',
                'Lessons Learned': '📝',
                'Wins': '🏆',
                'Challenges': '⚔️',
                'Goals': '🎯',
                'Gratitude': '🙏'
            };
            
            document.getElementById('notes-content').innerHTML = `
                <div class="card">
                    <h2>📓 Notes - Your Journey</h2>
                    <p style="color:#666;">Capture insights, book notes, ideas, and reflections</p>
                    
                    <div style="background:#f9fafb; padding:20px; border-radius:10px; margin:20px 0;">
                        <h3 style="margin:0 0 15px 0;">✍️ Add Note</h3>
                        <input type="text" id="note-title" placeholder="Note title (e.g., 'Key insights from $100M Offers')" style="width:100%; padding:12px; margin:5px 0; border:2px solid #e0e0e0; border-radius:8px;">
                        <textarea id="note-content" placeholder="Write your note here... (insights, quotes, action items, reflections)" style="width:100%; height:100px; padding:12px; margin:5px 0; border:2px solid #e0e0e0; border-radius:8px;"></textarea>
                        <select id="note-category" style="width:100%; padding:12px; margin:5px 0; border:2px solid #e0e0e0; border-radius:8px;">
                            <option>Book Notes</option>
                            <option>Ideas</option>
                            <option>Reflections</option>
                            <option>Lessons Learned</option>
                            <option>Wins</option>
                            <option>Challenges</option>
                            <option>Goals</option>
                            <option>Gratitude</option>
                        </select>
                        <input type="text" id="note-tags" placeholder="Tags (comma-separated): ai, marketing, mindset" style="width:100%; padding:12px; margin:5px 0; border:2px solid #e0e0e0; border-radius:8px;">
                        <button class="btn" onclick="window.modules.notes.addNote()" style="width:100%;">💾 Save Note</button>
                    </div>
                    
                    <!-- Search & Filters -->
                    <div style="background:white; padding:15px; border-radius:10px; margin-bottom:20px; border:2px solid #e5e7eb;">
                        <input type="text" placeholder="🔍 Search notes..." onkeyup="window.modules.notes.search(this.value)" style="width:100%; padding:10px; margin-bottom:10px; border:2px solid #e0e0e0; border-radius:8px;">
                        
                        <div style="margin-bottom:10px;">
                            <strong style="font-size:0.9em; color:#666;">Filter by Date:</strong>
                            <div style="display:flex; gap:8px; margin-top:8px; flex-wrap:wrap;">
                                <button onclick="window.modules.notes.setDateFilter('all')" class="btn btn-secondary" style="padding:6px 12px; font-size:0.9em; ${filterDate === 'all' ? 'background:#667eea; color:white;' : ''}">All</button>
                                <button onclick="window.modules.notes.setDateFilter('today')" class="btn btn-secondary" style="padding:6px 12px; font-size:0.9em; ${filterDate === 'today' ? 'background:#667eea; color:white;' : ''}">Today</button>
                                <button onclick="window.modules.notes.setDateFilter('week')" class="btn btn-secondary" style="padding:6px 12px; font-size:0.9em; ${filterDate === 'week' ? 'background:#667eea; color:white;' : ''}">Week</button>
                                <button onclick="window.modules.notes.setDateFilter('month')" class="btn btn-secondary" style="padding:6px 12px; font-size:0.9em; ${filterDate === 'month' ? 'background:#667eea; color:white;' : ''}">Month</button>
                                <button onclick="window.modules.notes.setDateFilter('3months')" class="btn btn-secondary" style="padding:6px 12px; font-size:0.9em; ${filterDate === '3months' ? 'background:#667eea; color:white;' : ''}">3 Months</button>
                            </div>
                        </div>
                        
                        ${allTags.length > 0 ? `
                            <div>
                                <strong style="font-size:0.9em; color:#666;">Filter by Tag:</strong>
                                <div style="display:flex; gap:8px; margin-top:8px; flex-wrap:wrap;">
                                    <button onclick="window.modules.notes.setFilter('all')" class="btn btn-secondary" style="padding:6px 12px; font-size:0.9em; ${filterTag === 'all' ? 'background:#667eea; color:white;' : ''}">All (${notes.length})</button>
                                    ${allTags.map(tag => `
                                        <button onclick="window.modules.notes.setFilter('${tag}')" class="btn btn-secondary" style="padding:6px 12px; font-size:0.9em; ${filterTag === tag ? 'background:#667eea; color:white;' : ''}">
                                            ${categoryIcons[tag] || '🏷️'} ${tag}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    
                    <!-- Notes List -->
                    <div style="margin-top:20px;">
                        <h3 style="margin-bottom:15px;">
                            📝 ${filtered.length} Note${filtered.length !== 1 ? 's' : ''}
                            ${filterTag !== 'all' || filterDate !== 'all' || searchTerm ? ' (filtered)' : ''}
                        </h3>
                        
                        ${filtered.length === 0 ? `
                            <div style="text-align:center; padding:40px; background:#f9fafb; border-radius:10px;">
                                <div style="font-size:2em; margin-bottom:10px;">📭</div>
                                <div style="color:#666;">
                                    ${notes.length === 0 ? 'No notes yet. Start capturing your journey!' : 'No notes match your filters.'}
                                </div>
                            </div>
                        ` : filtered.map(n => {
                            const icon = categoryIcons[n.category] || '📝';
                            const createdDate = new Date(n.created);
                            const isModified = n.modified !== n.created;
                            
                            return `
                                <div style="background:white; padding:20px; margin:15px 0; border-radius:10px; border:2px solid #e5e7eb;">
                                    <div style="display:flex; justify-content:space-between; align-items:start; gap:10px; margin-bottom:10px;">
                                        <div style="flex:1;">
                                            <div style="font-size:1.2em; font-weight:600; margin-bottom:5px;">${icon} ${n.title}</div>
                                            <div style="font-size:0.85em; color:#999;">
                                                ${createdDate.toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'})} 
                                                at ${createdDate.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}
                                                ${isModified ? ' • Edited' : ''}
                                            </div>
                                        </div>
                                        <div style="display:flex; gap:5px;">
                                            <button onclick="window.modules.notes.editNote(${n.id})" style="background:none; border:2px solid #667eea; color:#667eea; padding:6px 10px; border-radius:5px; cursor:pointer;">✏️</button>
                                            <button onclick="window.modules.notes.deleteNote(${n.id})" style="background:none; border:2px solid #ef4444; color:#ef4444; padding:6px 10px; border-radius:5px; cursor:pointer;">🗑️</button>
                                        </div>
                                    </div>
                                    
                                    <div style="background:#f9fafb; padding:15px; border-radius:8px; margin-bottom:10px; line-height:1.6; white-space:pre-wrap;">
                                        ${n.content}
                                    </div>
                                    
                                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                                        <span style="background:#667eea; color:white; padding:4px 10px; border-radius:12px; font-size:0.85em;">
                                            ${icon} ${n.category}
                                        </span>
                                        ${n.tags.map(tag => `
                                            <span style="background:#e0e7ff; color:#667eea; padding:4px 10px; border-radius:12px; font-size:0.85em; cursor:pointer;" onclick="window.modules.notes.setFilter('${tag}')">
                                                #${tag}
                                            </span>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    
                    <div style="background:#f0f9ff; padding:20px; border-radius:10px; margin-top:30px; border:2px solid #0ea5e9;">
                        <h3 style="margin:0 0 10px 0;">💡 Tips for Better Notes</h3>
                        <div style="line-height:1.8; color:#666; font-size:0.95em;">
                            • <strong>Book Notes:</strong> Key insights, quotes, action items<br>
                            • <strong>Use Tags:</strong> ai, marketing, mindset, habits, etc.<br>
                            • <strong>Be Specific:</strong> Include context and examples<br>
                            • <strong>Review Regularly:</strong> Filter by date and tag to reflect<br>
                            • <strong>Track Progress:</strong> Note wins and lessons learned
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
    
    window.modules.notes = NotesModule;
    NotesModule.init();
})();
