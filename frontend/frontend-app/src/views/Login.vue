<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Connexion</h2>
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label>Email</label>
          <input 
            type="email" 
            v-model="form.email" 
            required 
            placeholder="votre@email.com"
          >
        </div>
        
        <div class="form-group">
          <label>Mot de passe</label>
          <input 
            type="password" 
            v-model="form.password" 
            required 
            placeholder="Votre mot de passe"
          >
        </div>
        
        <button type="submit" class="auth-button" :disabled="loading">
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
        
        <p class="auth-link">
          Pas de compte ? <router-link to="/register">S'inscrire</router-link>
        </p>
      </form>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from '../services/api';

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      loading: false,
      error: ''
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = '';
      
      try {
        const response = await authService.login(this.form);
        this.$emit('user-login', response.user);
        this.$router.push('/products');
      } catch (error) {
        this.error = error.response?.data?.error || 'Erreur de connexion';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.auth-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-card h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #4A90E2;
}

.auth-button {
  width: 100%;
  background: #4A90E2;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.auth-button:hover:not(:disabled) {
  background: #357ABD;
}

.auth-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.auth-link {
  text-align: center;
  margin-top: 1rem;
  color: #666;
}

.auth-link a {
  color: #4A90E2;
  text-decoration: none;
}

.error-message {
  background: #ff4757;
  color: white;
  padding: 0.75rem;
  border-radius: 10px;
  margin-top: 1rem;
  text-align: center;
}
</style>
