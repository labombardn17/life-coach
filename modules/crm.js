// CRM Module - Client Relationship Management
(function() {
    'use strict';
    
    let contacts = [];
    
    const CRMModule = {
        init() {
            this.loadData();
            this.render();
        },
        
        loadData() {
            contacts = LifeCoach.getData('CRM') || [];
        },
        
        saveData() {
            LifeCoach.saveData('CRM', contacts);
        },
        
        addContact() {
            const contact = {
                id: Date.now(),
                name: document.getElementById('contact-name').value,
                person: document.getElementById('contact-person').value || '',
                phone: document.getElementById('contact-phone').value || '',
                email: document.getElementById('contact-email').value || '',
                type: document.getElementById('contact-type').value,
                status: document.getElementById('contact-status').value,
                date: new Date().toLocaleDateString(),
                notes: []
            };
            if (!contact.name) { alert('Business name required'); return; }
            contacts.push(contact);
            this.saveData();
            this.render();
            document.getElementById('contact-name').value = '';
            document.getElementById('contact-person').value = '';
            document.getElementById('contact-phone').value = '';
            document.getElementById('contact-email').value = '';
        },
        
        addNote(id) {
            const note = prompt('Add note:');
            if (note) {
                const contact = contacts.find(c => c.id === id);
                contact.notes.push({ text: note, date: new Date().toLocaleDateString() });
                this.saveData();
                this.render();
            }
        },
        
        deleteContact(id) {
            if (confirm('Delete contact?')) {
                contacts = contacts.filter(c => c.id !== id);
                this.saveData();
                this.render();
            }
        },
        
        render() {
            const statusColors = {
                'Lead': '#999',
                'Contacted': '#667eea',
                'Audit Scheduled': '#f093fb',
                'Proposal Sent': '#fa709a',
                'Client': '#10b981',
                'Lost': '#ef4444'
            };
            
            document.getElementById('crm-content').innerHTML = `
                <div class="card">
                    <h2>👥 CRM - Client Tracking</h2>
                    
                    <div style="background:#f9fafb; padding:20px; border-radius:10px; margin:20px 0;">
                        <h3 style="margin:0 0 15px 0; font-size:1em;">Add Contact</h3>
                        <input type="text" id="contact-name" placeholder="Business name" style="width:100%; padding:12px; margin:5px 0; border:2px solid #e0e0e0; border-radius:8px;">
                        <input type="text" id="contact-person" placeholder="Contact person" style="width:100%; padding:12px; margin:5px 0; border:2px solid #e0e0e0; border-radius:8px;">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin:5px 0;">
                            <input type="tel" id="contact-phone" placeholder="Phone" style="padding:12px; border:2px solid #e0e0e0; border-radius:8px;">
                            <input type="email" id="contact-email" placeholder="Email" style="padding:12px; border:2px solid #e0e0e0; border-radius:8px;">
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin:5px 0;">
                            <select id="contact-type" style="padding:12px; border:2px solid #e0e0e0; border-radius:8px;">
                                <option>🍕 Restaurant</option>
                                <option>🦷 Dental Practice</option>
                                <option>🏋️ Gym/Fitness</option>
                                <option>💈 Salon/Spa</option>
                                <option>🏠 Real Estate</option>
                                <option>🔧 Auto Shop</option>
                                <option>⚖️ Law Firm</option>
                                <option>🏥 Healthcare</option>
                                <option>🏪 Retail</option>
                                <option>🏢 Other</option>
                            </select>
                            <select id="contact-status" style="padding:12px; border:2px solid #e0e0e0; border-radius:8px;">
                                <option>Lead</option>
                                <option>Contacted</option>
                                <option>Audit Scheduled</option>
                                <option>Proposal Sent</option>
                                <option>Client</option>
                                <option>Lost</option>
                            </select>
                        </div>
                        <button class="btn" onclick="window.modules.crm.addContact()" style="width:100%;">➕ Add Contact</button>
                    </div>
                    
                    <div id="contacts-list">
                        ${contacts.length === 0 ? '<p style="color:#999; text-align:center; padding:40px;">No contacts yet. Add your first one above!</p>' :
                        contacts.map(c => `
                            <div style="background:white; padding:20px; margin:15px 0; border-radius:10px; border-left:5px solid ${statusColors[c.status]};">
                                <div style="display:flex; justify-content:space-between; align-items:start; gap:10px;">
                                    <div style="flex:1;">
                                        <h3 style="margin:0 0 10px 0;">${c.name}</h3>
                                        <div style="color:#666; font-size:0.9em; line-height:1.6;">
                                            ${c.person ? `👤 ${c.person}<br>` : ''}
                                            ${c.phone ? `📞 ${c.phone}<br>` : ''}
                                            ${c.email ? `📧 ${c.email}<br>` : ''}
                                            🏢 ${c.type} • 📅 Added ${c.date}
                                        </div>
                                        <div style="margin-top:10px;">
                                            <span style="background:${statusColors[c.status]}; color:white; padding:5px 10px; border-radius:15px; font-size:0.85em;">${c.status}</span>
                                        </div>
                                        ${c.notes.length > 0 ? `
                                            <div style="margin-top:15px; padding:10px; background:#f5f5f5; border-radius:5px;">
                                                <strong>Notes:</strong>
                                                ${c.notes.map(n => `<div style="margin-top:5px;">• ${n.text} <span style="color:#999; font-size:0.85em;">(${n.date})</span></div>`).join('')}
                                            </div>
                                        ` : ''}
                                    </div>
                                    <div style="display:flex; flex-direction:column; gap:5px;">
                                        <button onclick="window.modules.crm.addNote(${c.id})" style="background:none; border:2px solid #667eea; color:#667eea; padding:8px 12px; border-radius:5px; cursor:pointer; white-space:nowrap;">📝 Note</button>
                                        <button onclick="window.modules.crm.deleteContact(${c.id})" style="background:none; border:2px solid #ef4444; color:#ef4444; padding:8px 12px; border-radius:5px; cursor:pointer;">🗑️</button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        },
        
        refresh() {
            this.loadData();
            this.render();
        }
    };
    
    window.modules.crm = CRMModule;
    CRMModule.init();
})();
