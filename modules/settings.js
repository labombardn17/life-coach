// Settings Module - Device Sync & User ID Management
(function() {
    'use strict';
    
    const SettingsModule = {
        init() {
            this.render();
        },
        
        copyUserId() {
            const userId = window.firebaseUserId || localStorage.getItem('lifeCoach_userId');
            
            // Try to copy to clipboard
            if (navigator.clipboard) {
                navigator.clipboard.writeText(userId).then(() => {
                    alert('✅ User ID copied to clipboard!\n\nPaste this on your other device to sync.');
                }).catch(() => {
                    // Fallback: show in alert to manually copy
                    this.showUserIdAlert(userId);
                });
            } else {
                this.showUserIdAlert(userId);
            }
        },
        
        showUserIdAlert(userId) {
            alert('Your User ID (copy this):\n\n' + userId + '\n\nManually copy this text and paste it on your other device.');
        },
        
        syncDevice() {
            const newUserId = prompt('Paste the User ID from your other device:');
            
            if (!newUserId) {
                return; // Canceled
            }
            
            if (!newUserId.startsWith('user_')) {
                alert('❌ Invalid User ID format. It should start with "user_"');
                return;
            }
            
            // Set the new user ID
            localStorage.setItem('lifeCoach_userId', newUserId);
            window.firebaseUserId = newUserId;
            
            alert('✅ Device synced!\n\nRefreshing app to load your data...');
            
            // Reload the app
            setTimeout(() => {
                location.reload();
            }, 500);
        },
        
        generateSyncUrl() {
            const userId = window.firebaseUserId || localStorage.getItem('lifeCoach_userId');
            const baseUrl = window.location.origin + window.location.pathname;
            const syncUrl = baseUrl + '?syncId=' + userId;
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(syncUrl).then(() => {
                    alert('✅ Sync URL copied!\n\nOpen this URL on your other device to sync:\n\n' + syncUrl);
                }).catch(() => {
                    alert('Sync URL:\n\n' + syncUrl + '\n\nOpen this on your other device to sync.');
                });
            } else {
                alert('Sync URL:\n\n' + syncUrl + '\n\nOpen this on your other device to sync.');
            }
        },
        
        render() {
            const userId = window.firebaseUserId || localStorage.getItem('lifeCoach_userId') || 'Not set';
            const shortId = userId.substring(0, 20) + '...';
            
            document.getElementById('settings-content').innerHTML = `
                <div class="card">
                    <h2>⚙️ Settings & Device Sync</h2>
                    <p style="color:#666;">Sync your data across all devices</p>
                    
                    <!-- Current Device Info -->
                    <div style="background:#f0f9ff; padding:20px; border-radius:10px; margin:20px 0; border:2px solid #0ea5e9;">
                        <h3 style="margin:0 0 10px 0; font-size:1em;">📱 This Device</h3>
                        <div style="font-size:0.9em; color:#666; margin-bottom:15px;">
                            <strong>User ID:</strong><br>
                            <code style="background:white; padding:8px; display:block; margin-top:5px; border-radius:5px; word-break:break-all; font-size:0.85em;">${userId}</code>
                        </div>
                        <button onclick="window.modules.settings.copyUserId()" class="btn" style="width:100%; margin-bottom:10px;">
                            📋 Copy User ID
                        </button>
                        <button onclick="window.modules.settings.generateSyncUrl()" class="btn btn-secondary" style="width:100%;">
                            🔗 Copy Sync URL
                        </button>
                    </div>
                    
                    <!-- How to Sync -->
                    <div style="background:#fef3c7; padding:20px; border-radius:10px; margin:20px 0; border:2px solid #f59e0b;">
                        <h3 style="margin:0 0 15px 0; font-size:1em;">🔄 How to Sync Another Device</h3>
                        <div style="font-size:0.9em; line-height:1.6;">
                            <strong>Method 1: Copy/Paste (Easy)</strong>
                            <ol style="margin:10px 0; padding-left:20px;">
                                <li>On THIS device: Click "Copy User ID" above</li>
                                <li>On OTHER device: Open this app</li>
                                <li>Go to Settings (⚙️ icon)</li>
                                <li>Click "Sync This Device" below</li>
                                <li>Paste the User ID</li>
                                <li>Done! Both devices synced! 🎉</li>
                            </ol>
                            
                            <strong style="margin-top:15px; display:block;">Method 2: Sync URL (Easiest)</strong>
                            <ol style="margin:10px 0; padding-left:20px;">
                                <li>Click "Copy Sync URL" above</li>
                                <li>Text/email it to yourself</li>
                                <li>Open the URL on your other device</li>
                                <li>Done! Auto-synced! ✨</li>
                            </ol>
                        </div>
                    </div>
                    
                    <!-- Sync This Device -->
                    <div style="background:#f0fdf4; padding:20px; border-radius:10px; margin:20px 0; border:2px solid #10b981;">
                        <h3 style="margin:0 0 10px 0; font-size:1em;">🔗 Sync This Device</h3>
                        <p style="font-size:0.9em; color:#666; margin-bottom:15px;">
                            Have a User ID from another device? Paste it here to sync this device.
                        </p>
                        <button onclick="window.modules.settings.syncDevice()" class="btn" style="width:100%; background:#10b981;">
                            🔄 Sync This Device
                        </button>
                    </div>
                    
                    <!-- Firebase Status -->
                    <div style="background:#f3f4f6; padding:20px; border-radius:10px; margin:20px 0; border:2px solid #9ca3af;">
                        <h3 style="margin:0 0 10px 0; font-size:1em;">🔥 Firebase Sync Status</h3>
                        <div style="font-size:0.9em; line-height:1.6;">
                            <div style="margin:8px 0;">
                                <strong>Firebase:</strong> ${window.firebaseDB ? '✅ Connected' : '❌ Not Connected'}
                            </div>
                            <div style="margin:8px 0;">
                                <strong>User ID:</strong> ${userId ? '✅ Set' : '❌ Not Set'}
                            </div>
                            <div style="margin:8px 0;">
                                <strong>Sync:</strong> ${window.firebaseDB && userId ? '✅ Active' : '⚠️ Inactive'}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Important Notes -->
                    <div style="background:#fee; padding:15px; border-radius:8px; margin:20px 0; border:2px solid #ef4444;">
                        <h4 style="margin:0 0 10px 0; font-size:0.95em;">⚠️ Important</h4>
                        <ul style="margin:0; padding-left:20px; font-size:0.85em; line-height:1.6;">
                            <li>All synced devices must use the SAME User ID</li>
                            <li>Changes sync in 2-5 seconds when online</li>
                            <li>Works offline - syncs when back online</li>
                            <li>Keep your User ID safe - it's your data access key</li>
                        </ul>
                    </div>
                    
                    <!-- App Info -->
                    <div style="text-align:center; padding:20px; color:#999; font-size:0.85em; border-top:2px solid #e5e7eb; margin-top:30px;">
                        <div><strong>Life Coach App</strong></div>
                        <div>Version 2.0 with Firebase Sync</div>
                        <div style="margin-top:10px;">Made with ❤️ for your success</div>
                    </div>
                </div>
            `;
        },
        
        refresh() {
            this.render();
        }
    };
    
    // Register module
    window.modules = window.modules || {};
    window.modules.settings = SettingsModule;
})();
