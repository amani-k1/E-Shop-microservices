<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <h1 class="logo">E-Shop</h1>
        <div class="nav-links">
          <router-link to="/" class="nav-link">Accueil</router-link>
          <router-link to="/products" class="nav-link">Produits</router-link>
          
          <!-- Panier -->
          <div class="cart-container">
            <router-link to="/cart" class="nav-link cart-link">
              🛒 Panier 
              <span v-if="cartItems.length > 0" class="cart-count">
                {{ cartItems.length }}
              </span>
            </router-link>
          </div>

          <template v-if="!user">
            <router-link to="/login" class="nav-link">Connexion</router-link>
            <router-link to="/register" class="nav-link">Inscription</router-link>
          </template>
          <template v-else>
            <span class="user-welcome">Bonjour, {{ user.name }}</span>
            <button @click="logout" class="logout-btn">Déconnexion</button>
          </template>
        </div>
      </div>
    </nav>
    
    <main class="main-content">
      <router-view 
        @user-login="handleUserLogin" 
        @user-logout="handleUserLogout"
        :cartItems="cartItems"
        @add-to-cart="addToCart"
        @remove-from-cart="removeFromCart"
      />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      user: null,
      cartItems: []
    };
  },
  methods: {
    handleUserLogin(userData) {
      this.user = userData;
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);
    },
    handleUserLogout() {
      this.user = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      this.$router.push('/');
    },
    logout() {
      this.handleUserLogout();
    },
    addToCart(product) {
      const existingItem = this.cartItems.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.cartItems.push({
          ...product,
          quantity: 1
        });
      }
      
      this.saveCartToLocalStorage();
    },
    removeFromCart(productId) {
      this.cartItems = this.cartItems.filter(item => item.id !== productId);
      this.saveCartToLocalStorage();
    },
    saveCartToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    },
    loadCartFromLocalStorage() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cartItems = JSON.parse(savedCart);
      }
    }
  },
  mounted() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
    this.loadCartFromLocalStorage();
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #333;
}

.navbar {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  padding: 1rem 0;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.logo {
  color: #4A90E2;
  font-size: 1.8rem;
  font-weight: 700;
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #4A90E2;
  background: rgba(74, 144, 226, 0.1);
}

.nav-link.router-link-active {
  color: #4A90E2;
  background: rgba(74, 144, 226, 0.1);
}

.cart-container {
  position: relative;
}

.cart-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem !important;
}

.cart-count {
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  position: absolute;
  top: -5px;
  right: 0;
}

.user-welcome {
  color: #666;
  font-weight: 500;
  font-size: 0.9rem;
}

.logout-btn {
  background: #ff4757;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
  font-size: 0.9rem;
}

.logout-btn:hover {
  background: #ff3742;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: calc(100vh - 80px);
}

/* Responsive */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-links {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .main-content {
    padding: 1rem;
  }
}
</style>
