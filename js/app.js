/* ========================
   APPLICATION PRINCIPALE - PAGES
   ======================== */

// PAGE 404
function NotFoundPage() {
    return `
        <div class="app-container">
            <div style="grid-column: 1 / -1; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
                <div class="container text-center">
                    <h1 style="font-size: 4rem; margin-bottom: 1rem;">404</h1>
                    <h2>Page non trouvée</h2>
                    <p>La page que vous cherchez n'existe pas.</p>
                    <a href="/" class="btn btn-primary mt">Retour à l'accueil</a>
                </div>
            </div>
        </div>
    `;
}

// ========================
// PAGE DE CONNEXION
// ========================

function LoginPage() {
    if (store.state.isAuthenticated) {
        router.navigateTo('/dashboard');
        return '';
    }

    return `
        <div style="display: flex; min-height: 100vh;">
            <!-- Panneau de branding -->
            <div style="flex: 1; background: linear-gradient(135deg, var(--primary), var(--league-color)); color: white; display: flex; flex-direction: column; justify-content: center; padding: 2rem;" class="hidden-mobile">
                <div style="max-width: 500px;">
                    <h1 style="font-size: 3rem; margin-bottom: 1rem;">🎮 DuDirecte</h1>
                    <h2 style="font-size: 1.5rem; margin-bottom: 1rem; font-weight: 300;">Transformez votre scolarité en jeu</h2>
                    <p style="font-size: 1.1rem; opacity: 0.9;">Gagnez de l'XP, progressez dans les ligues et devenez légendaire!</p>
                    <div style="margin-top: 3rem; display: flex; gap: 1rem;">
                        <div>⭐️ Système de gamification</div>
                    </div>
                    <div style="margin-top: 1rem; display: flex; gap: 1rem;">
                        <div>🏆 Messages sécurisés</div>
                    </div>
                    <div style="margin-top: 1rem; display: flex; gap: 1rem;">
                        <div>🎯 Streaks & Ligues</div>
                    </div>
                </div>
            </div>

            <!-- Formulaire de connexion -->
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem; background-color: var(--bg-primary);">
                <div style="width: 100%; max-width: 400px;">
                    <h1 style="text-align: center; margin-bottom: 2rem;">Connexion DuDirecte</h1>

                    <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
                        <button class="btn btn-secondary" style="flex: 1; justify-content: center;" id="pronote-btn">
                            📘 Pronote
                        </button>
                        <button class="btn btn-secondary" style="flex: 1; justify-content: center;" id="ecole-btn">
                            📗 École Directe
                        </button>
                    </div>

                    <form id="login-form">
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-input" id="email" placeholder="exemple@école.fr" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Mot de passe</label>
                            <input type="password" class="form-input" id="password" placeholder="••••••••" required>
                        </div>

                        <button type="button" class="btn btn-primary btn-full btn-lg" id="login-btn">
                            Se connecter
                        </button>
                    </form>

                    <p style="text-align: center; margin-top: 2rem; color: var(--text-secondary);">
                        Pas de compte? <a href="#" data-link class="btn btn-secondary" style="padding: 0; background: none; color: var(--primary);">S'inscrire</a>
                    </p>

                    <!-- Comptes de test -->
                    <div style="margin-top: 2rem; padding: 1rem; background-color: var(--bg-secondary); border-radius: var(--radius-lg); font-size: var(--font-size-sm);">
                        <strong style="display: block; margin-bottom: 0.5rem;">Comptes de test (démo):</strong>
                        <div>Email: <code>demo@ecole.fr</code></div>
                        <div>Password: <code>password123</code></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ========================
// PAGE DASHBOARD
// ========================

function DashboardPage() {
    if (!store.state.isAuthenticated) {
        router.navigateTo('/');
        return '';
    }

    const user = store.state.user;
    const stats = store.state.userStats;
    const xpProgression = gamification.getXPProgression();
    const assignments = store.state.assignments;
    const upcomingAssignments = assignments.filter(a => !a.completed).slice(0, 3);
    const leaderboard = gamification.generateLeaderboard().slice(0, 5);

    return `
        <div class="app-container">
            ${Sidebar()}
            <div class="main-content">
                ${HeaderBar('Dashboard')}
                <div class="content">
                    <!-- Stats principales -->
                    <div class="grid grid-4 mb">
                        <div class="stat-card">
                            <div class="stat-icon">⭐</div>
                            <div class="stat-value">${stats.level}</div>
                            <div class="stat-label">Niveau</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">🔥</div>
                            <div class="stat-value">${stats.streak}</div>
                            <div class="stat-label">Streak</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">⏱️</div>
                            <div class="stat-value">${UIUtils.formatScreenTime(stats.screenTime)}</div>
                            <div class="stat-label">Temps d'écran</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">🏆</div>
                            <div class="stat-value">${stats.league}</div>
                            <div class="stat-label">Ligue</div>
                        </div>
                    </div>

                    <!-- XP Progress -->
                    <div class="card mb">
                        <div class="card-header">
                            <div class="card-title">📈 Progression XP</div>
                            <div style="font-weight: 600; color: var(--xp-color);">
                                ${gamification.formatXP(stats.xp)} / ${gamification.formatXP(stats.totalXPForLevel)}
                            </div>
                        </div>
                        ${UIUtils.createXPBar(stats.xp, stats.totalXPForLevel)}
                        <div style="display: flex; justify-content: space-between; font-size: var(--font-size-sm); color: var(--text-secondary);">
                            <span>Niveau ${stats.level}</span>
                            <span>Niveau ${stats.level + 1}</span>
                        </div>
                    </div>

                    <div class="grid grid-2">
                        <!-- Devoirs à faire -->
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title">📚 Devoirs à faire</div>
                                <div style="background-color: var(--primary); color: white; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-weight: 600; font-size: var(--font-size-sm);">
                                    ${upcomingAssignments.length}
                                </div>
                            </div>
                            ${upcomingAssignments.length > 0 ? `
                                <div class="card-content">
                                    ${upcomingAssignments.map(assignment => {
                                        const status = UIUtils.getAssignmentStatus(assignment);
                                        return `
                                            <div class="task-card">
                                                <div class="task-checkbox" data-assignment-id="${assignment.id}"></div>
                                                <div class="task-content" style="flex: 1;">
                                                    <div class="task-title">${assignment.subject}</div>
                                                    <div class="task-description">${assignment.title}</div>
                                                    <div class="task-meta">
                                                        <div class="task-meta-item" style="color: ${status.color};">
                                                            ${status.label}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            ` : `
                                <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                                    ✅ Aucun devoir! Bien joué!
                                </div>
                            `}
                            <a href="/lecons" data-link class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 1rem;">Voir tous les devoirs</a>
                        </div>

                        <!-- Top 5 Leaderboard -->
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title">🏆 Top 5</div>
                            </div>
                            <div class="card-content">
                                ${leaderboard.map((player, index) => `
                                    <div class="leaderboard-item">
                                        <div class="leaderboard-rank" style="color: ${index === 0 ? '#fbbf24' : index === 1 ? '#d1d5db' : index === 2 ? '#b45309' : 'var(--text-primary)'};">
                                            ${gamification.getMedalForRank(player.rank)} #${player.rank}
                                        </div>
                                        <div class="leaderboard-avatar">${player.avatar}</div>
                                        <div class="leaderboard-info">
                                            <div class="leaderboard-name">${player.name}</div>
                                            <div class="leaderboard-level">Lvl ${player.level}</div>
                                        </div>
                                        <div class="leaderboard-xp">${gamification.formatXP(player.xp)}</div>
                                    </div>
                                `).join('')}
                            </div>
                            <a href="/ligues" data-link class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 1rem;">Voir le classement complet</a>
                        </div>
                    </div>

                    <!-- Streaks et highlights -->
                    <div class="grid grid-2 mt">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title">🔥 Votre Streak</div>
                            </div>
                            <div style="text-align: center; padding: 2rem;">
                                <div style="font-size: 3rem; font-weight: 700; color: var(--streak-color); margin-bottom: 1rem;">${stats.streak}</div>
                                <p style="margin-bottom: 1rem;">Jours de suite sans manquer un devoir!</p>
                                <div style="font-size: var(--font-size-sm); color: var(--text-secondary);">
                                    ${stats.streak >= 7 ? '🎉 Vous approchez d\'un nouveau palier!' : 'Continuez comme ça!'}
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-title">📊 Statistiques</div>
                            </div>
                            <div class="card-content">
                                <div style="display: flex; justify-content: space-between; padding-bottom: var(--spacing-md); border-bottom: 1px solid var(--border);">
                                    <span>Devoirs complétés</span>
                                    <strong>${assignments.filter(a => a.completed).length} / ${assignments.length}</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; padding: var(--spacing-md) 0; border-bottom: 1px solid var(--border);">
                                    <span>Notes</span>
                                    <strong>${store.state.grades.length}</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; padding: var(--spacing-md) 0;">
                                    <span>Moyennes</span>
                                    <strong>${store.state.grades.length > 0 ? 
                                        ((store.state.grades.reduce((a, b) => a + b.score, 0) / store.state.grades.length).toFixed(2)) : 'N/A'
                                    }/20</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ========================
// PAGE LEÇONS / DEVOIRS
// ========================

function LessonsPage() {
    if (!store.state.isAuthenticated) {
        router.navigateTo('/');
        return '';
    }

    const assignments = store.state.assignments;
    const completed = assignments.filter(a => a.completed);
    const pending = assignments.filter(a => !a.completed);

    return `
        <div class="app-container">
            ${Sidebar()}
            <div class="main-content">
                ${HeaderBar('📚 Leçons')}
                <div class="content">
                    <div style="display: flex; gap: var(--spacing-md); margin-bottom: var(--spacing-lg);">
                        <button class="btn btn-primary" id="filter-all">Tous (${assignments.length})</button>
                        <button class="btn btn-secondary" id="filter-pending">À faire (${pending.length})</button>
                        <button class="btn btn-secondary" id="filter-completed">Complétés (${completed.length})</button>
                    </div>

                    <div id="assignments-list">
                        ${pending.length > 0 ? pending.map(assignment => `
                            <div class="card mb" data-assignment="${assignment.id}">
                                <div class="card-header" style="align-items: flex-start;">
                                    <div style="flex: 1;">
                                        <div class="card-title">${assignment.subject}</div>
                                        <div style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-top: 0.5rem;">
                                            ${assignment.title}
                                        </div>
                                    </div>
                                    ${(() => {
                                        const status = UIUtils.getAssignmentStatus(assignment);
                                        return `<span class="badge" style="background-color: ${status.color}20; color: ${status.color};">${status.label}</span>`;
                                    })()}
                                </div>
                                <div class="card-content">
                                    <p>${assignment.description}</p>
                                    <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap;">
                                        <span class="badge badge-primary">📅 ${UIUtils.formatDate(assignment.dueDate)}</span>
                                        <span class="badge badge-info">⭐ +10 XP</span>
                                        <span class="badge badge-success">⏱️ +5 min</span>
                                    </div>
                                </div>
                                <div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-lg);">
                                    <button class="btn btn-success complete-assignment" data-id="${assignment.id}">
                                        ✅ Marquer comme fait
                                    </button>
                                    <button class="btn btn-secondary">
                                        📸 Ajouter une preuve
                                    </button>
                                </div>
                            </div>
                        `) : `
                            <div class="card text-center">
                                <div style="padding: 3rem;">
                                    <div style="font-size: 2rem; margin-bottom: 1rem;">🎉</div>
                                    <h3>Aucun devoir en attente!</h3>
                                    <p>Vous avez fait tous vos devoirs. Bravo!</p>
                                </div>
                            </div>
                        `}
                    </div>

                    ${completed.length > 0 ? `
                        <h3 style="margin-top: 2rem; margin-bottom: 1rem;">✅ Devoirs complétés</h3>
                        ${completed.map(assignment => `
                            <div class="card mb" style="opacity: 0.7;">
                                <div class="card-header">
                                    <div>
                                        <div class="card-title">${assignment.subject}</div>
                                        <div style="font-size: var(--font-size-sm); color: var(--text-secondary);">
                                            Complété le ${UIUtils.formatDate(assignment.completedAt)}
                                        </div>
                                    </div>
                                    <span class="badge badge-success">✅ Complété</span>
                                </div>
                            </div>
                        `).join('')}
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// ========================
// PAGE NOTES / GRADES
// ========================

function GradesPage() {
    if (!store.state.isAuthenticated) {
        router.navigateTo('/');
        return '';
    }

    const grades = store.state.grades;
    const groupedBySubject = grades.reduce((acc, grade) => {
        if (!acc[grade.subject]) acc[grade.subject] = [];
        acc[grade.subject].push(grade);
        return acc;
    }, {});

    return `
        <div class="app-container">
            ${Sidebar()}
            <div class="main-content">
                ${HeaderBar('📊 Mes Notes')}
                <div class="content">
                    ${grades.length === 0 ? `
                        <div class="card text-center">
                            <div style="padding: 3rem;">
                                <div style="font-size: 2rem; margin-bottom: 1rem;">📈</div>
                                <h3>Aucune note pour l'instant</h3>
                                <p>Vos notes apparaîtront ici lorsque vous en aurez reçu de vos profs.</p>
                            </div>
                        </div>
                    ` : `
                        ${Object.entries(groupedBySubject).map(([subject, subjectGrades]) => {
                            const average = (subjectGrades.reduce((a, b) => a + b.score, 0) / subjectGrades.length).toFixed(2);
                            const colors = {
                                'Mathématiques': '#6366f1',
                                'Français': '#58cc02',
                                'Histoire': '#0066cc',
                                'Anglais': '#ff006e',
                                'Sport': '#8338ec',
                                'Chimie': '#f59e0b'
                            };
                            const color = colors[subject] || '#6b7280';

                            return `
                                <div class="card mb">
                                    <div class="card-header" style="border-bottom: 2px solid ${color};">
                                        <div>
                                            <div class="card-title">${subject}</div>
                                            <div style="font-size: var(--font-size-sm); color: var(--text-secondary);">
                                                Moyenne: <strong>${average}/20</strong>
                                            </div>
                                        </div>
                                        <div style="padding: 0.5rem 1rem; background-color: ${color}20; border-radius: var(--radius-lg); color: ${color}; font-weight: 600;">
                                            ${Math.round(average * 10) / 10 >= 16 ? '⭐' : Math.round(average * 10) / 10 >= 12 ? '✓' : '!'}
                                        </div>
                                    </div>
                                    <div class="card-content">
                                        ${subjectGrades.map(grade => `
                                            <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-md); border-bottom: 1px solid var(--border);">
                                                <div>
                                                    <div style="font-weight: 600; color: var(--text-primary);">Note ${grade.score}/20</div>
                                                    <div style="font-size: var(--font-size-sm); color: var(--text-secondary);">
                                                        Coefficient ${grade.coefficient} • ${UIUtils.formatDate(grade.date)}
                                                    </div>
                                                </div>
                                                <div style="text-align: right;">
                                                    <div style="font-weight: 700; color: var(--xp-color); font-size: var(--font-size-lg);">
                                                        +${Math.floor(grade.score * grade.coefficient)} XP
                                                    </div>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    `}
                </div>
            </div>
        </div>
    `;
}

// ========================
// PAGE LIGUES
// ========================

function LeaguesPage() {
    if (!store.state.isAuthenticated) {
        router.navigateTo('/');
        return '';
    }

    const leaderboard = gamification.generateLeaderboard();
    const leagueStats = gamification.getLeagueStats();

    return `
        <div class="app-container">
            ${Sidebar()}
            <div class="main-content">
                ${HeaderBar('🏆 Ligues')}
                <div class="content">
                    <!-- Info ligue actuelle -->
                    <div class="card mb">
                        <div class="card-header">
                            <div>
                                <div class="card-title">🏆 ${leagueStats.league}</div>
                                <div style="font-size: var(--font-size-sm); color: var(--text-secondary);">
                                    Vous êtes classé #${leagueStats.rank} / ${leagueStats.totalPlayers}
                                </div>
                            </div>
                        </div>
                        <div class="card-content">
                            <div style="text-align: center; padding: 2rem;">
                                ${leagueStats.canPromote ? `
                                    <div style="font-size: 1.5rem; margin-bottom: 1rem;">🚀</div>
                                    <h3>Vous allez bientôt être promu!</h3>
                                    <p>Gagnez plus d'XP pour atteindre le top 10</p>
                                ` : leagueStats.canDemote ? `
                                    <div style="font-size: 1.5rem; margin-bottom: 1rem;">⚠️</div>
                                    <h3>Vous risquez de descendre</h3>
                                    <p>Gagnez plus d'XP pour rester dans votre ligue</p>
                                ` : `
                                    <div style="font-size: 1.5rem; margin-bottom: 1rem;">💪</div>
                                    <h3>Vous êtes stable</h3>
                                    <p>Continuez à performer!</p>
                                `}
                            </div>
                            ${(() => {
                                if (leagueStats.canPromote) {
                                    return '<div class="progress-bar" style="margin-bottom: 1rem;"><div class="progress-fill" style="width: 85%;"></div></div>';
                                }
                                return '';
                            })()}
                        </div>
                    </div>

                    <!-- Classement complet -->
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">📊 Classement Global</div>
                            <span class="badge badge-primary">${leaderboard.length} joueurs</span>
                        </div>
                        <div class="card-content">
                            ${leaderboard.map((player, index) => {
                                const isCurrentUser = player.name === store.state.user?.name;
                                return `
                                    <div class="leaderboard-item" style="${isCurrentUser ? 'background-color: var(--bg-secondary); border-left: 4px solid var(--primary);' : ''}">
                                        <div class="leaderboard-rank">
                                            ${gamification.getMedalForRank(player.rank)}
                                            <div style="font-size: var(--font-size-sm); font-weight: 600;">#${player.rank}</div>
                                        </div>
                                        <div class="leaderboard-avatar">${player.avatar}</div>
                                        <div class="leaderboard-info">
                                            <div class="leaderboard-name">
                                                ${player.name} ${isCurrentUser ? '👈 Vous' : ''}
                                            </div>
                                            <div class="leaderboard-level">Lvl ${player.level}</div>
                                        </div>
                                        <div class="leaderboard-xp">${gamification.formatXP(player.xp)} XP</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- Infos promotions -->
                    <div class="grid grid-2 mt">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title">⬆️ Promotions</div>
                            </div>
                            <div class="card-content">
                                <p style="margin-bottom: 1rem;">Top 10 montent au:
 ligue or</p>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 50%;"></div>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title">⬇️ Rétrogradations</div>
                            </div>
                            <div class="card-content">
                                <p style="margin-bottom: 1rem;">Les 10 derniers descendent</p>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 20%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ========================
// PAGE MESSAGERIE
// ========================

function MessagingPage() {
    if (!store.state.isAuthenticated) {
        router.navigateTo('/');
        return '';
    }

    const messages = store.state.messages;

    return `
        <div class="app-container">
            ${Sidebar()}
            <div class="main-content">
                ${HeaderBar('💬 Messagerie')}
                <div class="content">
                    <div class="grid grid-2" style="height: 600px;">
                        <!-- Conversations -->
                        <div class="card" style="display: flex; flex-direction: column; overflow: hidden;">
                            <div class="card-header">
                                <div class="card-title">Conversations</div>
                                <button class="btn btn-primary" style="padding: 0.5rem 1rem;">➕</button>
                            </div>
                            <div style="flex: 1; overflow-y: auto;">
                                <div class="card-content">
                                    <div class="leaderboard-item">
                                        <div class="leaderboard-avatar" style="background-color: var(--primary); font-size: var(--font-size-lg);">👥</div>
                                        <div class="leaderboard-info">
                                            <div class="leaderboard-name">Groupe classe</div>
                                            <div class="leaderboard-level">12 membres</div>
                                        </div>
                                    </div>
                                    <div class="leaderboard-item">
                                        <div class="leaderboard-avatar" style="background-color: var(--success); font-size: var(--font-size-lg);">👤</div>
                                        <div class="leaderboard-info">
                                            <div class="leaderboard-name">Marie</div>
                                            <div class="leaderboard-level">En ligne</div>
                                        </div>
                                    </div>
                                    <div class="leaderboard-item">
                                        <div class="leaderboard-avatar" style="background-color: var(--info); font-size: var(--font-size-lg);">👤</div>
                                        <div class="leaderboard-info">
                                            <div class="leaderboard-name">Thomas</div>
                                            <div class="leaderboard-level">Hors ligne</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Chat -->
                        <div class="card" style="display: flex; flex-direction: column;">
                            <div class="card-header">
                                <div class="card-title">Groupe classe</div>
                                <div style="display: flex; gap: 0.5rem;">
                                    <button class="btn btn-secondary" style="padding: 0.5rem;">🔐</button>
                                    <button class="btn btn-secondary" style="padding: 0.5rem;">⚙️</button>
                                </div>
                            </div>
                            <div style="flex: 1; overflow-y: auto; padding: var(--spacing-lg); display: flex; flex-direction: column; gap: var(--spacing-md);">
                                <div style="text-align: center; color: var(--text-secondary); font-size: var(--font-size-sm);">
                                    Les messages sont chiffrés de bout en bout 🔒
                                </div>
                            </div>
                            <div style="padding: var(--spacing-lg); border-top: 1px solid var(--border); display: flex; gap: 0.5rem;">
                                <input type="text" class="form-input" placeholder="Votre message..." style="margin-bottom: 0;" id="message-input">
                                <button class="btn btn-primary">📤</button>
                            </div>
                        </div>
                    </div>

                    <h3 style="margin-top: 2rem; margin-bottom: 1rem;">🛡️ Sécurité</h3>
                    <div class="alert alert-success">
                        <div class="alert-icon">✅</div>
                        <div>
                            <strong>Chiffrement de bout en bout</strong>
                            <p style="margin: 0;">Tous les messages sont automatiquement chiffrés. Personne d'autre (même les admins) ne peut les lire.</p>
                        </div>
                    </div>

                    <div class="alert alert-primary">
                        <div class="alert-icon">🤖</div>
                        <div>
                            <strong>Modération par IA</strong>
                            <p style="margin: 0;">Notre système detect et filtre le harcèlement, les insultes et les contenus inappropriés.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ========================
// PAGE PROFIL
// ========================

function ProfilePage() {
    if (!store.state.isAuthenticated) {
        router.navigateTo('/');
        return '';
    }

    const user = store.state.user;
    const stats = store.state.userStats;
    const leaderboard = gamification.generateLeaderboard();
    const userRank = leaderboard.findIndex(p => p.name === user.name) + 1;

    return `
        <div class="app-container">
            ${Sidebar()}
            <div class="main-content">
                ${HeaderBar('👤 Profil')}
                <div class="content">
                    <!-- Profile header -->
                    <div class="card mb">
                        <div style="display: flex; gap: 2rem; align-items: center;">
                            <div style="font-size: 4rem; width: 80px; height: 80px; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--primary), var(--primary-light)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700;">
                                ${user.avatar}
                            </div>
                            <div>
                                <h1 style="font-size: var(--font-size-2xl); margin-bottom: 0.5rem;">${user.name}</h1>
                                <p style="margin-bottom: 0.5rem;">${user.email}</p>
                                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                                    <span class="badge badge-primary">Depuis ${UIUtils.formatDate(user.joinedAt)}</span>
                                    <span class="badge badge-info">${user.provider}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-2">
                        <!-- Stats personnelles -->
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title">📈 Vos stats</div>
                            </div>
                            <div class="card-content">
                                <div style="display: flex; justify-content: space-between; padding: var(--spacing-md) 0; border-bottom: 1px solid var(--border);">
                                    <span>Niveau</span>
                                    <strong>${stats.level}</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; padding: var(--spacing-md) 0; border-bottom: 1px solid var(--border);">
                                    <span>Classement</span>
                                    <strong>#${userRank}</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; padding: var(--spacing-md) 0; border-bottom: 1px solid var(--border);">
                                    <span>Ligue</span>
                                    <strong>${stats.league}</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; padding: var(--spacing-md) 0; border-bottom: 1px solid var(--border);">
                                    <span>XP Total</span>
                                    <strong>${gamification.formatXP(stats.xp)}</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; padding: var(--spacing-md) 0;">
                                    <span>Streak actuelle</span>
                                    <strong>${stats.streak} jours 🔥</strong>
                                </div>
                            </div>
                        </div>

                        <!-- Réalisations -->
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title">🏆 Réalisations</div>
                            </div>
                            <div class="card-content">
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                                    <div style="text-align: center; padding: 1rem; background-color: var(--bg-secondary); border-radius: var(--radius-lg);">
                                        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">⭐</div>
                                        <div style="font-size: var(--font-size-sm); color: var(--text-secondary);">Expert</div>
                                    </div>
                                    <div style="text-align: center; padding: 1rem; background-color: var(--bg-secondary); border-radius: var(--radius-lg);">
                                        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🔥</div>
                                        <div style="font-size: var(--font-size-sm); color: var(--text-secondary);">Week streak</div>
                                    </div>
                                    <div style="text-align: center; padding: 1rem; background-color: var(--bg-secondary); border-radius: var(--radius-lg);">
                                        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🎓</div>
                                        <div style="font-size: var(--font-size-sm); color: var(--text-secondary);">10 Devoirs</div>
                                    </div>
                                    <div style="text-align: center; padding: 1rem; background-color: var(--bg-secondary); border-radius: var(--radius-lg);">
                                        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">💬</div>
                                        <div style="font-size: var(--font-size-sm); color: var(--text-secondary);">Socialite</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="card mt">
                        <div class="card-header">
                            <div class="card-title">⚙️ Actions</div>
                        </div>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                            <button class="btn btn-secondary" id="edit-profile-btn">Modifier le profil</button>
                            <button class="btn btn-secondary" id="logout-btn">Se déconnecter</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ========================
// PAGE PARAMÈTRES
// ========================

function SettingsPage() {
    if (!store.state.isAuthenticated) {
        router.navigateTo('/');
        return '';
    }

    const settings = store.state.settings;
    const currentTheme = store.state.theme;

    return `
        <div class="app-container">
            ${Sidebar()}
            <div class="main-content">
                ${HeaderBar('⚙️ Paramètres')}
                <div class="content">
                    <div class="grid grid-2">
                        <!-- Apparence -->
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title">🎨 Apparence</div>
                            </div>
                            <div class="card-content gap-lg">
                                <div class="form-group">
                                    <label class="form-label">Thème</label>
                                    <select id="theme-select" class="form-select">
                                        <option value="duolingo" ${currentTheme === 'duolingo' ? 'selected' : ''}>Duolingo (vert)</option>
                                        <option value="pronote" ${currentTheme === 'pronote' ? 'selected' : ''}>Pronote (bleu)</option>
                                        <option value="ecole-directe" ${currentTheme === 'ecole-directe' ? 'selected' : ''}>École Directe</option>
                                        <option value="cyberpunk" ${currentTheme === 'cyberpunk' ? 'selected' : ''}>Cyberpunk</option>
                                        <option value="pastel" ${currentTheme === 'pastel' ? 'selected' : ''}>Pastel</option>
                                    </select>
                                </div>

                                <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-md) 0; border-bottom: 1px solid var(--border);">
                                    <span>Mode sombre</span>
                                    <input type="checkbox" id="dark-mode" ${settings.darkMode ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;">
                                </div>
                            </div>
                        </div>

                        <!-- Notifications -->
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title">🔔 Notifications</div>
                            </div>
                            <div class="card-content gap-lg">
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0; border-bottom: 1px solid var(--border); padding-bottom: var(--spacing-md);">
                                    <span>Activer</span>
                                    <input type="checkbox" id="notifications-toggle" ${settings.notifications ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;">
                                </div>

                                <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-md) 0; border-bottom: 1px solid var(--border);">
                                    <span>Son</span>
                                    <input type="checkbox" id="sound-toggle" ${settings.soundEnabled ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;">
                                </div>

                                <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-md) 0;">
                                    <span>Rappel quotidien</span>
                                    <input type="checkbox" id="daily-notify" ${settings.notifyDaily ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;">
                                </div>

                                <div style="display: flex; gap: var(--spacing-md);">
                                    <label class="form-label" style="flex: 1; margin-bottom: 0.5rem;">Heure</label>
                                    <input type="time" id="notify-time" class="form-input" value="${settings.dailyNotifyTime}" style="flex: 1;">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Confidentialité & Sécurité -->
                    <div class="card mt">
                        <div class="card-header">
                            <div class="card-title">🔒 Confidentialité & Sécurité</div>
                        </div>
                        <div class="card-content gap-lg">
                            <div class="alert alert-primary">
                                <div class="alert-icon">🔐</div>
                                <div>
                                    <strong>Chiffrement E2E</strong>
                                    <p style="margin: 0;">Tous vos messages sont chiffrés de bout en bout.</p>
                                </div>
                            </div>

                            <button class="btn btn-secondary">Modifier le mot de passe</button>
                            <button class="btn btn-danger">Supprimer le compte</button>
                        </div>
                    </div>

                    <!-- À propos -->
                    <div class="card mt">
                        <div class="card-header">
                            <div class="card-title">ℹ️ À propos</div>
                        </div>
                        <div class="card-content">
                            <div style="display: flex; justify-content: space-between; padding: var(--spacing-md) 0; border-bottom: 1px solid var(--border);">
                                <span>Version</span>
                                <strong>1.0.0</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: var(--spacing-md) 0; border-bottom: 1px solid var(--border);">
                                <span>Développé par</span>
                                <strong>DuDirecte Team</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: var(--spacing-md) 0;">
                                <span>Licence</span>
                                <strong>MIT</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ========================
// COMPOSANTS RÉUTILISABLES
// ========================

function Sidebar() {
    const user = store.state.user;
    const stats = store.state.userStats;
    const currentPath = window.location.pathname;

    return `
        <div class="sidebar">
            <div class="sidebar-header">
                <div class="sidebar-logo">🎮</div>
                <div class="sidebar-logo" style="-webkit-text-fill-color: unset; background: none;">DuD</div>
            </div>

            <nav class="sidebar-nav">
                <a href="/dashboard" data-link class="nav-item ${currentPath === '/dashboard' ? 'active' : ''}">
                    <div class="nav-icon">📊</div>
                    <span>Dashboard</span>
                </a>
                <a href="/lecons" data-link class="nav-item ${currentPath === '/lecons' ? 'active' : ''}">
                    <div class="nav-icon">📚</div>
                    <span>Leçons</span>
                </a>
                <a href="/notes" data-link class="nav-item ${currentPath === '/notes' ? 'active' : ''}">
                    <div class="nav-icon">📊</div>
                    <span>Notes</span>
                </a>
                <a href="/ligues" data-link class="nav-item ${currentPath === '/ligues' ? 'active' : ''}">
                    <div class="nav-icon">🏆</div>
                    <span>Ligues</span>
                </a>
                <a href="/messagerie" data-link class="nav-item ${currentPath === '/messagerie' ? 'active' : ''}">
                    <div class="nav-icon">💬</div>
                    <span>Messages</span>
                </a>
                <a href="/profil" data-link class="nav-item ${currentPath === '/profil' ? 'active' : ''}">
                    <div class="nav-icon">👤</div>
                    <span>Profil</span>
                </a>
                <a href="/parametres" data-link class="nav-item ${currentPath === '/parametres' ? 'active' : ''}">
                    <div class="nav-icon">⚙️</div>
                    <span>Paramètres</span>
                </a>
            </nav>

            <!-- Stats compactes -->
            <div style="padding-top: var(--spacing-lg); border-top: 1px solid var(--border);">
                <div style="padding: var(--spacing-md); text-align: center;">
                    <div style="font-weight: 700; color: var(--xp-color); font-size: var(--font-size-lg); margin-bottom: 0.5rem;">
                        ⭐ ${stats.level}
                    </div>
                    <div style="font-size: var(--font-size-sm); color: var(--text-secondary);">Niveau</div>
                </div>
            </div>
        </div>
    `;
}

function HeaderBar(title) {
    const user = store.state.user;

    return `
        <div class="header">
            <h1 class="header-title">${title}</h1>
            <div style="display: flex; align-items: center; gap: var(--spacing-lg);">
                <div style="text-align: right;">
                    <div style="font-weight: 600;">${user?.name || 'Utilisateur'}</div>
                    <div style="font-size: var(--font-size-sm); color: var(--text-secondary);" id="current-time">--:--</div>
                </div>
                <div style="width: 40px; height: 40px; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--primary), var(--primary-light)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700;">
                    ${user?.avatar || 'U'}
                </div>
            </div>
        </div>
    `;
}

// Mettre à jour l'heure
setInterval(() => {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
}, 1000);
