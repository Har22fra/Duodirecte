# 🎮 DuDirecte - Transformez votre scolarité en jeu

Bienvenue dans **DuDirecte**, une plateforme gamifiée qui transforme la gestion scolaire en expérience ludique inspirée de Duolingo, Pronote et École Directe!

## 📋 Fonctionnalités Principales

### 🔐 Authentification
- Connexion simulée via **Pronote** ou **École Directe**
- Synchronisation automatique des données scolaires
- Sauvegarde locale du profil utilisateur

### 🎨 Personnalisation
- **5 thèmes disponibles**: Duolingo, Pronote, École Directe, Cyberpunk, Pastel
- Mode sombre/clair
- Profil personnalisable avec avatar

### ⏱️ Temps d'Écran Gamifié
- Gagnez du temps d'écran avec de bonnes notes
- Perdez du temps d'écran avec des sanctions
- Formule: Note × Coefficient = XP

### 📚 Système de Leçons (style Duolingo)
- Devoirs présentés comme des niveaux à compléter
- Validation par case à cocher
- Rappels automatiques

### 🔥 Système de Streak
- Augmente avec chaque devoir complété
- Réinitialisé avec sanctions
- Badges de réussite

### 🏆 Système XP et Ligues
- **30 joueurs par ligue**
- **Top 10** → Promotion à la ligue supérieure
- **Derniers 10** → Rétrogradation
- Classement global en temps réel

### 💬 Messagerie Sécurisée
- Chiffrement de bout en bout
- Modération par IA (simulation)
- Détection du harcèlement

### 🔔 Notifications Intelligentes
- Rappels de devoirs
- Alertes de sanctions
- Progression XP
- Notifications quotidiennes personnalisables

## 🚀 Démarrage Rapide

### Installation
1. Ouvrez `index.html` dans votre navigateur
2. C'est tout! Aucune installation requise

### Identifiants de Test
```
Email: demo@ecole.fr
Mot de passe: password123
```

## 📁 Structure du Projet

```
DuDirecte/
├── index.html              # Page principale
├── css/
│   ├── main.css           # Styles principaux
│   ├── themes.css         # Thèmes et animations
│   └── components.css     # Composants UI
├── js/
│   ├── store.js           # Gestion d'état (Redux-like)
│   ├── router.js          # Système de routage SPA
│   ├── auth.js            # Authentication et sync
│   ├── gamification.js    # Logique de jeu
│   ├── notifications.js   # Notifications et modales
│   ├── ui.js              # Utilitaires UI
│   ├── app.js             # Pages et composants
│   └── main.js            # Initialisation et événements
└── assets/                # Ressources (images, etc.)
```

## 🎮 Pages Disponibles

| Page | URL | Description |
|------|-----|-------------|
| Login | `/` | Page de connexion |
| Dashboard | `/dashboard` | Aperçu et statistiques |
| Leçons | `/lecons` | Gestion des devoirs |
| Notes | `/notes` | Historique des notes |
| Ligues | `/ligues` | Classement et compétition |
| Messagerie | `/messagerie` | Chat sécurisé |
| Profil | `/profil` | Profil utilisateur |
| Paramètres | `/parametres` | Réglages et thèmes |

## ⚙️ Système de Points

### XP (Experience Points)
- **Devoir complété**: +10 XP
- **Note**: Note × Coefficient = XP
  - Exemple: 15/20 × 2 = +30 XP

### Temps d'Écran
- **Devoir complété**: +5 minutes
- **Sanction observation**: -5 minutes
- **Heure de colle**: -30 minutes
- **Exclusion**: -60 minutes
- **Absence injustifiée**: -10 minutes

### Ligues
```
Platinum  (Top 10)    🏆
Gold      (11-20)     🥇
Silver    (21-30)     🥈
Bronze    (30+)       🥉
```

## 🔒 Sécurité

- ✅ **Chiffrement E2E**: Tous les messages sont chiffrés de bout en bout
- ✅ **Modération IA**: Détection du harcèlement et insultes
- ✅ **Sauvegarde locale**: Données sur localStorage (démo)
- ✅ **Pas de serveur**: Application 100% client-side

## 💾 Données

Les données sont sauvegardées dans `localStorage`:
```javascript
localStorage.getItem('duodirecte_state')
```

Pour réinitialiser:
```javascript
localStorage.removeItem('duodirecte_state')
```

## 🎨 Thèmes Disponibles

1. **Duolingo** - Vert vibrant (défaut)
2. **Pronote** - Bleu professionnel
3. **École Directe** - Bleu foncé
4. **Cyberpunk** - Rose électrique et cyan
5. **Pastel** - Couleurs douces

## 📱 Responsive Design

- ✅ Desktop (1280px+)
- ✅ Tablet (768px - 1279px)
- ✅ Mobile (< 768px)

## 🚀 Améliorations Futures

- [ ] Intégration API réelle (Pronote/École Directe)
- [ ] Synchronisation cloud
- [ ] Système d'achievements avancé
- [ ] Vidéos tutorielles style Duolingo
- [ ] Chat vocal
- [ ] Statistiques avancées
- [ ] Export des données
- [ ] Mode hors ligne

## 🤝 Contribution

Pour contribuer:
1. Forkez le repo
2. Créez une branche (`git checkout -b feature/amazing`)
3. Commitez (`git commit -am 'Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Ouvrez une Pull Request

## 📄 Licence

MIT License - Utilisez librement!

## 👨‍💻 Développé par

**DuDirecte Team** - Transformons l'éducation ensemble! 🚀

---

**Besoin d'aide?** Consultez les commentaires dans le code ou reportez un issue!
