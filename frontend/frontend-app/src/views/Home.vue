<template>
  <div class="home">
    <div class="hero-section">
      <h1 class="hero-title">Bienvenue sur E-Shop</h1>
      <p class="hero-subtitle">Découvrez notre collection exclusive de produits tech</p>
      <router-link to="/products" class="cta-button">Voir les produits</router-link>
    </div>
    
    <div class="features">
      <div class="feature-card">
        <h3>🚀 Livraison Rapide</h3>
        <p>Livraison express sous 24h</p>
      </div>
      <div class="feature-card">
        <h3>💳 Paiement Sécurisé</h3>
        <p>Transactions 100% sécurisées</p>
      </div>
      <div class="feature-card">
        <h3>🔒 Données Protégées</h3>
        <p>Vos données en toute sécurité</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
};
</script>

<style scoped>
.home {
  text-align: center;
}

.hero-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 4rem 2rem;
  border-radius: 20px;
  margin-bottom: 3rem;
}

.hero-title {
  font-size: 3rem;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-block;
  background: #4A90E2;
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
}

.cta-button:hover {
  background: #357ABD;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h3 {
  color: #333;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #666;
}
</style>