### **4.4 Product Service README.md**

**Chemin :** `product-service/README.md`

````markdown
# Product Service - Catalogue Produits

## Description

Microservice gérant le catalogue des produits (CRUD, stock, prix).

## Base de données

- **MongoDB** : Stocke les produits
- **Collection** : `products`
- **Schéma** : name, description, price, category, image, stock

## Endpoints

- `GET /api/products` : Liste tous les produits
- `GET /api/products/:id` : Détail d'un produit
- `GET /api/test` : Test de connexion

## Dépendances

- **MongoDB** : product-db:27017
- **API Gateway** : Appelé via le gateway

## Exemple de document

```json
{
  "_id": "ObjectId",
  "name": "Smartphone XYZ",
  "description": "Description du produit",
  "price": 699.99,
  "category": "Smartphones",
  "image": "url_image.jpg",
  "stock": 50
}
```
````
