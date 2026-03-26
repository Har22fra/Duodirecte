/* ========================
   GAMIFICATION
   ======================== */

class Gamification {
    constructor(store) {
        this.store = store;
    }

    // Ligues - 30 joueurs par ligue
    generateLeaderboard() {
        const players = [
            { name: 'Alexandre', xp: 5200, level: 5, avatar: 'A' },
            { name: 'Marie', xp: 4800, level: 5, avatar: 'M' },
            { name: 'Thomas', xp: 4500, level: 4, avatar: 'T' },
            { name: 'Sophie', xp: 4200, level: 4, avatar: 'S' },
            { name: 'Luc', xp: 3900, level: 4, avatar: 'L' },
            { name: 'Emma', xp: 3600, level: 3, avatar: 'E' },
            { name: 'Pierre', xp: 3300, level: 3, avatar: 'P' },
            { name: 'Julien', xp: 3000, level: 3, avatar: 'J' },
            { name: 'Nina', xp: 2700, level: 2, avatar: 'N' },
            { name: 'Lucas', xp: 2400, level: 2, avatar: 'L' },
            { name: 'Clara', xp: 2100, level: 2, avatar: 'C' },
            { name: 'Oscar', xp: 1800, level: 2, avatar: 'O' },
            { name: 'Zoé', xp: 1500, level: 1, avatar: 'Z' },
            { name: 'Hugo', xp: 1200, level: 1, avatar: 'H' },
            { name: 'Margot', xp: 900, level: 1, avatar: 'M' },
            { name: 'Nathan', xp: 600, level: 1, avatar: 'N' },
            { name: 'Léa', xp: 300, level: 1, avatar: 'L' },
            { name: 'Maxime', xp: this.store.state.userStats.xp, level: this.store.state.userStats.level, avatar: store.state.user?.avatar }
        ];

        return players
            .sort((a, b) => b.xp - a.xp)
            .map((player, index) => ({
                ...player,
                rank: index + 1
            }));
    }

    // Obtenir la médaille en fonction du rang
    getMedalForRank(rank) {
        if (rank <= 10) return '🥇';
        if (rank <= 20) return '🥈';
        if (rank <= 30) return '🥉';
        return '📊';
    }

    // Calculer la progressión du XP pour le niveau suivant
    getXPProgression() {
        const stats = this.store.state.userStats;
        const xpToNextLevel = stats.totalXPForLevel;
        const currentXP = stats.xp;
        const progress = (currentXP / xpToNextLevel) * 100;

        return {
            current: currentXP,
            needed: xpToNextLevel,
            progress: Math.min(progress, 100),
            level: stats.level
        };
    }

    // Système d'achievements
    checkAchievements() {
        const achievements = [];
        const stats = this.store.state.userStats;

        // Streak achievements
        if (stats.streak === 7) achievements.push({ name: 'Une semaine de suite!', icon: '🔥', reward: 50 });
        if (stats.streak === 30) achievements.push({ name: 'Un mois de fiabilité', icon: '🏆', reward: 200 });
        if (stats.streak === 100) achievements.push({ name: 'Légendaire!', icon: '⭐', reward: 500 });

        // XP achievements
        if (stats.level === 5) achievements.push({ name: 'Niveau 5 atteint!', icon: '📈', reward: 100 });
        if (stats.level === 10) achievements.push({ name: 'Vraiment expérimenté', icon: '🎓', reward: 250 });

        // Screen time achievements
        if (stats.screenTime >= 500) achievements.push({ name: 'Récompense temps d\'écran', icon: '⏱️', reward: 100 });

        return achievements;
    }

    // Format pour affichage
    formatXP(xp) {
        if (xp >= 1000) {
            return Math.floor(xp / 1000) + 'k';
        }
        return xp.toString();
    }

    // Prédire le rang basé sur le XP
    predictRank() {
        const leaderboard = this.generateLeaderboard();
        const currentPlayer = leaderboard.find(p => p.name === store.state.user?.name);
        return currentPlayer?.rank || 0;
    }

    // Obtenir les statistiques de la ligue
    getLeagueStats() {
        const stats = this.store.state.userStats;
        const leaderboard = this.generateLeaderboard();
        const playerRank = leaderboard.findIndex(p => p.name === store.state.user?.name) + 1;

        return {
            league: stats.league,
            rank: playerRank,
            totalPlayers: leaderboard.length,
            canPromote: playerRank <= 10,
            canDemote: playerRank > 20,
            promotion: {
                available: playerRank <= 10,
                message: playerRank <= 10 ? '🚀 Vous allez être promu!' : 'Gagnez plus d\'XP pour être promu'
            }
        };
    }
}

const gamification = new Gamification(store);
