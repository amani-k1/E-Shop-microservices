const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// ⚠️ REMPLACEZ PAR VOTRE VRAI MOT DE PASSE POSTGRESQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'userdb',
  password: 'system', // 🔑 IMPORTANT
  port: 5432,
});

// Test connexion
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL connecté à userdb!');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Erreur PostgreSQL:', error.message);
    return false;
  }
};

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Vérifier si l'utilisateur existe
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Utilisateur existe déjà' });
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Créer l'utilisateur
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );
    
    // Token JWT
    const token = jwt.sign(
      { userId: result.rows[0].id, email: result.rows[0].email },
      'votre-secret-key',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        name: result.rows[0].name
      },
      token
    });
  } catch (error) {
    console.error('❌ Erreur inscription:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Identifiants invalides' });
    }
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(400).json({ error: 'Identifiants invalides' });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'votre-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    });
  } catch (error) {
    console.error('❌ Erreur connexion:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/test', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({ 
    message: 'User Service fonctionne!',
    database: dbConnected ? 'Connecté' : 'Non connecté'
  });
});

const PORT = 3001;
app.listen(PORT, async () => {
  console.log(`🚀 User Service sur le port ${PORT}`);
  await testConnection();
});