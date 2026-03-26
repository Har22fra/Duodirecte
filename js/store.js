/* ========================
   STORE - GESTION D'ÉTAT
   ======================== */

class Store {
    constructor() {
        this.state = {
            user: null,
            isAuthenticated: false,
            userStats: {
                xp: 0,
                level: 1,
                streak: 0,
                screenTime: 100, // minutes
                league: 'BRONZE',
                leagueRank: 1,
                totalXPForLevel: 1000,
            },
            assignments: [],
            grades: [],
            absences: [],
            sanctions: [],
            messages: [],
            theme: 'duolingo',
            notifications: [],
            settings: {
                notifications: true,
                soundEnabled: true,
                darkMode: false,
                notifyDaily: true,
                dailyNotifyTime: '09:00',
            }
        };

        this.listeners = [];
        this.loadFromStorage();
    }

    // Sauvegarder l'état dans localStorage
    saveToStorage() {
        localStorage.setItem('duodirecte_state', JSON.stringify(this.state));
    }

    // Charger l'état depuis localStorage
    loadFromStorage() {
        const saved = localStorage.getItem('duodirecte_state');
        if (saved) {
            this.state = JSON.parse(saved);
        }
    }

    // S'abonner aux changements
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // Notifier les listeners
    notify() {
        this.saveToStorage();
        this.listeners.forEach(listener => listener(this.state));
    }

    // Authentification
    login(user) {
        this.state.user = user;
        this.state.isAuthenticated = true;
        this.notify();
    }

    logout() {
        this.state.user = null;
        this.state.isAuthenticated = false;
        this.state.messages = [];
        this.notify();
    }

    // XP et Levels
    addXP(amount) {
        this.state.userStats.xp += amount;
        const currentLevelXP = this.state.userStats.level * 1000;
        
        if (this.state.userStats.xp >= currentLevelXP) {
            this.state.userStats.level++;
            this.state.userStats.xp = 0;
            this.state.userStats.totalXPForLevel = (this.state.userStats.level) * 1000;
        }
        this.notify();
    }

    // Streak
    incrementStreak() {
        this.state.userStats.streak++;
        this.notify();
    }

    resetStreak() {
        this.state.userStats.streak = 0;
        this.notify();
    }

    // Temps d'écran
    addScreenTime(minutes) {
        this.state.userStats.screenTime += minutes;
        this.notify();
    }

    removeScreenTime(minutes) {
        this.state.userStats.screenTime = Math.max(0, this.state.userStats.screenTime - minutes);
        this.notify();
    }

    // Assignments/Devoirs
    addAssignment(assignment) {
        assignment.id = Date.now();
        assignment.createdAt = new Date().toISOString();
        assignment.completed = false;
        this.state.assignments.push(assignment);
        this.notify();
    }

    completeAssignment(assignmentId) {
        const assignment = this.state.assignments.find(a => a.id === assignmentId);
        if (assignment) {
            assignment.completed = true;
            assignment.completedAt = new Date().toISOString();
            
            // Ajouter XP pour devoir complété + 5 min de temps d'écran
            this.addXP(10);
            this.addScreenTime(5);
            this.incrementStreak();
        }
        this.notify();
    }

    // Grades/Notes
    addGrade(grade) {
        grade.id = Date.now();
        grade.createdAt = new Date().toISOString();
        this.state.grades.push(grade);

        // Ajouter XP basé sur la note (note × coefficient)
        const xpGained = Math.floor(grade.score * grade.coefficient);
        this.addXP(xpGained);
        this.notify();
    }

    // Absences
    addAbsence(absence) {
        absence.id = Date.now();
        absence.createdAt = new Date().toISOString();
        this.state.absences.push(absence);
        if (!absence.justified) {
            this.removeScreenTime(10); // -10 min pour absence injustifiée
        }
        this.notify();
    }

    // Sanctions
    addSanction(sanction) {
        sanction.id = Date.now();
        sanction.createdAt = new Date().toISOString();
        this.state.sanctions.push(sanction);
        
        // Pénalité de temps d'écran selon type
        const penalties = {
            'observation': 5,
            'heure_colle': 30,
            'exclusion': 60,
            'autre': 10
        };
        
        const penalty = penalties[sanction.type] || 10;
        this.removeScreenTime(penalty);
        this.resetStreak();
        this.notify();
    }

    // Messages
    sendMessage(message) {
        message.id = Date.now();
        message.sentAt = new Date().toISOString();
        message.encrypted = true;
        message.moderated = false;
        this.state.messages.push(message);
        this.notify();
    }

    // Notifications
    addNotification(notification) {
        notification.id = Date.now();
        notification.timestamp = new Date().toISOString();
        this.state.notifications.push(notification);
        this.notify();
    }

    // Paramètres
    updateSettings(newSettings) {
        this.state.settings = { ...this.state.settings, ...newSettings };
        this.notify();
    }

    // Thème
    setTheme(theme) {
        this.state.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        this.notify();
    }

    // Ligues
    updateLeagueRank(rank) {
        this.state.userStats.leagueRank = rank;
        
        // Déterminer la ligue basée sur le classement
        if (rank <= 10) {
            this.state.userStats.league = 'PLATINE';
        } else if (rank <= 20) {
            this.state.userStats.league = 'OR';
        } else if (rank <= 30) {
            this.state.userStats.league = 'ARGENT';
        } else if (rank <= 50) {
            this.state.userStats.league = 'BRONZE';
        }
        this.notify();
    }

    // Reset démo
    resetState() {
        this.state = {
            user: null,
            isAuthenticated: false,
            userStats: {
                xp: 0,
                level: 1,
                streak: 0,
                screenTime: 100,
                league: 'BRONZE',
                leagueRank: 1,
                totalXPForLevel: 1000,
            },
            assignments: [],
            grades: [],
            absences: [],
            sanctions: [],
            messages: [],
            theme: 'duolingo',
            notifications: [],
            settings: {
                notifications: true,
                soundEnabled: true,
                darkMode: false,
                notifyDaily: true,
                dailyNotifyTime: '09:00',
            }
        };
        localStorage.removeItem('duodirecte_state');
        this.notify();
    }
}

// Instance globale
const store = new Store();
