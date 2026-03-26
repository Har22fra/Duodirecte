/* ========================
   NOTIFICATIONS
   ======================== */

class NotificationManager {
    constructor(store) {
        this.store = store;
        this.timeout = null;
    }

    // Afficher une notification toast
    show(title, message, type = 'success', duration = 3000) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type} fade-in`;
        notification.innerHTML = `
            <div class="notification-icon">${this.getIcon(type)}</div>
            <div class="notification-text">
                <strong>${title}</strong>
                <div>${message}</div>
            </div>
            <button class="notification-close">×</button>
        `;

        container.appendChild(notification);

        // Fermer au clic
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        // Auto-remove
        setTimeout(() => {
            notification.remove();
        }, duration);

        // Jouer son si activé
        if (this.store.state.settings.soundEnabled) {
            this.playSound(type);
        }
    }

    // Obtenir l'icône selon le type
    getIcon(type) {
        const icons = {
            success: '✅',
            danger: '❌',
            warning: '⚠️',
            info: 'ℹ️',
            xp: '⭐',
            streak: '🔥'
        };
        return icons[type] || '📢';
    }

    // Jouer un son (simulé)
    playSound(type) {
        // Dans une vraie app, on utiliserait l'API Web Audio
        console.log(`[SOUND] ${type}`);
    }

    // Notifications de devoirs
    notifyAssignmentDue(assignment) {
        this.show(
            'Devoir à faire',
            `📚 ${assignment.subject}: ${assignment.title}`,
            'warning'
        );
    }

    // Notifications d'XP
    notifyXPGained(amount) {
        this.show(
            'XP gagné!',
            `+${amount} XP`,
            'xp',
            2000
        );
    }

    // Notifications de streak
    notifyStreakMilestone(streak) {
        this.show(
            '🔥 Streak en feu!',
            `Vous avez une série de ${streak} jours!`,
            'streak'
        );
    }

    // Notifications de changement de ligue
    notifyLeagueChange(newLeague) {
        this.show(
            '🏆 Changement de ligue',
            `Bienvenue dans la ligue ${newLeague}!`,
            'success'
        );
    }

    // Notifications de sanctions
    notifyNewSanction(sanction) {
        this.show(
            '⚠️ Nouvelle sanction',
            `${sanction.type}: ${sanction.reason}`,
            'danger'
        );
    }

    // Rappels quotidiens
    scheduleDaily(title, message, time = '09:00') {
        // Analyser le time au format HH:MM
        const [hours, minutes] = time.split(':').map(Number);
        const now = new Date();
        let scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0);

        // Si l'heure est passée, programmer pour demain
        if (scheduledTime <= now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
        }

        const timeUntilNotification = scheduledTime.getTime() - now.getTime();

        setTimeout(() => {
            this.show(title, message, 'info');
            // Répéter chaque jour
            setInterval(() => {
                this.show(title, message, 'info');
            }, 24 * 60 * 60 * 1000);
        }, timeUntilNotification);
    }

    // Afficher une modale de confirmation
    showConfirmation(title, message, onConfirm, onCancel) {
        const container = document.getElementById('modal-container');
        if (!container) return;

        container.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    ${title}
                    <button class="modal-close">×</button>
                </div>
                <div style="margin-bottom: var(--spacing-lg);">${message}</div>
                <div style="display: flex; gap: var(--spacing-md); justify-content: flex-end;">
                    <button class="btn btn-secondary" id="cancel-btn">Annuler</button>
                    <button class="btn btn-primary" id="confirm-btn">Confirmer</button>
                </div>
            </div>
        `;

        container.classList.remove('hidden');

        const confirmBtn = container.querySelector('#confirm-btn');
        const cancelBtn = container.querySelector('#cancel-btn');
        const closeBtn = container.querySelector('.modal-close');

        confirmBtn.addEventListener('click', () => {
            container.classList.add('hidden');
            onConfirm();
        });

        cancelBtn.addEventListener('click', () => {
            container.classList.add('hidden');
            onCancel?.();
        });

        closeBtn.addEventListener('click', () => {
            container.classList.add('hidden');
            onCancel?.();
        });

        container.addEventListener('click', (e) => {
            if (e.target === container) {
                container.classList.add('hidden');
                onCancel?.();
            }
        });
    }

    // Afficher un input
    showInput(title, placeholder, onSubmit, type = 'text') {
        const container = document.getElementById('modal-container');
        if (!container) return;

        container.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    ${title}
                    <button class="modal-close">×</button>
                </div>
                <input type="${type}" class="form-input" id="modal-input" placeholder="${placeholder}" />
                <div style="display: flex; gap: var(--spacing-md); justify-content: flex-end; margin-top: var(--spacing-lg);">
                    <button class="btn btn-secondary" id="cancel-btn">Annuler</button>
                    <button class="btn btn-primary" id="submit-btn">Envoyer</button>
                </div>
            </div>
        `;

        container.classList.remove('hidden');

        const input = container.querySelector('#modal-input');
        const submitBtn = container.querySelector('#submit-btn');
        const cancelBtn = container.querySelector('#cancel-btn');
        const closeBtn = container.querySelector('.modal-close');

        const handleClose = () => {
            container.classList.add('hidden');
        };

        submitBtn.addEventListener('click', () => {
            if (input.value.trim()) {
                onSubmit(input.value);
                handleClose();
            }
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitBtn.click();
            }
        });

        cancelBtn.addEventListener('click', handleClose);
        closeBtn.addEventListener('click', handleClose);

        setTimeout(() => input.focus(), 100);
    }
}

const notificationManager = new NotificationManager(store);
