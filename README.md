# 🛒 E-Shop Microservices

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://www.docker.com/)

Une plateforme e-commerce complète démontrant une architecture microservices robuste. Ce projet sépare les responsabilités métiers (Utilisateurs, Produits, Avis) en services autonomes, orchestrés via Docker pour un déploiement et une scalabilité simplifiés.

---

## 🏗 Architecture du Système

Le projet est structuré autour de conteneurs Docker interconnectés :

| Service             | Technologie          | Port   | Description                                                                                 |
| :------------------ | :------------------- | :----- | :------------------------------------------------------------------------------------------ |
| **Frontend**        | Vue.js 3 (Vite)      | `8080` | Interface utilisateur réactive et moderne (SPA).                                            |
| **API Gateway**     | Node.js / Express    | `3000` | Point d'entrée unique. Redirige les requêtes du frontend vers les microservices appropriés. |
| **User Service**    | Node.js / PostgreSQL | `3001` | Gestion de l'authentification (JWT) et des profils utilisateurs.                            |
| **Product Service** | Node.js / MongoDB    | `3003` | Gestion du catalogue produits (CRUD).                                                       |
| **Review Service**  | Node.js / MongoDB    | `3004` | Gestion des commentaires et notes des utilisateurs sur les produits.                        |

### Diagramme de flux simplifié

`Frontend` ➡️ `API Gateway` ➡️ `Microservices (User/Product/Review)` ➡️ `Databases (Postgres/Mongo)`

---

##  Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Docker Desktop** (incluant Docker Compose) : [Télécharger ici](https://www.docker.com/products/docker-desktop)
- **Git** : [Télécharger ici](https://git-scm.com/)

---

## � Installation et Démarrage Rapide

1.  **Cloner le dépôt**

    ```bash
    git clone https://github.com/amani-k1/E-Shop-microservices.git
    cd E-Shop-microservices
    ```

2.  **Lancer l'application**
    Utilisez Docker Compose pour construire les images et démarrer tous les conteneurs en une seule commande :

    ```bash
    docker-compose up --build
    ```

    _La première exécution peut prendre quelques minutes le temps de télécharger les images de base et d'installer les dépendances._

3.  **Accéder à l'application**
    Une fois les logs stabilisés, ouvrez votre navigateur :
    👉 **http://localhost:8080**

---

## � Structure du Projet

```bash
microservices-projet/
├── api-gateway/       # 🌐 Point d'entrée API & Routage
├── frontend/          # 🎨 Application Vue.js (Interface Client)
├── product-service/   # 📦 Gestion des produits (MongoDB)
├── review-service/    # ⭐ Gestion des avis (MongoDB)
├── user-service/      # 👤 Gestion utilisateurs (PostgreSQL)
└── docker-compose.yml # 🐳 Configuration de l'orchestration
```

---

## 🔌 Endpoints API (Via Gateway)

L'API Gateway expose les routes suivantes sur `http://localhost:3000` :

- **Utilisateurs**
  - `POST /auth/register` : Inscription
  - `POST /auth/login` : Connexion
  - `GET /users/profile` : Profil utilisateur
- **Produits**
  - `GET /products` : Liste des produits
  - `GET /products/:id` : Détail d'un produit
- **Avis**
  - `GET /reviews/product/:productId` : Lire les avis d'un produit
  - `POST /reviews` : Ajouter un avis

---

## ✨ Fonctionnalités Clés

- **Architecture découplée** : Chaque service peut être développé, déployé et mis à l'échelle indépendamment.
- **Polyglot Persistence** : Utilisation de la base de données la plus adaptée pour chaque service (SQL pour les utilisateurs relationnels, NoSQL pour les catalogues produits flexibles).
- **Conteneurisation** : Environnement de développement cohérent et reproductible grâce à Docker.

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour proposer des modifications :

1.  Forkez le projet.
2.  Créez une branche (`git checkout -b feature/AmazingFeature`).
3.  Commitez vos changements (`git commit -m 'Add some AmazingFeature'`).
4.  Poussez vers la branche (`git push origin feature/AmazingFeature`).
5.  Ouvrez une Pull Request.

---

## 📝 Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.
