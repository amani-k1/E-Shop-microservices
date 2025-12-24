const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Configuration MongoDB
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

// Connexion à MongoDB
const connectDB = async () => {
  try {
    await client.connect();
    
    // Essayer différentes bases de données
    const possibleDbs = ['productdb', 'MONOOSH', 'ecommerce'];
    let connected = false;
    
    for (const dbName of possibleDbs) {
      try {
        const testDb = client.db(dbName);
        const collections = await testDb.listCollections().toArray();
        console.log(`🔍 Vérification de la base: ${dbName}`);
        console.log(`   Collections: ${collections.map(c => c.name).join(', ')}`);
        
        // Vérifier si la collection products existe
        const productsCollection = collections.find(col => col.name === 'products');
        if (productsCollection) {
          db = testDb;
          const products = await db.collection('products').find().toArray();
          console.log(`✅ Connecté à ${dbName} - ${products.length} produits trouvés`);
          
          // Afficher les IDs pour debug
          products.forEach(product => {
            console.log(`   - ${product.name} (ID: ${product._id})`);
          });
          
          connected = true;
          break;
        }
      } catch (error) {
        console.log(`   ❌ ${dbName}: ${error.message}`);
      }
    }
    
    if (!connected) {
      console.log('❌ Aucune base avec des produits trouvée, utilisation de productdb par défaut');
      db = client.db('productdb');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur connexion MongoDB:', error);
    return false;
  }
};

// Routes CORRIGÉES
// Obtenir tous les produits
app.get('/api/products', async (req, res) => {
  try {
    console.log('📦 Récupération de tous les produits...');
    const products = await db.collection('products').find().toArray();
    
    console.log(`✅ ${products.length} produits récupérés`);
    
    // Formater la réponse
    const formattedProducts = products.map(product => ({
      id: product._id ? product._id.toString() : `temp-${Date.now()}`,
      name: product.name || 'Produit sans nom',
      description: product.description || 'Description non disponible',
      price: product.price || 0,
      category: product.category || 'Non catégorisé',
      image: product.image || `https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=${encodeURIComponent(product.name || 'Produit')}`,
      stock: product.stockQuantity || product.stock || 0,
      // Garder l'ID original pour debug
      _id: product._id ? product._id.toString() : null
    }));
    
    res.json(formattedProducts);
  } catch (error) {
    console.error('❌ Erreur récupération produits:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
  }
});

// Obtenir un produit par ID - VERSION CORRIGÉE
app.get('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(`🔍 Recherche du produit avec ID: ${productId}`);
    
    let product;
    
    // Essayer avec ObjectId d'abord (pour les vrais IDs MongoDB)
    if (productId.length === 24) { // ObjectId MongoDB fait 24 caractères hexa
      try {
        product = await db.collection('products').findOne({ 
          _id: new ObjectId(productId) 
        });
        console.log(`✅ Recherche avec ObjectId: ${product ? 'trouvé' : 'non trouvé'}`);
      } catch (objectIdError) {
        console.log('❌ ObjectId invalide, recherche par ID string');
      }
    }
    
    // Si pas trouvé avec ObjectId, essayer avec id string
    if (!product) {
      product = await db.collection('products').findOne({ 
        id: productId 
      });
      console.log(`✅ Recherche par ID string: ${product ? 'trouvé' : 'non trouvé'}`);
    }
    
    // Si toujours pas trouvé, essayer avec _id comme string
    if (!product) {
      product = await db.collection('products').findOne({ 
        _id: productId 
      });
      console.log(`✅ Recherche par _id string: ${product ? 'trouvé' : 'non trouvé'}`);
    }
    
    if (!product) {
      console.log('❌ Produit non trouvé avec aucun des méthodes');
      
      // Lister tous les produits pour debug
      const allProducts = await db.collection('products').find().toArray();
      console.log('📋 Produits disponibles:');
      allProducts.forEach(p => {
        console.log(`   - ${p.name} (_id: ${p._id}, id: ${p.id})`);
      });
      
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    console.log(`✅ Produit trouvé: ${product.name}`);
    
    // Formater la réponse
    const formattedProduct = {
      id: product._id ? product._id.toString() : product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image || `https://via.placeholder.com/600x600/4A90E2/FFFFFF?text=${encodeURIComponent(product.name)}`,
      stock: product.stockQuantity || product.stock || 0,
      originalPrice: product.originalPrice,
      features: product.features
    };
    
    res.json(formattedProduct);
  } catch (error) {
    console.error('❌ Erreur récupération produit:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
  }
});

// Route test améliorée
app.get('/api/test', async (req, res) => {
  try {
    const products = await db.collection('products').find().toArray();
    
    res.json({ 
      message: 'Product Service fonctionne!',
      database: db.databaseName,
      products_count: products.length,
      port: 3003,
      status: 'OK',
      products_sample: products.slice(0, 3).map(p => ({
        name: p.name,
        _id: p._id,
        id: p.id
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur test MongoDB' });
  }
});

// Démarrer le serveur
const PORT = 3003;
app.listen(PORT, async () => {
  console.log(`🚀 Product Service démarré sur le port ${PORT}`);
  await connectDB();
});
