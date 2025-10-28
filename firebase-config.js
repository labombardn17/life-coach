// Firebase Configuration
(function() {
    'use strict';
    
    // Your Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBq7DNSuw3d8mqNow4FACtjAlMefjuV1ug",
        authDomain: "life-coach-a8a4c.firebaseapp.com",
        projectId: "life-coach-a8a4c",
        storageBucket: "life-coach-a8a4c.firebasestorage.app",
        messagingSenderId: "155893122137",
        appId: "1:155893122137:web:f73dcab3f179266e789d48"
    };
    
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    // Initialize Firestore
    const db = firebase.firestore();
    
    // Enable offline persistence
    db.enablePersistence({ synchronizeTabs: true })
        .then(() => {
            console.log('✅ Firebase offline persistence enabled');
        })
        .catch((err) => {
            if (err.code === 'failed-precondition') {
                console.log('⚠️ Multiple tabs open, persistence only works in one tab');
            } else if (err.code === 'unimplemented') {
                console.log('⚠️ Browser doesn\'t support offline persistence');
            }
        });
    
    // Get or create user ID
    let userId = localStorage.getItem('lifeCoach_userId');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('lifeCoach_userId', userId);
        console.log('✅ New user ID created:', userId);
    } else {
        console.log('✅ Existing user ID loaded:', userId);
    }
    
    // Make db and userId globally available
    window.firebaseDB = db;
    window.firebaseUserId = userId;
    
    console.log('🔥 Firebase initialized successfully!');
})();
