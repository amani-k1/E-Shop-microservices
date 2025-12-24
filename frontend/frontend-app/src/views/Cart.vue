<template>
  <div class="cart-page">
    <h1>🛒 Mon Panier</h1>
    
    <div v-if="cartItems.length === 0" class="empty-cart">
      <div class="empty-cart-icon">🛒</div>
      <p>Votre panier est vide</p>
      <router-link to="/products" class="continue-shopping">
        Continuer vos achats
      </router-link>
    </div>
    
    <div v-else class="cart-content">
      <div class="cart-items">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <img :src="item.image" :alt="item.name" class="cart-item-image">
          
          <div class="cart-item-info">
            <h3 class="cart-item-name">{{ item.name }}</h3>
            <p class="cart-item-category">{{ item.category }}</p>
            <p class="cart-item-price">{{ formatPrice(item.price) }} €</p>
          </div>
          
          <div class="cart-item-actions">
            <div class="quantity-controls">
              <button @click="decreaseQuantity(item)" class="quantity-btn">-</button>
              <span class="quantity">{{ item.quantity }}</span>
              <button @click="increaseQuantity(item)" class="quantity-btn">+</button>
            </div>
            
            <button @click="removeItem(item.id)" class="remove-btn">
              🗑️ Supprimer
            </button>
          </div>
          
          <div class="cart-item-total">
            {{ formatPrice(item.price * item.quantity) }} €
          </div>
        </div>
      </div>
      
      <div class="cart-summary">
        <h3>Récapitulatif</h3>
        <div class="summary-line">
          <span>Sous-total:</span>
          <span>{{ formatPrice(cartTotal) }} €</span>
        </div>
        <div class="summary-line">
          <span>Livraison:</span>
          <span>Gratuite</span>
        </div>
        <div class="summary-line total">
          <span>Total:</span>
          <span>{{ formatPrice(cartTotal) }} €</span>
        </div>
        
        <button class="checkout-btn" @click="proceedToCheckout">
          Commander ({{ formatPrice(cartTotal) }} €)
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  props: ['cartItems'],
  computed: {
    cartTotal() {
      const total = this.cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
      return total;
    }
  },
  methods: {
    formatPrice(price) {
      // S'assurer que le prix est un nombre et formater avec 2 décimales
      const numPrice = Number(price);
      return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
    },
    increaseQuantity(item) {
      item.quantity += 1;
      this.$emit('add-to-cart', item);
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
        this.$emit('add-to-cart', item);
      } else {
        this.removeItem(item.id);
      }
    },
    removeItem(productId) {
      this.$emit('remove-from-cart', productId);
    },
    proceedToCheckout() {
      if (this.cartItems.length > 0) {
        alert(`Commande passée pour ${this.formatPrice(this.cartTotal)} € !`);
        // Ici vous pourriez rediriger vers une page de checkout
      }
    }
  }
};
</script>

<style scoped>
.cart-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.cart-page h1 {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.empty-cart {
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 4rem 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.empty-cart-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.empty-cart p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
  font-weight: 500;
}

.continue-shopping {
  background: #4A90E2;
  color: white;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
}

.continue-shopping:hover {
  background: #357ABD;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr auto auto;
  gap: 1.5rem;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.cart-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.cart-item-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid #f8f9fa;
}

.cart-item-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cart-item-name {
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.cart-item-category {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.cart-item-price {
  color: #4A90E2;
  font-weight: 600;
  font-size: 1.1rem;
  margin: 0;
}

.cart-item-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f8f9fa;
  padding: 0.5rem;
  border-radius: 10px;
}

.quantity-btn {
  background: #4A90E2;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: background 0.3s ease;
}

.quantity-btn:hover {
  background: #357ABD;
}

.quantity {
  font-weight: 600;
  min-width: 30px;
  text-align: center;
  font-size: 1.1rem;
}

.remove-btn {
  background: #ff4757;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
  white-space: nowrap;
}

.remove-btn:hover {
  background: #ff3742;
}

.cart-item-total {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  min-width: 100px;
  text-align: right;
}

.cart-summary {
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 2rem;
}

.cart-summary h3 {
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
  font-size: 1rem;
}

.summary-line.total {
  border-top: 2px solid #4A90E2;
  border-bottom: none;
  padding-top: 1rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin-top: 1rem;
}

.checkout-btn {
  background: #2ed573;
  color: white;
  border: none;
  padding: 1.25rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  margin-top: 1.5rem;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.checkout-btn:hover {
  background: #25c465;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 213, 115, 0.3);
}

/* Responsive */
@media (max-width: 968px) {
  .cart-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .cart-summary {
    position: static;
    order: -1;
  }
}

@media (max-width: 768px) {
  .cart-page {
    padding: 1rem;
  }
  
  .cart-item {
    grid-template-columns: 100px 1fr;
    gap: 1rem;
    padding: 1rem;
  }
  
  .cart-item-actions {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  
  .cart-item-total {
    grid-column: 2;
    text-align: left;
    margin-top: 1rem;
  }
  
  .cart-item-image {
    width: 100px;
    height: 100px;
  }
}

@media (max-width: 480px) {
  .cart-page h1 {
    font-size: 2rem;
  }
  
  .cart-item {
    grid-template-columns: 80px 1fr;
    gap: 0.75rem;
    padding: 1rem;
  }
  
  .cart-item-image {
    width: 80px;
    height: 80px;
  }
  
  .cart-item-name {
    font-size: 1rem;
  }
  
  .quantity-controls {
    gap: 0.5rem;
  }
  
  .quantity-btn {
    width: 28px;
    height: 28px;
  }
}
</style>