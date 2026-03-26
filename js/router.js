/* ========================
   ROUTER - SYSTÈME DE ROUTAGE SPA
   ======================== */

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.listeners = [];

        // Écouter les changements d'URL
        window.addEventListener('popstate', () => {
            this.navigateTo(window.location.pathname);
        });

        // Intercepter les clics sur les liens
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-link]');
            if (link) {
                e.preventDefault();
                this.navigateTo(link.pathname || link.getAttribute('href'));
            }
        });
    }

    registerRoute(path, component) {
        this.routes.set(path, component);
    }

    registerRoutes(routesMap) {
        Object.entries(routesMap).forEach(([path, component]) => {
            this.registerRoute(path, component);
        });
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener(this.currentRoute));
    }

    navigateTo(path) {
        const route = this.routes.get(path);
        
        if (!route) {
            console.warn(`Route non trouvée: ${path}`);
            this.navigateTo('/');
            return;
        }

        this.currentRoute = {
            path,
            component: route
        };

        // Mettre à jour l'URL
        window.history.pushState({}, '', path);

        // Rendre le composant
        this.render();
        this.notifyListeners();
    }

    render() {
        const root = document.getElementById('root');
        if (!root || !this.currentRoute) return;

        const component = this.currentRoute.component;
        
        try {
            if (typeof component === 'function') {
                root.innerHTML = component();
            } else {
                root.innerHTML = component;
            }
        } catch (error) {
            console.error('Erreur lors du rendu:', error);
            root.innerHTML = '<div class="container"><h1>Erreur d\'affichage</h1></div>';
        }
    }

    start() {
        const path = window.location.pathname || '/';
        this.navigateTo(path);
    }

    link(path) {
        return `data-link href="${path}"`;
    }
}

// Instance globale
const router = new Router();
