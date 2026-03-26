/* ========================
   AUTHENTIFICATION
   ======================== */

class Auth {
    constructor(store) {
        this.store = store;
    }

    // Simulation - Connexion Pronote
    loginPronote(email, password) {
        // Simulation de vérification
        if (!email.includes('@') || password.length < 6) {
            return {
                success: false,
                error: 'Email ou mot de passe invalide'
            };
        }

        const user = {
            id: Math.random().toString(36).substr(2, 9),
            name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
            email,
            school: 'Collège/Lycée',
            provider: 'Pronote',
            avatar: this.generateAvatar(),
            joinedAt: new Date().toISOString()
        };

        // Simulation de synchronisation
        this.syncProNoteData(user);
        this.store.login(user);

        return { success: true, user };
    }

    // Simulation - Connexion École Directe
    loginEcolDirecte(email, password) {
        if (!email.includes('@') || password.length < 6) {
            return {
                success: false,
                error: 'Email ou mot de passe invalide'
            };
        }

        const user = {
            id: Math.random().toString(36).substr(2, 9),
            name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
            email,
            school: 'Collège/Lycée',
            provider: 'EcoleDirect',
            avatar: this.generateAvatar(),
            joinedAt: new Date().toISOString()
        };

        this.syncEcolDirecteData(user);
        this.store.login(user);

        return { success: true, user };
    }

    // Inscription
    signup(email, password, confirmPassword) {
        if (password !== confirmPassword) {
            return {
                success: false,
                error: 'Les mots de passe ne correspondent pas'
            };
        }

        if (password.length < 8) {
            return {
                success: false,
                error: 'Le mot de passe doit contenir au moins 8 caractères'
            };
        }

        return this.loginPronote(email, password);
    }

    logout() {
        this.store.logout();
    }

    // Synchroniser les données Pronote
    syncProNoteData(user) {
        // Données simulées
        const assignments = [
            {
                subject: 'Mathématiques',
                title: 'Exercices chapitre 5',
                dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                description: 'Pages 120-125, exercices 1-10'
            },
            {
                subject: 'Français',
                title: 'Dissertation sur la liberté',
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                description: 'Minimum 500 mots'
            },
            {
                subject: 'Histoire',
                title: 'Projet de recherche',
                dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                description: 'Sur la Révolution Française'
            }
        ];

        assignments.forEach(a => this.store.addAssignment(a));

        // Grades simulées
        const grades = [
            { subject: 'Mathématiques', score: 17, coefficient: 2, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
            { subject: 'Français', score: 15, coefficient: 3, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
            { subject: 'Histoire', score: 16, coefficient: 2, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
        ];

        grades.forEach(g => this.store.addGrade(g));

        // Absences
        this.store.addAbsence({
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            subject: 'Sport',
            justified: true
        });

        this.store.addNotification({
            type: 'sync',
            title: 'Synchronisation réussie',
            message: 'Vos données Pronote ont été synchronisées',
            icon: '✅'
        });
    }

    // Synchroniser les données École Directe
    syncEcolDirecteData(user) {
        // Données simulées (similaires pour la démo)
        const assignments = [
            {
                subject: 'Anglais',
                title: 'Exercices de vocabulaire',
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                description: 'Unit 8, pages 45-50'
            }
        ];

        assignments.forEach(a => this.store.addAssignment(a));

        this.store.addNotification({
            type: 'sync',
            title: 'Synchronisation réussie',
            message: 'Vos données École Directe ont été synchronisées',
            icon: '✅'
        });
    }

    // Générer un avatar aléatoire
    generateAvatar() {
        const colors = ['#6366f1', '#58cc02', '#0066cc', '#ff006e', '#8338ec'];
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
        return randomLetter;
    }

    // Vérifier si l'utilisateur est authentifié
    isAuthenticated() {
        return this.store.state.isAuthenticated;
    }

    getCurrentUser() {
        return this.store.state.user;
    }

    // Mettre à jour le profil
    updateProfile(updates) {
        this.store.state.user = { ...this.store.state.user, ...updates };
        this.store.notify();
    }
}

const auth = new Auth(store);
