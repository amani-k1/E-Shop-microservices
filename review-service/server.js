const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

const connectDB = async () => {
  try {
    await client.connect();
    db = client.db('productdb');
    console.log('✅ Review Service connecté à MongoDB!');
    
    await db.collection('reviews').createIndex({ productId: 1 });
    await db.collection('reviews').createIndex({ userId: 1 });
    
  } catch (error) {
    console.error('❌ Erreur connexion MongoDB:', error);
  }
};

// Route simple pour créer un avis
app.post('/api/products/:productId/reviews', async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId, userName, rating } = req.body;
    
    if (!userId || !rating) {
      return res.status(400).json({ error: 'User ID et rating requis' });
    }
    
    // Vérifier si déjà reviewé
    const existingReview = await db.collection('reviews').findOne({
      productId,
      userId
    });
    
    if (existingReview) {
      return res.status(400).json({ error: 'Vous avez déjà donné votre avis' });
    }
    
    const newReview = {
      productId,
      userId,
      userName: userName || 'Utilisateur',
      rating: parseInt(rating),
      comment: `Avis avec note ${rating}/5`,
      createdAt: new Date(),
      verified: true
    };
    
    const result = await db.collection('reviews').insertOne(newReview);
    
    res.status(201).json({
      message: 'Avis enregistré!',
      review: {
        _id: result.insertedId,
        ...newReview
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur création avis:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour vérifier si l'user a déjà reviewé
app.get('/api/products/:productId/reviews/user/:userId', async (req, res) => {
  try {
    const { productId, userId } = req.params;
    
    const existingReview = await db.collection('reviews').findOne({
      productId,
      userId
    });
    
    res.json({ hasReviewed: !!existingReview });
    
  } catch (error) {
    console.error('❌ Erreur vérification:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

const PORT = 3004;
app.listen(PORT, async () => {
  console.log(`🚀 Review Service sur le port ${PORT}`);
  await connectDB();
});
