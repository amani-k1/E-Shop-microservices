# frontend-app

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

# Frontend - E-commerce Vue.js

## Description

Interface utilisateur développée avec Vue.js pour l'application e-commerce.

## Interactions

- **API Gateway** : Toutes les requêtes HTTP passent par l'API Gateway (port 3000)
- **Routes principales** :
  - `/` : Page d'accueil
  - `/products` : Liste des produits
  - `/product/:id` : Détail produit
  - `/cart` : Panier
  - `/login` : Connexion
  - `/register` : Inscription

## Dépendances

- **API Gateway** : http://api-gateway:3000
- **Variables d'environnement** : Voir `.env.example`

## Démarrage local

```bash
npm install
npm run dev
```

npm run build
