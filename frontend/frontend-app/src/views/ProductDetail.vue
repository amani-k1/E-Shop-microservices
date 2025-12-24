<template>
  <div class="product-detail-page">
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Chargement du produit...</p>
    </div>
    
    <div v-else-if="product" class="product-detail">
      <nav class="breadcrumb">
        <router-link to="/products" class="breadcrumb-link">Produits</router-link>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">{{ product.name }}</span>
      </nav>
      
      <button @click="$router.back()" class="back-btn">← Retour aux produits</button>
      
      <div class="product-layout">
        <!-- Colonne Image -->
        <div class="product-gallery">
          <div class="main-image">
            <img :src="product.image" :alt="product.name" @error="setDefaultImage">
          </div>
          <div v-if="product.images && product.images.length > 0" class="image-thumbnails">
            <img 
              v-for="(thumb, index) in product.images" 
              :key="index"
              :src="thumb" 
              :alt="product.name"
              class="thumbnail"
              @click="product.image = thumb"
            >
          </div>
        </div>
        
        <!-- Colonne Informations -->
        <div class="product-info-detail">
          <div class="product-header">
            <h1 class="product-title">{{ product.name }}</h1>
            <div class="product-rating">
              <span class="stars">★★★★★</span>
              <span class="rating-text">(4.5/5)</span>
            </div>
          </div>
          
          <div class="product-price-detail">
            {{ formatPrice(product.price) }} €
            <span v-if="product.originalPrice" class="original-price">
              {{ formatPrice(product.originalPrice) }} €
            </span>
          </div>
          
          <div class="product-meta">
            <div class="meta-item">
              <span class="meta-label">Catégorie:</span>
              <span class="meta-value">{{ product.category }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Référence:</span>
              <span class="meta-value">#{{ product.id.slice(-8).toUpperCase() }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Stock:</span>
              <span class="meta-value" :class="getStockClass(product.stock)">
                {{ product.stock }} unités disponibles
              </span>
            </div>
          </div>
          
          <div class="product-description-section">
            <h3>Description</h3>
            <p class="product-description-detail">
              {{ product.description }}
            </p>
          </div>
          
          <div class="product-features" v-if="product.features">
            <h3>Caractéristiques</h3>
            <ul class="features-list">
              <li v-for="(feature, index) in product.features" :key="index">
                {{ feature }}
              </li>
            </ul>
          </div>
          
          <div class="product-actions">
            <div class="quantity-selector">
              <label for="quantity">Quantité:</label>
              <select id="quantity" v-model="quantity" class="quantity-select">
                <option v-for="n in Math.min(product.stock, 10)" :key="n" :value="n">
                  {{ n }}
                </option>
              </select>
            </div>
            
            <button 
              class="add-to-cart-large" 
              :disabled="product.stock === 0"
              @click="addToCart"
            >
              <span v-if="product.stock === 0">❌ Produit en rupture</span>
              <span v-else>🛒 Ajouter au panier - {{ formatPrice(product.price * quantity) }} €</span>
            </button>
            
            <button class="buy-now-btn" :disabled="product.stock === 0">
              Acheter maintenant
            </button>
          </div>

          <!-- Bouton simple pour donner son avis -->
          <div class="simple-review-section">
            <button 
              v-if="user && !userHasReviewed" 
              @click="showReviewForm = true" 
              class="simple-review-btn"
            >
              ⭐ Donner votre avis
            </button>
            <div v-else-if="user && userHasReviewed" class="already-reviewed">
              ✅ Vous avez déjà donné votre avis
            </div>
            <div v-else class="login-prompt">
              <router-link to="/login">🔐 Connectez-vous pour donner votre avis</router-link>
            </div>
          </div>
          
          <div class="product-guarantees">
            <div class="guarantee-item">
              <span class="guarantee-icon">🚚</span>
              <span>Livraison gratuite</span>
            </div>
            <div class="guarantee-item">
              <span class="guarantee-icon">↩️</span>
              <span>Retour sous 30 jours</span>
            </div>
            <div class="guarantee-item">
              <span class="guarantee-icon">🔒</span>
              <span>Paiement sécurisé</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Popup simple pour l'avis -->
      <div v-if="showReviewForm" class="review-popup-overlay">
        <div class="review-popup">
          <h3>Donner votre avis</h3>
          
          <div class="rating-stars">
            <span 
              v-for="star in 5" 
              :key="star"
              class="star"
              :class="{ active: star <= newReview.rating }"
              @click="newReview.rating = star"
            >
              ★
            </span>
          </div>
          
          <p class="rating-text">Note: {{ newReview.rating }}/5</p>
          
          <div class="popup-actions">
            <button @click="showReviewForm = false" class="cancel-btn">Annuler</button>
            <button 
              @click="submitSimpleReview" 
              :disabled="newReview.rating === 0"
              class="submit-btn"
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="not-found">
      <div class="not-found-icon">😕</div>
      <h2>Produit non trouvé</h2>
      <p>Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
      <router-link to="/products" class="back-to-products">
        ← Retour à la boutique
      </router-link>
    </div>
  </div>
</template>

<script>
import { productService } from '../services/api';
import { reviewService } from '../services/api';

export default {
  name: 'ProductDetail',
  props: ['cartItems', 'user'],
  data() {
    return {
      product: null,
      loading: true,
      error: '',
      quantity: 1,
      // Données simplifiées pour les reviews
      showReviewForm: false,
      userHasReviewed: false,
      newReview: {
        rating: 0
      }
    };
  },
  methods: {
    async loadProduct() {
    try {
      const productId = this.$route.params.id;
      console.log('🔄 Chargement du produit ID:', productId);
      
      // Essayer de récupérer d'abord tous les produits
      const allProducts = await productService.getProducts();
      console.log('📦 Tous les produits:', allProducts);
      
      // Chercher le produit dans la liste
      this.product = allProducts.find(p => p.id === productId);
      
      if (!this.product) {
        // Si pas trouvé, essayer avec l'API directe
        try {
          this.product = await productService.getProduct(productId);
        } catch (apiError) {
          console.error('API error:', apiError);
          this.error = 'Produit non trouvé';
        }
      }
      
      if (this.product) {
        console.log('✅ Produit trouvé:', this.product);
        // Ajouter des caractéristiques simulées
        if (!this.product.features) {
          this.product.features = this.generateFeatures();
        }

        // Vérifier si l'utilisateur a déjà reviewé ce produit
        if (this.user) {
          await this.checkUserReview();
        }
      } else {
        this.error = 'Produit non trouvé';
      }
      
    } catch (error) {
      console.error('❌ Erreur chargement produit:', error);
      this.error = 'Erreur lors du chargement du produit';
    } finally {
      this.loading = false;
    }
  },

    async checkUserReview() {
      if (!this.user) return;
      
      try {
        const productId = this.$route.params.id;
        const result = await reviewService.checkUserReview(productId, this.user.id);
        this.userHasReviewed = result.hasReviewed;
      } catch (error) {
        console.error('Erreur vérification review:', error);
        this.userHasReviewed = false;
      }
    },

    async submitSimpleReview() {
      if (!this.user) {
        alert('Veuillez vous connecter');
        return;
      }

      if (this.newReview.rating === 0) {
        alert('Veuillez sélectionner une note');
        return;
      }

      try {
        const productId = this.$route.params.id;
        
        await reviewService.createReview(productId, {
          rating: this.newReview.rating,
          comment: `Avis avec note ${this.newReview.rating}/5`,
          userId: this.user.id,
          userName: this.user.name
        });

        // Réinitialiser et fermer
        this.showReviewForm = false;
        this.newReview.rating = 0;
        this.userHasReviewed = true;
        
        alert(`✅ Merci ! Votre note de ${this.newReview.rating}/5 a été enregistrée.`);
        
      } catch (error) {
        console.error('Erreur publication avis:', error);
        const message = error.response?.data?.error || 'Erreur lors de l\'envoi';
        alert(`❌ ${message}`);
      }
    },
    
    generateFeatures() {
      const features = {
        'Smartphones': [
          'Écran 6.1 pouces Super Retina XDR',
          'Chip A15 Bionic',
          'Système photo avancé 12MP',
          'Résistance à l\'eau IP68',
          'Batterie toute la journée'
        ],
        'Informatique': [
          'Processeur Intel Core i7 11e gén',
          '16Go RAM DDR4',
          'SSD 512Go NVMe',
          'Carte graphique RTX 3060',
          'Écran 15.6" 144Hz'
        ],
        'Audio': [
          'Réduction de bruit active',
          'Autonomie 24h',
          'Charge rapide 15min = 3h',
          'Contrôle tactile',
          'Compatibilité spatial audio'
        ],
        'Téléphonie': [
          'Écran 6.7 pouces Dynamic AMOLED',
          'Processeur Snapdragon 8 Gen 2',
          'Appareil photo 200MP',
          'Batterie 5000mAh',
          'Charge rapide 45W'
        ]
      };
      
      return features[this.product?.category] || [
        'Haute qualité',
        'Garantie 2 ans',
        'Livraison incluse',
        'Support client 24/7'
      ];
    },
    
    formatPrice(price) {
      const numPrice = Number(price);
      return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
    },
    
    getStockClass(stock) {
      if (stock === 0) return 'out-of-stock';
      if (stock < 5) return 'low-stock';
      return 'in-stock';
    },
    
    setDefaultImage(event) {
      event.target.src = `https://via.placeholder.com/600x600/4A90E2/FFFFFF?text=${encodeURIComponent(this.product?.name || 'Produit')}`;
    },
    
    addToCart() {
      if (this.product && this.product.stock > 0) {
        // Ajouter la quantité sélectionnée
        for (let i = 0; i < this.quantity; i++) {
          this.$emit('add-to-cart', this.product);
        }
        
        alert(`${this.quantity} x ${this.product.name} ajouté(s) au panier !`);
      }
    }
  },
  async mounted() {
    await this.loadProduct();
  },
  
  // Réagir aux changements de route
  watch: {
    '$route.params.id': {
      handler: function(newId) {
        if (newId) {
          this.loading = true;
          this.loadProduct();
        }
      },
      immediate: true
    },
    'user': {
      handler: function(newUser) {
        if (newUser && this.product) {
          this.checkUserReview();
        }
      }
    }
  }
};
</script>

<style scoped>
.product-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 80vh;
}

/* Loading */
.loading {
  text-align: center;
  color: white;
  padding: 4rem 2rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: white;
}

.breadcrumb-link {
  color: white;
  text-decoration: none;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  opacity: 0.7;
}

.breadcrumb-current {
  opacity: 0.9;
  font-weight: 500;
}

.back-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  font-weight: 500;
}

.back-btn:hover {
  background: white;
  transform: translateX(-5px);
}

/* Layout Principal */
.product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

/* Galerie */
.product-gallery {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image {
  width: 100%;
  border-radius: 15px;
  overflow: hidden;
  background: #f8f9fa;
}

.main-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.main-image:hover img {
  transform: scale(1.02);
}

.image-thumbnails {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.thumbnail:hover {
  border-color: #4A90E2;
  transform: scale(1.1);
}

/* Informations Produit */
.product-info-detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-header {
  border-bottom: 2px solid #f1f3f4;
  padding-bottom: 1rem;
}

.product-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  color: #ffc107;
  font-size: 1.2rem;
}

.rating-text {
  color: #666;
  font-size: 0.9rem;
}

.product-price-detail {
  font-size: 2.5rem;
  font-weight: 700;
  color: #4A90E2;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.original-price {
  font-size: 1.5rem;
  color: #999;
  text-decoration: line-through;
}

.product-meta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-label {
  font-weight: 600;
  color: #333;
}

.meta-value {
  color: #666;
}

.meta-value.in-stock {
  color: #2ed573;
  font-weight: 600;
}

.meta-value.low-stock {
  color: #ffa502;
  font-weight: 600;
}

.meta-value.out-of-stock {
  color: #ff4757;
  font-weight: 600;
}

.product-description-section h3,
.product-features h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  font-weight: 600;
}

.product-description-detail {
  color: #666;
  line-height: 1.7;
  font-size: 1.1rem;
}

.features-list {
  list-style: none;
  padding: 0;
}

.features-list li {
  padding: 0.5rem 0;
  color: #666;
  position: relative;
  padding-left: 1.5rem;
}

.features-list li:before {
  content: '✓';
  color: #2ed573;
  font-weight: bold;
  position: absolute;
  left: 0;
}

/* Actions */
.product-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 15px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quantity-selector label {
  font-weight: 600;
  color: #333;
}

.quantity-select {
  padding: 0.5rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  font-size: 1rem;
}

.add-to-cart-large {
  background: #4A90E2;
  color: white;
  border: none;
  padding: 1.25rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-to-cart-large:hover:not(:disabled) {
  background: #357ABD;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.add-to-cart-large:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.buy-now-btn {
  background: #2ed573;
  color: white;
  border: none;
  padding: 1.25rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.buy-now-btn:hover:not(:disabled) {
  background: #25c465;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 213, 115, 0.3);
}

.buy-now-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Section review simplifiée */
.simple-review-section {
  margin-top: 1rem;
  padding: 1rem;
  text-align: center;
  border-top: 1px solid #f1f3f4;
}

.simple-review-btn {
  background: #ffc107;
  color: #333;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.simple-review-btn:hover {
  background: #e0a800;
  transform: translateY(-2px);
}

.already-reviewed {
  color: #2ed573;
  font-weight: 600;
  padding: 1rem;
}

.login-prompt {
  margin-top: 1rem;
}

.login-prompt a {
  color: #4A90E2;
  text-decoration: none;
  font-weight: 500;
}

.login-prompt a:hover {
  text-decoration: underline;
}

/* Popup simple */
.review-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.review-popup {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  min-width: 300px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.review-popup h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.rating-stars {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.rating-stars .star {
  font-size: 2.5rem;
  color: #ddd;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rating-stars .star.active {
  color: #ffc107;
  transform: scale(1.1);
}

.rating-stars .star:hover {
  color: #ffc107;
}

.rating-text {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.popup-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.cancel-btn, .submit-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background: #5a6268;
}

.submit-btn {
  background: #4A90E2;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #357ABD;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Garanties */
.product-guarantees {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.guarantee-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  justify-content: center;
}

.guarantee-icon {
  font-size: 1.2rem;
}

/* Page non trouvée */
.not-found {
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 4rem 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.not-found-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.not-found h2 {
  color: #333;
  margin-bottom: 1rem;
}

.not-found p {
  color: #666;
  margin-bottom: 2rem;
}

.back-to-products {
  background: #4A90E2;
  color: white;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
}

.back-to-products:hover {
  background: #357ABD;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 968px) {
  .product-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem;
  }
  
  .product-gallery {
    order: -1;
  }
  
  .product-guarantees {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .product-detail-page {
    padding: 1rem;
  }
  
  .product-title {
    font-size: 2rem;
  }
  
  .product-price-detail {
    font-size: 2rem;
  }
  
  .product-actions {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .product-layout {
    padding: 1.5rem;
  }
  
  .product-title {
    font-size: 1.5rem;
  }
  
  .add-to-cart-large,
  .buy-now-btn {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }

  .popup-actions {
    flex-direction: column;
  }
}
</style>
