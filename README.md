# 🏗️ Stack Tower

Un jeu de stacking 3D moderne et responsive développé avec Three.js et Cannon.js.

![Stack Tower Game](public/ecranJeu.png)

## 🎮 À propos du jeu

Stack Tower est un jeu d'empilement de blocs en 3D où l'objectif est de construire la tour la plus haute possible. Les blocs se déplacent automatiquement et vous devez cliquer au bon moment pour les empiler avec précision.

### ✨ Fonctionnalités

- **🎯 Gameplay intuitif** : Clic ou touche Espace pour placer les blocs
- **📱 Design responsive** : Optimisé pour mobile, tablette et desktop
- **🎨 Interface moderne** : Écran de chargement animé avec particules
- **🏆 Système de score** : Sauvegarde du meilleur score localement
- **🌈 Couleurs dynamiques** : Les blocs changent de couleur par groupes
- **⚡ Performance optimisée** : Moteur physique réaliste avec Cannon.js

## 🚀 Installation

### Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn

### Étapes d'installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/akam731/stack-game.git
   cd stack-tower
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrir dans le navigateur**
   ```
   http://localhost:5173
   ```

## 🎯 Comment jouer

1. **Démarrage** : Cliquez sur "Jouer" après le chargement
2. **Contrôles** : 
   - **Clic gauche** ou **Espace** : Placer le bloc
   - **Entrée** : Commencer une nouvelle partie
3. **Objectif** : Empilez les blocs le plus haut possible
4. **Score** : Chaque bloc empilé avec succès augmente votre score

### 🎮 Contrôles détaillés

| Action | Contrôle |
|--------|----------|
| Placer un bloc | Clic gauche / Espace |
| Commencer le jeu | Entrée / Espace |
| Rejouer | Clic sur l'écran de fin |

## 🛠️ Technologies utilisées

- **Three.js** - Moteur 3D pour le rendu
- **Cannon.js** - Moteur physique pour les collisions
- **Vite** - Build tool et serveur de développement
- **HTML5/CSS3** - Interface utilisateur
- **JavaScript ES6+** - Logique du jeu

## 📁 Structure du projet

```
stack-tower/
├── index.html          # Page principale
├── main.js            # Logique du jeu
├── style.css          # Styles CSS
├── package.json       # Configuration npm
├── public/
│   └── vite.svg      # Icône Vite
└── README.md         # Documentation
```

## 🎨 Personnalisation

### Modifier les couleurs des blocs

Dans `main.js`, modifiez le tableau `groupColors` :

```javascript
const groupColors = [
    [223, 229, 238], // Gris bleuté clair
    [255, 182, 193], // Rose clair
    [144, 238, 144], // Vert clair
    // Ajoutez vos couleurs ici
]
```

### Ajuster la difficulté

Modifiez la vitesse des blocs dans la fonction `animate` :

```javascript
const speed = 0.008 // Réduisez pour ralentir, augmentez pour accélérer
```

### Personnaliser les tailles d'écran

Dans la fonction `getBoxSize()` :

```javascript
function getBoxSize() {
    if (window.innerWidth < 480) {
        return 2.5 // Mobile
    } else if (window.innerWidth < 768) {
        return 2   // Tablette
    }
    return 1.5     // Desktop
}
```

## 🚀 Déploiement

### Build de production

```bash
npm run build
```

### Prévisualisation du build

```bash
npm run preview
```

### Déploiement sur Vercel

1. Installez Vercel CLI : `npm i -g vercel`
2. Déployez : `vercel`
3. Suivez les instructions

### Déploiement sur Netlify

1. Build le projet : `npm run build`
2. Uploadez le dossier `dist/` sur Netlify
3. Configurez les redirections SPA si nécessaire

## 👨‍💻 Auteur

**MARTEAU Alexandre**
- GitHub: [@akam731](https://github.com/akam731)
- Email: alexandre.marteau63@example.com

---

⭐ **N'oubliez pas de mettre une étoile si ce projet vous a plu !**

## 🎮 Screenshots

### Interface de jeu
![Game Interface](public/ecranJeu.png)

### Écran de fin
![Game Over](public/ecranFin.png)

---

*Développé avec ❤️ en JavaScript*
