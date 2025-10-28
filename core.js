// Core App Logic - Central State Management
// This file handles app initialization, state, and navigation

const LifeCoach = {
    // App State
    state: {
        currentModule: 'overview',
        loadedModules: new Set(),
        user: {
            name: 'You',
            weekNumber: 1,
            progress: 0,
            streak: 0
        }
    },

    // Local Storage Keys
    storage: {
        ROADMAP: 'roadmap_data',
        CRM: 'crm_contacts',
        CALENDAR: 'calendar_events',
        HABITS: 'habits_data',
        WORKOUTS: 'workouts_data',
        LEARN: 'learn_progress',
        IBWORK: 'ibwork_tasks',
        TODAY: 'today_tasks',
        NOTES: 'notes_data',
        GOALS: 'goals_data',
        MANIFESTATION: 'manifestation_data',
        MOTIVATION: 'motivation_favorites',
        SETTINGS: 'app_settings',
        PROGRESS: 'user_progress',
        START_DATE: 'roadmap_start_date'
    },

    // Initialize App
    async init() {
        console.log('🚀 Life Coach App Initializing...');
        
        // Load user data
        this.loadUserData();
        
        // Update stats
        this.updateStats();
        
        // Setup navigation
        this.setupNavigation();
        
        // Setup swipe gestures for iPhone
        this.setupSwipeGestures();
        
        // Setup Firebase real-time sync
        setTimeout(() => {
            this.setupFirebaseSync();
        }, 1000); // Wait for Firebase to initialize
        
        // Load initial module (overview)
        await this.switchModule('overview');
        
        // Hide loading
        document.getElementById('loading').classList.remove('active');
        
        console.log('✅ App Ready!');
    },

    // Load User Data from LocalStorage
    loadUserData() {
        const saved = localStorage.getItem(this.storage.PROGRESS);
        if (saved) {
            const data = JSON.parse(saved);
            this.state.user = { ...this.state.user, ...data };
        }
    },

    // Save User Data
    saveUserData() {
        localStorage.setItem(this.storage.PROGRESS, JSON.stringify(this.state.user));
    },

    // Update Top Stats Bar
    updateStats() {
        document.getElementById('week-stat').textContent = this.state.user.weekNumber || 1;
        document.getElementById('progress-stat').textContent = (this.state.user.progress || 0) + '%';
        document.getElementById('streak-stat').textContent = this.state.user.streak || 0;
    },

    // Setup Bottom Navigation
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', async (e) => {
                const module = item.dataset.module;
                await this.switchModule(module);
            });
        });
    },

    // Switch Module (with Lazy Loading)
    async switchModule(moduleName) {
        console.log(`📦 Switching to: ${moduleName}`);
        
        // Update UI
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.dataset.module === moduleName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Hide all modules
        document.querySelectorAll('.module-content').forEach(el => {
            el.classList.remove('active');
        });
        
        // Show selected module
        const contentEl = document.getElementById(`${moduleName}-content`);
        if (contentEl) {
            contentEl.classList.add('active');
        }
        
        // Load module if not loaded yet (Lazy Loading)
        if (!this.state.loadedModules.has(moduleName)) {
            await this.loadModule(moduleName);
            this.state.loadedModules.add(moduleName);
        }
        
        // Update state
        this.state.currentModule = moduleName;
        
        // Trigger module refresh if it has one
        if (window.modules && window.modules[moduleName] && window.modules[moduleName].refresh) {
            window.modules[moduleName].refresh();
        }
    },

    // Load Module Dynamically
    async loadModule(moduleName) {
        try {
            // Show brief loading (smooth UX)
            const contentEl = document.getElementById(`${moduleName}-content`);
            contentEl.innerHTML = '<div style="text-align:center; padding:40px; color:#999;">Loading...</div>';
            
            // Load module script
            await this.loadScript(`modules/${moduleName}.js`);
            
            console.log(`✅ Module loaded: ${moduleName}`);
        } catch (error) {
            console.error(`❌ Error loading ${moduleName}:`, error);
            const contentEl = document.getElementById(`${moduleName}-content`);
            contentEl.innerHTML = `
                <div class="card">
                    <h2>⚠️ Module Loading Error</h2>
                    <p>Could not load ${moduleName}. Please refresh the page.</p>
                    <button class="btn" onclick="location.reload()">Refresh</button>
                </div>
            `;
        }
    },

    // Load External Script
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    },

    // Setup Swipe Gestures (iPhone Navigation)
    setupSwipeGestures() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        const modules = ['overview', 'today', 'habits', 'workout', 'ibwork', 'calendar', 'crm', 'learn', 'notes', 'goals', 'manifestation', 'motivation', 'roadmap'];
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(modules);
        });
        
        this.handleSwipe = (modules) => {
            const swipeThreshold = 50;
            const currentIndex = modules.indexOf(this.state.currentModule);
            
            // Swipe left (next module)
            if (touchStartX - touchEndX > swipeThreshold && currentIndex < modules.length - 1) {
                this.switchModule(modules[currentIndex + 1]);
            }
            
            // Swipe right (previous module)
            if (touchEndX - touchStartX > swipeThreshold && currentIndex > 0) {
                this.switchModule(modules[currentIndex - 1]);
            }
        };
    },

    // Helper: Get Data (from localStorage, Firebase handles sync in background)
    getData(key) {
        const data = localStorage.getItem(this.storage[key]);
        return data ? JSON.parse(data) : null;
    },

    // Helper: Save Data (to localStorage AND Firebase)
    saveData(key, data) {
        // Save to localStorage immediately (for offline and instant access)
        localStorage.setItem(this.storage[key], JSON.stringify(data));
        
        // Sync to Firebase if available
        if (window.firebaseDB && window.firebaseUserId) {
            const docRef = window.firebaseDB.collection('users').doc(window.firebaseUserId).collection('data').doc(key);
            docRef.set({
                data: data,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }).catch(err => {
                console.log('⚠️ Firebase sync queued for later (offline):', key);
            });
        }
    },
    
    // Setup Firebase Real-time Listeners
    setupFirebaseSync() {
        if (!window.firebaseDB || !window.firebaseUserId) {
            console.log('⚠️ Firebase not available, using localStorage only');
            return;
        }
        
        console.log('🔥 Setting up Firebase real-time sync...');
        
        // Listen to all data changes
        Object.keys(this.storage).forEach(key => {
            const docRef = window.firebaseDB.collection('users').doc(window.firebaseUserId).collection('data').doc(key);
            
            docRef.onSnapshot((doc) => {
                if (doc.exists) {
                    const firebaseData = doc.data().data;
                    const localData = this.getData(key);
                    
                    // Only update if Firebase data is newer
                    if (JSON.stringify(firebaseData) !== JSON.stringify(localData)) {
                        console.log('📥 Syncing from Firebase:', key);
                        localStorage.setItem(this.storage[key], JSON.stringify(firebaseData));
                        
                        // Refresh the current module if it matches
                        const moduleMap = {
                            'ROADMAP': 'roadmap',
                            'CRM': 'crm',
                            'CALENDAR': 'calendar',
                            'HABITS': 'habits',
                            'WORKOUTS': 'workout',
                            'LEARN': 'learn',
                            'IBWORK': 'ibwork',
                            'TODAY': 'today',
                            'NOTES': 'notes',
                            'GOALS': 'goals',
                            'MANIFESTATION': 'manifestation',
                            'MOTIVATION': 'motivation'
                        };
                        
                        const moduleName = moduleMap[key];
                        if (moduleName && window.modules[moduleName] && window.modules[moduleName].refresh) {
                            window.modules[moduleName].refresh();
                        }
                        
                        // Always refresh overview
                        if (window.modules.overview && window.modules.overview.refresh) {
                            window.modules.overview.refresh();
                        }
                    }
                }
            }, (error) => {
                console.log('⚠️ Firebase listener error:', error);
            });
        });
        
        console.log('✅ Firebase real-time sync enabled!');
    },

    // Helper: Format Date
    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    },

    // Helper: Calculate Streak
    calculateStreak(completions) {
        if (!completions || completions.length === 0) return 0;
        
        let streak = 0;
        const today = new Date().toDateString();
        let checkDate = new Date();
        
        for (let i = 0; i < 365; i++) {
            const dateStr = checkDate.toDateString();
            if (completions.includes(dateStr)) {
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
    
    // Date-Aware Functions for Roadmap
    getStartDate() {
        let startDate = localStorage.getItem(this.storage.START_DATE);
        if (!startDate) {
            // First time - set today as start
            startDate = new Date().toISOString().split('T')[0];
            localStorage.setItem(this.storage.START_DATE, startDate);
        }
        return new Date(startDate);
    },
    
    setStartDate(date) {
        const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
        localStorage.setItem(this.storage.START_DATE, dateStr);
    },
    
    getCurrentWeekAndDay() {
        const start = this.getStartDate();
        const today = new Date();
        const diffTime = Math.abs(today - start);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        const currentWeek = Math.floor(diffDays / 7) + 1;
        const currentDay = diffDays % 7; // 0-6 (Sunday-Saturday)
        
        return {
            week: Math.min(currentWeek, 52), // Cap at week 52
            day: currentDay,
            totalDays: diffDays,
            dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][today.getDay()]
        };
    },
    
    resetRoadmap() {
        if (confirm('This will reset your roadmap progress and set today as Week 1 Day 1. Continue?')) {
            localStorage.removeItem('aiConsultingProgress');
            this.setStartDate(new Date());
            alert('✅ Roadmap reset! Today is now Week 1 Day 1.');
            if (window.modules.roadmap) window.modules.roadmap.refresh();
            if (window.modules.overview) window.modules.overview.refresh();
        }
    }
};

// Global Modules Object (modules register themselves here)
window.modules = {
    settings: {
        open: () => {
            alert('Settings module coming in next update!');
            // TODO: Implement settings modal
        }
    },
    quickActions: {
        open: () => {
            const actions = [
                '📝 Add Task',
                '👤 Add Contact',
                '📅 Add Event',
                '✅ Add Habit',
                '💪 Log Workout'
            ];
            
            const choice = prompt('Quick Actions:\n\n' + actions.map((a, i) => `${i + 1}. ${a}`).join('\n') + '\n\nEnter number:');
            
            if (choice) {
                const index = parseInt(choice) - 1;
                if (index >= 0 && index < actions.length) {
                    // Switch to relevant module
                    const moduleMap = ['roadmap', 'crm', 'calendar', 'habits', 'workout'];
                    LifeCoach.switchModule(moduleMap[index]);
                }
            }
        }
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LifeCoach.init());
} else {
    LifeCoach.init();
}

// Export for use in modules
window.LifeCoach = LifeCoach;
