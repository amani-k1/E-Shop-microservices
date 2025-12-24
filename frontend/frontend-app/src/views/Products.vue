<template>
  <div class="products-page">
    <h1>Nos Produits</h1>
    
    <div v-if="loading" class="loading">Chargement des produits...</div>
    
    <div v-else class="products-grid">
      <div 
        v-for="product in products" 
        :key="product.id" 
        class="product-card"
        @click="viewProductDetail(product.id)"
      >
        <div class="product-image">
          <img :src="product.image" :alt="product.name">
        </div>
        
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-description">{{ product.description }}</p>
          <p class="product-category">Catégorie: {{ product.category }}</p>
          <p class="product-stock">Stock: {{ product.stock }}</p>
          
          <div class="product-footer">
            <span class="product-price">{{ product.price }} €</span>
            <button 
              class="add-to-cart-btn" 
              :disabled="product.stock === 0"
              @click.stop="addToCart(product)"
            >
              {{ product.stock === 0 ? 'Rupture' : 'Ajouter au panier' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { productService } from '../services/api';

export default {
  name: 'Products',
  props: ['cartItems'],
  data() {
    return {
      products: [],
      loading: true,
      error: ''
    };
  },
  methods: {
    async loadProducts() {
      try {
        this.products = await productService.getProducts();
      } catch (error) {
        this.error = 'Erreur lors du chargement des produits';
        console.error('Error fetching products:', error);
      } finally {
        this.loading = false;
      }
    },
    addToCart(product) {
      if (product.stock > 0) {
        this.$emit('add-to-cart', product);
        alert(`${product.name} ajouté au panier !`);
      }
    },
    viewProductDetail(productId) {
      this.$router.push(`/product/${productId}`);
    }
  },
  async mounted() {
    await this.loadProducts();
  }
};
</script>

<style scoped>
.products-page h1 {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.loading {
  text-align: center;
  color: white;
  font-size: 1.2rem;
  padding: 2rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.product-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 1.5rem;
}

.product-name {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.product-description {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-category, .product-stock {
  color: #888;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.product-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4A90E2;
}

.add-to-cart-btn {
  background: #4A90E2;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #357ABD;
}

.add-to-cart-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
