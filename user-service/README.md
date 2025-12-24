# User Service - Gestion Utilisateurs

## Description

Microservice responsable de la gestion des utilisateurs (authentification, inscriptions).

## Base de données

- **PostgreSQL** : Stocke les informations utilisateurs
- **Collection/Table** : `users`
- **Champs** : id, name, email, password, created_at

## Endpoints

- `POST /api/register` : Créer un compte
- `POST /api/login` : Connexion
- `GET /api/users` : Liste des utilisateurs (admin)

## Dépendances

- **PostgreSQL** : user-db:5432
- **API Gateway** : Appelé via le gateway

## Modèle de données

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
