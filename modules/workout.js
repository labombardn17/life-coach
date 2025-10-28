// Workout Module - GVT Program Tracker
(function() {
    'use strict';
    
    let workouts = [];
    
    const GVT_PLAN = [{workout:8,date:'2025-10-27',day:'Monday',split:'Legs',exercise:'Leg Press',sets:10,reps:10,tempo:'4-0-2',status:'Completed'},{workout:8,date:'2025-10-27',day:'Monday',split:'Legs',exercise:'One-Legged Leg Press',sets:10,reps:10,tempo:'4-0-2',status:'Completed'},{workout:8,date:'2025-10-27',day:'Monday',split:'Legs',exercise:'Dumbbell Walking Lunges',sets:10,reps:10,tempo:'4-0-2',status:'Completed'},{workout:8,date:'2025-10-27',day:'Monday',split:'Legs',exercise:'Lying Leg Curls',sets:10,reps:10,tempo:'4-0-2',status:'Completed'},{workout:9,date:'2025-10-29',day:'Wednesday',split:'Shoulders & Arms',exercise:'Military Press',sets:10,reps:10,tempo:'4-0-2',status:'Planned'},{workout:9,date:'2025-10-29',day:'Wednesday',split:'Shoulders & Arms',exercise:'Bent-Over Dumbbell Laterals',sets:10,reps:10,tempo:'4-0-2',status:'Planned'},{workout:9,date:'2025-10-29',day:'Wednesday',split:'Shoulders & Arms',exercise:'Dumbbell Spider Curls',sets:10,reps:10,tempo:'4-0-2',status:'Planned'},{workout:9,date:'2025-10-29',day:'Wednesday',split:'Shoulders & Arms',exercise:'Triceps Rope Extensions',sets:10,reps:10,tempo:'4-0-2',status:'Planned'},{workout:10,date:'2025-10-31',day:'Friday',split:'Back & Chest',exercise:'Flat Dumbbell Press',sets:10,reps:10,tempo:'4-0-2',status:'Planned'},{workout:10,date:'2025-10-31',day:'Friday',split:'Back & Chest',exercise:'Wide-Grip T-Bar Row',sets:10,reps:10,tempo:'4-0-2',status:'Planned'},{workout:10,date:'2025-10-31',day:'Friday',split:'Back & Chest',exercise:'Decline Dumbbell Flyes',sets:10,reps:10,tempo:'4-0-2',status:'Planned'},{workout:10,date:'2025-10-31',day:'Friday',split:'Back & Chest',exercise:'Wide-Grip Pulldown',sets:10,reps:10,tempo:'4-0-2',status:'Planned'},{workout:11,date:'2025-11-02',day:'Sunday',split:'Legs',exercise:'Leg Press',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:11,date:'2025-11-02',day:'Sunday',split:'Legs',exercise:'One-Legged Leg Press',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:11,date:'2025-11-02',day:'Sunday',split:'Legs',exercise:'Dumbbell Walking Lunges',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:11,date:'2025-11-02',day:'Sunday',split:'Legs',exercise:'Lying Leg Curls',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:12,date:'2025-11-04',day:'Tuesday',split:'Shoulders & Arms',exercise:'Arnold Press',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:12,date:'2025-11-04',day:'Tuesday',split:'Shoulders & Arms',exercise:'Upright EZ Bar Row',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:12,date:'2025-11-04',day:'Tuesday',split:'Shoulders & Arms',exercise:'Cable Biceps Curl',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:12,date:'2025-11-04',day:'Tuesday',split:'Shoulders & Arms',exercise:'Lying EZ Bar Triceps Extension',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:13,date:'2025-11-06',day:'Thursday',split:'Back & Chest',exercise:'Incline Barbell Press',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:13,date:'2025-11-06',day:'Thursday',split:'Back & Chest',exercise:'Reverse-Grip Barbell Row',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:13,date:'2025-11-06',day:'Thursday',split:'Back & Chest',exercise:'Pec Deck Fly',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:13,date:'2025-11-06',day:'Thursday',split:'Back & Chest',exercise:'Seated Cable Row',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:14,date:'2025-11-08',day:'Saturday',split:'Legs',exercise:'Barbell Squat',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:14,date:'2025-11-08',day:'Saturday',split:'Legs',exercise:'Barbell Deadlift',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:14,date:'2025-11-08',day:'Saturday',split:'Legs',exercise:'Leg Extension',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:14,date:'2025-11-08',day:'Saturday',split:'Legs',exercise:'Lying Leg Curl',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:15,date:'2025-11-10',day:'Monday',split:'Shoulders & Arms',exercise:'Dumbbell Shoulder Press',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:15,date:'2025-11-10',day:'Monday',split:'Shoulders & Arms',exercise:'Dumbbell Lateral Raise',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:15,date:'2025-11-10',day:'Monday',split:'Shoulders & Arms',exercise:'Concentration Dumbbell Curl',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:15,date:'2025-11-10',day:'Monday',split:'Shoulders & Arms',exercise:'Lying Dumbbell Triceps Extension',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:16,date:'2025-11-12',day:'Wednesday',split:'Back & Chest',exercise:'Flat Barbell Bench Press',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:16,date:'2025-11-12',day:'Wednesday',split:'Back & Chest',exercise:'Overhand Barbell Row',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:16,date:'2025-11-12',day:'Wednesday',split:'Back & Chest',exercise:'Dumbbell Pullover',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:16,date:'2025-11-12',day:'Wednesday',split:'Back & Chest',exercise:'Neutral-Grip Seated Cable Row',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:17,date:'2025-11-14',day:'Friday',split:'Legs',exercise:'Front Barbell Squat',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:17,date:'2025-11-14',day:'Friday',split:'Legs',exercise:'Barbell Deadlift',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:17,date:'2025-11-14',day:'Friday',split:'Legs',exercise:'Leg Extension',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:17,date:'2025-11-14',day:'Friday',split:'Legs',exercise:'Standing Single-Leg Cable Curl',sets:10,reps:10,tempo:'4-0-2',status:'Progression'},{workout:18,date:'2025-11-16',day:'Sunday',split:'Shoulders & Arms',exercise:'Barbell Shoulder Press',sets:10,reps:10,tempo:'4-0-2',status:'Final Phase'},{workout:18,date:'2025-11-16',day:'Sunday',split:'Shoulders & Arms',exercise:'Front Dumbbell Raise',sets:10,reps:10,tempo:'4-0-2',status:'Final Phase'},{workout:18,date:'2025-11-16',day:'Sunday',split:'Shoulders & Arms',exercise:'EZ Bar Curl',sets:10,reps:10,tempo:'4-0-2',status:'Final Phase'},{workout:18,date:'2025-11-16',day:'Sunday',split:'Shoulders & Arms',exercise:'Overhead Dumbbell Triceps Extension',sets:10,reps:10,tempo:'4-0-2',status:'Final Phase'},{workout:19,date:'2025-11-18',day:'Tuesday',split:'Back & Chest',exercise:'Incline Dumbbell Press',sets:10,reps:10,tempo:'4-0-2',status:'Final Phase'},{workout:19,date:'2025-11-18',day:'Tuesday',split:'Back & Chest',exercise:'Overhand Barbell Row',sets:10,reps:10,tempo:'4-0-2',status:'Final Phase'},{workout:19,date:'2025-11-18',day:'Tuesday',split:'Back & Chest',exercise:'Incline Dumbbell Fly',sets:10,reps:10,tempo:'4-0-2',status:'Final Phase'},{workout:19,date:'2025-11-18',day:'Tuesday',split:'Back & Chest',exercise:'One-Arm Cable Row',sets:10,reps:10,tempo:'4-0-2',status:'Final Phase'},{workout:20,date:'2025-11-19',day:'Wednesday',split:'Legs',exercise:'Front Barbell Squat',sets:10,reps:10,tempo:'4-0-2',status:'Final Phase'},{workout:20,date:'2025-11-19',day:'Wednesday',split:'Legs',exercise:'Stiff-Leg Deadlift',sets:10,reps:10,tempo:'4-0-2',status:'Final Phase'},{workout:20,date:'2025-11-19',day:'Wednesday',split:'Legs',exercise:'Dumbbell Step-Up',sets:10,reps:10,tempo:'4-0-2',status:'Final Phase'},{workout:20,date:'2025-11-19',day:'Wednesday',split:'Legs',exercise:'Standing Leg Curl',sets:10,reps:10,tempo:'4-0-2',status:'Final Phase'},{workout:21,date:'2025-11-21',day:'Friday',split:'Shoulders & Arms',exercise:'Dumbbell Shoulder Press',sets:10,reps:10,tempo:'4-0-2',status:'Final Phase'},{workout:21,date:'2025-11-21',day:'Friday',split:'Shoulders & Arms',exercise:'Front Dumbbell Raise',sets:10,reps:10,tempo:'4-0-2',status:'Final Phase'},{workout:21,date:'2025-11-21',day:'Friday',split:'Shoulders & Arms',exercise:'EZ Bar Curl',sets:10,reps:10,tempo:'4-0-2',status:'Final Phase'},{workout:21,date:'2025-11-21',day:'Friday',split:'Shoulders & Arms',exercise:'Overhead Dumbbell Triceps Extension',sets:10,reps:10,tempo:'4-0-2',status:'Final Phase'}];
    
    const WorkoutModule = {
        init() {
            this.loadData();
            this.render();
        },
        
        loadData() {
            workouts = LifeCoach.getData('WORKOUTS') || [];
            if (workouts.length === 0) {
                this.loadGVTPlan();
            }
        },
        
        saveData() {
            LifeCoach.saveData('WORKOUTS', workouts);
        },
        
        loadGVTPlan() {
            GVT_PLAN.forEach((ex, i) => {
                workouts.push({
                    id: Date.now() + i,
                    name: ex.exercise,
                    sets: ex.sets,
                    reps: ex.reps,
                    weight: 0,
                    day: `${ex.day} - ${ex.split}`,
                    tempo: ex.tempo,
                    workoutNum: ex.workout,
                    date: ex.date,
                    status: ex.status,
                    completions: ex.status === 'Completed' ? [{date: ex.date, sets: ex.sets, reps: ex.reps, weight: 0}] : []
                });
            });
            this.saveData();
        },
        
        render() {
            const byWorkout = {};
            workouts.forEach(w => {
                const key = w.workoutNum ? `Workout ${w.workoutNum}` : 'Unscheduled';
                if (!byWorkout[key]) byWorkout[key] = {};
                if (!byWorkout[key][w.day]) byWorkout[key][w.day] = [];
                byWorkout[key][w.day].push(w);
            });
            
            const sorted = Object.keys(byWorkout).sort((a, b) => {
                const aNum = parseInt(a.replace('Workout ', ''));
                const bNum = parseInt(b.replace('Workout ', ''));
                const aStatus = byWorkout[a][Object.keys(byWorkout[a])[0]][0].status;
                const bStatus = byWorkout[b][Object.keys(byWorkout[b])[0]][0].status;
                const order = {'Planned': 1, 'Progression': 2, 'Final Phase': 3, 'Completed': 4};
                const diff = (order[aStatus] || 5) - (order[bStatus] || 5);
                return diff !== 0 ? diff : aNum - bNum;
            });
            
            const today = new Date();
            let nextWorkout = null;
            workouts.forEach(w => {
                if ((w.status !== 'Completed') && w.date) {
                    if (!nextWorkout || new Date(w.date) < new Date(nextWorkout.date)) {
                        nextWorkout = w;
                    }
                }
            });
            
            let nextBanner = '';
            if (nextWorkout) {
                const days = Math.ceil((new Date(nextWorkout.date) - today) / 86400000);
                const isToday = days === 0;
                nextBanner = `
                    <div style="background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color:white; padding:20px; border-radius:15px; margin:20px 0; text-align:center;">
                        <div style="font-size:1.5em; font-weight:bold;">${isToday ? '🔥 TODAY' : '📅 NEXT'} - Workout ${nextWorkout.workoutNum}</div>
                        <div style="margin-top:10px;">${nextWorkout.day}</div>
                        <div style="margin-top:5px; opacity:0.9;">${new Date(nextWorkout.date).toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'})}</div>
                    </div>
                `;
            }
            
            document.getElementById('workout-content').innerHTML = `
                <div class="card">
                    <h2>🏋️ GVT Program Tracker</h2>
                    <p style="color:#666;">German Volume Training - 14 Workouts (8-21)</p>
                    ${nextBanner}
                    ${sorted.map(workoutNum => {
                        const days = byWorkout[workoutNum];
                        return `
                            <div style="margin:30px 0;">
                                <h3 style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; padding:15px; border-radius:10px;">
                                    ${workoutNum} ${days[Object.keys(days)[0]][0].status ? `(${days[Object.keys(days)[0]][0].status})` : ''}
                                </h3>
                                ${Object.keys(days).map(day => `
                                    <div style="margin:15px 0;">
                                        <h4 style="padding:10px; background:#f3f4f6; border-radius:8px;">${day}</h4>
                                        ${days[day].map(w => {
                                            const lastLog = w.completions && w.completions.length > 0 ? w.completions[w.completions.length - 1] : null;
                                            const isCompleted = w.status === 'Completed';
                                            return `
                                                <div style="background:${isCompleted ? '#f0fdf4' : 'white'}; padding:15px; margin:10px 0; border-radius:8px; border:2px solid ${isCompleted ? '#10b981' : '#e5e7eb'};">
                                                    <div style="display:flex; justify-content:space-between; align-items:start; gap:10px;">
                                                        <div style="flex:1;">
                                                            <div style="font-weight:600; margin-bottom:5px;">${isCompleted ? '✅ ' : ''}${w.name}</div>
                                                            <div style="font-size:0.9em; color:#666;">Target: ${w.sets}×${w.reps} • Tempo: ${w.tempo}</div>
                                                            ${lastLog ? `<div style="margin-top:8px; padding:8px; background:white; border-radius:5px; font-size:0.85em;">Last: ${new Date(lastLog.date).toLocaleDateString()} - ${lastLog.weight} lbs</div>` : ''}
                                                        </div>
                                                        <button class="btn" onclick="window.modules.workout.logWorkout(${w.id})" style="padding:8px 16px; white-space:nowrap;">✅ Log</button>
                                                    </div>
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                `).join('')}
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        },
        
        logWorkout(id) {
            const exercise = workouts.find(w => w.id === id);
            const today = new Date().toISOString().split('T')[0];
            const lastLog = exercise.completions && exercise.completions.length > 0 ? exercise.completions[exercise.completions.length - 1] : null;
            const defaultWeight = lastLog ? lastLog.weight : (exercise.weight || 0);
            
            const weightInput = prompt(`${exercise.name}\n${exercise.sets}×${exercise.reps}\n\nEnter weight (lbs):`, defaultWeight);
            if (weightInput === null) return;
            
            const weight = parseFloat(weightInput) || 0;
            if (!exercise.completions) exercise.completions = [];
            exercise.completions.push({date: today, sets: parseInt(exercise.sets), reps: parseInt(exercise.reps), weight});
            exercise.weight = weight;
            
            const workoutNum = exercise.workoutNum;
            const workoutExercises = workouts.filter(w => w.workoutNum === workoutNum);
            const allCompleted = workoutExercises.every(w => w.completions && w.completions.some(c => c.date === today));
            
            if (allCompleted && exercise.status !== 'Completed') {
                workoutExercises.forEach(w => w.status = 'Completed');
                setTimeout(() => alert(`🎉 WORKOUT ${workoutNum} COMPLETE!\n\nNext workout now at top.`), 100);
            }
            
            this.saveData();
            this.render();
            alert(`✅ ${exercise.name} logged!\n${exercise.sets}×${exercise.reps} @ ${weight} lbs`);
        },
        
        refresh() {
            this.loadData();
            this.render();
        }
    };
    
    window.modules.workout = WorkoutModule;
    WorkoutModule.init();
})();
