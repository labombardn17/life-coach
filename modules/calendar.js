// Calendar Module - Events & Scheduling
(function() {
    'use strict';
    
    let calendarEvents = [];
    let calendarView = 'all';
    
    const CalendarModule = {
        init() {
            this.loadData();
            this.render();
        },
        
        loadData() {
            calendarEvents = LifeCoach.getData('CALENDAR') || [];
        },
        
        saveData() {
            LifeCoach.saveData('CALENDAR', calendarEvents);
        },
        
        addEvent(title, date, time, category, notes) {
            const event = {
                id: Date.now(),
                title: title || document.getElementById('event-title')?.value,
                date: date || document.getElementById('event-date')?.value,
                time: time || document.getElementById('event-time')?.value || '',
                category: category || document.getElementById('event-category')?.value || 'personal',
                notes: notes || document.getElementById('event-notes')?.value || '',
                created: new Date().toISOString()
            };
            
            if (!event.title || !event.date) {
                alert('Title and date required');
                return false;
            }
            
            calendarEvents.push(event);
            this.saveData();
            this.render();
            return true;
        },
        
        deleteEvent(id) {
            if (confirm('Delete event?')) {
                calendarEvents = calendarEvents.filter(e => e.id !== id);
                this.saveData();
                this.render();
            }
        },
        
        render() {
            const now = new Date();
            let filtered = [...calendarEvents];
            
            if (calendarView === 'week') {
                const weekFromNow = new Date(now.getTime() + 7 * 86400000);
                filtered = calendarEvents.filter(e => {
                    const eventDate = new Date(e.date);
                    return eventDate >= now && eventDate <= weekFromNow;
                });
            } else if (calendarView === 'month') {
                const monthFromNow = new Date(now.getTime() + 30 * 86400000);
                filtered = calendarEvents.filter(e => {
                    const eventDate = new Date(e.date);
                    return eventDate >= now && eventDate <= monthFromNow;
                });
            }
            
            filtered.sort((a, b) => new Date(a.date + ' ' + (a.time || '00:00')) - new Date(b.date + ' ' + (b.time || '00:00')));
            
            const groupedEvents = {};
            filtered.forEach(e => {
                const dateKey = new Date(e.date).toDateString();
                if (!groupedEvents[dateKey]) groupedEvents[dateKey] = [];
                groupedEvents[dateKey].push(e);
            });
            
            const categories = {
                business: { bg: '#dbeafe', icon: '💼' },
                client: { bg: '#dcfce7', icon: '🤝' },
                workout: { bg: '#fef3c7', icon: '💪' },
                personal: { bg: '#fce7f3', icon: '👨‍👩‍👧' },
                family: { bg: '#ffe4e6', icon: '❤️' },
                health: { bg: '#d1fae5', icon: '🧘' },
                social: { bg: '#fce7f3', icon: '🎉' },
                travel: { bg: '#dbeafe', icon: '✈️' },
                important: { bg: '#fef08a', icon: '⭐' }
            };
            
            document.getElementById('calendar-content').innerHTML = `
                <div class="card">
                    <h2>📅 Calendar & Events</h2>
                    
                    <div style="background:#f9fafb; padding:20px; border-radius:10px; margin:20px 0;">
                        <h3 style="margin:0 0 15px 0; font-size:1em;">Add Event</h3>
                        <input type="text" id="event-title" placeholder="Event title" style="width:100%; padding:12px; margin:5px 0; border:2px solid #e0e0e0; border-radius:8px;">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin:5px 0;">
                            <input type="date" id="event-date" style="padding:12px; border:2px solid #e0e0e0; border-radius:8px;">
                            <input type="time" id="event-time" style="padding:12px; border:2px solid #e0e0e0; border-radius:8px;">
                        </div>
                        <select id="event-category" style="width:100%; padding:12px; margin:5px 0; border:2px solid #e0e0e0; border-radius:8px;">
                            <option value="business">💼 Business</option>
                            <option value="client">🤝 Client</option>
                            <option value="workout">💪 Workout</option>
                            <option value="personal">👨‍👩‍👧 Personal</option>
                            <option value="family">❤️ Family</option>
                            <option value="health">🧘 Health</option>
                            <option value="social">🎉 Social</option>
                            <option value="travel">✈️ Travel</option>
                            <option value="important">⭐ Important</option>
                        </select>
                        <textarea id="event-notes" placeholder="Notes (optional)" style="width:100%; height:60px; padding:12px; margin:5px 0; border:2px solid #e0e0e0; border-radius:8px;"></textarea>
                        <button class="btn" onclick="window.modules.calendar.addEvent()" style="width:100%;">➕ Add Event</button>
                    </div>
                    
                    <div style="display:flex; justify-content:space-between; align-items:center; margin:20px 0;">
                        <h3 style="margin:0;">Upcoming Events</h3>
                        <div style="display:flex; gap:10px;">
                            <button class="btn btn-secondary" onclick="window.modules.calendar.changeView('week')" style="padding:8px 16px; font-size:0.9em;">Week</button>
                            <button class="btn btn-secondary" onclick="window.modules.calendar.changeView('month')" style="padding:8px 16px; font-size:0.9em;">Month</button>
                            <button class="btn btn-secondary" onclick="window.modules.calendar.changeView('all')" style="padding:8px 16px; font-size:0.9em;">All</button>
                        </div>
                    </div>
                    
                    <div id="events-list">
                        ${Object.keys(groupedEvents).length === 0 ? '<p style="color:#999; text-align:center; padding:40px;">No events yet. Add one above!</p>' : 
                        Object.keys(groupedEvents).map(dateKey => {
                            const eventDate = new Date(dateKey);
                            const isToday = eventDate.toDateString() === now.toDateString();
                            const isPast = eventDate < now && !isToday;
                            
                            return `
                                <div style="margin:20px 0;">
                                    <h3 style="background:${isToday ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : isPast ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}; color:white; padding:12px 15px; border-radius:10px; margin:0 0 10px 0;">
                                        ${isToday ? '🔥 TODAY' : isPast ? '📌' : '📅'} ${eventDate.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'})}
                                    </h3>
                                    ${groupedEvents[dateKey].map(e => {
                                        const style = categories[e.category] || categories.personal;
                                        return `
                                            <div style="background:${style.bg}; padding:15px; margin:10px 0; border-radius:8px; ${isPast ? 'opacity:0.6;' : ''}">
                                                <div style="display:flex; justify-content:space-between; align-items:start; gap:10px;">
                                                    <div style="flex:1;">
                                                        <div style="font-weight:600; font-size:1.1em; margin-bottom:5px;">${style.icon} ${e.title}</div>
                                                        <div style="color:#666; font-size:0.9em;">${e.time ? `🕐 ${e.time}` : '🕐 All day'}</div>
                                                        ${e.notes ? `<div style="margin-top:10px; padding:10px; background:white; border-radius:5px; font-size:0.9em;">${e.notes}</div>` : ''}
                                                    </div>
                                                    <button onclick="window.modules.calendar.deleteEvent(${e.id})" style="background:none; border:2px solid #ef4444; color:#ef4444; padding:6px 10px; border-radius:5px; cursor:pointer;">🗑️</button>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        },
        
        changeView(view) {
            calendarView = view;
            this.render();
        },
        
        refresh() {
            this.loadData();
            this.render();
        }
    };
    
    window.modules.calendar = CalendarModule;
    CalendarModule.init();
})();
