# Projet Microservices E-commerce

Ce projet est une application e-commerce moderne construite sur une architecture microservices. Elle démontre l'utilisation de conteneurs Docker pour orchestrer plusieurs services indépendants, chacun ayant sa propre responsabilité et sa propre base de données.

## 🏗 Architecture

Le système est composé des services suivants :

*   **Frontend (`frontend-app`)** : Application Vue.js 3 (Vite) servant d'interface utilisateur. Accessible sur le port `8080`.
*   **API Gateway (`api-gateway`)** : Point d'entrée unique pour le frontend. Il route les requêtes vers les microservices appropriés. Accessible sur le port `3000`.
*   **Service Utilisateurs (`user-service`)** : Gère l'authentification et les profils utilisateurs. Utilise une base de données **PostgreSQL**.
*   **Service Produits (`product-service`)** : Gère le catalogue de produits. Utilise une base de données **MongoDB**.
*   **Service Avis (`review-service`)** : Gère les commentaires et notes des produits. Utilise une base de données **MongoDB**.

## 🚀 Technologies

*   **Frontend** : Vue.js 3, Vite, Vue Router, Axios.
*   **Backend** : Node.js, Express.
*   **Bases de données** : PostgreSQL, MongoDB.
*   **DevOps** : Docker, Docker Compose.

## 🛠 Prérequis

*   [Docker Desktop](https://www.docker.com/products/docker-desktop) installé et lancé.
*   [Git](https://git-scm.com/) pour le versionning.

## 📦 Installation et Démarrage

1.  **Cloner le dépôt** :
    ```bash
    git clone https://github.com/VOTRE_UTILISATEUR/microservices-projet.git
    cd microservices-projet
    ```

2.  **Lancer l'application avec Docker Compose** :
    À la racine du projet (là où se trouve le fichier `docker-compose.yml`), exécutez :
    ```bash
    docker-compose up --build
    ```
    *L'option `--build` assure que les images sont reconstruites si vous avez fait des modifications.*

3.  **Accéder à l'application** :
    Ouvrez votre navigateur et allez sur : [http://localhost:8080](http://localhost:8080)

## 🔧 Structure du Projet

```
microservices-projet/
├── api-gateway/       # Code du point d'entrée API
├── frontend/          # Code de l'application Vue.js
├── product-service/   # Microservice de gestion des produits
├── review-service/    # Microservice de gestion des avis
├── user-service/      # Microservice de gestion des utilisateurs
└── docker-compose.yml # Configuration de l'orchestration Docker
```
