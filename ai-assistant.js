// AI Assistant - Natural Language Command Processing
(function() {
    'use strict';
    
    window.AIAssistant = {
        // Process natural language commands
        processCommand(input) {
            const text = input.toLowerCase().trim();
            
            // Calendar event patterns
            if (text.includes('add event') || text.includes('add an event') || text.includes('schedule')) {
                return this.parseCalendarEvent(text);
            }
            
            // Habit patterns
            if (text.includes('add habit')) {
                return this.parseHabit(text);
            }
            
            // Contact patterns
            if (text.includes('add contact') || text.includes('add client')) {
                return this.parseContact(text);
            }
            
            // Task patterns
            if (text.includes('add task') || text.includes('add project')) {
                return this.parseTask(text);
            }
            
            return { success: false, message: "I don't understand that command yet. Try: 'Add event on 10/21 for Elise's party'" };
        },
        
        // Parse calendar event from natural language
        parseCalendarEvent(text) {
            // Extract date patterns
            const datePatterns = [
                /on (\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)/,  // "on 10/21" or "on 10/21/2025"
                /(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)/,     // "10/21" or "10/21/2025"
                /(tomorrow|today|next week|next month)/i
            ];
            
            let dateStr = '';
            let dateFound = false;
            
            for (const pattern of datePatterns) {
                const match = text.match(pattern);
                if (match) {
                    const dateInput = match[1];
                    if (dateInput === 'tomorrow') {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        dateStr = tomorrow.toISOString().split('T')[0];
                        dateFound = true;
                    } else if (dateInput === 'today') {
                        dateStr = new Date().toISOString().split('T')[0];
                        dateFound = true;
                    } else if (dateInput.includes('/')) {
                        // Parse date like "10/21" or "10/21/2025"
                        const parts = dateInput.split('/');
                        const month = parts[0].padStart(2, '0');
                        const day = parts[1].padStart(2, '0');
                        const year = parts[2] ? parts[2] : new Date().getFullYear();
                        dateStr = `${year}-${month}-${day}`;
                        dateFound = true;
                    }
                    break;
                }
            }
            
            if (!dateFound) {
                return { success: false, message: "Couldn't find a date. Try: 'Add event on 10/21 for...' or 'Add event tomorrow for...'" };
            }
            
            // Extract event title (everything after "for")
            const forMatch = text.match(/for (.+?)(?:\s+at\s+|$)/);
            if (!forMatch) {
                return { success: false, message: "Couldn't find event title. Use 'for' like: 'Add event on 10/21 for Elise's party'" };
            }
            
            const title = forMatch[1].trim();
            
            // Extract time if present
            const timeMatch = text.match(/at (\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
            let timeStr = '';
            if (timeMatch) {
                let hour = parseInt(timeMatch[1]);
                const minute = timeMatch[2] || '00';
                const ampm = timeMatch[3]?.toLowerCase();
                
                if (ampm === 'pm' && hour < 12) hour += 12;
                if (ampm === 'am' && hour === 12) hour = 0;
                
                timeStr = `${hour.toString().padStart(2, '0')}:${minute}`;
            }
            
            // Detect category
            let category = 'personal';
            if (text.includes('meeting') || text.includes('call') || text.includes('client')) category = 'client';
            else if (text.includes('workout') || text.includes('gym')) category = 'workout';
            else if (text.includes('birthday') || text.includes('party')) category = 'family';
            
            // Add to calendar
            if (window.modules.calendar) {
                const success = window.modules.calendar.addEvent(title, dateStr, timeStr, category, '');
                if (success) {
                    const dateObj = new Date(dateStr);
                    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                    return { 
                        success: true, 
                        message: `✅ Added "${title}" on ${formattedDate}${timeStr ? ' at ' + timeStr : ''}`,
                        action: 'calendar',
                        data: { title, date: dateStr, time: timeStr }
                    };
                }
            }
            
            return { success: false, message: "Calendar module not loaded yet" };
        },
        
        parseHabit(text) {
            // Extract habit name
            const habitMatch = text.match(/add habit[:\s]+(.+)/i);
            if (habitMatch) {
                return { 
                    success: true, 
                    message: `Habit parsing: "${habitMatch[1]}"`,
                    action: 'habit',
                    data: { name: habitMatch[1].trim() }
                };
            }
            return { success: false, message: "Couldn't parse habit" };
        },
        
        parseContact(text) {
            return { success: false, message: "Contact parsing coming soon" };
        },
        
        parseTask(text) {
            return { success: false, message: "Task parsing coming soon" };
        }
    };
    
    // Add chat interface to FAB
    const originalQuickActions = window.modules.quickActions;
    window.modules.quickActions = {
        open: () => {
            const input = prompt('🤖 AI Assistant\n\nTry:\n• "Add event on 10/21 for Elise\'s party"\n• "Add event tomorrow at 2pm for client call"\n• "Add event on 12/25 for Christmas"\n\nWhat would you like to do?');
            if (input) {
                const result = window.AIAssistant.processCommand(input);
                alert(result.message);
                
                if (result.success && result.action === 'calendar') {
                    // Switch to calendar view
                    LifeCoach.switchModule('calendar');
                }
            }
        }
    };
})();
