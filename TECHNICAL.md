# 🔧 Documentation Technique - DuDirecte

## Architecture

DuDirecte est une Single Page Application (SPA) vanilla JavaScript avec une architecture claire :

```
┌─────────────────────────────────────────┐
│         index.html (DOM)                │
└──────────────┬──────────────────────────┘
               │
      ┌────────┴────────┐
      ▼                 ▼
  ┌────────┐      ┌──────────┐
  │ Router │      │  Store   │
  └────────┘      └──────────┘
      │                │
      ├────────┬───────┤
      ▼        ▼       ▼
   Pages   Modules  State
```

## Flux de Données

```
User Interaction
     ↓
Event Listener
     ↓
Action (auth.login, store.addAssignment, etc.)
     ↓
State Updated (store.notify())
     ↓
Router Re-renders Page
     ↓
DOM Updated
```

## Modules

### 1. **store.js** - État Global
```javascript
class Store {
  state = { user, assignments, grades, ... }
  saveToStorage()     // localStorage
  subscribe(listener) // Observers
  addXP(amount)       // Logique gamification
  ...
}
```

### 2. **router.js** - Navigation SPA
```javascript
router.registerRoutes({
  '/': LoginPage,
  '/dashboard': DashboardPage,
  ...
})
router.navigateTo(path)  // Navigue sans reload
```

### 3. **auth.js** - Authentification
```javascript
auth.loginPronote(email, password)   // Simule Pronote API
auth.loginEcolDirecte(email, password)
auth.syncProNoteData(user)           // Données simulées
```

### 4. **gamification.js** - Logique de Jeu
```javascript
gamification.generateLeaderboard()    // Top 30
gamification.getXPProgression()      // Level progression
gamification.checkAchievements()     // Badges
gamification.getLeagueStats()        // Info ligue
```

### 5. **notifications.js** - UI Feedback
```javascript
notificationManager.show(title, message, type)
notificationManager.showConfirmation(title, message, onConfirm)
notificationManager.showInput(title, placeholder, onSubmit)
notificationManager.scheduleDaily(title, message, time)
```

### 6. **ui.js** - Utilitaires
```javascript
UIUtils.formatDate(isoString)        // Français
UIUtils.createAvatar(letter)         // HTML avatar
UIUtils.createXPBar(current, needed) // Progress bar
UIUtils.getAssignmentStatus(assign)  // Status badge
```

### 7. **app.js** - Pages
```javascript
LoginPage()      // /
DashboardPage()  // /dashboard
LessonsPage()    // /leçons
// ... 8 pages totales
```

### 8. **main.js** - Initialisation
```javascript
router.start()                // Démarre l'app
addEventListener('click', ...) // Délégation
checkDailyAssignments()       // Vérifies devoirs
```

## Système de Données

### Structure State
```javascript
{
  user: {
    id: string,
    name: string,
    email: string,
    avatar: string,
    provider: 'Pronote' | 'EcoleDirect'
  },
  userStats: {
    xp: number,
    level: number,
    streak: number,
    screenTime: number,  // minutes
    league: 'BRONZE' | 'ARGENT' | 'OR' | 'PLATINE',
    leagueRank: number
  },
  assignments: Assignment[],
  grades: Grade[],
  absences: Absence[],
  sanctions: Sanction[],
  messages: Message[],
  theme: string,
  notifications: Notification[],
  settings: UserSettings
}
```

## Calculs Importants

### XP Gagné
```javascript
// Devoir complété
xpGained = 10

// Note
xpGained = score × coefficient
// Ex: 15/20 × 2 = 30 XP

// Total par niveau
xpNeeded = level × 1000
// Level 1: 1000 XP
// Level 2: 2000 XP
// ...
```

### Temps d'Écran
```javascript
// Gagnés
+5 min   par devoir complété
+5 min   à chaque note (simulation)

// Perdus
-10 min  absence injustifiée
-5 min   observation
-30 min  heure de colle
-60 min  exclusion
```

### Ligues (30 joueurs)
```javascript
#1-10    → Platinum (promotion)
#11-20   → Gold
#21-30   → Silver
#31+     → Bronze (rétrogradation)

// Changements chaque simulation
```

## Intégration API (Futur)

Pour intégrer des APIs réelles:

### Pronote API
```javascript
// À faire dans auth.js
async loginPronote(email, password) {
  const response = await fetch('https://api.pronote.fr/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
  const userData = await response.json()
  return userData
}

async syncProNoteData(user) {
  const grades = await fetch(`https://api.pronote.fr/grades/${user.id}`)
  const assignments = await fetch(`https://api.pronote.fr/devoirs/${user.id}`)
  // ...
}
```

### Base de Données
```javascript
// Remplacer localStorage par une DB
// Option 1: Firebase
const db = firebase.firestore()
db.collection('users').doc(user.id).set(store.state)

// Option 2: Custom API
await fetch('/api/save-state', {
  method: 'POST',
  body: JSON.stringify(store.state)
})
```

## Pipeline de Déploiement

1. **Local Testing**
   ```bash
   # Ouvrir index.html dans le navigateur
   python -m http.server 8000
   ```

2. **Build**
   ```bash
   # Minifier le JavaScript (optionnel)
   npx terser js/*.js -o dist/app.min.js
   ```

3. **Deploy**
   ```bash
   # GitHub Pages
   git push origin main
   # URL: https://username.github.io/DuDirecte

   # Netlify
   netlify deploy --prod --dir=.

   # Vercel
   vercel --prod
   ```

## Performance

- ⚡ Charging: < 100ms (pas de serveur)
- 🎯 Rendering: < 16ms per frame
- 💾 Storage: ~500KB en localStorage
- 📊 Bundle: ~150KB (non-minifié)

## Tests

### Cas de Test
```javascript
// Test connexion
test('Login avec credentials valides', () => {
  const result = auth.loginPronote('test@ecole.fr', 'password123')
  assert(result.success === true)
})

// Test XP
test('Completer un devoir ajoute 10 XP', () => {
  const initialXP = store.state.userStats.xp
  store.completeAssignment(1)
  assert(store.state.userStats.xp === initialXP + 10)
})

// Test streak
test('Streak augmente avec devoir complété', () => {
  const initialStreak = store.state.userStats.streak
  store.completeAssignment(1)
  assert(store.state.userStats.streak === initialStreak + 1)
})
```

## Variables CSS (Personnalisation)

```css
--primary: #6366f1;           /* Couleur principale */
--success: #10b981;           /* Succès */
--danger: #ef4444;            /* Danger */
--spacing-lg: 1.5rem;         /* Espacement */
--font-size-lg: 1.125rem;     /* Typographie */
--transition-base: 200ms;    /* Durée animations */
```

Changez ces variables dans `css/main.css` pour customiser l'apparence.

## Debug

### Console Logs
```javascript
// Voir l'état
console.log(store.state)

// Tester une action
store.addXP(50)
console.log(store.state.userStats.xp)

// Voir les listeners
console.log(store.listeners.length)

// Test localStorage
localStorage.getItem('duodirecte_state')
```

### Erreurs Courantes

1. **"Router undefined"**
   → Vérifiez que router.js est chargé avant app.js

2. **"Store is not defined"**
   → Vérifiez que store.js est le premier script

3. **"localStorage full"**
   → Videz le cache: `localStorage.clear()`

## Roadmap Développement

- [x] MVP (Page login, dashboard, leçons)
- [x] Gamification basique (XP, levels, streaks)
- [x] UI/UX (Thèmes, responsive)
- [ ] API réelle (Pronote/École Directe)
- [ ] Base de données (Firebase/PostgreSQL)
- [ ] Authentification OAuth
- [ ] Chat augmenté (WebSocket, encryption E2E)
- [ ] Analytics (Comportement utilisateur)
- [ ] Mobile App (React Native)
- [ ] PWA (Offline support)

---

**Code avec passion! 💻🚀**
