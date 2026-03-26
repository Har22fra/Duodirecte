/* ========================
   UTILITAIRES UI
   ======================== */

class UIUtils {
    // Formater une date
    static formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    static formatDateShort(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString('fr-FR', {
            month: '2-digit',
            day: '2-digit'
        });
    }

    // Formater une heure
    static formatTime(isoString) {
        const date = new Date(isoString);
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Jours jusqu'à une date
    static daysUntil(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        const diff = date.getTime() - today.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    // Créer un avatar avec initiales
    static createAvatar(letter, size = 'md') {
        const colors = ['#6366f1', '#58cc02', '#0066cc', '#ff006e', '#8338ec', '#f59e0b'];
        const color = colors[letter.charCodeAt(0) % colors.length];
        return `<div class="avatar avatar-${size}" style="background: ${color};">${letter}</div>`;
    }

    // Créer une barre d'XP
    static createXPBar(current, needed) {
        const percent = (current / needed) * 100;
        return `
            <div class="xp-bar">
                <div class="xp-fill" style="width: ${percent}%"></div>
            </div>
        `;
    }

    // Formater le temps d'écran
    static formatScreenTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    }

    // Créer un badge de couleur selon la valeur
    static createGradeBadge(score) {
        let color = '#10b981'; // vert
        if (score < 10) color = '#ef4444'; // rouge
        else if (score < 12) color = '#f59e0b'; // orange
        else if (score < 14) color = '#3b82f6'; // bleu
        else if (score < 16) color = '#06b6d4'; // cyan

        return `<span class="badge" style="background-color: ${color}20; color: ${color};">${score}/20</span>`;
    }

    // Créer une médaille selon le rang
    static getMedalEmoji(rank) {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        if (rank <= 10) return '🔷';
        if (rank <= 20) return '🔶';
        if (rank <= 30) return '◼️';
        return '•';
    }

    // Générer un graphique simple
    static createSimpleChart(data, maxValue = 20) {
        return data.map(item => {
            const percent = (item.value / maxValue) * 100;
            return `
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>${item.label}</span>
                        <strong>${item.value}</strong>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percent}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Valider un email
    static isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Tronquer un texte
    static truncate(text, length = 50) {
        if (text.length > length) {
            return text.substring(0, length) + '...';
        }
        return text;
    }

    // Obtenir le statut d'un devoir
    static getAssignmentStatus(assignment) {
        const daysLeft = this.daysUntil(assignment.dueDate);
        
        if (assignment.completed) {
            return { status: 'completed', label: '✅ Complété', color: '#10b981' };
        }
        if (daysLeft < 0) {
            return { status: 'overdue', label: '❌ En retard', color: '#ef4444' };
        }
        if (daysLeft === 0) {
            return { status: 'today', label: '📌 Aujourd\'hui', color: '#f59e0b' };
        }
        if (daysLeft <= 2) {
            return { status: 'urgent', label: `⏰ ${daysLeft}j restant`, color: '#f59e0b' };
        }
        return { status: 'pending', label: `📅 ${daysLeft}j`, color: '#3b82f6' };
    }

    // Créer une ligne pour un grade
    static createGradeLine(grade) {
        const colors = {
            'Mathématiques': '#6366f1',
            'Français': '#58cc02',
            'Histoire': '#0066cc',
            'Anglais': '#ff006e',
            'Sport': '#8338ec',
            'Chimie': '#f59e0b'
        };

        const color = colors[grade.subject] || '#6b7280';
        const xpGained = Math.floor(grade.score * grade.coefficient);

        return `
            <div class="leaderboard-item" style="border-left: 4px solid ${color};">
                <div style="flex: 1;">
                    <div class="leaderboard-name">${grade.subject}</div>
                    <div class="leaderboard-level">${grade.score}/20 × ${grade.coefficient} = ${xpGained} XP</div>
                </div>
                <div class="leaderboard-xp">${this.formatDate(grade.date)}</div>
            </div>
        `;
    }
}

// Fonctions globales de formatage
function formatDate(isoString) {
    return UIUtils.formatDate(isoString);
}

function formatTime(isoString) {
    return UIUtils.formatTime(isoString);
}

function daysUntil(dateString) {
    return UIUtils.daysUntil(dateString);
}
