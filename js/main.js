/* ========================
   INITIALISATION & ÉVÉNEMENTS
   ======================== */

// Enregistrer les routes
router.registerRoutes({
    '/': LoginPage,
    '/dashboard': DashboardPage,
    '/lecons': LessonsPage,
    '/notes': GradesPage,
    '/ligues': LeaguesPage,
    '/messagerie': MessagingPage,
    '/profil': ProfilePage,
    '/parametres': SettingsPage,
});

// Appliquer le thème sauvegardé au démarrage
document.documentElement.setAttribute('data-theme', store.state.theme);

// ========================
// GESTION DES ÉVÉNEMENTS
// ========================

// Événements de connexion
document.addEventListener('click', (e) => {
    // Bouton login
    if (e.target?.id === 'login-btn') {
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;

        if (!email || !password) {
            notificationManager.show('Erreur', 'Veuillez remplir tous les champs', 'danger');
            return;
        }

        const result = auth.loginPronote(email, password);
        if (result.success) {
            notificationManager.show('Bienvenue!', `Connecté en tant que ${result.user.name}`, 'success');
            setTimeout(() => router.navigateTo('/dashboard'), 1000);
        } else {
            notificationManager.show('Erreur', result.error, 'danger');
        }
    }

    // Boutons Pronote/EcolDirecte (demo)
    if (e.target?.id === 'pronote-btn' || e.target?.id === 'ecole-btn') {
        document.getElementById('email').value = 'demo@ecole.fr';
        document.getElementById('password').value = 'password123';
    }

    // Logout
    if (e.target?.id === 'logout-btn') {
        notificationManager.showConfirmation(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter?',
            () => {
                auth.logout();
                notificationManager.show('Au revoir!', 'Vous avez été déconnecté', 'success');
                setTimeout(() => router.navigateTo('/'), 1000);
            }
        );
    }
});

// Compléter un devoir
document.addEventListener('click', (e) => {
    if (e.target?.classList.contains('complete-assignment')) {
        const assignmentId = parseInt(e.target.dataset.id);
        store.completeAssignment(assignmentId);
        notificationManager.show('Devoir complété!', '+10 XP, +5 min temps d\'écran, Streak +1', 'success');
        notificationManager.notifyXPGained(10);
        
        // Recharger la page
        const currentPath = window.location.pathname;
        router.navigateTo(currentPath);
    }

    // Cocher un devoir depuis le dashboard
    if (e.target?.classList.contains('task-checkbox')) {
        const assignmentId = parseInt(e.target?.dataset.assignmentId);
        if (assignmentId) {
            store.completeAssignment(assignmentId);
            notificationManager.show('Devoir complété!', '+10 XP 🎉', 'success');
            router.navigateTo('/dashboard');
        }
    }

    // Changement de thème
    if (e.target?.id === 'theme-select') {
        const theme = e.target.value;
        store.setTheme(theme);
        notificationManager.show('Thème changé', `Vous utilisez maintenant le thème ${theme}`, 'success');
    }

    // Dark mode
    if (e.target?.id === 'dark-mode') {
        const isDark = e.target.checked;
        store.updateSettings({ darkMode: isDark });
        document.documentElement.style.filter = isDark ? 'invert(1)' : 'none';
    }

    // Notifications
    if (e.target?.id === 'notifications-toggle') {
        store.updateSettings({ notifications: e.target.checked });
    }

    if (e.target?.id === 'sound-toggle') {
        store.updateSettings({ soundEnabled: e.target.checked });
    }

    if (e.target?.id === 'daily-notify') {
        store.updateSettings({ notifyDaily: e.target.checked });
    }

    if (e.target?.id === 'notify-time') {
        store.updateSettings({ dailyNotifyTime: e.target.value });
    }

    // Modifier profil
    if (e.target?.id === 'edit-profile-btn') {
        notificationManager.showInput(
            'Changer votre nom',
            'Nouveau nom',
            (newName) => {
                auth.updateProfile({ name: newName });
                notificationManager.show('Profil mis à jour', `Votre nom est maintenant ${newName}`, 'success');
                router.navigateTo('/profil');
            }
        );
    }
});

// Envoyer un message
document.addEventListener('keypress', (e) => {
    if (e.target?.id === 'message-input' && e.key === 'Enter') {
        const message = e.target.value.trim();
        if (message) {
            store.sendMessage({
                content: message,
                sender: store.state.user.name,
                conversationId: 'groupe-classe'
            });
            e.target.value = '';
            notificationManager.show('Message envoyé', 'Votre message a été chiffré et envoyé', 'success');
        }
    }
});

// Filtrer les devoirs
document.addEventListener('click', (e) => {
    if (e.target?.id === 'filter-all') {
        const list = document.getElementById('assignments-list');
        if (list) {
            list.innerHTML = store.state.assignments.map(assignment => `
                <div class="card mb" data-assignment="${assignment.id}">
                    <div class="card-header" style="align-items: flex-start;">
                        <div style="flex: 1;">
                            <div class="card-title">${assignment.subject}</div>
                            <div style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-top: 0.5rem;">
                                ${assignment.title}
                            </div>
                        </div>
                        <span class="badge badge-${assignment.completed ? 'success' : 'warning'}">${assignment.completed ? '✅ Complété' : '⏳ En attente'}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    if (e.target?.id === 'filter-pending') {
        const list = document.getElementById('assignments-list');
        if (list) {
            const pending = store.state.assignments.filter(a => !a.completed);
            list.innerHTML = pending.length > 0 ? pending.map(assignment => `
                <div class="card mb"><strong>${assignment.subject}: ${assignment.title}</strong></div>
            `).join('') : '<div class="card">Aucun devoir en attente</div>';
        }
    }

    if (e.target?.id === 'filter-completed') {
        const list = document.getElementById('assignments-list');
        if (list) {
            const completed = store.state.assignments.filter(a => a.completed);
            list.innerHTML = completed.length > 0 ? completed.map(assignment => `
                <div class="card mb" style="opacity: 0.6;"><strong>✅ ${assignment.subject}: ${assignment.title}</strong></div>
            `).join('') : '<div class="card">Aucun devoir complété</div>';
        }
    }
});

// Initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
    router.start();

    // Ajouter des données d'exemple si aucune connexion
    if (!store.state.isAuthenticated && !localStorage.getItem('duodirecte_state')) {
        // Données pré-chargées de démo
    }

    // Abonnement aux changements d'état
    store.subscribe(() => {
        // Le DOM est mise à jour via le router, pas besoin de faire quoi que ce soit ici
    });
});

// ========================
// UTILITAIRES
// ========================

// Formatter les dates automatiquement
const style = document.createElement('style');
style.textContent = `
    .hidden-mobile {
        display: none !important;
    }
    @media (min-width: 768px) {
        .hidden-mobile {
            display: flex !important;
        }
    }
`;
document.head.appendChild(style);

// Gestion du responsive sidebar (optionnel)
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// Vérifier les devoirs à faire quotidienne
function checkDailyAssignments() {
    const today = new Date().toISOString().split('T')[0];
    const dueTodayCount = store.state.assignments.filter(a => 
        a.dueDate === today && !a.completed
    ).length;

    if (dueTodayCount > 0 && store.state.settings.notifyDaily) {
        notificationManager.show(
            '📚 Devoirs du jour',
            `Vous avez ${dueTodayCount} devoir(s) à faire aujourd'hui!`,
            'warning'
        );
    }
}

// Lancer les vérifications
if (store.state.isAuthenticated) {
    checkDailyAssignments();
    setInterval(checkDailyAssignments, 24 * 60 * 60 * 1000);
}
