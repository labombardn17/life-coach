// Manifestation Module - Affirmations & Vision
(function() {
    'use strict';
    
    let affirmations = [];
    let visionItems = [];
    
    const ManifestationModule = {
        init() {
            this.loadData();
            this.render();
        },
        
        loadData() {
            const saved = LifeCoach.getData('MANIFESTATION') || {};
            affirmations = saved.affirmations || this.getDefaultAffirmations();
            visionItems = saved.visionItems || [];
        },
        
        saveData() {
            LifeCoach.saveData('MANIFESTATION', { affirmations, visionItems });
        },
        
        getDefaultAffirmations() {
            return [
                "I am building the life I desire every single day",
                "Money flows to me easily through value I provide",
                "I am capable of achieving extraordinary things",
                "My relationship grows stronger through my actions",
                "I am disciplined, focused, and unstoppable",
                "Every challenge makes me stronger and wiser",
                "I attract success by being my best self",
                "My body is getting stronger and healthier daily"
            ];
        },
        
        addAffirmation() {
            const text = prompt('Add your personal affirmation:');
            if (text && text.trim()) {
                affirmations.push(text.trim());
                this.saveData();
                this.render();
            }
        },
        
        deleteAffirmation(index) {
            if (confirm('Delete this affirmation?')) {
                affirmations.splice(index, 1);
                this.saveData();
                this.render();
            }
        },
        
        addVisionItem() {
            const title = prompt('What do you want to manifest?');
            if (title && title.trim()) {
                const why = prompt('Why do you want this?');
                const by = prompt('By when? (optional - press Enter to skip)');
                
                visionItems.push({
                    id: Date.now(),
                    title: title.trim(),
                    why: why ? why.trim() : '',
                    by: by ? by.trim() : '',
                    created: new Date().toISOString(),
                    manifested: false
                });
                this.saveData();
                this.render();
            }
        },
        
        toggleManifested(id) {
            const item = visionItems.find(v => v.id === id);
            item.manifested = !item.manifested;
            if (item.manifested) {
                item.manifestedDate = new Date().toISOString();
                alert(`🎉 Manifested: ${item.title}!`);
            }
            this.saveData();
            this.render();
        },
        
        deleteVisionItem(id) {
            if (confirm('Remove from vision board?')) {
                visionItems = visionItems.filter(v => v.id !== id);
                this.saveData();
                this.render();
            }
        },
        
        render() {
            const active = visionItems.filter(v => !v.manifested);
            const manifested = visionItems.filter(v => v.manifested);
            
            document.getElementById('manifestation-content').innerHTML = `
                <div class="card">
                    <h2>✨ Manifestation & Vision</h2>
                    <p style="color:#666;">Declare what you want and take aligned action</p>
                    
                    <div style="background:linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color:white; padding:25px; border-radius:15px; margin:20px 0; text-align:center;">
                        <div style="font-size:1.3em; font-weight:bold; margin-bottom:15px;">🌟 Daily Affirmations</div>
                        <div style="font-size:1.1em; line-height:1.8;">
                            ${affirmations.map(a => `<div style="margin:10px 0;">• ${a}</div>`).join('')}
                        </div>
                        <button onclick="window.modules.manifestation.addAffirmation()" class="btn btn-secondary" style="margin-top:15px; background:rgba(255,255,255,0.2); border:2px solid white; color:white;">➕ Add Personal Affirmation</button>
                    </div>
                    
                    <h3 style="margin:30px 0 15px 0;">🎯 Vision Board</h3>
                    <button class="btn" onclick="window.modules.manifestation.addVisionItem()" style="width:100%; margin-bottom:20px;">➕ Add to Vision</button>
                    
                    ${active.length === 0 && manifested.length === 0 ? '<p style="color:#999; text-align:center; padding:40px;">Start your vision board. What do you want to manifest?</p>' : ''}
                    
                    ${active.length > 0 ? `
                        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:15px; margin-bottom:30px;">
                            ${active.map(v => `
                                <div style="background:white; padding:20px; border-radius:10px; border:3px solid #667eea; position:relative;">
                                    <button onclick="window.modules.manifestation.deleteVisionItem(${v.id})" style="position:absolute; top:10px; right:10px; background:none; border:none; color:#ef4444; cursor:pointer; font-size:1.2em;">🗑️</button>
                                    <div style="font-size:1.5em; margin-bottom:10px;">🎯</div>
                                    <div style="font-weight:600; font-size:1.1em; margin-bottom:10px;">${v.title}</div>
                                    ${v.why ? `<div style="font-size:0.9em; color:#666; margin-bottom:8px;"><strong>Why:</strong> ${v.why}</div>` : ''}
                                    ${v.by ? `<div style="font-size:0.85em; color:#f59e0b;"><strong>By:</strong> ${v.by}</div>` : ''}
                                    <button onclick="window.modules.manifestation.toggleManifested(${v.id})" class="btn" style="width:100%; margin-top:15px; font-size:0.9em;">✅ Manifested!</button>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    ${manifested.length > 0 ? `
                        <h3 style="margin:30px 0 15px 0;">🌟 Manifested (${manifested.length})</h3>
                        <div style="display:grid; gap:10px;">
                            ${manifested.map(v => `
                                <div style="background:#f0fdf4; padding:15px; border-radius:8px; border:2px solid #10b981; display:flex; justify-content:space-between; align-items:center;">
                                    <div>
                                        <div style="font-weight:600;">✨ ${v.title}</div>
                                        <div style="font-size:0.85em; color:#666; margin-top:5px;">Manifested ${new Date(v.manifestedDate).toLocaleDateString()}</div>
                                    </div>
                                    <button onclick="window.modules.manifestation.deleteVisionItem(${v.id})" style="background:none; border:2px solid #ef4444; color:#ef4444; padding:6px 10px; border-radius:5px; cursor:pointer;">🗑️</button>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    <div style="background:#fff3cd; padding:20px; border-radius:10px; margin-top:30px; border:2px solid #f59e0b;">
                        <h3 style="margin:0 0 10px 0;">💡 Manifestation Tips</h3>
                        <div style="line-height:1.8;">
                            ✅ Read affirmations every morning<br>
                            ✅ Visualize your vision daily (5 min)<br>
                            ✅ Take action toward your goals<br>
                            ✅ Feel the emotions of having it now<br>
                            ✅ Trust the process and timing
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
    
    window.modules.manifestation = ManifestationModule;
    ManifestationModule.init();
})();
